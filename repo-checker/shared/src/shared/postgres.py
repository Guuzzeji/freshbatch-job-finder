from urllib.parse import urlsplit


def parse_postgres_url(url: str) -> dict[str, str | int | None]:
    """Parse a Postgres DSN into psycopg2 connection kwargs."""
    parsed = urlsplit(url)
    return {
        "host": parsed.hostname,
        "port": parsed.port,
        "username": parsed.username,
        "password": parsed.password,
        "dbname": parsed.path[1:],
    }
