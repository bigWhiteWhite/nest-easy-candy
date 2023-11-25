# nginx

## 基本命令

```javascript
//命令行进入nginx解压后的文件夹，start nginx 启动nginx
start nginx 					// cd到nginx所在目录，启动nginx
nginx -s reload					// 修改配置后重新加载生效
nginx -s reopen					// 重新打开日志文件
nginx -t -c /path/to/nginx.conf	// 测试nginx配置文件是否正确
nginx -s stop					// 快速停止nginx
nginx -s quit					// 完整有序的停止nginx
nginx -t						// 查看有无配置成功
```

### 部署

cnpm run build
将打包好的dist文件放在nginx的安装目录下的html中，配置nginx的conf文件，将root的路径进行修改，如果不修改，则将新的dist文件覆盖旧的dist文件

## 反向代理

### 正向代理

- 在客户端(浏览器)配置代理服务器，通过代理服务器进行互联网访问，而不是用户直接访问互联网

### 反向代理

- 其实客户端对代理是无感知的，因为客户端不需要任何配置就可以访问，我们只需要将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，在返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器ip地址

### 配置实例

```javascript
//实现效果-打开浏览器实现效果：使用 nginx 反向代理，访问 www .123 .com 直接跳转到 127.0.0.1:8080
//3.1：tomcat命令
startup.bat //启动tomcat服务
shutdown.bat //关闭tomcat服务

//window(浏览器)    --》   nginx(反向代理) 	--》  tomcat(ip服务器)
//域名www.123.com 		192.168.17.129:80 		  127.0.0.1:8080(客户端看不到这个)

```

```javascript
//第一步 在window系统的host文件进行域名和ip对应关系的配置，如果找不到会去网络上找
C:\Windows\System32\drivers\etc  中的hosts文件
//添加内容到host文件中，需要管理员权限，用管理员的方式打开Hbuild软件，然后保存就好
//IP地址   			域名
//192.168.133.1   www.123.com

//！！！192.168.133.1是本地的ipv6的地址，每个电脑不一样，通过ipconfig来查询

//验证：www.123.com:8080      192.168.133.1:8080 还是失败了，一定要输入端口号，而且不启动nginx也可以访问，是tomcat的作用
```

### server

```javascript

upstream tomcat_server1 {
    server 127.0.0.1:8080;     //被代理的服务器ip
}
server {
    listen       8091;
    server_name  192.168.133.1; //被代理的服务器ip

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   html;
        proxy_pass   http://tomcat_server1;//代理ip地址
        index  index.html index.htm;
    }
    location /img/ {//请求到img的时候去访问到root的目录
        root   D:/nginx-1.18.0/static;
        proxy_pass   http://tomcat_server1;
        autoindex on;
    }
}
```

## 负载均衡

客户端发送多个请求到服务器，服务器处理请求，有一些可能要与数据库进行交互，服务器处理完毕后，再将结果返回给客户端。这种架构模式对于早期的系统相对单一，并发请求相对较少的情况下是比较适合的，成本也低。但是随着信息数量的不断增长，访问量和数据量的飞速增长，以及系统业务的复杂度增加，这种架构会造成服务器相应客户端的请求日益缓慢，并发量特别大的时候，还容易造成服务器直接崩溃。很明显这是由于服务器性能的瓶颈造成的问题，那么如何解决这种情况呢？

		这时候集群的概念产生了，
		单个服务器解决不了，我们增加服务器的数量，然后将请求分发到各个服务器上，将原先请
		求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发到不同的服务器
		，也就是我们所说的 负载均衡
												服务器(8001)
		客户端(浏览器) --》反向代理服务器(端口9001) --》 	服务器(8002)
					nginx						服务器(8003)
												
		假如有15个请求，那么nginx就将请求分发到3个服务器上	，一个服务器应该有5个请求，反向代理服务器就有负载均衡的作用	
