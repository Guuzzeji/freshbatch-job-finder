FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

COPY shared /app/shared
COPY repo-checker/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -e /app/shared \
    && pip install --no-cache-dir -r /app/requirements.txt

COPY repo-checker/main.py /app/main.py
COPY repo-checker/src /app/src
COPY repo-checker/repos /app/repos

CMD ["python", "main.py"]
