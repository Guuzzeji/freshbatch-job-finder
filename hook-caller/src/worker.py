import hmac
import hashlib
import requests
import redis
from time import sleep

from shared.interface import JobInformation, HookerInformation
from .local_shared import PAYLOAD_DIVIDER

def sign_package(package: str, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), package.encode("utf-8"), hashlib.sha256).hexdigest()

def decode_package(package: str) -> dict:
    chunks = package.split(PAYLOAD_DIVIDER)
    if len(chunks) != 2:
        raise Exception("invalid package")

    return {
        "hook_metadata": HookerInformation.from_string(chunks[0]),
        "data": JobInformation.from_string_list(chunks[1])
    }

def create_worker(redis_pool, worker_id: int, worker_queue: str, job_queue: str):
    try:
        redis_conn = redis.Redis(connection_pool=redis_pool)
        worker_queue = f"{worker_queue}{worker_id}"
        print(f"worker started - {worker_queue}")

        while True:
            message = redis_conn.lmove(job_queue, worker_queue, 'RIGHT', 'LEFT')
            # print(f"{worker_queue}: got new message for processing {message}")
            if message is None:
                sleep(5)
                continue

            package = decode_package(str(message))
            signature = sign_package(str(package["data"]), package["hook_metadata"].sign_key)
            print(signature)

            try:
                http_call = requests.post(
                        package["hook_metadata"].hook_url, 
                        headers={"Content-Type": "application/json", "signature": signature}, 
                        timeout=3,
                        json={
                            "data": [job.dump() for job in package["data"]],
                        })
            except Exception as e:
                print(f"failed: {str(e)}")
                redis_conn.lrem(worker_queue, 1, message)
                continue

            if http_call.status_code != 200:
                print(f"failed: {http_call.status_code}")
                redis_conn.lrem(worker_queue, 1, message)
                continue

            print(f"success: {http_call.status_code}")
            redis_conn.lrem(worker_queue, 1, message)

    except Exception as e:
        print(e)
