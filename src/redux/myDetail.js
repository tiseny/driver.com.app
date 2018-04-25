import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';
/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.myDetail = {
	//  获取 信息 列表
	fetchDetail: params => {
		return new Promise((resolve, reject) => {
			fetch(`${config.apiList.trailer}/${params.id}`, null, 'get')
				.then(json => {
					// console.log(json)
					resolve(json)
				})
		})
	},

	//获取评论
	fetchEvaluate: params => {
		return new Promise((resolve, reject) => {
			fetch(`${config.apiList.evaluate}/${params.id}`, null, 'get')
				.then(json => {
					// console.log(json)
					resolve(json)
				}).catch(err=>{
					console.log(err)
				})
		})
	}
}