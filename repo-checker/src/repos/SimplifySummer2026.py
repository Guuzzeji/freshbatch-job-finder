import json
import asyncio
import logging
from datetime import datetime, timedelta
from pydriller import Repository, Commit

from shared.interface import JobInformation
from repo_change_parser import RepoChangesParser, ALL_REPO_SAVE_PATH

logger = logging.getLogger(__name__)

class SimplifySummer2026(RepoChangesParser):
    __repo_name = "SimplifyJobs-Summer2026-Internships"
    __repo_url = "https://github.com/SimplifyJobs/Summer2026-Internships"
    __repo_path = ALL_REPO_SAVE_PATH + __repo_name

    def create_job_report(self, json_buffer: list[str]) -> JobInformation | None:
        check_keys = ["company_name", "title", "date_posted", "url",
                      "source", "degrees", "sponsorship", "locations", "category"]

        try:
            report = json.loads("{" + "".join(json_buffer) + "}")

            for key in check_keys:
                if key not in report:
                    logger.warning(f"[SimplifySummer2026] Skipping malformed job entry — missing required key '{key}' in JSON buffer")
                    return None

            return JobInformation(
                report["company_name"],
                report["title"],
                report["date_posted"],
                report["url"],
                report["source"],
                report["degrees"],
                report["sponsorship"],
                report["locations"],
                False, # is_fte
                True,  # is_intern
                report["category"],
            )
        except Exception as e:
            logger.error(f"[SimplifySummer2026] Failed to parse job report from JSON buffer: {str(e)}", exc_info=True)
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

    def get_latest_commits(self, last_date: datetime | None = None) -> list[Commit]:
        if last_date is None:
            last_date = datetime.now()

        return [commit for commit in Repository(
            self.__repo_path,
            since=last_date,
            filepath=".github/scripts/listings.json",
            only_in_branch="dev",
            order="reverse",
            num_workers=1)
            .traverse_commits()]

    def check(self) -> None:
        pull_ok = self.pull(self.__repo_url, self.__repo_name)
        if not pull_ok:
            logger.error("[SimplifySummer2026] Skipping parse because repository sync did not complete")
            return None

        last_date = super().get_last_commit_date(self.__repo_name)
        commits = self.get_latest_commits(last_date)

        if len(commits) == 0:
            return None
        
        super().save_commit_date(commits[0].author_date + timedelta(seconds=5), self.__repo_name)
        jobs: list[JobInformation] = []
        try:
            for commit in commits:
                for file in commit.modified_files:
                    # TODO: add tracker for commit hash to get track of which commits were parsed
                    jobs.extend(self.parse_job_data(file.diff_parsed))
        except Exception as e:
            logger.error(f"[SimplifySummer2026] Unexpected error while parsing commits: {str(e)}", exc_info=True)

        logger.info(f"[SimplifySummer2026] Check complete — dispatched {len(jobs)} new job(s) to fanout queue")

        if len(jobs) > 0:
            asyncio.run(super().add_jobs_batch(jobs))