```javascript
//实验代码(在csdn中有)首先准备两个同时启动的 Tomcat,在 nginx.conf 中进行配置
upstream xx.com{
  server 127.0.0.1:8080 fail_timeout=2s max_fails=1;
  server 127.0.0.1:8081 fail_timeout=2s max_fails=1;
}
server {
    listen 80;
    server_name www.123.com;

    location / {
        proxy_pass http://xx.com;
        proxy_redirect default;
        proxy_connect_timeout 2s;
    }
        .......省略
}
```

### 负载均衡策略

```javascript
//3.1：轮询（默认）每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除。
//3.2：weight 代表权重默认为 1,权重越高被分配的客户端越多
//指定轮询几率，weight 和访问比率成正比，用于后端服务器性能不均的情况。										
upstream xx.com{
    server 192.168.12.100:5000 weight=1;
    server 192.168.12.101:5000 weight=1;
    server 192.168.12.101:5000 weight=3;
}
//权重为1和3，那么权重为3的服务器被轮询的几率为1的3倍。
//3.3：ip_hash 通过对IP的Hash值进行计算然后选择分配的服务器。这个方法可以使客户端的请求发送到相同的服务器以保证session会话，并且可以使用权重。
//就是第一次访问的服务器是谁，后面再次访问都是访问这个服务器。
upstream xx.com{
    ip_hash;    #保证每个访客固定访问一个后端服务器
    server localhost:8080   weight=2; 
    server localhost:8083   max_fails=3 fail_timeout=20s;  
}
//3.4：fair：按照服务端响应时间来分配请求，响应时间最短的优先分配。
upstream xx.com{
    server localhost:8080   weight=2; 
    server localhost:8083   max_fails=3 fail_timeout=20s;  
    fair
}
```

## 动静分离

	   为了加快网站的解析速度，可以把动态页面(jsp)和静态页面(html,css,js)由不同的服务器来解析，加快解析速度。降低原来单个服务器的压力。
	   图片请求相对于jsp，servlet来说就是所谓的静态资源，当然服务中的静态资源不仅仅只是图片，像页面样式css文件，js脚本文件这些都可以看着是静态资源。
	   tomcat既可以静态资源也可以处理动态资源。但是单节点的tomcat本身处理请求的资源是有限的，如果项目中的tomcat既处理动态请求有要处理大量的静态资源。显然是不合理的，也就是会遇到tomcat的性能瓶颈问题。静态资源的请求由Nginx来处理，像jsp我们交给tomcat来处理。这样也能减轻tomcat的处理压力。
动静分离从目前实现角度来讲大致分为两种，一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案；另外一种方法就是动态跟静态文件混合在一起发布，通过 nginx 来分开

```javascript
#静态文件交给nginx处理
location ~ .*\.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|pdf|xls|mp3|wma)$
{
    root /static;
    expires 30d;
}
#静态文件交给nginx处理
location ~ .*\.(js|css)?$
{
	root /static;
	expires 1h;
}
				
```

## 高可用的集群

有可能nginx会宕机，那么请求就会失败
		
	高可用：如果只有一个nginx的服务器，那么很容易发生单点故障，所以说加多一个nginx服务器，当主nginx服务器宕机，
	那么，备用的nginx服务器也可以接替主服务器的工作。


​			
				主nginx服务器(MASTER)			tomcat1
	浏览器--》							--》 
				备nginx服务器(BACKUP)			tomcat2
	(如果主nginx没有问题，那么不会启用备服务器，由主服务器处理工作)
			
	要实现高可用，需要用到虚拟ip和keeplive，两台nginx服务器会使用虚拟的ip给用户访问，当主nginx的服务器宕机，keepalive检测到以后，那么会替换备用的服务器
	1：启动两个nginx
	keepalive只有window，就学习到这里
## 坑

