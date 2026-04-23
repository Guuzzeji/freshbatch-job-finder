import os
import psycopg2
import redis
import logging
from time import sleep
from dotenv import load_dotenv

from shared.interface import HookerInformation, JobInformation
from .local_shared import PAYLOAD_DIVIDER, parse_postgres_url

load_dotenv()

logger = logging.getLogger(__name__)

_postgres_dsn = os.getenv('POSTGRES_DSN_URL')
if not _postgres_dsn:
    raise RuntimeError("POSTGRES_DSN_URL environment variable is not set")
POSTGRES_DSN_URL: str = _postgres_dsn
BATCH_SIZE = int(os.getenv('BATCH_SIZE') or 100)


def job_query_type(job: JobInformation) -> str:
    if job.is_fte:
        return "SELECT id, hook_url, sign_key FROM webhooks WHERE is_active = TRUE AND is_fte = TRUE;"
    else:
        return "SELECT id, hook_url, sign_key FROM webhooks WHERE is_active = TRUE AND is_intern = TRUE;"

def producer_handler(payload: str, redis_pool, queue_name: str):
    try:
        # NOTE: if redis connection or database connection fails, we don't really have a backup plan,
        # just long error and try again next time and drop updates
        redis_conn = redis.Redis(connection_pool=redis_pool)
        parsed_url = parse_postgres_url(POSTGRES_DSN_URL)
        pg_conn = psycopg2.connect(
            host=parsed_url["host"],
            port=parsed_url["port"],
            user=parsed_url["username"],
            password=parsed_url["password"],
            dbname=parsed_url["dbname"],
        )
    except Exception as e:
        logger.error(f"[Producer] Handler failed while processing fanout payload: {str(e)}", exc_info=True)
        raise RuntimeError("Failed to connect to Redis or PostgreSQL") from e

    try:
        jobs = JobInformation.from_string_list(payload)
        if not jobs:
            logger.warning("[Producer] Received empty job list from fanout queue — nothing to enqueue, skipping")
            return
        with pg_conn.cursor(name="hook_cursor") as cur:
            cur.itersize = BATCH_SIZE
            # NOTE: Assume that the first object is the same type as the rest
            search_query = job_query_type(jobs[0])
            cur.execute(search_query)
            for row in cur:
                hook_metadata = HookerInformation(
                    webhook_id=row[0],
                    hook_url=row[1],
                    sign_key=row[2]
                )
                job_for_worker = f"{hook_metadata.dump()}{PAYLOAD_DIVIDER}{payload}"
                redis_conn.lpush(queue_name, job_for_worker)
                logger.info(f"[Producer] Enqueued job batch for webhook subscriber: url={hook_metadata.hook_url}")
    finally:
        pg_conn.close()

def create_producer(redis_pool, fanout_queue: str, send_queue: str):
    try:
        logger.info("[Producer] Service started — polling fanout queue for job payloads")
        redis_conn = redis.Redis(connection_pool=redis_pool)
    except Exception as e:
        logger.error(f"[Producer] Fatal error reading from fanout queue — producer loop terminated: {str(e)}", exc_info=True)
        raise RuntimeError("Producer loop terminated due to fatal error") from e
    
    while True:
        logger.info("[Producer] Polling fanout queue for new job payloads")
        # NOTE: We can do this because we always have a single producer
        try:
            payload = redis_conn.lpop(fanout_queue)
        except redis.exceptions.RedisError as e:
            logger.error(f"[Producer] Redis connection error during lpop: {str(e)}")
            sleep(5)
            continue
            
        if payload is None:
            logger.info("[Producer] No pending payloads in fanout queue — sleeping 5s before next poll")
            sleep(5)
            continue
        logger.info("[Producer] Payload found — dispatching to producer_handler for webhook fanout")
        producer_handler(str(payload), redis_pool, send_queue)