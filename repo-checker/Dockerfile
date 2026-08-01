FROM python:3.14

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN chmod +x prod.install.sh && ./prod.install.sh

CMD ["python", "/app/main.py"]
