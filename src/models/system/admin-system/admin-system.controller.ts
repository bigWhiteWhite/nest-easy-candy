import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Param
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AdminSystemService } from './admin-system.service'
import {
	CreateSystemDto,
	QuerySystem,
	SystemIds,
	SystemInfoDto,
	UpdateSystemDto
} from './dto/admin-systen.dto'
import { PageDto, PageList } from 'src/common/dto/page.dto'

@Controller('admin/admin-system')
@ApiTags('管理系统值')
export class AdminSystemController {
	constructor(private adminSystemService: AdminSystemService) {}

	@Post('list')
	@ApiOperation({ summary: '获取所有系统及其拥有的菜单' })
	async findAll(
		@Body() body: PageDto & QuerySystem
	): Promise<PageList<CreateSystemDto>> {
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
	async list(@Body() body: SystemIds): Promise<Array<SystemInfoDto>> {
		return await this.adminSystemService.infoSystems(body)
	}

	@Get(':id')
	@ApiOperation({ summary: '获取系统信息' })
	async info(@Param('id') id: string): Promise<SystemInfoDto> {
		return await this.adminSystemService.infoSystem(id)
	}

	@Post('/systemIds')
	@ApiOperation({ summary: '获取所有系统和系统id' })
	async systemIds(): Promise<any> {
		return await this.adminSystemService.getSystemIds()
	}

	@Patch(':id')
	@ApiOperation({ summary: '编辑系统' })
	async edit(
		@Body() body: UpdateSystemDto,
		@Param('id') id: string
	): Promise<void> {
		await this.adminSystemService.updateSystem(body, id)
	}

	@Delete(':id')
	@ApiOperation({ summary: '删除系统' })
	async remove(@Param('id') id: string): Promise<void> {
		await this.adminSystemService.deleteSystem(id)
	}
}
