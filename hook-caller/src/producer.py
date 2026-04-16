import os
import psycopg2
import redis
from time import sleep
from urllib.parse import urlsplit
from dotenv import load_dotenv

from shared.interface import HookerInformation
from .local_shared import PAYLOAD_DIVIDER

load_dotenv()

POSTGRES_DSN_URL = str(os.getenv('POSTGRES_DSN_URL'))
BATCH_SIZE = int(os.getenv('BATCH_SIZE') or 100)

def parse_postgres_url(url):
    # NOTE: DNS needs to parse does not work directly with psycopg2
    parsed = urlsplit(url)
    return {
        "host": parsed.hostname,
        "port": parsed.port,
        "username": parsed.username,
        "password": parsed.password,
        "dbname": parsed.path[1:],
    }

def producer_handler(payload: str, redis_pool, queue_name: str):
    try:
        # NOTE: if redis connection or database connection fails, we don't really have a backup plan,
        # just long error and try again next time and drop updates
        redis_conn = redis.Redis(connection_pool=redis_pool)
        total_hooks = 0

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
            cur.execute("SELECT hook_url, sign_key FROM webhooks WHERE is_active = TRUE;")
            for row in cur:
                hook_metadata = HookerInformation(
                    sign_key=row[1],
                    hook_url=row[0]
                )
                job_for_worker = f"{hook_metadata.dump()}{PAYLOAD_DIVIDER}{payload}"
                # print(f"CREATING PAYLOAD: {job_for_worker}")
                redis_conn.lpush(queue_name, job_for_worker)
                total_hooks += 1
                if total_hooks % BATCH_SIZE == 0:
                    print(f"sent {total_hooks} hooks")

        pg_conn.close()
    except Exception as e:
        print(f"failed: {str(e)}")

def create_producer(redis_pool, fanout_queue: str, send_queue: str):
    try:
        redis_conn = redis.Redis(connection_pool=redis_pool)
        while True:
            payload = redis_conn.lpop(fanout_queue)
            if payload is None:
                sleep(5)
                continue

            print("payload: " + str(payload))
            producer_handler(str(payload), redis_pool, send_queue)
    except Exception as e:
        print(f"failed: {str(e)}")