<template>
	<div :class="{ 'table-search-container': isflex }" v-if="props.search.length >= 0">
		<el-form ref="tableSearchRef" :model="state.form" size="default" :label-width="labelWidth" class="table-form">
			<div class="mb10 mr10" v-for="(val, key) in search" :key="key" v-show="key < showNumber || state.isToggle">
				<el-form-item :label="val.label + '：'" v-if="val.type != 'check'">
					<template v-if="val.type !== ''">
						<!-- input -->
						<el-input
							v-model="state.form[val.prop]"
							:placeholder="val.placeholder"
							:clearable="!val.isClear"
							v-if="val.type === 'input'"
							style="width: 180px"
						/>
						<!-- month -->
						<el-date-picker
							v-model="state.form[val.prop]"
							type="month"
							:placeholder="val.placeholder"
							v-else-if="val.type === 'month'"
							style="width: 180px"
							format="YYYY-MM"
							value-format="YYYY-MM"
							:clearable="!val.isClear"
						/>
						<!-- date -->
						<el-date-picker
							v-model="state.form[val.prop]"
							type="date"
							:placeholder="val.placeholder"
							v-else-if="val.type === 'date'"
							style="width: 180px"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							:clearable="!val.isClear"
						/>
						<!-- daterange -->
						<el-date-picker
							v-model="state.form[val.prop]"
							type="daterange"
							:placeholder="val.placeholder"
							v-else-if="val.type === 'daterange'"
							style="width: 470px"
							range-separator="到"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							size="default"
							:format="val.formatDa"
							:value-format="val.formatDa"
							@change="handleClose($event, val.prop)"
							:clearable="!val.isClear"
						/>
						<!-- search -->
						<el-select
							v-model="state.form[val.prop]"
							:placeholder="val.placeholder"
							v-else-if="val.type === 'select'"
							style="width: 180px"
							:multiple="val.multiple"
							:collapse-tags="val.collapseTags"
							:collapse-tags-tooltip="val.collapseTagsTooltip"
							@change="selectChangeValue($event, val.prop)"
							:clearable="!val.isClear"
							:filterable="val.filterable"
						>
							<el-option
								v-for="(item, index) in val.options"
								:key="val.valName ? item[val.valName] : val.useIndex ? index : item"
								:label="val.labelName ? item[val.labelName] : item"
								:value="val.valName ? item[val.valName] : val.useIndex ? index : item"
							>
							</el-option>
						</el-select>
						<!-- twoInput -->
						<div v-else-if="val.type === 'twoInput'">
							<el-date-picker
								v-model="model1"
								type="date"
								:placeholder="val.placeholder"
								style="width: 180px"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								:clearable="!val.isClear"
								@blur="state.form[val.prop][0] = $event.target.value"
							/>
							-
							<el-date-picker
								v-model="model2"
								type="date"
								:placeholder="val.placeholder"
								style="width: 180px"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								:clearable="!val.isClear"
								@blur="state.form[val.prop][1] = $event.target.value"
							/>
						</div>
						<div v-else-if="val.type === 'twoDate'">
							<el-input
								:placeholder="val.placeholder"
								:clearable="!val.isClear"
								style="width: 83px"
								v-model="model1"
								@blur="state.form[val.prop][0] = $event.target.value"
							/>
							-
							<el-input
								:placeholder="val.placeholder"
								:clearable="!val.isClear"
								style="width: 83px"
								v-model="model2"
								@blur="state.form[val.prop][1] = $event.target.value"
							/>
						</div>
					</template>
				</el-form-item>
				<el-checkbox
					v-model="state.form[val.prop]"
					:label="val.label"
					:true-label="val.trueLabel"
					:false-label="val.falseLabel"
					size="large"
					v-if="val.type === 'check'"
					style="width: 280px; padding-left: 18px"
				>
					{{ val.label }}
				</el-checkbox>
			</div>
			<div class="mb10" style="width: 180px" v-if="search.length > showNumber">
				<div class="table-form-btn-toggle ml10" @click="state.isToggle = !state.isToggle">
					<span>{{ state.isToggle ? '收筛选' : '展筛选' }}</span>
					<SvgIcon :name="state.isToggle ? 'ele-ArrowUp' : 'ele-ArrowDown'" />
				</div>
			</div>
		</el-form>
		<div class="btn">
			<slot name="btnBlock" :formdata="state.form" />
			<el-button size="default" type="info" @click="resetAll" v-if="isShowReset"> 重置 </el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="makeTableDemoSearch">
import { reactive, ref, onMounted, watchEffect } from 'vue';
import type { FormInstance } from 'element-plus';

const model1 = ref();
const model2 = ref();
// 定义父组件传过来的值
const props = defineProps({
	// 搜索表单
	search: {
		type: Array<TableSearchType>,
		default: () => [],
	},
	// 清空搜索框的propname
	resetName: {
		type: String,
		default: '',
	},
	// 清空搜索框的propname(数组形式)
	resetNames: {
		type: Array,
		default: () => [],
	},
	// 默认展示的个数(默认1个)
	showNumber: {
		type: Number,
		default: 1,
	},
	// 是否按钮菜单左右排序
	isflex: {
		type: Boolean,
		default: false,
	},
	// 是否显示重置按钮
	isShowReset: {
		type: Boolean,
		default: true,
	},
	labelWidth: {
		type: String,
		default: '100px',
	},
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['selectChange', 'reset', 'resets']);

// 定义变量内容
const tableSearchRef = ref<FormInstance>();
const state = reactive({
	form: {} as any,
	isToggle: false,
});

// 清空某个字段
watchEffect(() => {
	if (props.resetName) {
		state.form[props.resetName] = null;
		emit('reset', true);
	}
	if (props.resetNames) {
		props.resetNames.map((item: any) => {
			state.form[item] = null;
		});
		emit('resets', true);
	}
});

// 多选时间组件
const handleClose = (val?: any, name?: string) => {
	state.form[`start_${name}`] = val ? val[0] : '';
	state.form[`end_${name}`] = val ? val[1] : '';
};

// 重置
const resetAll = () => {
	for (const key in state.form) {
		let obj = props.search.filter((item) => item.prop == key)[0];
		if (!obj?.isNotReset) {
			state.form[key] = Array.isArray(state.form[key]) ? [] : null;
		} else {
			state.form[key] = obj.default || state.form[key];
		}
	}
	model1.value = null;
	model2.value = null;
};

// select组件回传
const selectChangeValue = (val?: any, name?: string) => {
	emit('selectChange', name, val);
};

// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
	if (props.search.length <= 0) return false;
	props.search.forEach((v) => {
		if (v.default) {
			if (v.type == 'daterange') {
				state.form[`start_${v.prop}`] = v.default[0];
				state.form[`end_${v.prop}`] = v.default[1];
				state.form[v.prop] = v.default;
			} else {
				state.form[v.prop] = v.default;
			}
		} else {
			state.form[v.prop] = v.type == 'twoInput' ? [] : '';
		}
	});
};
// 页面加载时
onMounted(() => {
	initFormField();
});
</script>

<style scoped lang="scss">
.table-search-container {
	display: flex;
	flex-wrap: wrap;
}
.table-form {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 10px;
	.table-form-btn-toggle {
		height: 100%;
		white-space: nowrap;
		user-select: none;
		display: flex;
		align-items: center;
		color: var(--el-color-primary);
	}
}
.btn {
	margin-bottom: 10px;
}
</style>
