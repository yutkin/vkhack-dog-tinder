FROM python:3.7

ADD requirements.txt /app/requirements.txt

RUN pip install -U pip && pip install -r /app/requirements.txt

ADD ./vkhack/ /app/

WORKDIR /app


EXPOSE 8080

#CMD ["gunicorn", "--workers=4", "--bind=0.0.0.0:8000", "--worker-class='egg:meinheld#gunicorn_worker", "vkhack.wsgi"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]