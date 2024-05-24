<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色名称">
							<el-input v-model="state.ruleForm.name" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色标识">
							<el-input v-model="state.ruleForm.roleSign" placeholder="请输入角色标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门">
							<el-select v-model="state.ruleForm.department_id" placeholder="请选择部门" clearable>
								<el-option v-for="item in list" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单权限">
							<el-tree :data="state.menuData" :props="state.menuProps" show-checkbox class="menu-data-tree" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRoleDialog">
import { onBeforeMount, reactive, ref } from 'vue';
import { systemModuleApi } from '/@/api/system';
import { deepClone } from '/@/utils/other';
import { ElMessage } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const systemApi = systemModuleApi();

// 定义变量内容
const roleDialogFormRef = ref();
const list = ref();
const state: any = reactive({
	ruleForm: {},
	menuData: [] as TreeType[],
	menuProps: {
		children: 'children',
		label: 'label',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	state.type = type;
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改角色';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增角色';
		state.dialog.submitTxt = '新 增';
		state.dataForm = {};
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = async () => {
	state.dialog.isBtnLoading = true;
	let param = deepClone(state.ruleForm);
	param.parent_id = param.menuSuperior?.length > 0 ? param.menuSuperior[param.menuSuperior.length - 1] : '0';
	let res;
	if (state.type == 'add') {
		res = await systemApi.createRole(param);
	} else {
		res = await systemApi.editRole(param);
	}
	if (res.code != 200) {
		ElMessage.error(res.message);
	} else {
		ElMessage.success('成功了');
		closeDialog(); // 关闭弹窗
		emit('refresh');
	}
	state.dialog.isBtnLoading = false;
};

// 暴露变量
defineExpose({
	openDialog,
});

onBeforeMount(async () => {
	const res = await systemApi.getDictionaryLists({ type_field: 7, page_size: 100, page: 1 });
	list.value = res.data.data;
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
