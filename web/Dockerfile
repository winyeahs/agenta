FROM node:22.11-alpine3.19 AS base
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache tzdata
FROM base as packages
WORKDIR /app/web
COPY . /app/web/
RUN chmod  777 ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install
RUN pnpm install @types/lodash --save-dev
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]

