# 阶段 1 - 安装依赖
FROM node:16 as builder
WORKDIR /nest-easy-candy

# set timezone - 设置容器的时区
RUN ln -sf /usr/share/zoneinfo/Asia/GuangZhou /etc/localtime
RUN echo 'Asia/GuangZhou' > /etc/timezone

RUN corepack enable

# 拷贝依赖声明
COPY package.json pnpm-lock.yaml /nest-easy-candy/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# 拷贝源代码
COPY ./ ./

# 阶段2 - 构建
RUN pnpm build

# clean dev dep - 清理开发依赖,在生产环境中安装依赖，并清理掉开发依赖。
RUN pnpm install --production
RUN pnpm cache clean

# 阶段3 - 构建
RUN pnpm global add pm2

# 暴露端口 - httpserver set port
EXPOSE 7001
# 暴露端口 - websokcet set port
EXPOSE 7002

# 容器启动时执行的命令，类似npm run start
# CMD ["pnpm", "start:prod"]
CMD ["pm2-runtime", "ecosystem.config.js"]
