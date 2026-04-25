FROM python:3.14

WORKDIR /app

COPY create-db-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY create-db-service/ .

CMD ["python", "main.py"]
