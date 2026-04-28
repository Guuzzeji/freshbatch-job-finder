import os
import json
import redis
import shutil
import subprocess
import time
from datetime import datetime, timedelta
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
        force_reclone_env = str(os.getenv("REPO_CHECKER_FORCE_RECLONE_ON_STARTUP") or "true").strip().lower()
        self._force_reclone_on_startup = force_reclone_env in {"1", "true", "yes", "on"}
        self._startup_sync_complete = False
        self._need_reboot_due_to_resource_pressure = False

    def _is_process_pressure_error(self, error: Exception) -> bool:
        error_text = str(error)
        lowered = error_text.lower()
        error_type =  (
            "resource temporarily unavailable" in lowered
            or "cannot fork" in lowered
            or "can't start new thread" in lowered
            or "errno 11" in lowered
        )
        
        if not error_type:
            return False
        return True

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

    def _force_delete_repo_path(self, repo_path: str, repo_name: str) -> bool:
        if not os.path.exists(repo_path):
            return True

        try:
            shutil.rmtree(repo_path)
            logger.info(
                "[RepoChangesParser] Force deleted existing local repo '%s' before fresh clone",
                repo_name,
            )
            return True
        except OSError as e:
            logger.error(
                "[RepoChangesParser] Failed to force delete local repo '%s': %s",
                repo_name,
                str(e),
                exc_info=True,
            )
            return False

    def _run_git_command_with_retry(
        self,
        command: list[str],
        repo_name: str,
        cwd: str | None = None,
        max_attempts: int = 3,
    ) -> bool:
        for attempt in range(1, max_attempts + 1):
            try:
                subprocess.run(
                    command,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=cwd,
                    check=True,
                )
                return True
            except subprocess.CalledProcessError as e:
                is_transient_resource_error = self._is_process_pressure_error(e)
                if is_transient_resource_error and attempt < max_attempts:
                    backoff_seconds = attempt
                    logger.warning(
                        "[RepoChangesParser] Transient git failure for repo '%s' (attempt %s/%s). "
                        "Retrying in %ss. Stderr: %s",
                        repo_name,
                        attempt,
                        max_attempts,
                        backoff_seconds,
                        str(e.stderr or "").strip(),
                    )
                    time.sleep(backoff_seconds)
                    continue

                self._need_reboot_due_to_resource_pressure = is_transient_resource_error

                logger.error(
                    "[RepoChangesParser] Git process failed for repo '%s'. Return code: %s. Stderr: %s",
                    repo_name,
                    e.returncode,
                    str(e.stderr or ""),
                )
                return False
            except OSError as e:
                # Errno 11 is commonly raised when the process table is temporarily exhausted.
                is_process_pressure_error = e.errno == 11 or self._is_process_pressure_error(e)
                if is_process_pressure_error and attempt < max_attempts:
                    backoff_seconds = attempt
                    logger.warning(
                        "[RepoChangesParser] OS process spawn failed for repo '%s' (attempt %s/%s). "
                        "Retrying in %ss. Error: %s",
                        repo_name,
                        attempt,
                        max_attempts,
                        backoff_seconds,
                        str(e),
                    )
                    time.sleep(backoff_seconds)
                    continue

                self._need_reboot_due_to_resource_pressure = is_transient_resource_error

                logger.error(
                    "[RepoChangesParser] Unexpected OS error while running git for repo '%s': %s",
                    repo_name,
                    str(e),
                    exc_info=True,
                )
                return False

        return False

    def pull(self, repo_url: str, repo_name: str) -> bool:
        self.__create_repo_folder()
        repo_path = os.path.join(ALL_REPO_SAVE_PATH, repo_name)

        try:
            if self._force_reclone_on_startup and not self._startup_sync_complete:
                logger.info(
                    "[RepoChangesParser] Startup recovery enabled for '%s'; forcing fresh clone",
                    repo_name,
                )
                if not self._force_delete_repo_path(repo_path, repo_name):
                    return False

                clone_ok = self._run_git_command_with_retry(
                    ["git", "clone", repo_url, repo_path],
                    repo_name,
                )
                if not clone_ok:
                    return False

                self._startup_sync_complete = True
                logger.info(
                    "[RepoChangesParser] Fresh clone complete for repo '%s'; starting parse phase",
                    repo_name,
                )
                return True

            if not os.path.exists(repo_path):
                clone_ok = self._run_git_command_with_retry(
                    ["git", "clone", repo_url, repo_path],
                    repo_name,
                )
                if not clone_ok:
                    return False

                self._startup_sync_complete = True
                logger.info(
                    "[RepoChangesParser] Clone complete for repo '%s'; starting parse phase",
                    repo_name,
                )
                return True
            else:
                pull_ok = self._run_git_command_with_retry(
                    ["git", "pull"],
                    repo_name,
                    cwd=repo_path,
                )
                if pull_ok:
                    self._startup_sync_complete = True
                    logger.info(
                        "[RepoChangesParser] Pull complete for repo '%s'; starting parse phase",
                        repo_name,
                    )
                return pull_ok
        except OSError as e:
            logger.error(
                "[RepoChangesParser] Unexpected error while pulling repo '%s': %s",
                repo_name,
                str(e),
                exc_info=True,
            )
            return False
        
    def need_to_reboot_due_to_resource_pressure(self) -> bool:
        if self._need_reboot_due_to_resource_pressure:
            logger.warning(
                "[RepoChangesParser] System is currently under resource pressure backoff. "
                "Consider rebooting the system to recover resources if this persists.",
            )
            return True
        return False

    def check(self) -> None:
        return None
