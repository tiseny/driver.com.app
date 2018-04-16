import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';
/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.waitOrderDetail = {
	//  获取 待接 列表
	fetchDetail: params => {
		return new Promise((resolve, reject) => {
			fetch(`${config.apiList.order}/${params.id}`, null, 'get').then(json => {
				resolve(json)
			})
		})
	},

	acceptOrder: params => {
		return new Promise((resolve, reject) => {
			fetch(`${config.apiList.order}`, {
				header: {accept: params.accept},
				body: params.id
			}, 'put').then(json => {
				resolve(json)
			})
		})
	},

	refuseOrder: params => {
		return new Promise((resolve, reject) => {
			fetch(`${config.apiList.order}`, {
				header: {fromSingleReason: params.fromSingleReason, accept: params.accept},
				body: params.id
			}, 'put').then(json => {
				resolve(json)
			})
		})
	}
}