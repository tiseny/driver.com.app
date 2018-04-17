import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';

window.app = window.app || {}
window.app.history = {
	//获取历史订单数据
	fetchHistoryList: params => {
		return new Promise((resolve,reject) => {
			fetch(config.apiList.orderHistory,{header: params},"get").then(json => {
				resolve(json)
			})
		})
	}
}