from pydriller import Repository, Commit
from datetime import datetime
import json

from interface import RepoChangesParser, JobInformation, ALL_REPO_SAVE_PATH


class SimplifyJobs(RepoChangesParser):
    __repo_name = "SimplifyJobs-New-Grad-Positions"
    __repo_url = "https://github.com/SimplifyJobs/New-Grad-Positions"
    __repo_path = ALL_REPO_SAVE_PATH + __repo_name

    def create_job_report(self, json_buffer: list[str]) -> JobInformation | None:
        check_keys = ["company_name", "title", "date_posted", "url",
                      "source", "degrees", "sponsorship", "locations", "category"]

        try:
            report = json.loads("{" + "".join(json_buffer) + "}")

            for key in check_keys:
                if key not in report:
                    print("missing key: " + key)
                    return None

            return JobInformation(
                self.__repo_name,
                report["company_name"],
                report["title"],
                report["date_posted"],
                report["url"],
                report["source"],
                report["degrees"],
                report["sponsorship"],
                report["locations"],
                report["category"]
            )
        except Exception as e:
            print(f"failed: {str(e)}")
            return None

    def parse_job_data(self, diff: dict[str, list[tuple[int, str]]]) -> list[JobInformation]:
        is_job = False
        json_buffer = []
        jobs = []

        for line in diff.items():
            if line[0] == "deleted":
                continue
            for change in line[1]:
                if "source" in change[1].strip() and not is_job:
                    is_job = True
                    json_buffer.append(change[1].strip())
                elif (("]" in change[1].strip() and "\"degrees\": [" in json_buffer) or "\"degrees\": []" in change[1].strip()) and is_job:
                    is_job = False
                    json_buffer.append(change[1].strip())
                    
                    self.create_job_report(json_buffer)
                    job_report = self.create_job_report(json_buffer)

                    if job_report is not None:
                        jobs.append(job_report)
                    json_buffer = []
                elif is_job:
                    json_buffer.append(change[1].strip())
                else:
                    is_job = False
                    json_buffer = []

        return jobs

    def get_latest_commits(self, last_date: datetime = datetime.now()) -> list[Commit] | None:
        return [commit for commit in Repository(
            self.__repo_path,
            since_as_filter=last_date,
            filepath=".github/scripts/listings.json",
            only_in_branch="dev",
            order="reverse")
            .traverse_commits()]

    def check(self) -> list[JobInformation] | None:
        self.pull(self.__repo_url, self.__repo_name)
        commits = self.get_latest_commits()

        if commits is None:
            return None

        jobs: list[JobInformation] = []
        for commit in commits:
            for file in commit.modified_files:
                jobs.extend(self.parse_job_data(file.diff_parsed))

        for job in jobs:
            print(job)

        return jobs


if __name__ == "__main__":
    SimplifyJobs().check()
