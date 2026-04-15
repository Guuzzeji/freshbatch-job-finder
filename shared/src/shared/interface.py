import json
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
    
    def dump(self) -> str:
        return json.dumps(self.to_json())
