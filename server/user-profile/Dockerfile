FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y libpq-dev

WORKDIR /user-profile

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .
