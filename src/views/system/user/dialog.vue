<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称">
							<el-input v-model="state.ruleForm.nickname" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号">
							<el-input v-model="state.ruleForm.username" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门">
							<el-select v-model="state.ruleForm.department_id" placeholder="请选择部门" clearable>
								<el-option v-for="item in list" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色">
							<el-select v-model="state.ruleForm.role_id" placeholder="请选择角色" clearable>
								<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别">
							<!-- <el-input v-model="state.ruleForm.sex" placeholder="请输入性别" clearable></el-input> -->

							<el-select v-model="state.ruleForm.sex" placeholder="请选择性别" clearable>
								<el-option label="男" :value="1"></el-option>
								<el-option label="女" :value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户密码">
							<el-input v-model="state.ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="确认密码">
							<el-input v-model="state.ruleForm.password2" placeholder="请输入" type="password" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"></el-switch>
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

<script setup lang="ts" name="systemUserDialog">
import { onBeforeMount, reactive, ref } from 'vue';
import { deepClone } from '/@/utils/other';
import { systemModuleApi } from '/@/api/system';
import { ElMessage } from 'element-plus';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const systemApi = systemModuleApi();
const userDialogFormRef = ref();
const list = ref();
const role = ref();

const state: any = reactive({
	ruleForm: {},
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,

		title: '',
		submitTxt: '',
		isBtnLoading: false,
	},
	type: 'add',
});

// 打开弹窗
const openDialog = (type: string, row: RowUserType) => {
	state.type = type;
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增用户';
		state.dialog.submitTxt = '新 增';
		state.ruleForm = {};
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
		res = await systemApi.createAdmins(param);
	} else {
		res = await systemApi.editAdminsLists(param);
	}
	if (res.code != 200) {
		state.dialog.isBtnLoading = false;
		return ElMessage.error(res.message);
	} else {
		ElMessage.success('成功了');
		closeDialog(); // 关闭弹窗
		emit('refresh');
	}
};

onBeforeMount(async () => {
	const res = await systemApi.getDictionaryLists({ type_field: 7, page_size: 100, page: 1 });
	list.value = res.data.data;

	const roleRes = await systemApi.getRolesList({ page_size: 100, page: 1 });
	role.value = roleRes.data.rows;
});

// 暴露变量
defineExpose({
	openDialog,
});
</script>
