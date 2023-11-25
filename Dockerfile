# 构建变量
ARG NODE_VERSION=18-alpine

# 阶段 1 - 安装依赖
FROM node:${NODE_VERSION} as builder
# 环境变量, 设置 PNPM_HOME 环境变量，指定 pnpm 的全局安装目录
ENV LOCALTIME='Asia/GuangZhou'
ENV PNPM_HOME="/usr/local/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# set timezone - 设置容器的时区
RUN ln -sf /usr/share/zoneinfo/Asia/GuangZhou /etc/localtime
RUN echo ${LOCALTIME} > /etc/timezone

FROM builder AS build
# 拷贝源代码
COPY ["./", "./"]
WORKDIR /nest-easy-candy
# 下载pm2
RUN pnpm add pm2 --global
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=back-server --prod /back-server
# RUN pnpm deploy --filter=front-server --prod /front-server

# 启动后端服务
FROM builder AS back-server
WORKDIR /back-server
# 暴露端口 - httpserver set port
EXPOSE 7001
# 暴露端口 - websokcet set port
EXPOSE 7002
CMD ["pm2-runtime", "ecosystem.config.js"]

# 启动前端服务
# FROM base AS front-server
# WORKDIR /front-server