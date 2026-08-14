import logging
import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

COOLIFY_BASE_URL = str(os.getenv("COOLIFY_BASE_URL"))
COOLIFY_API_KEY = str(os.getenv("COOLIFY_API_KEY"))
APP_ID = str(os.getenv("APP_ID"))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def restart_repo_checker():
    # Don't restart as that will not do a full rebuild of the docker image
    # check this as point of reference: https://github.com/coollabsio/coolify/discussions/2935
    url = f"{COOLIFY_BASE_URL}/api/v1/deploy?uuid={APP_ID}&force=true"
    headers = {
        "Authorization": f"Bearer {COOLIFY_API_KEY}"
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 200:
        logger.info("Repo checker restarted successfully")
        return True
    else:
        logger.error(f"Failed to restart repo checker: {response.status_code} - {response.text}")
        return False

if __name__ == "__main__":
    STATUS = restart_repo_checker()
    if STATUS:
        logger.info("Exiting with status 0")
        sys.exit(0)
    else:
        logger.error("Exiting with status 1")
        sys.exit(1)