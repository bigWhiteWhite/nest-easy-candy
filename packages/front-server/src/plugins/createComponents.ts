import type { FormRules, FormProps, FormItemProps } from 'element-plus'
import { ElInput, ElSwitch, ElForm, ElFormItem } from 'element-plus'
export enum ValidComponentType {
	INPUT = 'input', // 表示一个输入组件
	SWITCH = 'switch', // 表示一个开关组件
	SLOT = 'slot' // 表示一个插槽组件
}
// 设置组件是否出现，条件为权限和hideComponent
function RequiresRole(target: any, key: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value
	descriptor.value = function (...args: any[]) {
		const componentConfig: ComponentConfigurator = args[0]
		// (componentConfig.roleId && ![].includes(componentConfig.roleId)) ||
		if (componentConfig.hideComponent) {
			return null // 如果不匹配，返回 null 或默认组件
		}
		return originalMethod.apply(this, args)
	}
	return descriptor
}
// 校验传入的type类型
function ValidateComponentType<T extends { new (...args: any[]): {} }>(constructor: T) {
	return class extends constructor {
		type = this.validateType()
		validateType() {
			if (Object.values(ValidComponentType).includes(this.type)) {
				return this.type
			} else {
				console.warn(`Invalid component type: ${this.type}`)
			}
		}
	}
}
// 生成配置项
@ValidateComponentType
export class ComponentConfigurator {
	type!: ValidComponentType
	modelValue?: any
	name!: string
	roleId?: string
	rules?: Array<FormRules>
	hideComponent?: boolean // 是否需要隐藏组件
	formItemOptions?: FormItemProps
	updateHandler?: (value: any) => void
	slotContent?: VNode | (() => VNode)
	'prefix-slot'?: VNode | (() => VNode)
	'suffix-slot'?: VNode | (() => VNode)
	'prepend-slot'?: VNode | (() => VNode)
	'append-slot'?: VNode | (() => VNode)
	'error-message-slot'?: VNode | ((message: string) => VNode)
	constructor(component: ComponentConfigurator) {
		Object.assign(this, component)
		// 当 type 为 ValidComponentType.slot 时进行特殊处理
		switch (this.type) {
			case ValidComponentType.SLOT:
				if (!this.slotContent) {
					console.warn("slotContent is required when type is 'slot'")
				}
				// 其他根据需要的特殊处理
				break
			default:
				break
		}
	}
}

/**
 * @description 生成单个组件
 */
export class ComponentGenerator {
	@RequiresRole
	static generate(component: ComponentConfigurator) {
		const itemAttr = {
			...component.formItemOptions
			// rules: component.rules
		}
		const attributes = {
			modelValue: component.modelValue,
			'onUpdate:modelValue': component.updateHandler
		}
		// 判断是否存在插槽
		const createSlots = (slotList: Array<string>) => {
			const slots: Record<string, any> = {}
			slotList.map((slotName) => {
				if (component[`${slotName}-slot`]) {
					if (typeof component[`${slotName}-slot`] === 'function') {
						slots[slotName] = (value: any) => {
							return component[`${slotName}-slot`](value)
						}
					} else if (component[`${slotName}-slot`]) {
						slots[slotName] = () => component[`${slotName}-slot`]
					}
				}
			})
			return slots
		}
		switch (component.type) {
			// 输入框
			case ValidComponentType.INPUT: {
				return h(
					ElFormItem,
					{
						...itemAttr
					},
					{
						default: () =>
							h(
								ElInput,
								{ ...attributes },
								{
									// 使用具名插槽
									...createSlots(['prefix', 'suffix', 'prepend', 'append'])
								}
							)
					}
				)
			}
			// 开关
			case ValidComponentType.SWITCH:
				return h(
					ElFormItem,
					{
						...itemAttr
					},
					{
						default: () => h(ElSwitch, { ...attributes })
					}
				)
			default:
				return h('div', 'Unsupported component type')
		}
	}
}
// 生成表单组件
export class FormComponentGenerator {
	formOptions?: FormProps
	formList?: Array<ComponentConfigurator>
	static generate(model: any, formComponentConfig: FormComponentGenerator) {
		const { formOptions, formList } = formComponentConfig
		return h(ElForm, formOptions, {
			default: () => {
				return formList?.map((component) => {
					// 修改组件的 modelValue 更新处理函数
					const updateHandler = (value) => {
						model[component.name] = value // 直接更新外部 model
					}
					if (component.type === ValidComponentType.SLOT) {
						// 使用外部传递的 slotContent 渲染插槽内容
						return typeof component.slotContent === 'function' ? component.slotContent() : () => component.slotContent
					} else {
						return ComponentGenerator.generate(Object.assign(component, { modelValue: model[component.name], updateHandler }))
					}
				})
			}
		})
	}
}
