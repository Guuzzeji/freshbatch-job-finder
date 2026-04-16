import os
import uuid
import json
import redis
from bullmq import Queue
from datetime import datetime
from dotenv import load_dotenv
import logging

from shared.interface import JobInformation
from shared.constant import QUEUE_NAME_PAYLOADS_FANOUT, REPO_DATE_KEY

load_dotenv()
logger = logging.getLogger(__name__)

ALL_REPO_SAVE_PATH = os.getcwd() + "/repos/"

class RepoChangesParser:

    def __init__(self, redis_pool) -> None:
        self.__redis_pool = redis_pool

    def __open_connection(self) -> redis.Redis:
        return redis.Redis(connection_pool=self.__redis_pool)

    def get_last_commit_date(self, repo_name: str) -> datetime:
        redis_conn = self.__open_connection()
        redis_date = redis_conn.get(f"{repo_name}:{REPO_DATE_KEY}")
        redis_conn.close()

        if redis_date is not None:
            return datetime.fromisoformat(str(redis_date))
        
        return datetime.now()

    def save_commit_date(self, date: datetime, repo_name: str) -> None:
        redis_conn = self.__open_connection()
        redis_conn.set(f"{repo_name}:{REPO_DATE_KEY}", date.isoformat())
        redis_conn.close()

    async def add_jobs_batch(self, jobs: list[JobInformation]) -> None:
        redis_conn = self.__open_connection()
        print(jobs)
        jobs_batch = [job.dump() for job in jobs]
        redis_conn.lpush(QUEUE_NAME_PAYLOADS_FANOUT, json.dumps(jobs_batch))
        redis_conn.close()

    def __create_repo_folder(self) -> None:
        if not os.path.exists(ALL_REPO_SAVE_PATH):
            os.mkdir(ALL_REPO_SAVE_PATH)

    def pull(self, repo_url: str, repo_name: str) -> None:
        self.__create_repo_folder()

        try:
            if not os.path.exists(ALL_REPO_SAVE_PATH + repo_name):
                os.mkdir(ALL_REPO_SAVE_PATH + repo_name)
                os.system("git clone " + repo_url + " " + ALL_REPO_SAVE_PATH + repo_name)

            os.chdir(ALL_REPO_SAVE_PATH + repo_name)
            os.system("git pull")
        except Exception as e:
            logger.error(f"failed: {str(e)}")

    def check(self) -> None:
        return None
