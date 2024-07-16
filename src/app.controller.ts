import { Controller, Get, Post, Response, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
// import { createWriteStream } from 'fs'
// import { join } from 'path'
// import dayjs = require('dayjs')

@Controller('/server')
export class AdminController {
	@Get('setCookie')
	setCookie(@Response() res) {
		res.cookie('nestCookie', 'nestCookie', {
			maxAge: 1000 * 60 * 10,
			httpOnly: true
		})
		// return { name: '张三' } 使用Response就不可以使用return
		res.send('设置曲奇')
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	upload(@UploadedFile() file) {
		console.log('🚀 ~ AdminController ~ upload ~ file:', file)
		return file
	}

	@Post('uploads')
	@UseInterceptors(FilesInterceptor('files'))
	uploads(@UploadedFiles() files) {
		return files
	}
}
