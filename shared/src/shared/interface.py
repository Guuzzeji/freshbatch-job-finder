import json

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
                 is_fte: bool,
                 is_intern: bool,
                 category: str) -> None:
        self.is_fte = is_fte
        self.is_intern = is_intern
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
            "is_fte": self.is_fte,
            "is_intern": self.is_intern,
            "repo_name": self.repo_name,
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

class HookerInformation:
    def __init__(self,
                 sign_key: str,
                 hook_url: str) -> None:
        self.sign_key = sign_key
        self.hook_url = hook_url

    def to_json(self) -> dict:
        return {
            "sign_key": self.sign_key,
            "hook_url": self.hook_url
        }
    
    def __str__(self) -> str:
        return str(self.to_json())
    
    def dump(self) -> str:
        return json.dumps(self.to_json())