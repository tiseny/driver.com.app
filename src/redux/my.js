import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';
/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.my = {
	// 退出登录
	quit: params => {
		return new Promise((resolve, reject) => {
			fetch(config.apiList.login, null, 'delete', true).then(json => {
				resolve(json)
			})
		})
	}		
}