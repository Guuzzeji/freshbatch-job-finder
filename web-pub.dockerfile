FROM python:3.14

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY shared /app/shared
COPY webhook-publisher /app/webhook-publisher

RUN cd /app/webhook-publisher && chmod +x prod.install.sh && ./prod.install.sh

CMD ["python", "/app/webhook-publisher/main.py"]
