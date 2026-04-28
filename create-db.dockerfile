FROM python:3.14

WORKDIR /app

COPY shared /app/shared
COPY scripts/create-db-service /app/create-db-service

RUN cd /app/create-db-service && chmod +x prod.install.sh && ./prod.install.sh

CMD ["python", "/app/create-db-service/main.py"]
