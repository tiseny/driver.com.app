import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';

window.app = window.app || {}
window.app.fee = {
	//获取费用数据
	fetchFee: params => {
		return new Promise((resolve,reject) => {
			fetch(`${config.apiList.fee}/${params.id}`,null,"get").then(json => {
				resolve(json)
			})
		})
	}
}