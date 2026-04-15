import os
import redis
import threading
import sys
from time import sleep
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))

from src.worker import create_worker
from src.producer import fan_out_work

load_dotenv()


THREAD_COUNT = int(os.getenv('THREAD_COUNT') or 5)
REDIS_HOST = str(os.getenv('REDIS_HOST') or 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT') or 6379)


if __name__ == "__main__":
    redis_pool = redis.ConnectionPool(
        host=REDIS_HOST, port=REDIS_PORT,
        max_connections=THREAD_COUNT + 2,  # one per worker + headroom
        decode_responses=True
    )

    threads = []
    for i in range(THREAD_COUNT):
        thread = threading.Thread(target=create_worker, args=(redis_pool, "webhook-queue"))
        thread.start()
        threads.append(thread)

    redis_conn = redis.Redis(connection_pool=redis_pool)
    while True:
        payload = redis_conn.lpop("webhook-payload")
        print("payload: " + str(payload))
        if payload is None:
            sleep(5)
            continue

        fan_out_work(str(payload), redis_pool, "webhook-queue")
