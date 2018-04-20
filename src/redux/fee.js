import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';

window.app = window.app || {}
window.app.checkSheet = {
	//获取费用数据
	checkSheet: params => {
		return new Promise((resolve,reject) => {
			fetch(config.apiList.checkSheet,{header: params},"get").then(json => {
				resolve(json)
			})
		})
	}
}