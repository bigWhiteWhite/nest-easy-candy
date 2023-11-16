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
import { MenuService } from './menu.service'
import { CreateMenuDto, QueryMenu, UpdateMenuDto } from './dto/menu.dto'
import { PageDto, PageList } from '@/common/dto/page.dto'

@Controller('admin/menu')
@ApiTags('菜单模块')
export class MenuController {
	constructor(private menuService: MenuService) {}

	@Post()
	@ApiOperation({ summary: '添加菜单' })
	async create(@Body() body: CreateMenuDto): Promise<void> {
		await this.menuService.addMenu(body)
	}

	@Post('list')
	@ApiOperation({ summary: '获取所有菜单' })
	async findAll(
		@Body() body: PageDto & QueryMenu
	): Promise<PageList<UpdateMenuDto>> {
		const { pagination, ..._ } = body
		return await this.menuService.listMenu(pagination, _)
	}

	@Get(':id')
	@ApiOperation({ summary: '获取菜单信息' })
	async findOne(@Param('id') id: string): Promise<Partial<CreateMenuDto>> {
		return await this.menuService.infoMenu(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: '编辑菜单' })
	async update(
		@Body() body: CreateMenuDto,
		@Param('id') id: string
	): Promise<void> {
		await this.menuService.updateMenu(body, id)
	}

	@Delete(':id')
	@ApiOperation({ summary: '删除菜单' })
	async remove(@Param('id') id: string): Promise<void> {
		await this.menuService.deleteMenu(id)
	}
}
