FROM python:3.14

WORKDIR /app

COPY scripts/move-db/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY scripts/move-db/ .

CMD ["python", "main.py"]
