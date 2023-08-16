FROM --platform=linux/amd64 python:3.11-slim
WORKDIR /app
RUN pip3 install poetry
COPY . .
RUN poetry install
CMD poetry run locust
