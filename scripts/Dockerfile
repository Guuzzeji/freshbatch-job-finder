FROM python:3.14

WORKDIR /app

COPY . /app

RUN chmod +x prod.install.sh && ./prod.install.sh

CMD ["python", "/app/uptime.py"]
