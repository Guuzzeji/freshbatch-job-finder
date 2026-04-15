import hmac
import hashlib
import json
import requests
import redis
import random
from time import sleep

def sign_package(package: str, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), package.encode("utf-8"), hashlib.sha256).hexdigest()

def decode_package(package: str) -> dict:
    chunks = package.split("/:/")

    if chunks is None or len(chunks) != 2:
        raise Exception("invalid package")

    return {
        "hook_metadata": json.loads(chunks[0]),
        "data": json.loads(chunks[1])
    }

def create_worker(redis_pool, queue_name: str):
    redis_conn = redis.Redis(connection_pool=redis_pool)
    print("worker started")
    worker_queue = f"worker:{random.randint(0, 1000)}"
    while True:
        message = redis_conn.lmove(queue_name, worker_queue, 'RIGHT', 'LEFT')
        print(f"{worker_queue}: got new message for processing")
        if message is None:
            sleep(5)
            continue

        redis_conn.lrem(queue_name, 1, message)

        package = decode_package(str(message))
        # print(package)
        # signature = sign_package(json.dumps(package["data"]), package["hook_metadata"]["sign_key"])
        # print(signature)
        call = requests.post(package["hook_metadata"]["hook_url"], 
                      headers={"Content-Type": "application/json", "signature": "test"}, 
                      timeout=10,
                      json={
                        "data": package["data"],
                    })
