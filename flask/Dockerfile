#!/bin/sh
FROM python:3.9-slim-buster

WORKDIR /find-your-consultant/flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
