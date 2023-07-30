FROM alpine:3.17

RUN apk update && \
    apk add --no-cache \
    python3 \
    py3-pip \
    py3-psycopg2 \
    && pip install --upgrade pip

COPY requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

WORKDIR /app

COPY ./music_controller .

# CMD /app/entrypoint.sh
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]