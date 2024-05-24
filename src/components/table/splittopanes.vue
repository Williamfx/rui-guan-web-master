<template>
	<splitpanes @resize="paneSize = $event[0].size" :style="splitStyle">
		<pane :size="leftSize" :min-size="leftMinSize">
			<div :style="paneStyle">
				<slot name="leftpane" />
			</div>
		</pane>
		<pane :size="rightSize" :min-size="rightMinSize">
			<div :style="paneStyle">
				<slot name="rightpane" />
			</div>
		</pane>
	</splitpanes>
</template>

<script setup lang="ts" name="splittopanes">
import { computed, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const props = defineProps({
	// 左边区域
	leftSize: {
		type: Number,
		default: 58,
	},
	// 左边区域最小
	leftMinSize: {
		type: Number,
		default: 40,
	},
	// 右边区域
	rightSize: {
		type: Number,
		default: 42,
	},
	// 右边区域最小
	rightMinSize: {
		type: Number,
		default: 30,
	},
	transformOrigin: {
		type: String,
		default: 'top',
	},
});

const t = computed(() => {
	let t: any;
	// 屏幕dpi
	let dpi = window.devicePixelRatio;
	// 屏幕实际宽度
	let screenWidth = window.screen.width;
	if (dpi >= 1.5) {
		screenWidth = screenWidth * dpi;
	}
	if (dpi >= 1.5 && screenWidth > 1920) {
		t = (1920 * dpi) / screenWidth;
	} else {
		t = dpi;
	}
	return t;
});

const splitStyle = computed(() => {
	let style = `transform: scale(${t.value});width: ${(1 / t.value) * 100}%;height: ${(1 / t.value) * 100}%;transform-origin:${props.transformOrigin}`;
	return style;
});
const paneStyle = computed(() => {
	let style = `transform: scale(${1 / t.value});width: ${t.value * 100}%;height: ${t.value * 100}%;transform-origin: left top`;
	return style;
});

// 定义变量内容
const paneSize = ref(100);
</script>

<style scoped lang="scss">
:deep(.splitpanes__splitter) {
	width: 7px;
	border-left: 1px solid #eee;
	margin-left: -1px;
	background-color: #fff;
	box-sizing: border-box;
	position: relative;
	flex-shrink: 0;
}
:deep(.splitpanes__splitter::before) {
	margin-left: -2px;
}
:deep(.splitpanes__splitter::after) {
	margin-right: 1px;
}
:deep(.splitpanes__splitter::after),
:deep(.splitpanes__splitter::before) {
	transform: translateY(-50%);
	width: 1px;
	height: 30px;
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	background-color: #00000026;
	transition: background-color 0.3s;
}
</style>
