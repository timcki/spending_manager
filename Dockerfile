FROM python:3

WORKDIR /root

COPY requirements.txt .

RUN pip3 install -r requirements.txt

ENV FLASK_APP spending_manager
ENV FLASK_ENV development

EXPOSE 5000

CMD [ "flask", "run", "-h0.0.0.0" ]
