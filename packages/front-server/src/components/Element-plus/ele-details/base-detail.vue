<template>
	<div>
		<template v-if="props.detailType === 'cardList'">
			<!-- 卡片详情: 支持一行，如果需要两行，就写两次-->
			<el-row justify="space-between" :gutter="16">
				<el-col v-for="card in props.cardList" :key="card.name">
					<el-card class="box-card">
						<!-- 头部插槽 -->
						<template #header>
							<slot name="header"></slot>
						</template>
						<!-- 动态插槽 -->
						<template #[card.name]="scope">
							<slot :name="card.name" :row="scope.row">{{ card.value && $t(`${card.value}`) }}</slot>
						</template>
					</el-card>
				</el-col>
			</el-row>
		</template>
		<template v-else-if="props.detailType === 'collapses'">
			<el-collapse v-model="state.activeKey">
				<el-collapse-item
					v-for="panel in props.collapses"
					v-bind="panel.panelOptions"
					:key="panel.name"
					:title="$t(panel?.title)"
					:name="panel.name"
					:class="`collapse-${panel.collapseType || 'description'}`"
				>
					<template #default>
						<el-descriptions v-bind="panel.desOptions" :title="panel.desOptions && $t(panel.desOptions.title)">
							<el-descriptions-item v-for="dec in panel.decList" :key="dec.name" :label="$t(dec.title)">
								<slot :name="dec.name">{{ dec.value && $t(`${dec.value}`) }}</slot>
							</el-descriptions-item>
						</el-descriptions>
					</template>
				</el-collapse-item>
			</el-collapse>
		</template>
	</div>
</template>

<script lang="ts" setup name="base-detail">
import * as ADetail from '@/types/ElementPlus/base-detail'
import { PropType, reactive } from 'vue'
const props = defineProps({
	detailType: {
		type: String,
		required: true
	},
	activeKey: {
		type: [String, Array<string>],
		default: ''
	},
	collapses: {
		type: Array as PropType<ADetail.Collapses[]>,
		default: () => []
	},
	cardList: {
		type: Array as PropType<ADetail.CardList[]>,
		default: () => []
	}
})

const state = reactive({
	activeKey: props.activeKey
})
</script>

<style scoped lang="less"></style>
