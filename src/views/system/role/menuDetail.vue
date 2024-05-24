<template>
	<div class="main-detail" id="mainBlock1">
		<el-tree
			ref="roleTree"
			:data="state.menuData"
			:props="state.menuProps"
			show-checkbox
			class="menu-data-tree"
			default-expand-all
			@check="checkNodes"
			node-key="id"
		>
			<template #default="{ node }">
				<span class="custom-tree-node">
					<span style="display: inline-block">{{ node.label }}</span>
				</span>
			</template>
		</el-tree>
		<div class="btnList">
			<el-button size="default" class="ml10" type="primary" @click="addMenuInRole" v-auth="'bindingMenu'">绑定菜单</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="menuDetail">
import { reactive, onMounted, watch, ref, nextTick } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { systemModuleApi } from '/@/api/system';

type roleFormRule = {
	id: '';
};

// 父组件向子组件传值
const props = defineProps({
	roleRowDetail: {},
});

const systemApi = systemModuleApi();
const roleTree = ref();
const state = reactive({
	menuData: [] as TreeType[], //所有的菜单列表
	menuProps: {
		children: 'children',
		label(data: any) {
			const config = data.meta.title || undefined;
			return config;
		},
		class(data: any) {
			if (data.type == '2') {
				return 'is-penultimate';
			}
		},
	},
	rowDetail: {} as roleFormRule,
	roleInMenu: [], // 角色绑定的菜单列表
	dialog: {
		roleLoading: false,
	},
	treeIsCheck: [], //选中的树状态的节点
	treeIsCheckHalf: [], //半选中的树状态的节点
});

// 获取菜单列表
const getMenuData = (routes: RouteItems) => {
	const arr: RouteItems = [];
	routes.map((val: RouteItem) => {
		val['title'] = val.title;
		arr.push({ ...val });
		if (val.children) getMenuData(val.children);
	});
	return arr;
};

// 获取角色绑定菜单列表
const getMenuInRole = async (id: any) => {
	const res = await systemApi.getMenuInRole({ role_id: id });
	if (res.code == 200) {
		state.treeIsCheck = res.data.menuRulesALL;
		state.treeIsCheckHalf = res.data.menuRulesHalf;
		let arr = [...state.treeIsCheck, ...state.treeIsCheckHalf];
		roleTree.value.setCheckedKeys(state.treeIsCheck);
		let Allkeys = roleTree.value.getCheckedKeys();
		let deleteArr = Allkeys.filter((item: never) => !arr.includes(item));
		deleteArr.map((item1: any) => {
			roleTree.value.setChecked(item1, false);
		});
	}
};

// 绑定菜单
const addMenuInRole = async () => {
	let param = {
		menu_id_all: state.treeIsCheck,
		menu_id_half: state.treeIsCheckHalf,
		role_id: state.rowDetail.id,
	};
	const res = await systemApi.accessMenuToRole(param);
	if (res.code == 500) {
		ElMessage.error('绑定失败');
		return;
	} else if (res.code == 200) {
		ElMessage.success('绑定成功');
	}
};

const checkNodes = (data: any, items: any) => {
	state.treeIsCheck = items.checkedKeys;
	state.treeIsCheckHalf = items.halfCheckedKeys;
};

watch(
	() => props.roleRowDetail,
	async (newVal) => {
		if (newVal) {
			const loadingInstance1 = ElLoading.service({ fullscreen: true, target: '#mainBlock1' });
			state.rowDetail = JSON.parse(JSON.stringify(props.roleRowDetail as roleFormRule));
			await getMenuInRole(state.rowDetail.id);
			loadingInstance1.close();
		}
	},
	{
		immediate: true,
	}
);

// 页面加载时
onMounted(async () => {
	const res = await systemApi.getPermissionsList({});
	state.menuData = getMenuData(res.data);
});
</script>

<style scoped lang="scss">
:deep() .el-tree {
	flex: 1;
	overflow: auto;
}
.btnList {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}

:deep(.is-penultimate) {
	display: inline-block;
}
:deep(.el-tree-node) {
	white-space: inherit;
}
</style>
