import { User } from '@app/db/modules/system/sys-user.model'
import { Global, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { Types, PopulateOptions, MongooseQueryOptions } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'

export type OrderType<T> = Record<keyof T, 'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1>
type ModelName = 'noteGroupModel' | 'noteModel' | any
interface Paginator {
	pageSize: number
	offset: number
	currentPage: number
	sort: any
	[key: string]: any
}
@Global()
@Injectable()
export class AdminService {
	constructor(
		@InjectModel(User)
		private readonly userModel: ReturnModelType<typeof User>
	) {}
	/**
	 * @description 填充其他模型
	 * @private
	 * @template D
	 * @param {DocumentQuery<D, DocumentType<T>, {}>} docsQuery
	 * @param {(PopulateOptions | PopulateOptions[] | null)} populates
	 * @returns {DocumentQuery<D, DocumentType<T>, {}>}
	 */
	private populates(docsQuery: any, populates: PopulateOptions | PopulateOptions[] | null) {
		if (populates) {
			;[].concat(populates).forEach((item: PopulateOptions) => {
				docsQuery.populate(item)
			})
		}
		return docsQuery
	}

	/**
	 * @description 抛出mongodb异常
	 * @protected
	 * @static
	 * @param {MongoError} err
	 * @memberof AdminService
	 */
	protected static throwMongoError(err: Error): void {
		throw new InternalServerErrorException(err, err.message)
	}

	/**
	 * @description 将字符串转换成ObjectId
	 * @protected
	 * @static
	 * @param {string} id
	 * @returns {Types.ObjectId}
	 * @memberof AdminService
	 */
	protected static toObjectId(id: string): Types.ObjectId {
		try {
			return Types.ObjectId(id)
		} catch (e) {
			this.throwMongoError(e)
		}
	}

	/**
	 * @description 获取指定条件全部数据
	 * @param {*} conditions
	 * @param {(Object | string)} [projection]
	 * @param {({
	 *     sort?: OrderType<T>;
	 *     limit?: number;
	 *     skip?: number;
	 *     lean?: boolean;
	 *     populates?: PopulateOptions[] | PopulateOptions;
	 *     [key: string]: any;
	 *   })} [options]
	 * @returns {QueryList<T>}
	 */
	public findAll(
		modelName: ModelName,
		conditions: any,
		projection?: object | string,
		options: {
			sort?: any
			limit?: number
			skip?: number
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		return this[modelName].find(conditions, projection, options)
	}

	public async findAllAsync(
		conditions: any,
		projection?: object | string,
		options: {
			sort?: any
			limit?: number
			skip?: number
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		const { populates = null, ...option } = options
		const docsQuery = this.findAll(conditions, projection, option)
		try {
			return await this.populates(docsQuery, populates)
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 获取带分页数据
	 * @param {PaginationParams<T>} params
	 * @param {(Object | string)} [projection]
	 * @param {({
	 *     lean?: boolean;
	 *     populates?: PopulateOptions[] | PopulateOptions;
	 *     [key: string]: any;
	 *   })} [options={}]
	 * @returns {Promise<Paginator<T>>}
	 */
	public async paginator(
		modelName: ModelName,
		params: Paginator,
		projection?: object | string,
		options: {
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		const { pageSize, offset, currentPage, sort, condition } = params
		// 拼装分页返回参数
		const result = {
			list: [],
			total: 0,
			pageSize,
			offset: 0,
			currentPage: 1, // 当前页
			pages: 0 // 总页数
		}

		// 拼装查询配置参数
		options.sort = sort
		options.limit = pageSize

		// 处理起始位置
		if (offset !== undefined) {
			result.offset = offset
			options.skip = offset
		} else if (currentPage !== undefined) {
			result.currentPage = currentPage
			options.skip = (currentPage - 1) * pageSize
			result.pages = Math.ceil(result.total / pageSize) || 1
		} else {
			options.skip = 0
		}

		try {
			const { _id, ...other } = condition
			if (_id) {
				// 获取分页数据
				result.list.push(await this.findByIdAsync(modelName, condition._id, projection, options))
				// 获取总条数
				result.total = await this.count(modelName, condition)
			} else {
				// 获取分页数据
				result.list = await this.findAllAsync(other, projection, options)
				// 获取总条数
				result.total = await this.count(modelName, other)
			}
			// 返回分页结果
			return Promise.resolve(result)
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 获取单条数据
	 * @param {*} conditions
	 * @param {(Object | string)} [projection]
	 * @param {({
	 *     lean?: boolean;
	 *     populates?: PopulateOptions[] | PopulateOptions;
	 *     [key: string]: any;
	 *   })} [options]
	 * @returns {QueryItem<T>}
	 */
	public findOne(
		modelName: ModelName,
		conditions: any,
		projection?: object | string,
		options: {
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		return this[modelName].findOne(conditions, projection || {}, options, (e) => {
			AdminService.throwMongoError(e)
		})
	}

	public findOneAsync(
		modelName: ModelName,
		conditions: any,
		projection?: object | string,
		options: {
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		try {
			const { populates = null, ...option } = options
			const docsQuery = this.findOne(modelName, conditions, projection || {}, option)
			return this.populates(docsQuery, populates).exec()
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 根据id获取单条数据
	 * @param {(string)} id
	 * @param {(Object | string)} [projection]
	 * @param {({
	 *     lean?: boolean;
	 *     populates?: PopulateOptions[] | PopulateOptions;
	 *     [key: string]: any;
	 *   })} [options={}]
	 * @returns {QueryItem<T>}
	 */
	public findById(
		modelName: ModelName,
		id: string,
		projection?: object | string,
		options: {
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		return this[modelName].findById(AdminService.toObjectId(id), projection, options)
	}

	public findByIdAsync(
		modelName: ModelName,
		id: string,
		projection?: object | string,
		options: {
			lean?: boolean
			populates?: PopulateOptions[] | PopulateOptions
			[key: string]: any
		} = {}
	) {
		try {
			const { populates = null, ...option } = options
			const docsQuery = this.findById(modelName, id, projection || {}, option)
			return this.populates(docsQuery, populates).exec()
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 获取指定查询条件的数量
	 * @param {*} conditions
	 * @returns {Query<number>}
	 */
	public count(modelName: ModelName, conditions: any) {
		return this[modelName].count(conditions)
	}

	public countAsync(modelName: ModelName, conditions: any): Promise<number> {
		try {
			return this.count(modelName, conditions).exec()
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 创建一条数据
	 * @param {Partial<T>} docs
	 * @returns {Promise<DocumentType<T>>}
	 */
	public async create(modelName: ModelName, docs) {
		try {
			await this[modelName].create(docs)
		} catch (e) {
			return AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 删除指定数据
	 * @param {(any)} id
	 * @param {MongooseQueryOptions} options
	 * @returns {QueryItem<T>}
	 */
	public delete(modelName: ModelName, conditions: any, options?: MongooseQueryOptions) {
		return this[modelName].findOneAndDelete(conditions, options)
	}

	public async deleteAsync(conditions: any, options?: MongooseQueryOptions) {
		try {
			await this.delete(conditions, options).exec()
		} catch (e) {
			return AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 删除指定id数据
	 * @param {(any)} id
	 * @param {MongooseQueryOptions} options
	 * @returns {Query<FindAndModifyWriteOpResultObject<DocumentType<T>>>}
	 */
	public deleteById(modelName: ModelName, id: string, options?: MongooseQueryOptions) {
		return this[modelName].findByIdAndDelete(AdminService.toObjectId(id), options)
	}

	public async deleteByIdAsync(modelName: ModelName, id: string, options?: MongooseQueryOptions) {
		try {
			return await this.deleteById(modelName, id, options).exec()
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 更新指定id数据
	 * @param {string} id
	 * @param {Partial<T>} update
	 * @param {MongooseQueryOptions} [options={ new: true }]
	 * @returns {QueryItem<T>}
	 */
	public update(modelName: ModelName, id: string, update: any, options: MongooseQueryOptions) {
		return this[modelName].findByIdAndUpdate(AdminService.toObjectId(id), update, options)
	}

	async updateAsync(modelName: ModelName, id: string, update: any, options: MongooseQueryOptions) {
		try {
			await this.update(modelName, id, update, options).exec()
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}

	/**
	 * @description 删除所有匹配条件的文档集合
	 * @param {*} [conditions={}]
	 * @returns {Promise<WriteOpResult['result']>}
	 */
	public clearCollection(modelName: ModelName, conditions: any = {}) {
		try {
			return this[modelName].deleteMany(conditions).exec()
		} catch (e) {
			AdminService.throwMongoError(e)
		}
	}
}
