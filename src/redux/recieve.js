import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';
/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.recieve = {
	//  获取 待接 列表
	fetchRecieveList: params => {
		return new Promise((resolve, reject) => {
			fetch(config.apiList.order, {header: params}, 'get').then(json => {
				resolve(json)
			})
		})
	}		
}