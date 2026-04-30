FROM python:3.14

WORKDIR /app

COPY shared /app/shared
COPY scripts/ /app/scripts/

RUN cd /app/scripts/ && chmod +x prod.install.sh && ./prod.install.sh
