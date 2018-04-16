import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';
/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.orderDetail = {
	//  获取 待接 列表
	fetchDetail: params => {
		return new Promise((resolve, reject) => {
			fetch(`${config.apiList.order}/${params.id}`, null, 'get').then(json => {
				resolve(json)
			})
		})
	}		
}