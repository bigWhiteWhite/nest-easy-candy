import { DataSource, DataSourceOptions } from 'typeorm'

/**
 * ?知识点
 * 每次迁移都需要create一个迁移文件，命令行会执行最新时间戳的文件
 * revert会将迁移返回上一个时间戳
 * 迁移文件需要自己修改
 */

// 基础配置
const baseConfig: Partial<DataSourceOptions> = {
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'root',
	database: 'candyServer'
}

// 该对象 typeorm cli 迁移时使用
const ormConfigForCli: Partial<DataSourceOptions> = {
	...baseConfig,
	entities: ['src/**/entities/*.entity{.js,.ts}'],
	migrations: ['migrations/*{.js,.ts}'], // migration:run时查找的文件夹
	subscribers: ['subscribers/*{.js,.ts}'],
	logger: 'file',
	logging: true
}

// 实例化dataSource，用以之后cli使用
const dataSource = new DataSource(ormConfigForCli as unknown as DataSourceOptions)

// 此处的dataSource需要 export default才可以使用
export default dataSource
