import schedule
import threading
import time
import logging

from SimplifyJobs import SimplifyJobs

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s - %(message)s'
)

REPOS = [
    SimplifyJobs()
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