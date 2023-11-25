## 常用命令

```javascript
sudo su root		//切换超级管理员
cp 文件夹名 /root/Desktop/new
```

### 挂载共享文件夹

```javascript
/usr/bin/vmhgfs-fuse .host:/share  /mnt/hgfs/share  -o subtype=vmhgfs-fuse,allow_other
```

