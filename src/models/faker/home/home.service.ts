import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { CrawlerServer } from '@/shared/tools/crawler.service'
import { sample } from 'lodash'
@Injectable()
export class HomeService {
	constructor(private readonly httpService: HttpService) {}
	getCategory(query: { num: number }) {
		const list = [
			{
				name: 'recommend',
				route: '/home-recommend'
			},
			{
				name: 'cloth',
				route: '/home-childCloth'
			}
		]
		return list.concat(
			Array(Number(query.num || 0))
				.fill(null)
				.map(() => ({
					name: faker.commerce.department(), // 随机商品类名
					route: faker.commerce.department() // 随机商品类名
				}))
		)
	}

	async getCommodity(query: { num: number }) {
		// const imageJson = await lastValueFrom(this.httpService.get('https://www.dmoe.cc/random.php?return=json'))
		const images = [
			'https://img14.360buyimg.com/mobilecms/s360x360_jfs/t1/220008/29/38178/86589/65f7a343Fdabd44a8/aaee41aad1937a5b.jpg!q70.dpg.webp',
			'https://img14.360buyimg.com/mobilecms/s360x360_jfs/t1/241303/17/2948/65078/659d07b4Fc76e1aae/ac5858e9750dca55.jpg!q70.dpg.webp',
			'https://img14.360buyimg.com/mobilecms/s360x360_jfs/t1/207624/8/39231/98527/65f50349Fe00c6492/e26019e0af7f7177.jpg!q70.dpg.webp',
			'https://img14.360buyimg.com/mobilecms/s360x360_jfs/t1/246184/25/5439/175997/65ebbe39Ffdd13d6c/390758eeb47cb927.jpg!q70.dpg.webp',
			'https://img14.360buyimg.com/mobilecms/s360x360_jfs/t1/132151/8/41470/63463/65f81bfbFc8c83c55/6e3b5c7b5e98be7f.jpg!q70.dpg.webp',
			'https://img14.360buyimg.com/mobilecms/s360x360_jfs/t1/209021/16/34026/51215/65065527F2dfd5d2a/45d6fe26d25f7404.jpg!q70.dpg.webp'
		]
		return Array(Number(query.num || 0))
			.fill(null)
			.map(() => ({
				productName: faker.commerce.productName(),
				product: faker.commerce.product(),
				productAdjective: faker.commerce.productAdjective(),
				productDescription: faker.commerce.productDescription(),
				productMaterial: faker.commerce.productMaterial(),
				price: faker.commerce.price({ min: 10, max: 10000, dec: 0, symbol: '$' }),
				isbn: faker.commerce.isbn({ variant: 13, separator: ' ' }),
				image: sample(images)
				// image: faker.image.urlLoremFlickr({ category: 'business' })
			}))
	}
}
