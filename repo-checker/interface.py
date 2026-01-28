import os
import uuid
import json
import redis
from bullmq import Queue
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()


class JobInformation:
    def __init__(self,
                 repo_name: str,
                 company_name: str,
                 title: str,
                 date_posted: int,
                 url: str,
                 source: str,
                 degrees: list[str],
                 sponsorship: str,
                 locations: list[str],
                 category: str) -> None:
        self.repo_name = repo_name
        self.company_name = company_name
        self.title = title
        self.date_posted = date_posted
        self.url = url
        self.source = source
        self.degrees = degrees
        self.sponsorship = sponsorship
        self.locations = locations
        self.category = category

    def to_json(self) -> dict:
        return {
            "company_name": self.company_name,
            "title": self.title,
            "date_posted": self.date_posted,
            "url": self.url,
            "source": self.source,
            "degrees": self.degrees,
            "sponsorship": self.sponsorship,
            "locations": self.locations,
            "category": self.category
        }
    
    def __str__(self) -> str:
        return str(self.to_json())
    
    def dump(self) -> str:
        return json.dumps(self.to_json())


ALL_REPO_SAVE_PATH = os.getcwd() + "/repos/"


class RepoChangesParser:

    def __open_connection(self) -> redis.Redis:
        return redis.Redis(host=os.getenv('REDIS_HOST') or 'localhost', port=int(os.getenv('REDIS_PORT') or 6379), db=0, decode_responses=True)

    def get_last_commit_date(self, repo_name: str) -> datetime:
        redis_conn = self.__open_connection()
        redis_date = redis_conn.get(repo_name + ":last_commit_date")
        redis_conn.close()

        if redis_date is not None:
            return datetime.fromisoformat(str(redis_date))
        
        return datetime.now()

    def save_commit_date(self, date: datetime, repo_name: str) -> None:
        redis_conn = self.__open_connection()
        redis_conn.set(repo_name + ":last_commit_date", date.isoformat())
        redis_conn.close()

    async def add_jobs_batch(self, jobs: list[JobInformation]) -> None:
        redis_url = "redis://" + (os.getenv('REDIS_HOST') or 'localhost') + ":" + (os.getenv('REDIS_PORT') or '6379')
        webhook_worker_queue = Queue('webhook', opts={'connection': redis_url})

        try:
            for job in jobs:
                await webhook_worker_queue.add(str(uuid.uuid4()), job.dump())
        finally:
            await webhook_worker_queue.close()

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
            print(f"failed: {str(e)}")

    def check(self) -> None:
        return None
