import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1708487065406 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS \`article\`;`)
		await queryRunner.query(
			`CREATE TABLE \`article\` (\`id\` int(11) NOT NULL AUTO_INCREMENT,\`title\` varchar(100) DEFAULT NULL,\`body\` longtext,\`tag\` varchar(50) DEFAULT NULL COMMENT '每条记录的标签',\`category\` varchar(40) DEFAULT NULL,\`created_at\` date DEFAULT NULL,\`updated_at\` date DEFAULT NULL,\`status\` tinyint(1) DEFAULT '1' COMMENT '1表示正常  0表示删除 ',\`type\` tinyint(3) DEFAULT '1' COMMENT '1：原创； 0：转载',\`views\` int(11) DEFAULT '0',\`markdown\` tinyint(1) DEFAULT NULL,PRIMARY KEY (\`id\`)) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4;`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
          DROP TABLE IF EXISTS \`article\`;`)
	}
}
