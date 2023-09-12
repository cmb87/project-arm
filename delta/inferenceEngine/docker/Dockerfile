FROM python:3.9-slim


ENV USER=uwsgi
ENV UID=1000

RUN useradd -ms /bin/bash "$USER"

WORKDIR /home/uwsgi/app
COPY requirements.txt /home/uwsgi/app
COPY app /home/uwsgi/app/
RUN apt update -y

RUN apt-get update && \
    apt-get install -y \
        build-essential \
        make \
        gcc \
        libpcre3 \
        libpcre3-dev \
        libgl1-mesa-dev \
        libglib2.0-0 \
        uwsgi-plugin-python3 \
    && pip3 install -r requirements.txt \
    && pip3 install opencv-python \
    && apt-get remove -y --purge make gcc build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# RUN mkdir -p /var/tmp/uwsgi_metrics
# RUN chown -R "$USER" /var/tmp/uwsgi_metrics

# RUN mkdir -p /home/uwsgi/app/uploads/
# RUN chown -R "$USER" /home/uwsgi/app/uploads/

# RUN mkdir -p /var/tmp/prometheus_multiproc
# RUN chown -R "$USER" /var/tmp/prometheus_multiproc
# ENV prometheus_multiproc_dir=/var/tmp/prometheus_multiproc

ARG APPVERSIONARG=NA
ENV APPVERSION=$APPVERSIONARG

EXPOSE 5005
# Run app_ws.py when the container launches
USER uwsgi
# Run app.py when the container launches
CMD ["python3", "app.py"]