import { DataSource, DataSourceOptions } from 'typeorm'

// 基础配置
const baseConfig: Partial<DataSourceOptions> = {
	// host: process.env.DATABASE_HOST,
	// port: process.env.MYSQL_PORT as unknown as number,
	// username: process.env.MYSQL_USERNAME,
	// password: process.env.MYSQL_PASSWORD,
	// database: process.env.MYSQL_DATABASE
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
console.log('🚀 ~ baseConfig:', baseConfig)

// 此处的dataSource需要 export default才可以使用
export default dataSource
