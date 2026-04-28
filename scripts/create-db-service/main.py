import os
import time
import logging
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from shared.postgres import parse_postgres_url

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

_postgres_dsn = os.getenv("POSTGRES_DSN_URL")
if not _postgres_dsn:
    raise RuntimeError("POSTGRES_DSN_URL environment variable is not set")
POSTGRES_DSN_URL: str = _postgres_dsn


def connect_to_db(dbname: str):
    parsed_url = parse_postgres_url(POSTGRES_DSN_URL)
    return psycopg2.connect(
        dbname=dbname,
        user=parsed_url["username"],
        password=parsed_url["password"],
        host=parsed_url["host"],
        port=parsed_url["port"],
    )

def execute_sql_file(cursor, file_path):
    with open(file_path, 'r') as f:
        sql = f.read()
        if sql.strip():
            cursor.execute(sql)

def create_databases():
    parsed_url = parse_postgres_url(POSTGRES_DSN_URL)
    logger.info(f"Connecting to default database (postgres) at {parsed_url['host']}:{parsed_url['port']}...")
    try:
        # Connect to the default postgres database
        conn = connect_to_db("postgres")
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        logger.info("Checking and creating databases...")
        databases_to_create = ["webhook_db", "auth_db"]
        for db_name in databases_to_create:
            cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
            exists = cur.fetchone()
            if not exists:
                logger.info(f"Creating database: {db_name}")
                # Safe to use f-string here as db_name is hardcoded from our list
                cur.execute(f"CREATE DATABASE {db_name}")
                logger.info(f"Database {db_name} created successfully.")
            else:
                logger.info(f"Database {db_name} already exists. Skipping.")
                
        cur.close()
        conn.close()
        logger.info("Database creation phase completed.")
    except Exception as e:
        logger.error(f"Error during database creation: {e}")
        raise

def create_tables():
    parsed_url = parse_postgres_url(POSTGRES_DSN_URL)
    logger.info(f"Connecting to webhook_db at {parsed_url['host']}:{parsed_url['port']}...")
    try:
        conn = connect_to_db("webhook_db")
        cur = conn.cursor()

        script_dir = os.path.dirname(os.path.abspath(__file__))
        sql_file = os.path.join(script_dir, "create-tables.sql")
        
        logger.info(f"Executing {sql_file}...")
        execute_sql_file(cur, sql_file)
        
        conn.commit()
        cur.close()
        conn.close()
        logger.info("Tables created successfully in webhook_db.")
    except Exception as e:
        logger.error(f"Error during table creation: {e}")
        raise

def main():
    logger.info("Starting database setup service...")
    
    # We'll sleep just for 2 seconds to be safe, though docker-compose condition: service_healthy should handle this.
    time.sleep(2)
    
    create_databases()
    create_tables()
    
    logger.info("Database setup completed successfully. Exiting.")

if __name__ == "__main__":
    main()
