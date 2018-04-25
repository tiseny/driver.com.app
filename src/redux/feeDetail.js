import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';

window.app = window.app || {}
window.app.feeDetail = {
	//获取费用数据
	fetchFee: params => {
		return new Promise((resolve,reject) => {
			fetch(`${config.apiList.fee}/${params.id}`,null,"get").then(json => {
				resolve(json)
			})
		})
	},
	//获取费用种类
	feeCategory: params => {
		return new Promise((resolve,reject) => {
			fetch(config.apiList.feeCategory,{header: params},"get").then(json => {
				resolve(json)
			})
		})
	}
}