import os
import redis
import threading
import sys
from time import sleep
import logging
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))

from src.worker import create_worker
from src.producer import create_producer
from shared.constant import QUEUE_NAME_PAYLOADS_FANOUT, QUEUE_NAME_PAYLOAD_SEND, QUEUE_NAME_PAYLOAD_PROCESS_WORKER

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)


THREAD_COUNT = int(os.getenv('THREAD_COUNT') or 5)
REDIS_URL = str(os.getenv('REDIS_URL') or 'redis://localhost:6379')


if __name__ == "__main__":
    logging.info("Starting webhook-publisher")
    managed_threads = []

    redis_pool = redis.ConnectionPool.from_url(
        url=REDIS_URL,
        max_connections=THREAD_COUNT + 3,  # one per worker + headroom
        decode_responses=True
    )

    for i in range(THREAD_COUNT):
        target = create_worker
        args = (redis_pool, i, QUEUE_NAME_PAYLOAD_PROCESS_WORKER, QUEUE_NAME_PAYLOAD_SEND)
        
        thread = threading.Thread(target=target, args=args)
        thread.start()
        
        managed_threads.append({
            "name": f"Worker-{i}",
            "target": target,
            "args": args,
            "thread_obj": thread
        })

        logging.info(f"Started {managed_threads[-1]['name']}")

    producer_target = create_producer
    producer_args = (redis_pool, QUEUE_NAME_PAYLOADS_FANOUT, QUEUE_NAME_PAYLOAD_SEND)
    
    producer_thread = threading.Thread(target=producer_target, args=producer_args)
    producer_thread.start()
    
    managed_threads.append({
        "name": "Producer",
        "target": producer_target,
        "args": producer_args,
        "thread_obj": producer_thread
    })

    logging.info(f"Started {managed_threads[-1]['name']}")

    while True:
        logging.info("Monitoring threads...")
        sleep(2)
        for t_info in managed_threads:
            if not t_info["thread_obj"].is_alive():
                logging.warning(f"{t_info['name']} died. Restarting...")
                
                # Create a brand new thread using the stored blueprint
                new_thread = threading.Thread(target=t_info["target"], args=t_info["args"])
                new_thread.start()
                
                # Replace the old dead thread object with the new living one
                t_info["thread_obj"] = new_thread