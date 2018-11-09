FROM nginx:latest

ARG CERT_PATH=/etc/letsencrypt/live/snek-gc.misha.im

ADD nginx.conf /etc/nginx/nginx.conf


ADD fullchain.pem $CERT_PATH/fullchain.pem
ADD privkey.pem $CERT_PATH/privkey.pem

RUN chmod +rwxrwxrwx $CERT_PATH/fullchain.pem
RUN chmod +rwxrwxrwx $CERT_PATH/privkey.pem

