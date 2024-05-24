<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级菜单">
							<el-cascader
								:options="menuList"
								:props="{ checkStrictly: true, value: 'id', label: 'title' }"
								placeholder="请选择上级菜单"
								clearable
								class="w100"
								v-model="state.ruleForm.menuSuperior"
							>
								<template #default="{ node, data }">
									<span>{{ data.title }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单类型">
							<el-radio-group v-model="state.ruleForm.type">
								<el-radio value="0">目录</el-radio>
								<el-radio value="1">菜单</el-radio>
								<el-radio value="2">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单名称">
							<!-- <el-input v-model="state.ruleForm.title" placeholder="菜单名称" clearable></el-input> -->
							{{ state.host }}
							<el-upload
								class="avatar-uploader"
								:action="state.host"
								:header="{}"
								:show-file-list="false"
								method="put"
								:on-success="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload"
								:http-request="httpRequest"
							>
								<img v-if="imageUrl" :src="imageUrl" class="avatar" />
								<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
							</el-upload>
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.type === '0' || state.ruleForm.type === '1'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由路径">
								<el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="重定向">
								<el-input v-model="state.ruleForm.redirect" placeholder="请输入路由重定向" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="菜单图标">
								<IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.icon" />
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="组件路径">
								<el-input v-model="state.ruleForm.component" placeholder="组件路径" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="state.ruleForm.type === '2'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识">
								<el-input v-model="state.ruleForm.btnPower" placeholder="请输入权限标识" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单排序">
							<el-input-number v-model="state.ruleForm.sort" controls-position="right" placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.type === '0' || state.ruleForm.type === '1'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否隐藏">
								<el-radio-group v-model="state.ruleForm.hidden">
									<el-radio value="1">隐藏</el-radio>
									<el-radio value="0">不隐藏</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" :laoding="state.dialog.isBtnLoading" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { systemModuleApi } from '/@/api/system';
import { deepClone } from '/@/utils/other';
import { ElMessage, UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const props = defineProps({
	menuList: {
		type: Array,
		default: () => [],
	},
});

const systemApi = systemModuleApi();

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();

const state: any = reactive({
	host: '',
	type: '',
	ruleForm: {
		menuSuperior: [],
		type: '0',
		name: '',
		component: '',
		sort: 0,
		path: '',
		redirect: '',
		title: '',
		icon: '',
		hidden: false,
		btnPower: '', // 菜单类型为按钮时，权限标识
	},
	dialog: {
		isShowDialog: false,
		isBtnLoading: false,
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	state.type = type;
	if (type === 'edit') {
		state.ruleForm = deepClone(row);
		state.dialog.title = '修改菜单';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增菜单';
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.type = type;
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
		res = await systemApi.createPermissions(param);
	} else {
		res = await systemApi.editPermissions(param);
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

const imageUrl = ref('');

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const httpRequest = (file) => {
	// 调用后端接口
	axios.request({
		headers: {
			'Content-Type': 'application/octet-stream',
		},
		url: state.host,
		method: 'post',
		data: file.file,
	});
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	// if (rawFile.type !== 'image/jpeg') {
	// 	ElMessage.error('Avatar picture must be JPG format!');
	// 	return false;
	// } else if (rawFile.size / 1024 / 1024 > 2) {
	// 	ElMessage.error('Avatar picture size can not exceed 2MB!');
	// 	return false;
	// }
	return true;
};

onMounted(async () => {
	const res = await systemApi.getOssToken();
	state.host = res.data.url;
});

// 暴露变量
defineExpose({
	openDialog,
});
</script>
async async
