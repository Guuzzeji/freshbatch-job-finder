import schedule
import threading
import time
import logging
import redis
import sys
import os
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))
from repos.SimplifyJobs import SimplifyJobs
from repos.SimplifySummer2026 import SimplifySummer2026

load_dotenv()

REDIS_HOST = str(os.getenv('REDIS_HOST') or 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT') or 6379)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

redis_pool = redis.ConnectionPool(
    host=REDIS_HOST, port=REDIS_PORT,
    max_connections=2,  # one per worker + headroom
    decode_responses=True
)

REPOS = [
    SimplifyJobs(redis_pool),
    SimplifySummer2026(redis_pool)
]

def job():
    logging.info("Running repo-checker")
    threads = []
    
    for repo in REPOS:
        thread = threading.Thread(target=repo.check, daemon=True)
        thread.start()
        threads.append(thread)

schedule.every(2).seconds.do(job)

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(1)
