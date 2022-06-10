#!/bin/sh
FROM python:3.9-slim-buster

WORKDIR /find-your-consultant/flask

# COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# CMD ["python3", "run.py"]
CMD ["gunicorn" "--worker-class" "eventlet" "-w" "1" "-b" "0.0.0.1:3000" "run:app"]