import config from '../config';
import fetch from '../helpers/fetch';
import { setState, getState } from '../helpers/state';

/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.login = params => {
	return new Promise((resolve, reject) => {
		fetch(config.apiList.login, {body: params}, 'POST', false).then(json => {
			if (json.result) {
				// 帐号和用户名 存储起来
				// token
				setState('user', JSON.stringify(params))
				setState('token', 'token122121')

				resolve(json)
			}
		})
	})
};	
