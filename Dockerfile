# 构建变量
ARG NODE_VERSION=18-alpine

# 阶段 1 - 安装依赖
FROM node:${NODE_VERSION} as builder
# 环境变量, 设置 PNPM_HOME 环境变量，指定 pnpm 的全局安装目录
ENV PNPM_HOME="/usr/local/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# set timezone - 设置容器的时区
RUN ln -sf /usr/share/zoneinfo/Asia/GuangZhou /etc/localtime
RUN echo Asia/GuangZhou > /etc/timezone

WORKDIR /nest-easy-candy

# 下载pm2
# RUN pnpm add pm2 --global
RUN yarn add pm2 --global

# 拷贝源代码
COPY ./ ./
RUN yarn install
RUN yarn run build
# 暴露端口 - httpserver set port
EXPOSE 7001
# 暴露端口 - websokcet set port
EXPOSE 7002
CMD ["pm2-runtime", "ecosystem.config.js"]
