# 构建变量
ARG NODE_VERSION=18-alpine
ARG PROJECT_DIR

# 阶段 1 - 安装依赖
FROM node:${NODE_VERSION} as builder
# 环境变量, 设置 PNPM_HOME 环境变量，指定 pnpm 的全局安装目录
ENV PNPM_HOME="/pnpm" \
  PATH="$PNPM_HOME:$PATH" \
  DATABASE_HOST=db \
  SERVER_PORT=7001 \
  SOKCET_PORT=7002

RUN corepack enable \
  && yarn global add pm2

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，
# 如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd 到 /nest-admin
WORKDIR $PROJECT_DIR
COPY ./ $PROJECT_DIR
RUN chmod +x ./wait-for-it.sh

# see https://pnpm.io/docker
FROM builder AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM builder AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# mirror acceleration
# RUN npm config set registry https://registry.npmmirror.com
# RUN pnpm config set registry https://registry.npmmirror.com
# RUN npm config rm proxy && npm config rm https-proxy
FROM builder
COPY --from=prod-deps $PROJECT_DIR/node_modules $PROJECT_DIR/node_modules
COPY --from=build $PROJECT_DIR/dist $PROJECT_DIR/dist

# 暴露端口 - httpserver set port
EXPOSE $SERVER_PORT
# 暴露端口 - websokcet set port
EXPOSE $SOKCET_PORT

# 容器启动时执行的命令，类似npm run start
# CMD ["pnpm", "start:prod"]
# CMD ["pm2-runtime", "ecosystem.config.js"]
ENTRYPOINT ./wait-for-it.sh $DATABASE_HOST:$MYSQL_PORT -- pnpm migration:run && pm2-runtime ecosystem.config.js
