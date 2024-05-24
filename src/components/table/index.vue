<template>
	<div class="table-container">
		<el-table
			ref="tableMainRef"
			:data="data"
			:border="setBorder"
			v-bind="$attrs"
			:row-key="rowKey"
			style="width: 100%"
			v-loading="config.loading"
			:header-cell-style="{ 'text-align': 'center' }"
			:cell-style="{ 'text-align': 'center' }"
		>
			<el-table-column type="selection" :reserve-selection="reserveSelection" :selectable="isSelectable" width="50" v-if="config.isSelection" />
			<el-table-column type="index" label="序号" width="65" v-if="config.isSerialNo" />

			<el-table-column
				v-for="(item, index) in setHeader"
				:key="index"
				:show-overflow-tooltip="!item.tooltip"
				:prop="item.key"
				:width="item.colWidth"
				:min-width="item.minWidth"
				:label="item.title"
				:sortable="item.sortable"
				:fixed="item.isFixed"
			>
				<template v-if="!item.type" v-slot="{ row, column, $index }">
					<slot v-if="item.slot" :name="item.slot" :row="row" :column="column" :index="$index" />
					<template v-else>{{ row[item.key] }}</template>
				</template>
				<template v-if="item.isChildren">
					<el-table-column
						v-for="(item1, index) in item.isChildren"
						:key="index"
						:show-overflow-tooltip="!item1.tooltip"
						:prop="item1.key"
						:width="item1.colWidth"
						:min-width="item1.minWidth"
						:label="item1.title"
						:sortable="item1.sortable"
					>
						<template v-if="!item1.type" v-slot="{ row, column, $index }">
							<slot v-if="item1.slot" :name="item1.slot" :row="row" :column="column" :index="$index" />
							<template v-else>{{ row[item1.key] }}</template>
						</template>
					</el-table-column>
				</template>
			</el-table-column>
			<template #empty>
				<el-empty description="暂无数据" />
			</template>
			<slot name="addColumn"></slot>
		</el-table>

		<div class="table-footer mt15" v-if="config.isPagination">
			<el-pagination
				v-model:current-page="state.page.pageNum"
				v-model:page-size="state.page.pageSize"
				:pager-count="5"
				:page-sizes="config.pageSizeNum"
				:total="config.total"
				layout="total, sizes, prev, pager, next, jumper"
				background
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
			>
			</el-pagination>
			<div class="table-footer-tool" v-if="config.isOptions">
				<el-popover
					placement="top-end"
					trigger="hover"
					transition="el-zoom-in-top"
					popper-class="table-tool-popper"
					:width="300"
					:persistent="false"
					@show="onSetTable"
				>
					<template #reference>
						<SvgIcon name="iconfont icon-quanjushezhi_o" :size="22" title="设置" />
					</template>
					<template #default>
						<div class="tool-box">
							<el-checkbox
								v-model="state.checkListAll"
								:indeterminate="state.checkListIndeterminate"
								class="ml10 mr1"
								label="列显示"
								@change="onCheckAllChange"
							/>
							<div class="popurBtn">
								<el-button size="small" type="info" @click="resetConfig()" class="flexbtn">重置</el-button>
								<el-button size="small" type="primary" @click="saveConfig(config.tableName)" class="flexbtn">保存</el-button>
							</div>
						</div>
						<el-scrollbar>
							<div ref="toolSetRef" class="tool-sortable">
								<div class="tool-sortable-item" v-for="v in header" :key="v.key" :data-key="v.key">
									<i class="fa fa-arrows-alt handle cursor-pointer"></i>
									<el-checkbox v-model="v.isCheck" size="default" class="ml12 mr8" :label="v.title" @change="onCheckChange" />
								</div>
							</div>
						</el-scrollbar>
					</template>
				</el-popover>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="netxTable">
import { reactive, computed, nextTick, ref, onMounted, watch } from 'vue';
import Sortable from 'sortablejs';
import '/@/theme/tableTool.scss';
import { Local } from '/@/utils/storage';

const props = defineProps({
	// 列表内容
	data: {
		type: Array<EmptyObjectType>,
		default: () => [],
	},
	// 表头内容
	header: {
		type: Array<EmptyObjectType>,
		default: () => [],
	},
	// 配置项
	config: {
		type: Object,
		default: () => {},
	},
	// 初始化表单头
	resetHeader: {
		type: Array<EmptyObjectType>,
		default: () => [],
	},
	rowKey: {
		type: String,
		default: () => 'id',
	},
	reserveSelection: {
		type: Boolean,
		default: () => true,
	},
});

/**
 * 定义子组件向父组件传值/事件
 * pageChange: 页面页数刷新
 * sortHeader： 设置里拖拽刷新
 */
