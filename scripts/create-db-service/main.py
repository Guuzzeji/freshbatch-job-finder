import os
import time
import logging
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Environment variables
DB_HOST = os.environ.get("DB_HOST", "db")
DB_PORT = os.environ.get("DB_PORT", "5432")
POSTGRES_USER = os.environ.get("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "postgres")

def execute_sql_file(cursor, file_path):
    with open(file_path, 'r') as f:
        sql = f.read()
        if sql.strip():
            cursor.execute(sql)

def create_databases():
    logger.info(f"Connecting to default database (postgres) at {DB_HOST}:{DB_PORT}...")
    try:
        # Connect to the default postgres database
        conn = psycopg2.connect(
            dbname="postgres",
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
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
    logger.info(f"Connecting to webhook_db at {DB_HOST}:{DB_PORT}...")
    try:
        conn = psycopg2.connect(
            dbname="webhook_db",
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
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
