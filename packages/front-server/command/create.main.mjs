import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import handlebars from 'handlebars'
import { Auxiliary } from './auxiliary.mjs'
const readSpinner = ora(chalk.green('读取模板文件中...'))
const genSpinner = ora(chalk.green('生成模板文件中...'))

/**
 * @param fileType 选中的模板文件类型
 * @param defaultReadPath 默认的读取文件目录
 * @param defaultGenPath 默认的生成模板目录
 * @param context 模板需要替换的属性
 * @param fileTypeList 可选模板类型
 */
export class CreateTemplate {
	fileType
	defaultReadPath
	defaultGenPath
	context
	fileTypeList
	constructor(
		defaultReadPath = 'command/template',
		defaultGenPath = 'command/sample',
		context = {},
		fileTypeList = [
			{
				name: 'vue',
				value: 'vue'
			},
			{
				name: 'react(tsx)',
				value: 'tsx'
			},
			{
				name: 'react(jsx)',
				value: 'jsx'
			},
			{
				name: 'js',
				value: 'js'
			}
		]
	) {
		this.defaultReadPath = defaultReadPath
		this.defaultGenPath = defaultGenPath
		this.context = context
		this.fileTypeList = fileTypeList
	}

	// 定义帮助函数来检查文件是否存在
	async fileExists(path) {
		return fs.pathExists(path)
	}

	/**
	 * @param {*} readFilePath 模板文件路径
	 * @param {*} fileName 生成文件名
	 */
	async generate(readFilePath, fileName) {
		try {
			readSpinner.start()
			const hasTemFile = await this.fileExists(readFilePath)
			if (!hasTemFile) throw new Auxiliary().error(20002)
			readSpinner.succeed('读取模板成功')
			const content = await fs.readFile(readFilePath, 'utf8')
			// 使用 Handlebars 编译模板
			const template = handlebars.compile(content)
			// 将数据应用到模板中
			const updatedData = template(this.context)
			readSpinner.stop()
			// 生成模板
			genSpinner.start()
			const genDirPath = path.resolve(this.defaultGenPath) // 生成文件目录
			const genFilePath = `${genDirPath}/${fileName}.${this.fileType}` // 生成文件路径
			await fs.ensureDir(genDirPath)
			const hasGenFile = await this.fileExists(genFilePath)
			if (hasGenFile) throw new Auxiliary().error(20003)
			// 复制目标模板到指定文件夹
			await fs.copy(readFilePath, genFilePath)
			await fs.writeFile(genFilePath, updatedData, 'utf8')
			genSpinner.succeed('生成模板成功')
			genSpinner.stop()
		} catch (error) {
			readSpinner.stop()
			genSpinner.stop()
			return Promise.reject(error)
		}
	}

	// 输入生成文件名
	createFile(readFilePath) {
		inquirer
			.prompt([
				{
					type: 'input', // 问题类型
					name: 'fileName', // 数据属性名
					message: '请输入文件名称(无需后缀)', // 提示信息
					default: '', // 默认值
					validate: (value) => {
						return value ? Boolean(value) : new Auxiliary().error(20001)
					}
				}
			])
			.then(({ fileName }) => {
				fileName && this.generate(readFilePath, fileName)
			})
	}

	// 选择模板文件
	choiceTemFile(temList) {
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'readFilePath',
					message: '请选择模板文件',
					choices: temList
				}
			])
			.then(async ({ readFilePath }) => {
				this.createFile(readFilePath)
			})
			.catch((error) => {
				return Promise.reject(error)
			})
	}

	/**
	 * @param {*} fileType 输入文件类型可以查找目录下所有符合的模板
	 * @returns 返回模板list
	 */
	async backTemList(fileType) {
		try {
			const result = []
			const readFilesInDirectory = async (directoryPath) => {
				const files = await fs.readdir(directoryPath)
				await Promise.all(
					files.map(async (file) => {
						const filePath = path.join(directoryPath, file)
						const stat = await fs.stat(filePath)
						if (stat.isFile() && file.endsWith(fileType)) {
							result.push({
								name: filePath,
								value: filePath
							})
						} else if (stat.isDirectory()) {
							await readFilesInDirectory(filePath)
						}
					})
				)
			}
			await readFilesInDirectory(this.defaultReadPath)
			return result
		} catch (error) {
			return Promise.reject(error)
		}
	}

	// 选择模板类型
	start() {
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'fileType',
					message: '请选择模板类型',
					default: 'vue',
					choices: this.fileTypeList
				}
			])
			.then(async ({ fileType }) => {
				this.fileType = fileType
				const temList = await this.backTemList(fileType)
				if (temList.length === 0) throw `${this.defaultReadPath}目录下不存在${fileType}模板`
				this.choiceTemFile(temList)
			})
			.catch((error) => {
				console.log(`${new Auxiliary().error(20000)}: ${error}`)
			})
	}
}
