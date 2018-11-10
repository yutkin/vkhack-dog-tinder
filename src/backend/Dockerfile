FROM python:3.7

ADD requirements.txt /app/requirements.txt

RUN pip install -U pip && pip install -r /app/requirements.txt

ADD . /app

WORKDIR /app

RUN python manage.py collectstatic

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]