<template>
	<el-config-provider size="large">
		<router-view />
		<Setings ref="setingsRef" />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
import { onBeforeMount, onMounted, nextTick, watch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeConfig } from '/@/stores/themeConfig';
import other from '/@/utils/other';
import { Local } from '/@/utils/storage';

import setIntroduction from '/@/utils/setIconfont';
const Setings = defineAsyncComponent(() => import('/@/layout/navBars/topBar/setings.vue'));


// 定义变量内容
const route = useRoute();
const storesThemeConfig = useThemeConfig();

// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => {
	// 设置批量第三方 icon 图标
	setIntroduction.cssCdn();
	// 设置批量第三方 js
	setIntroduction.jsCdn();
});
// 页面加载时
onMounted(() => {
	nextTick(() => {
		// 获取缓存中的布局配置
		if (Local.get('themeConfig')) {
			storesThemeConfig.setThemeConfig({ themeConfig: Local.get('themeConfig') });
			document.documentElement.style.cssText = Local.get('themeConfigStyle');
		}

	});
});
// 监听路由的变化，设置网站标题
watch(
	() => route.path,
	() => {
		other.useTitle();
	},
	{
		deep: true,
	}
);
</script>

<style lang="scss">
.demo-tabs {
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.el-tab-pane {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.main-detail {
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.buttonComponents {
	margin-bottom: 10px;
	display: flex;
}

.w100 {
	width: 100%;
}
</style>
