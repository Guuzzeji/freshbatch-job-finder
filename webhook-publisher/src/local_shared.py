from urllib.parse import urlsplit

PAYLOAD_DIVIDER = "/-/"

def parse_postgres_url(url):
    # NOTE: DNS needs to parse does not work directly with psycopg2
    parsed = urlsplit(url)
    return {
        "host": parsed.hostname,
        "port": parsed.port,
        "username": parsed.username,
        "password": parsed.password,
        "dbname": parsed.path[1:],
    }