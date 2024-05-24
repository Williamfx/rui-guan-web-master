<template>
	<div class="layout-navbars-breadcrumb-user-news">
		<div class="content-box">
			<template v-if="state.newsList.length > 0">
				<div class="content-box-item" v-for="(v, k) in state.newsList" :key="k">
					<div>{{ v.label }}</div>
					<div class="content-box-msg">
						{{ v.value }}
					</div>
					<div class="content-box-time">{{ v.time }}</div>
				</div>
			</template>
			<el-empty description="暂无通知" v-else></el-empty>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUserNews">
import { reactive } from 'vue';

// 定义变量内容
const state = reactive({
	newsList: [
		{
			label: '版本号：1.0.1',
			value: '页面初始化',
			time: '发布时间：2024-4-7',
		},
	],
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
	.content-box {
		font-size: 13px;

		.content-box-item {
			padding-top: 12px;

			&:last-of-type {
				padding-bottom: 12px;
			}

			.content-box-msg {
				color: var(--el-text-color-secondary);
				margin-top: 5px;
				margin-bottom: 5px;
			}

			.content-box-time {
				color: var(--el-text-color-secondary);
			}
		}
	}

	.foot-box {
		height: 35px;
		color: var(--el-color-primary);
		font-size: 13px;
		cursor: pointer;
		opacity: 0.8;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid var(--el-border-color-lighter);

		&:hover {
			opacity: 1;
		}
	}

	:deep(.el-empty__description p) {
		font-size: 13px;
	}
}
</style>