```javascript
//使用反向代理的时候没有办法访问到nginx下的目录，估计是去toncat下的目录下寻找了，监听的端口也需要改变，不能是8080
upstream tomcat_server1 {
    server 127.0.0.1:8080;    //无法使用反向代理，只能用localhost:8090端口访问
}
server {
    listen       8090;
    server_name  localhost;
    location / {
        root   html;
        index  index.html index.htm;
    }
    location /www/ {
        root   D:/nginx-1.18.0/static;
        index  index.html index.htm;
        autoindex on;  //列出文件目录
    }
    location /img/ {
        root   D:/nginx-1.18.0/static;
        proxy_pass   http://tomcat_server1;
        autoindex on;
    }
}
```

# nginx配置文件解析

- 全局块

  ```javascript
  从配置文件开始到 events 块之间的内容，主要会设置一些影响 nginx 服务器整体运行的配置指令，主要包括配置运行 Nginx 服务器的用户（组）、允许生成的 worker process 数，进程 PID 存放路径、日志存放路径和类型以及配置文件的引入等。
  worker_processes  1; 
  比如上面第一行配置的：这是 Nginx 服务器并发处理服务的关键配置，worker_processes 值越大，可以支持的并发处理量也越多，但是
  会受到硬件、软件等设备的制约
  ```

- events 块

  ```javascript
  events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 work process下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。
  worker_connections  1024;上述例子就表示每个 work process 支持的最大连接数为 1024.这部分的配置对 Nginx 的性能影响较大，在实际中应该灵活配置。
  ```

- http 块

  - 这算是 Nginx 服务器配置中最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里。需要注意的是：http 块也可以包括 http 全局块、server 块。

  - http 全局块配置的指令包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单链接请求数上限等。

  - server 这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了节省互联网服务器硬件成本。每个 http 块可以包括多个 server 块，而每个 server 块就相当于一个虚拟主机。而每个 server 块也分为全局 server 块，以及可以同时包含多个 locaton 块。

    ```javascript
    1、全局 server 块
    最常见的配置是本虚拟机主机的监听配置和本虚拟主机的名称或 IP 配置。
    2、location 块
    一个 server 块可以配置多个 location 块。
    这块的主要作用是基于 Nginx 服务器接收到的请求字符串（例如 server_name/uri-string），对虚拟主机名称
    （也可以是 IP 别名）之外的字符串（例如 前面的 /uri-string）进行匹配，对特定的请求进行处理。地址定向、数据缓
    存和应答控制等功能，还有许多第三方模块的配置也在这里进行。
    ```

    ```javascript
    server {
        listen       8090;//监听端口
        server_name  localhost;//主机名称
    
        location / {
            root html/dist;
            try_files $uri $uri/ /index.html last;
            index  index.html index.htm;
            autoindex on;       #开启nginx目录浏览功能
            autoindex_exact_size off;   #文件大小从KB开始显示
            charset utf-8;          #显示中文
            add_header 'Access-Control-Allow-Origin' '*'; #允许来自所有的访问地址
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'GET, PUT, POST, DELETE, OPTIONS'; #支持请求方式
            add_header 'Access-Control-Allow-Headers' 'Content-Type,*';
        }
        #开始配置我们的反向代理
        location /proxy{
            rewrite ^/proxy/(.*)$ /$1 break;
            include uwsgi_params;
            proxy_set_header   Host             $host;
            proxy_set_header   x-forwarded-for  $remote_addr;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_pass  http://127.0.0.1:8100;
        }
    
        location @router {
            rewrite ^.*$ /index.html last;
        }
    
         error_page   500 502 503 504  /50x.html;
            location = /50x.html {
            root   html;
        }
    }
    ```

    

    

# tomcat

命令

```javascript
startup.bat 	//启动tomcat服务  或者点击bin目录下的startup.bat文件启动
shutdown.bat 	//关闭tomcat服务
```

```javascript
http://127.0.0.1:8080/edu/a.html //项目放在tomcat文件夹下的webapps下，edu文件夹放在webapps下
```

