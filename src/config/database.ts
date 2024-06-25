import { DataSource, DataSourceOptions } from 'typeorm'
import { ConfigType, registerAs } from '@nestjs/config'
import { config } from 'dotenv'
import { Configuration } from './env'
// ?命令行启动时确认当前环境变量
config({ path: `.env.${process.env.NODE_ENV}` })
// 当前通过 npm scripts 执行的命令
// const currentScript = process.env.npm_lifecycle_event

// 该对象 typeorm cli 迁移时使用
const dataSourceOptions: DataSourceOptions = {
	// 基础配置
	type: 'mysql',
	host: Configuration()?.database.host,
	port: Configuration()?.database.port,
	username: Configuration()?.database.username,
	password: Configuration()?.database.password,
	database: Configuration()?.database.database,
	entities: ['src/**/entities/*.entity{.js,.ts}'],
	migrations: ['migrations/*{.js,.ts}'], // migration:run时查找的文件夹
	subscribers: ['src/**/entities/*.subscriber{.js,.ts}'],
	// 解决通过 pnpm migration:run 初始化数据时，遇到的 SET FOREIGN_KEY_CHECKS = 0; 等语句报错问题, 仅在执行数据迁移操作时设为 true
	multipleStatements: false,
	logger: 'file',
	logging: true
}

export const dbRegToken = 'database'
export const DatabaseConfig = registerAs(dbRegToken, (): DataSourceOptions => dataSourceOptions)
export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>
const dataSource = new DataSource(dataSourceOptions)

export default dataSource
