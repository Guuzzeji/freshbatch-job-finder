FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY shared /app/shared
COPY webhook-publisher/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -e /app/shared \
    && pip install --no-cache-dir -r /app/requirements.txt

COPY webhook-publisher/main.py /app/main.py
COPY webhook-publisher/src /app/src

CMD ["python", "main.py"]
