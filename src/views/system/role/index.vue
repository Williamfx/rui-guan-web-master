<template>
	<div class="system-role-container layout-padding">
		<SplitTopanes>
			<template #leftpane>
				<div class="system-role-padding layout-padding-auto layout-padding-view">
					<TableSearch :search="state.tableData.search" :resetName="state.tableData.resetName" :showNumber="9">
						<template #btnBlock="scope">
							<el-button size="default" type="primary" @click="search(scope.formdata)" ref="tabSearch">查询</el-button>
							<el-button size="default" type="danger" @click="onOpenSaveUser('add')">新增</el-button>
						</template>
					</TableSearch>
					<Table
						ref="mainRef"
						v-bind="state.tableData"
						class="table-demo"
						@pageChange="onTablePageChange"
						@current-change="handleSelection"
						highlight-current-row
						border
					>
						<template #operation="scope">
							<el-button size="small" text type="primary" @click="onOpenSaveUser('edit', scope.row)">编辑</el-button>
							<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
						</template>
					</Table>
				</div>
			</template>
			<template #rightpane>
				<div class="system-role-padding layout-padding-auto layout-padding-view">
					<MenuDetail :roleRowDetail="rowDetail" />
				</div>
			</template>
		</SplitTopanes>

		<RoleDialog ref="roleDialog" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { systemModuleApi } from '/@/api/system';

// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/table/searchprop.vue'));
const RoleDialog = defineAsyncComponent(() => import('/@/views/system/role/dialog.vue'));
const SplitTopanes = defineAsyncComponent(() => import('/@/components/table/splittopanes.vue'));
const MenuDetail = defineAsyncComponent(() => import('/@/views/system/role/menuDetail.vue'));

// 定义变量内容
const systemApi = systemModuleApi();
let rowDetail = ref();
const tabSearch = ref();
const mainRef = ref();
const roleDialog = ref();
const state = reactive<TableComponentState>({
	tableData: {
		// 表格配置
		data: [],
		header: [
			{ key: 'name', minWidth: '100', title: '角色名称', type: 'text', isCheck: true },
			{ key: 'description', minWidth: '100', title: '部门', type: 'text', isCheck: true },
			{ key: 'created_at', minWidth: '120', title: '创建日期', type: 'text', isCheck: true },
			{ key: 'updated_at', minWidth: '120', title: '更新日期', type: 'text', isCheck: true },
			{ key: 'operation', minWidth: '100', title: '操作', type: '', isCheck: true, slot: 'operation' },
		],
		config: {
			total: 0,
			pageSizeNum: [20, 30, 50, 100],
			tableName: ' ',
			loading: true,
			isPagination: true,
			isSerialNo: true,
			resetPageSize: 20,
		},
		param: {
			page: 1,
			page_size: 20,
		},
		// 搜索配置
		search: [{ label: '角色名称', prop: 'name', type: 'date', placeholder: '请输入' }],
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.config.loading = true;
	const res = await systemApi.getRolesList(state.tableData.param);
	state.tableData.data = res.data.rows;
	state.tableData.config.total = Number(res.data.total);
	state.tableData.config.loading = false;
};

//选择一项
const handleSelection = (row: any) => {
	rowDetail.value = row;
};

// 表格数据获取后加行高亮
const refresh = async (row?: any) => {
	await getTableData();
	if (row) {
		let array = state.tableData.data.filter((item) => {
			return item.id == row.id;
		});
		mainRef.value.setCurrentRow(array[0]);
	} else {
		mainRef.value.setCurrentRow(state.tableData.data[0]);
	}
};

// 搜索刷新页面
const search = async (data?: any) => {
	for (const key in data) {
		if (data[key]) {
			state.tableData.param[key] = data[key];
		} else {
			delete state.tableData.param[key];
		}
	}
	refresh();
};

// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.param.page = page.page;
	state.tableData.param.page_size = page.page_size;
	refresh();
};

// 打开用户弹窗
const onOpenSaveUser = (type: string, row?: RowUserType) => {
	roleDialog.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: RowUserType) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

// 页面加载时
watch(
	() => tabSearch.value,
	async (newVal) => {
		if (newVal) {
			tabSearch.value.$.vnode.el?.click();
		}
	}
);
</script>

<style scoped lang="scss">
.system-role-container {
	display: flex;
	justify-content: center;
	flex-wrap: nowrap;
	flex-direction: row;

	.system-role-padding {
		padding: 15px;

		.el-table {
			flex: 1;
		}
	}

	.mr10 {
		margin-right: 10px;
	}
}

.table-demo {
	flex: 1;
	overflow: hidden;
}
</style>
