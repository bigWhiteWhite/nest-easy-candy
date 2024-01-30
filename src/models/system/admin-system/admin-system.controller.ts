import { Body, Controller, Post, Get, Patch, Delete, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AdminSystemService } from './admin-system.service'
import { CreateSystemDto, QuerySystem, SystemId, SystemIds, SystemInfo } from './dto/admin-systen.dto'
import { PageDto } from '@/common/class/res.class'

@Controller('admin-system')
@ApiTags('管理系统值')
export class AdminSystemController {
	constructor(private adminSystemService: AdminSystemService) {}

	@Post('list')
	@ApiOperation({ summary: '获取所有系统及其拥有的菜单' })
	async findAll(@Body() body: PageDto & QuerySystem) {
		const { pagination, ..._ } = body
		return await this.adminSystemService.listSystem(pagination, _)
	}

	@Post()
	@ApiOperation({ summary: '添加系统' })
	async create(@Body() body: CreateSystemDto): Promise<void> {
		await this.adminSystemService.addSystem(body)
	}

	@Post('/infoSystems')
	@ApiOperation({ summary: '获取多个系统信息' })
	async list(@Body() body: SystemIds) {
		return await this.adminSystemService.infoSystems(body)
	}

	@Post('/infoSystem')
	@ApiOperation({ summary: '获取单个系统信息' })
	async info(@Body() body: SystemId) {
		return await this.adminSystemService.infoSystem(body)
	}

	@Post('/systemIds')
	@ApiOperation({ summary: '获取所有系统和系统id' })
	async systemIds(): Promise<Array<SystemInfo>> {
		return await this.adminSystemService.getSystemIds()
	}

	@Patch(':id')
	@ApiOperation({ summary: '编辑系统' })
	async edit(@Body() body: CreateSystemDto, @Param('id') id: string) {
		await this.adminSystemService.updateSystem(body, id)
	}

	@Delete(':id')
	@ApiOperation({ summary: '删除系统' })
	async remove(@Param('id') id: string) {
		await this.adminSystemService.deleteSystem(id)
	}
}
