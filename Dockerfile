FROM python:3

WORKDIR /root

COPY requirements.txt .
COPY setup.py .
COPY spending_manager spending_manager/

RUN apt-get -y update
RUN pip3 install -r requirements.txt

RUN ls -la .

ENV FLASK_APP spending_manager
ENV FLASK_ENV developement

EXPOSE 5000

CMD [ "flask", "run", "-h0.0.0.0" ]
