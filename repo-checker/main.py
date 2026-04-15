import schedule
import threading
import time
import logging
import redis

from SimplifyJobs import SimplifyJobs

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s - %(message)s'
)

redis_pool = redis.ConnectionPool(
    host="localhost", port=6379,
    max_connections=2,  # one per worker + headroom
    decode_responses=True
)

REPOS = [
    SimplifyJobs(redis_pool)
]

def job():
    logging.info("Running repo-checker")
    threads = []
    
    for repo in REPOS:
        thread = threading.Thread(target=repo.check, daemon=True)
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

schedule.every(5).seconds.do(job)

if __name__ == "__main__":
    logging.info("Starting repo-checker")
    while True:
        schedule.run_pending()
        time.sleep(1)