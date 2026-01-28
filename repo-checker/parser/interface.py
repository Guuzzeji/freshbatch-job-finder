import os
from datetime import datetime


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


ALL_REPO_SAVE_PATH = os.getcwd() + "/repos/"


class RepoChangesParser:

    def get_last_commit_date(self, repo_name: str) -> datetime:
        return datetime.now()

    def save_commit_date(self, date: datetime, repo_name: str) -> None:
        pass

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

    def check(self) -> JobInformation | None:
        return None
