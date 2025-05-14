FROM node:22

RUN apt update && \
    apt install -y vim tmux nginx git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY . ./

RUN yarn && yarn build

COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx"]
