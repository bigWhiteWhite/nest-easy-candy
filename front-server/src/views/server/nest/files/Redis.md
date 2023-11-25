[图形化界面](https://github.com/lework/RedisDesktopManager-Windows/releases?spm=a2c6h.12873639.article-detail.8.4cec71fbpyE08u)

[Redis 下载](https://github.com/microsoftarchive/redis/releases)

[官方文档](https://redis.io/docs/getting-started/)

[中文文档](https://www.redis.net.cn/tutorial/3517.html)

[可视化链接工具](https://pan.baidu.com/s/1jBjxXvrwJsdRIFLW_PJnsQ)：提取码：xnu1

https://resp.app/

连接本机 redis 无问题就 ok

# 启动

## 设置 redis 开机自启动

- 在 redis 的目录下执行（执行后就作为 windows 服务了）

```bash
 redis-server.exe --service-install redis.windows.conf
```

- 安装好后需要手动启动 redis

```bash
 redis-server.exe --service-start
```

- 停止服务

```bash
 redis-server.exe --service-stop
```

- 卸载 redis 服务

```bash
 redis-server.exe --service-uninstall
```

## 设置 Redis 的密码

进入 Redis 的安装目录打开：redis.windows-conf，按下 Ctrl+F 查找：requirepass，找到编辑保存然后重新启动 Redis 服务即可。（注意：这里是 redis.windows-conf，windows 自启动会加载这个配置文件）。

# Nest 中使用 redis

注意首先引入到`app.module`中

## 基本使用

1. **连接与断开**
   - `new Redis()`: 创建一个新的 Redis 客户端实例。
   - `disconnect()`: 断开与 Redis 的连接。
2. **基本命令**
   - `set(key, value)`: 设置一个键值。
   - `get(key)`: 获取一个键的值。
   - `del(key)`: 删除一个键。
   - `expire(key, seconds)`: 设置键的过期时间。
   - `incr(key)`: 自增一个键的值。
   - `decr(key)`: 自减一个键的值。
3. **哈希操作**
   - `hset(key, field, value)`: 设置哈希表中的字段值。
   - `hget(key, field)`: 获取哈希表中的字段值。
   - `hdel(key, field)`: 删除哈希表中的字段。
   - `hmset(key, obj)`: 设置多个哈希表字段。
   - `hgetall(key)`: 获取哈希表中的所有字段和值。
4. **列表操作**
   - `lpush(key, value)`: 将一个值插入到列表头部。
   - `rpush(key, value)`: 将一个值插入到列表尾部。
   - `lpop(key)`: 移除并获取列表的第一个元素。
   - `rpop(key)`: 移除并获取列表的最后一个元素。
5. **集合操作**
   - `sadd(key, value)`: 将一个成员加入到集合中。
   - `smembers(key)`: 返回集合中的所有成员。
   - `srem(key, value)`: 移除集合中的一个或多个成员。
6. **发布/订阅**
   - `subscribe(channel)`: 订阅一个频道。
   - `publish(channel, message)`: 在一个频道上发布消息。
   - `unsubscribe(channel)`: 取消订阅频道。
7. **事务**
   - `multi()`: 开始一个事务。
   - `exec()`: 提交事务。
8. **其他**
   - `keys(pattern)`: 根据模式匹配获取键。
   - `exists(key)`: 检查键是否存在。
   - `ttl(key)`: 获取键的剩余生存时间。

```ts
import { RedisService } from 'apps/server/src/shared/redis/redis.service'
export class UserService {
	constructor(
		@InjectModel(User)
		private readonly userModel: ReturnModelType<typeof User>,
		private redisService: RedisService
	) {}

	// 获取
	async getRedisPasswordVersionById(id: string): Promise<string> {
		return this.redisService.getRedis().get(`server:passwordVersion:${id}`)
	}
}
```
