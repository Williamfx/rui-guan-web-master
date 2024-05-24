import { defineStore } from 'pinia';
export const useThemeConfig = defineStore('themeConfig', {
	state: (): ThemeConfigState => ({
		themeConfig: {
			// 是否开启布局配置抽屉
			isDrawer: false,
			// 默认 primary 主题颜色
			primary: '#409eff',
			// 是否开启深色模式
			isIsDark: false,
			// 默认顶栏导航背景颜色
			topBar: '#ffffff',
			// 默认顶栏导航字体颜色
			topBarColor: '#606266',
			// 是否开启顶栏背景颜色渐变
			isTopBarColorGradual: false,
			// 默认菜单导航背景颜色
			menuBar: '#545c64',
			// 默认菜单导航字体颜色
			menuBarColor: '#eaeaea',
			// 默认菜单高亮背景色
			menuBarActiveColor: 'rgba(0, 0, 0, 0.2)',
			// 是否开启菜单背景颜色渐变
			isMenuBarColorGradual: false,
			// 默认分栏菜单背景颜色
			columnsMenuBar: '#545c64',
			// 默认分栏菜单字体颜色
			columnsMenuBarColor: '#e6e6e6',
			// 是否开启分栏菜单背景颜色渐变
			isColumnsMenuBarColorGradual: false,
			// 是否开启分栏菜单鼠标悬停预加载(预览菜单)
			isColumnsMenuHoverPreload: false,
			// 是否开启菜单水平折叠效果
			isCollapse: false,
			// 是否开启菜单手风琴效果
			isUniqueOpened: true,
			// 是否开启固定 Header
			isFixedHeader: true,
			// 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
			isFixedHeaderChange: false,
			// 是否开启经典布局分割菜单（仅经典布局生效）
			isClassicSplitMenu: false,
			// 是否开启侧边栏 Logo
			isShowLogo: false,
			// 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
			isShowLogoChange: false,
			// 是否开启 Breadcrumb，强制经典、横向布局不显示
			isBreadcrumb: true,
			// 是否开启 Tagsview
			isTagsview: false,
			// 是否开启 Breadcrumb 图标
			isBreadcrumbIcon: false,
			// 是否开启 Tagsview 图标
			isTagsviewIcon: false,
			// 是否开启 TagsView 缓存
			isCacheTagsView: false,
			// 是否开启 TagsView 拖拽
			isSortableTagsView: false,
			// 是否开启 TagsView 共用
			isShareTagsView: false,
			// 是否开启色弱模式
			isInvert: false,
			// 定义的值与 `/src/layout/navBars/tagsView/tagsView.vue` 中的 class 同名
			tagsStyle: 'tags-style-five',
			// 主页面切换动画：可选值"<slide-right|slide-left|opacitys>"，默认 slide-right
			animation: 'slide-right',
			// 分栏高亮风格：可选值"<columns-round|columns-card>"，默认 columns-round
			columnsAsideStyle: 'columns-round',
			// 分栏布局风格：可选值"<columns-horizontal|columns-vertical>"，默认 columns-horizontal
			columnsAsideLayout: 'columns-vertical',

			// 布局切换：可选值"<defaults|classic|transverse|columns>"，默认 defaults
			layout: 'defaults',
			/**
			 * 后端控制路由
			 */
			// 是否开启后端控制路由
			isRequestRoutes: true,
		},
	}),
	actions: {
		setThemeConfig(data: ThemeConfigState) {
			this.themeConfig = data.themeConfig;
		},
	},
});
