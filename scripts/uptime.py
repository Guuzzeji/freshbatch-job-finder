from time import sleep
import logging

"""
Used to get docker image up and running without exiting immediately.
"""

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting uptime script...")
    while True:
        logger.info("Docker container is running...")
        sleep(60)  # Sleep for 60 seconds before printing again