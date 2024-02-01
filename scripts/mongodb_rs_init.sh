#!/bin/bash

m1=mongod1
m2=mongod2
m3=mongod3
port=${PORT:-27017}
rootUser="$MONGO_LOGIN"
rootPassword="$MONGO_PASSWORD"

echo "###### 等待实例 ${m1} 启动.."
until mongosh --host ${m1}:${port} --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done
echo "###### 发现工作 ${m1} 实例, 初始化用户设置 & 初始化rs设置..."

# setup user + pass and initialize replica sets
# var admin = db.getSiblingDB('admin');
mongosh --host ${m1}:${port} <<EOF
db.auth('$rootUser', '$rootPassword');

var config = {
    "_id": "${MONGO_REPLICA_NAME}",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "${m1}:${port}",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "${m2}:27018",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "${m3}:27019",
            "priority": 1,
            "arbiterOnly": true
        }
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF