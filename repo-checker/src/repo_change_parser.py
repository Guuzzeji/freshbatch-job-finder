import os
import json
import redis
import subprocess
from datetime import datetime
from dotenv import load_dotenv
import logging

from shared.interface import JobInformation
from shared.constant import QUEUE_NAME_PAYLOADS_FANOUT

REPO_DATE_KEY = "last_commit_date"

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
        jobs_batch = [job.dump() for job in jobs]
        redis_conn.lpush(QUEUE_NAME_PAYLOADS_FANOUT, json.dumps(jobs_batch))
        redis_conn.close()

    def __create_repo_folder(self) -> None:
        if not os.path.exists(ALL_REPO_SAVE_PATH):
            os.mkdir(ALL_REPO_SAVE_PATH)

    def repo_exists(self, repo_name: str) -> bool:
        repo_path = os.path.join(ALL_REPO_SAVE_PATH, repo_name)
        return os.path.exists(repo_path) and os.path.isdir(repo_path)

    def pull(self, repo_url: str, repo_name: str) -> None:
        self.__create_repo_folder()
        repo_path = os.path.join(ALL_REPO_SAVE_PATH, repo_name)

        try:
            if not os.path.exists(repo_path):
                os.makedirs(repo_path, exist_ok=True)
                subprocess.Popen(
                    ["git", "clone", repo_url, repo_path, "--depth", "1"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                ).wait()
            else:
                subprocess.Popen(
                    ["git", "pull"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=repo_path,
                ).wait()   
        except Exception as e:
            logger.error(f"[RepoChangesParser] Unexpected error while pulling repo '{repo_name}': {str(e)}", exc_info=True)

    def check(self) -> None:
        return None
