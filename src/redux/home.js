import config from '../config';
import fetch from '../helpers/fetch';

/**
 * 用户登录
 **/
window.app = window.app || {}
window.app.login = params => {
	return new Promise((resolve, reject) => {
		fetch(config.apiList.login, {header: params}, 'post', false).then(json => {
			resolve(json)
		})
	})
};	
