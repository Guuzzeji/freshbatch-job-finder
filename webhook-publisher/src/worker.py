import hmac
import hashlib
import json
import requests
import redis
from time import sleep
import logging

from shared.interface import JobInformation, HookerInformation
from .local_shared import PAYLOAD_DIVIDER

logger = logging.getLogger(__name__)

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

def create_worker(redis_pool, worker_id: int, worker_queue: str, job_queue: str):
    try:
        redis_conn = redis.Redis(connection_pool=redis_pool)
        worker_queue = f"{worker_queue}{worker_id}"
        logging.info(f"worker started - {worker_queue}")

        while True:
            logging.info(f"worker {worker_queue} checking for jobs")
            queue_pop_msg = redis_conn.lmove(job_queue, worker_queue, 'RIGHT', 'LEFT')
            if queue_pop_msg is None:
                logging.info(f"worker {worker_queue} no jobs found")
                sleep(5)
                continue
            
            logging.info(f"worker {worker_queue} found job")
            package = decode_package(str(queue_pop_msg))
            signature = sign_package(package["data"], package["hook_metadata"].sign_key)

            try:
                logging.info(f"worker {worker_queue} sending job")
                http_call = requests.post(
                        package["hook_metadata"].hook_url, 
                        headers={"Content-Type": "application/json", "webhook-signature": signature}, 
                        timeout=3,
                        json={
                            "data": [job.to_json() for job in package["data"]],
                        })
                if http_call.status_code != 200:
                    logging.info(f"registered hook failed with status (not our fault): {http_call.status_code}")
                else:
                    logging.info(f"success sent jobs to hook")
            except Exception as e:
                logging.error(f"failed to send jobs to hook: {str(e)}")
            finally:
                redis_conn.lrem(worker_queue, 1, queue_pop_msg) # pyright: ignore[reportArgumentType]
    except Exception as e:
        logging.error(f"general error: {str(e)}")
