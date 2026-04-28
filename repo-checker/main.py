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

REDIS_URL = str(os.getenv('REDIS_URL') or 'redis://localhost:6379')
CHECK_INTERVAL_SECONDS = max(5, int(os.getenv('REPO_CHECKER_INTERVAL_SECONDS') or 30))
INTER_REPO_DELAY_SECONDS = max(0.0, float(os.getenv('REPO_CHECKER_INTER_REPO_DELAY_SECONDS') or 1.0))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

redis_pool = redis.ConnectionPool.from_url(
    url=REDIS_URL,
    max_connections=2,  # one per worker + headroom
    decode_responses=True
)

REPOS = [
    SimplifyJobs(redis_pool),
    SimplifySummer2026(redis_pool)
]

_job_lock = threading.Lock()

def job():
    if not _job_lock.acquire(blocking=False):
        logging.warning("Skipping repo-checker tick because previous run is still in progress")
        return

    logging.info("Running repo-checker")
    try:
        for index, repo in enumerate(REPOS):
            repo.check()
            if index < len(REPOS) - 1 and INTER_REPO_DELAY_SECONDS > 0:
                time.sleep(INTER_REPO_DELAY_SECONDS)
    finally:
        _job_lock.release()

schedule.every(CHECK_INTERVAL_SECONDS).seconds.do(job)

if __name__ == "__main__":
    logging.info(
        "Starting repo-checker schedule (interval=%ss, inter_repo_delay=%ss)",
        CHECK_INTERVAL_SECONDS,
        INTER_REPO_DELAY_SECONDS,
    )
    while True:
        schedule.run_pending()
        time.sleep(1)
