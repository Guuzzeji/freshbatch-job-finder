# Install the external shared module locally
pip install -e ../shared
# Install the repo-checker locally (along with requirements.txt)
pip install -e .
# m1 mac fix for postgres library
pip install psycopg2-binary --force-reinstall --no-cache-dir