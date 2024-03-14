import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
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
				image: faker.image.urlLoremFlickr({ category: 'business' })
			}))
	}
}