const emit = defineEmits(['pageChange', 'sortHeader']);

// 定义变量内容
const toolSetRef = ref();
const tableMainRef = ref();
const state = reactive({
	page: {
		pageNum: 1,
		pageSize: 20,
	},
	selectlist: [] as EmptyObjectType[],
	checkListAll: true,
	checkListIndeterminate: false,
});

// 设置边框显示/隐藏
const setBorder = computed(() => {
	return props.config.isBorder ? true : false;
});

// 设置 tool header 数据
const setHeader = computed(() => {
	return props.header.filter((v) => v.isCheck);
});
// tool 列显示全选改变时
const onCheckAllChange = <T>(val: T) => {
	if (val) props.header.forEach((v) => (v.isCheck = true));
	else props.header.forEach((v) => (v.isCheck = false));
	state.checkListIndeterminate = false;
};
// tool 列显示当前项改变时
const onCheckChange = () => {
	const headers = props.header.filter((v) => v.isCheck).length;
	state.checkListAll = headers === props.header.length;
	state.checkListIndeterminate = headers > 0 && headers < props.header.length;
};

// 分页改变
const onHandleSizeChange = (val: number) => {
	state.page.pageSize = val;
	emit('pageChange', state.page);
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.page.pageNum = val;
	emit('pageChange', state.page);
};
// 搜索时，分页还原成默认
const pageReset = () => {
	state.page.pageNum = 1;
	state.page.pageSize = props.config.resetPageSize || 20;
	emit('pageChange', state.page);
};

// 开启多选时，根据isSelect来判断是否可选
const isSelectable = (row: any) => {
	return !row.isSelect;
};

// 设置
const onSetTable = () => {
	nextTick(() => {
		const sortable = Sortable.create(toolSetRef.value, {
			handle: '.handle',
			dataIdAttr: 'data-key',
			animation: 150,
			onEnd: () => {
				const headerList: EmptyObjectType[] = [];
				sortable.toArray().forEach((val) => {
					props.header.forEach((v) => {
						if (v.key === val) headerList.push({ ...v });
					});
				});
				emit('sortHeader', headerList);
			},
		});
	});
};

const setCurrentRow = (row: any) => {
	tableMainRef.value.setCurrentRow(row);
};

const toggleRowSelection = (row: any, status: boolean) => {
	tableMainRef.value.toggleRowSelection(row, status);
};

const clearSelection = () => {
	tableMainRef.value.clearSelection();
};

// 保存配置到本地
const saveConfig = (name: string) => {
	let arr: any = [];
	props.header.map((item) => {
		arr.push({ key: item.key, isCheck: item.isCheck });
	});
	Local.set(name, arr);
};

// 重置表头
const resetConfig = () => {
	emit('sortHeader', JSON.parse(JSON.stringify(props.resetHeader)));
};

watch(
	() => props.config.resetPageSize,
	(newVal) => {
		if (newVal) {
			state.page.pageSize = newVal;
		}
	},
	{
		immediate: true,
	}
);

onMounted(() => {
	/* 火狐浏览器禁止拖拽新窗口打开 */
	document.body.ondrop = function (event) {
		event.preventDefault();
		event.stopPropagation();
	};
});

// 暴露变量
defineExpose({
	pageReset,
	setCurrentRow,
	toggleRowSelection,
	clearSelection,
});
</script>

<style scoped lang="scss">
// background-color: var(--el-table-tr-bg-color);
:deep() .el-table thead th {
	background-color: rgb(245, 245, 245);
}

:deep() .el-table__body tr.current-row > td.el-table__cell {
	background: #f0f9eb !important;
}

:deep() .el-table .caret-wrapper {
	width: 10px;
}

:deep() .el-table .sort-caret.ascending {
	border-bottom-color: #fff;
}

:deep() .el-table .sort-caret.descending {
	border-top-color: #fff;
}

:deep() .el-table .ascending .sort-caret.ascending {
	border-bottom-color: var(--el-color-primary);
}

:deep() .el-table .descending .sort-caret.descending {
	border-top-color: var(--el-color-primary);
}

.table-container {
	display: flex;
	flex-direction: column;

	.el-table {
		flex: 1;
	}

	.table-footer {
		display: flex;
		position: relative;

		.table-footer-tool {
			position: absolute;
			height: 100%;
			right: 0;
			top: 50%;
			transform: translateY(-36%);
			background-color: #fff;

			i {
				margin-right: 10px;
				cursor: pointer;
				color: var(--el-text-color-regular);

				&:last-of-type {
					margin-right: 0;
				}
			}
		}
	}
}

.popurBtn {
	position: absolute;
	right: 20px;
	display: flex;
	justify-content: flex-end;
}
</style>
