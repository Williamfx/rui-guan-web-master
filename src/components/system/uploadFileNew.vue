<template>
	<el-upload
		:file-list="files"
		action="#"
		list-type="picture-card"
		multiple
		:before-upload="handleBeforeUpload"
		:limit="limitNum"
		:on-exceed="handleExceed"
		:http-request="handleUpload"
		:on-preview="handleOnPriview"
		:on-remove="handleRemove"
		:before-remove="beforeRemove"
		:accept="accept"
		:on-success="handleSuccess"
	>
		<el-icon><Plus /></el-icon>
	</el-upload>
	<ImgPreView v-model="state.visible" :imgs="state.imageUrl" />
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
import uploadImg from '/@/utils/uploadOss';
import axios from 'axios';
const ImgPreView = defineAsyncComponent(() => import('/@/components/system/imgPreView.vue'));

const emits = defineEmits(['update:files']);

const props = defineProps({
	files: {
		default: () => [],
		type: Array,
	},
	// 图片限制
	limitNum: {
		default: 5,
		type: Number,
	},
	// 默认文件

	// 是否展示列表
	showFileList: {
		default: false,
		type: Boolean,
	},
	uploadStyle: {
		default: '',
		type: String,
	},
	accept: {
		default: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF',
		type: String,
	},
});

// 定义文件列表参数
const state = reactive({
	imageUrl: '' as any,
	visible: false,
});

watch(
	() => props.files,
	(newVal) => {
		state.imageUrl = [];
		newVal.map((item: any) => {
			state.imageUrl.push(item.url);
		});
	}
);

/**
 * 超出限制，需要跟limit一起使用
 * @param files
 * @param uploadFiles
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`最多上传${props.limitNum}张,您选择了${files.length}个文件,目前一共有${files.length + uploadFiles.length}个文件`);
};

/**
 * 文件上传前，不可超过20M校验
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
	const isLt2M = file.size / 1024 / 1024 < 20;
	if (!isLt2M) {
		ElMessage.error('上传图片大小不能超过 20MB!');
	}
	return isLt2M;
};

/**
 * 自定义上传
 */
const handleUpload = async (options: any) => {
	const param: any = await uploadImg.getFile(options.file);

	const fileData = {
		...param,
		file: options.file,
	};
	// 使用 axios 发送请求
	const res = await axios.post(param.host, fileData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	if (res.status == 200) {
		return {
			name: param.name,
			url: `https://adgoos.aidigong.com/${param.key}`,
		};
	}
};

// 文件上传成功（多选时，全成功后回调）
const handleSuccess: UploadProps['onSuccess'] = async (fileData, file, files) => {
	files.forEach((item) => {
		if (item.url == file.url) {
			item.url = fileData.url;
			item.name = fileData.name;
		}
	});
	emits('update:files', files);
};

// 移除文件
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	emits('update:files', uploadFiles);
};

// 移除文件之前
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
	return ElMessageBox.confirm(`确定移除 ${uploadFile.name}文件 ?`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(
		() => true,
		() => false
	);
};

// 文件列表点击
const handleOnPriview: UploadProps['onPreview'] = (file) => {
	state.visible = true;
};
</script>
