# FROM 表示设置要制作的镜像基于哪个镜像，FROM指令必须是整个Dockerfile的第一个指令，如果指定的镜像不存在默认会自动从Docker Hub上下载。
# 指定我们的基础镜像是node，latest表示版本是最新, 如果要求空间极致，可以选择lts-alpine
# 使用 as 来为某一阶段命名
FROM node:16 as builder

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，
# 如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd 到 /nest-easy-candy
WORKDIR /nest-easy-candy

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/GuangZhou /etc/localtime
RUN echo 'Asia/GuangZhou' > /etc/timezone

# mirror acceleration
# RUN npm config set registry https://registry.npmmirror.com
# RUN pnpm config set registry https://registry.npmmirror.com
# RUN npm config rm proxy && npm config rm https-proxy

# install & build
COPY ./ ./
RUN pnpm install
RUN pnpm build
# clean dev dep
RUN pnpm install --production
RUN pnpm cache clean

RUN pnpm global add pm2

# httpserver set port
EXPOSE 7001
# websokcet set port
EXPOSE 7002

# 容器启动时执行的命令，类似npm run start
# CMD ["pnpm", "start:prod"]
CMD ["pm2-runtime", "ecosystem.config.js"]
