import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto, QueryRole } from './dto/create-role.dto'
import { ApiOperation } from '@nestjs/swagger'
import { PageDto } from '@/common/class/res.class'

@Controller('admin/role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post()
	@ApiOperation({ summary: '添加角色' })
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.roleService.create(createRoleDto)
	}

	@Post('list')
	@ApiOperation({ summary: '获取所有角色' })
	findAll(@Body() body: PageDto & QueryRole) {
		const { pagination, ..._ } = body
		return this.roleService.listRole(pagination, _)
	}

	@Get(':id')
	@ApiOperation({ summary: '获取角色信息' })
	findOne(@Param('id') id: string) {
		return this.roleService.findOne(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: '编辑角色' })
	update(@Param('id') id: string, @Body() updateRoleDto: CreateRoleDto) {
		return this.roleService.update(id, updateRoleDto)
	}

	@Delete(':id')
	@ApiOperation({ summary: '删除角色' })
	remove(@Param('id') id: string) {
		return this.roleService.remove(id)
	}
}
