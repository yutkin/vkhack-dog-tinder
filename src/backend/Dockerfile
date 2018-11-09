FROM python:3.7

ADD . /app

RUN pip install -U pip && pip install -r /app/requirements.txt

WORKDIR /app

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]