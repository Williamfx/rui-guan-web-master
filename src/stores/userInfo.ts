import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { Session } from '/@/utils/storage';
import { useLoginApi } from '../api/login';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
const userApi = useLoginApi();
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			roles: [],
			authBtnList: [],
			photo: '',
			time: 0
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos = <UserInfos>await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		async getApiUserInfo() {
			const userName = Cookies.get('userName');
			// const res = await userApi.getMenus({});
			const res = {
				menus: [{
					path: '/home',
					name: 'home',
					component: () => import('/@/views/home/index.vue'),
					redirect: '',
					meta: {
						isKeepAlive: true,
					},
					children: [
					],
				},], perms: []
			};
			// const { menus, perms } = res.data
			const { menus, perms } = res
			return new Promise((resolve) => {
				const userInfos = {
					userName: userName,
					roles: 'defaultRoles',
					menus: menus,
					authBtnList: perms,
				};
				Session.set('userInfo', userInfos);
				resolve(userInfos);
			});
		},
	},
});
