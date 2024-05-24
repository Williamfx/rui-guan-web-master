import request from '/@/utils/request';

export function useMenuApi() {
	return {
		/* 获取菜单列表 */
		getMenu: (data?: object) => {
			return request({
				url: '/vuesystem/menulist',
				method: 'post',
				data,
			});
		},
		/* 新增菜单 */
		addMenu: (data?: object) => {
			return request({
				url: '/vuesystem/menuadd',
				method: 'post',
				data,
			});
		},
		/* 修改菜单 */
		editMenu: (data?: object) => {
			return request({
				url: '/vuesystem/menuedit',
				method: 'post',
				data,
			});
		},
	};
}
