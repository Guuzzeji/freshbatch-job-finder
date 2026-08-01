# This is a corn job that runs every 12 hours to help fix bug in repo-checker

import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

COOLIFY_BASE_URL=str(os.getenv("COOLIFY_BASE_URL"))
COOLIFY_API_KEY=str(os.getenv("COOLIFY_API_KEY"))
APP_ID=str(os.getenv("APP_ID"))

def restart_repo_checker():
    # Don't restart as that will not do a full rebuild of the docker image
    # check this as point of reference: https://github.com/coollabsio/coolify/discussions/2935
    url = f"{COOLIFY_BASE_URL}/api/v1/applications/deploy?uuid={APP_ID}&force=true"
    headers = {
        "Authorization": f"Bearer {COOLIFY_API_KEY}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("Repo checker restarted successfully")
        return True
    else:
        print(f"Failed to restart repo checker: {response.status_code} - {response.text}")
        return False

if __name__ == "__main__":
    STATUS = restart_repo_checker()
    if STATUS:
        sys.exit(0)
    else:
        sys.exit(1)