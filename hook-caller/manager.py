import os
import psycopg2
import json
import redis
from urllib.parse import urlsplit
from dotenv import load_dotenv

load_dotenv()

POSTGRES_DSN_URL = str(os.getenv('POSTGRES_DSN_URL'))
BATCH_SIZE = int(os.getenv('BATCH_SIZE') or 100)

def parse_postgres_url(url):
    parsed = urlsplit(url)
    return {
        "host": parsed.hostname,
        "port": parsed.port,
        "username": parsed.username,
        "password": parsed.password,
        "dbname": parsed.path[1:],
    }


def fan_out_work(payload: str, redis_pool, queue_name: str):
    redis_conn = redis.Redis(connection_pool=redis_pool)
    total_hooks = 0
    try:
        print(POSTGRES_DSN_URL)
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
            cur.execute(
                "SELECT hook_url FROM webhooks WHERE is_active = TRUE;")

            for row in cur:
                hook_call_json = json.dumps({
                    # "sign_key": row[1],
                    "hook_url": row[0],
                })
                redis_conn.lpush(queue_name, f"{hook_call_json}/:/{payload}")

                total_hooks += 1

                if total_hooks % BATCH_SIZE == 0:
                    print(f"sent {total_hooks} hooks")

        pg_conn.close()
    except Exception as e:
        print(f"failed: {str(e)}")
