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
CHECK_INTERVAL_SECONDS = max(5, int(os.getenv('REPO_CHECKER_INTERVAL_SECONDS') or 30))
INTER_REPO_DELAY_SECONDS = max(0.0, float(os.getenv('REPO_CHECKER_INTER_REPO_DELAY_SECONDS') or 1.0))

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

_job_lock = threading.Lock()

def pull_jobs() -> bool:
    if not _job_lock.acquire(blocking=False):
        logging.warning("Skipping repo-checker tick because previous run is still in progress")
        return False

    logging.info("Running repo-checker")
    try:
        for index, repo in enumerate(REPOS):
            repo.check()
            if repo.need_to_reboot_due_to_resource_pressure():
                return True
            # Add delay between repos to reduce chance of resource contention if multiple repos are being processed
            if index < len(REPOS) - 1 and INTER_REPO_DELAY_SECONDS > 0:
                time.sleep(INTER_REPO_DELAY_SECONDS)
    finally:
        _job_lock.release()

    return False

if __name__ == "__main__":
    logging.info(
        "Starting repo-checker schedule (interval=%ss, inter_repo_delay=%ss)",
        CHECK_INTERVAL_SECONDS,
        INTER_REPO_DELAY_SECONDS,
    )


    while True:
        force_reboot_system = pull_jobs()
        # If any repo signals that the system is under resource pressure and should be rebooted, break the loop immediately to allow for a quick restart, rather than waiting for the next scheduled tick.
        if force_reboot_system:
            break
        time.sleep(CHECK_INTERVAL_SECONDS)

    # git crash or smt
    sys.exit(1)
