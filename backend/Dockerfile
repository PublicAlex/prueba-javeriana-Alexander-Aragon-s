# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate --noinput && python manage.py seed_data

EXPOSE 8000

CMD ["gunicorn", "biblioteca_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
