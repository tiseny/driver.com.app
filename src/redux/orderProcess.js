import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';
/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.orderProcess = {
	//  获取 待接 列表
	fetchDetail: params => {
		return new Promise((resolve, reject) => {
			fetch(config.apiList.orderContainer, {header: params}, 'get').then(json => {
				resolve(json)
			})
		})
	},

	upaloadImage: params => {
		return new Promise((resolve, reject) => {
			const header = {
				orderId: params.orderId,
				businessKey: params.businessKey
			}
			const body = {
				[params.businessKey] : params.data
			}
			fetch(config.apiList.orderContainerImage, {header, body}, 'post').then(json => {
				resolve(json)
			})
		})
	}
}