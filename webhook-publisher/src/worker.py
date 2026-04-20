import hmac
import hashlib
import json
import requests
import redis
import os
import psycopg2
from time import sleep
import logging
from dotenv import load_dotenv

from shared.interface import JobInformation, HookerInformation
from .local_shared import PAYLOAD_DIVIDER, parse_postgres_url

load_dotenv()
logger = logging.getLogger(__name__)

_postgres_dsn = os.getenv('POSTGRES_DSN_URL')
if not _postgres_dsn:
    raise RuntimeError("POSTGRES_DSN_URL environment variable is not set")
POSTGRES_DSN_URL: str = _postgres_dsn
BATCH_SIZE = int(os.getenv('BATCH_SIZE') or 100)

def sign_package(jobs: list["JobInformation"], secret: str) -> str:
    """
    Produce a deterministic HMAC-SHA256 signature over the job list.

    Canonical form:
      - Each JobInformation is serialised via to_json() (a plain dict).
      - Keys within every dict are sorted alphabetically (sort_keys=True).
      - The list itself is sorted by each job's `url` field.
      - The whole structure is compacted (no extra spaces) so the byte
        sequence is unambiguous for any receiver to reproduce.
    """
    sorted_jobs = sorted(
        [job.to_json() for job in jobs],
        key=lambda j: j["url"],
    )
    canonical = json.dumps(sorted_jobs, sort_keys=True, separators=(",", ":"))
    return hmac.new(
        secret.encode("utf-8"),
        canonical.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

def decode_package(package: str) -> dict:
    chunks = package.split(PAYLOAD_DIVIDER)
    if len(chunks) != 2:
        raise ValueError("invalid package, package is either missing divider or is malformed")
    return {
        "hook_metadata": HookerInformation.from_string(chunks[0]),
        "data": JobInformation.from_string_list(chunks[1])
    }

def log_webhook_request(webhook_id: int, success: bool, error_message: str | None, status_code: int | None, jobs_payload: str, is_test: bool):
    if webhook_id < 0:
        return
    try:
        logger.warning(f"logging webhook request to db: webhook_id={webhook_id}, success={success}, error_message={error_message}, status_code={status_code}, jobs_payload={jobs_payload}, is_test={is_test}")
        parsed_url = parse_postgres_url(POSTGRES_DSN_URL)
        pg_conn = psycopg2.connect(
            host=parsed_url["host"],
            port=parsed_url["port"],
            user=parsed_url["username"],
            password=parsed_url["password"],
            dbname=parsed_url["dbname"],
        )
        try:
            with pg_conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO webhooks_log (webhook_id, success, error_message, status_code, jobs_payload, is_test)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (webhook_id, success, error_message, status_code, jobs_payload, is_test)
                )
            pg_conn.commit()
        finally:
            pg_conn.close()
    except Exception as e:
        logger.error(f"failed to log webhook request to db: {str(e)}")

def create_worker(redis_pool, worker_id: int, worker_queue: str, job_queue: str):
    try:
        redis_conn = redis.Redis(connection_pool=redis_pool)
        worker_queue = f"{worker_queue}{worker_id}"
        logging.info(f"worker-{worker_id} started - {worker_queue}")

        while True:
            logging.info(f"worker-{worker_id} | checking for jobs")
            queue_pop_msg = redis_conn.lmove(job_queue, worker_queue, 'RIGHT', 'LEFT')
            if queue_pop_msg is None:
                logging.info(f"worker-{worker_id} | no jobs found")
                sleep(5)
                continue
            
            logging.info(f"worker-{worker_id} | {worker_queue} found job")
            package = decode_package(str(queue_pop_msg))
            signature = sign_package(package["data"], package["hook_metadata"].sign_key)

            try:
                logging.info(f"worker-{worker_id} | {worker_queue} sending job")
                json_payload = {"data": [job.to_json() for job in package["data"]]}
                http_call = requests.post(
                        package["hook_metadata"].hook_url, 
                        headers={"Content-Type": "application/json", "webhook-signature": signature}, 
                        timeout=3,
                        json=json_payload)
                
                is_test = any(job.is_test for job in package["data"])
                jobs_payload_str = json.dumps(json_payload["data"])

                if http_call.status_code != 200:
                    logging.warning(f"worker-{worker_id} | webhook-id-{package["hook_metadata"].webhook_id} | registered hook failed with status (not our fault): {http_call.status_code}")
                    log_webhook_request(
                        webhook_id=package["hook_metadata"].webhook_id,
                        success=False,
                        error_message=http_call.text[:1000] if http_call.text else None,
                        status_code=http_call.status_code,
                        jobs_payload=jobs_payload_str,
                        is_test=is_test
                    )
                else:
                    logging.info(f"worker-{worker_id} | webhook-id-{package["hook_metadata"].webhook_id} | success sent jobs to hook")
                    log_webhook_request(
                        webhook_id=package["hook_metadata"].webhook_id,
                        success=True,
                        error_message=None,
                        status_code=http_call.status_code,
                        jobs_payload=jobs_payload_str,
                        is_test=is_test
                    )
            except Exception as e:
                logging.error(f"worker-{worker_id} | webhook-id-{package["hook_metadata"].webhook_id} | failed to send jobs to hook: {str(e)}")
                is_test = any(job.is_test for job in package["data"])
                jobs_payload_str = json.dumps([job.to_json() for job in package["data"]])
                log_webhook_request(
                    webhook_id=package["hook_metadata"].webhook_id,
                    success=False,
                    error_message=str(e)[:1000],
                    status_code=None,
                    jobs_payload=jobs_payload_str,
                    is_test=is_test
                )
            finally:
                redis_conn.lrem(worker_queue, 1, queue_pop_msg) # pyright: ignore[reportArgumentType]
    except Exception as e:
        logging.error(f"worker-{worker_id} | webhook-id-{package["hook_metadata"].webhook_id} | general error: {str(e)}")
