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

POSTGRES_DSN_URL = str(os.getenv('POSTGRES_DSN_URL'))
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

        with pg_conn.cursor(name="hook_cursor") as cur:
            cur.itersize = BATCH_SIZE
            # NOTE: Assume that the first object is the same type as the rest
            search_query = job_query_type(JobInformation.from_string_list(payload)[0])
            cur.execute(search_query)
            for row in cur:
                hook_metadata = HookerInformation(
                    webhook_id=row[0],
                    hook_url=row[1],
                    sign_key=row[2]
                )
                job_for_worker = f"{hook_metadata.dump()}{PAYLOAD_DIVIDER}{payload}"
                redis_conn.lpush(queue_name, job_for_worker)
                logger.info(f"pushed job to queue for {hook_metadata.hook_url}")
        pg_conn.close()
    except Exception as e:
        logger.error(f"producer failed with handler: {str(e)}")

def create_producer(redis_pool, fanout_queue: str, send_queue: str):
    try:
        logger.info("producer started")
        redis_conn = redis.Redis(connection_pool=redis_pool)
        while True:
            logger.info("producer checking for jobs")
            # NOTE: We can do this because we always have a single producer
            payload = redis_conn.lpop(fanout_queue)
            if payload is None:
                logger.info("producer no jobs found")
                sleep(5)
                continue
            logger.info("producer found job")
            producer_handler(str(payload), redis_pool, send_queue)
    except Exception as e:
        logger.error(f"producer failed with getting new jobs from queue: {str(e)}")