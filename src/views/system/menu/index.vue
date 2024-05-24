<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<el-input size="default" placeholder="没做的搜索" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="getTableData">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddMenu">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增菜单
				</el-button>
			</div>
			<el-table
				:data="state.tableData.data"
				v-loading="state.tableData.loading"
				style="width: 100%"
				row-key="id"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column label="菜单名称" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.icon" />
						<span class="ml10">{{ scope.row.title }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
				<el-table-column prop="component" label="组件路径" show-overflow-tooltip></el-table-column>
				<el-table-column prop="perms" label="权限标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip width="80"> </el-table-column>
				<el-table-column label="类型" show-overflow-tooltip width="80">
					<template #default="scope">
						<el-tag type="warning" size="small" v-if="scope.row.type == '0'">目录</el-tag>
						<el-tag type="success" size="small" v-if="scope.row.type == '1'">菜单</el-tag>
						<el-tag type="danger" size="small" v-if="scope.row.type == '2'">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditMenu(scope.row)">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" :menuList="state.tableData.data" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { systemModuleApi } from '/@/api/system';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/system/menu/dialog.vue'));

// 定义变量内容
const menuDialogRef = ref();
const systemApi = systemModuleApi();
const state = reactive({
	tableData: {
		data: [] as RouteRecordRaw[],
		loading: true,
	},
});

const getTableData = async () => {
	state.tableData.loading = true;
	const res = await systemApi.getPermissionsList({});
	state.tableData.data = res.data;
	setTimeout(() => {
		state.tableData.loading = false;
	}, 500);
};

// 打开新增菜单弹窗
const onOpenAddMenu = () => {
	menuDialogRef.value.openDialog('add');
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (row: RouteRecordRaw) => {
	menuDialogRef.value.openDialog('edit', row);
};
// 删除当前行
const onTabelRowDel = (row: RouteRecordRaw) => {
	ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			ElMessage.success('删除成功');
			getTableData();
		})
		.catch(() => {});
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>
