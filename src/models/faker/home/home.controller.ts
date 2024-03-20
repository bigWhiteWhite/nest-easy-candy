import { Controller, Get, Query } from '@nestjs/common'
import { HomeService } from './home.service'
import { ApiOperation } from '@nestjs/swagger'

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get('category')
	@ApiOperation({ summary: '获取商品类别' })
	getCategory(@Query() query: { num: number }) {
		return this.homeService.getCategory(query)
	}

	@Get('commodity')
	@ApiOperation({ summary: '获取商品' })
	getCommodity(@Query() query: { num: number }) {
		return this.homeService.getCommodity(query)
	}
	// @Get('crawler-images')
	// @ApiOperation({ summary: '爬取商品图片' })
	// crawlerImages(@Query() query: { num: number }) {
	// 	return this.homeService.crawlerImages(query)
	// }
}
