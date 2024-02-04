#!/bin/bash

m1=mongod1
m2=mongod2
m3=mongod3
port=${PORT:-27017}

echo "###### 等待实例 ${m1} 启动.."
until mongosh --host ${m1}:${port} --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done
echo "###### 发现工作 ${m1} 实例, 初始化用户设置 & 初始化rs设置..."
# setup user + pass and initialize replica sets
# mongosh --host mongod1:27017 <<EOF
mongosh --host ${m1}:${port} <<EOF
var rootUser = process.env.MONGO_INITDB_ROOT_USERNAME;
var rootPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
var replicaName = process.env.MONGO_REPLICA_NAME;
var authDatabase = process.env.MONGO_AUTHDATABASE;
var admin = db.getSiblingDB('admin');
admin.auth(rootUser, rootPassword);
print("认证成功");

var config = {
    "_id": replicaName,
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "${m1}:${port}",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "${m2}:${port}",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "${m3}:${port}",
            "priority": 1,
            "arbiterOnly": true
        }
    ]
};
rs.initiate(config, { force: true });
rs.status();

use admin
db.auth(rootUser, rootPassword);
var authDb = db.getSiblingDB(authDatabase)
authDb.createUser({
    "user":rootUser,
    "pwd":rootPassword,
    "roles":[
        {
            role:"readWrite",
            db:authDatabase
        }
    ]
})
show users
EOF
