import Crawler = require('crawler')

export class CrawlerServer {
	readonly crawlerInstance: any

	constructor(maxConnections: number, callback: any) {
		this.crawlerInstance = new Crawler({
			maxConnections, // 最大同时连接数
			callback: callback.bind(this)
		})
	}

	crawl(url: string) {
		this.crawlerInstance.queue(url)
	}
}
