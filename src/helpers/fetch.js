import { getState } from './state';
const mui = require('../libs/mui.min.js');

// 参数 序列化
function param(paramData) {

  const escape = window.encodeURIComponent;

  if(!paramData || typeof paramData !== 'object'){
    return ''
  }

  const params = Object.keys(paramData).map(key => {
    const val =  paramData[key];
    return `${escape(key)}=${val === undefined || val === null ? '' : escape(val)}`
  });
  
  return params.join('&');
}

// 请求地址
function getApiPath(url, paramData) {
  const requestParams = paramData || {};
  requestParams.t = (new Date()).getTime();

  let params = param(requestParams);

  if (params) {
    params = url.indexOf('?') === -1 ? `?${params}` : `&${params}`
  }

  return `${url}${params}`
}


function fetch(url, params, method, hasToken = true) {

	url = getApiPath(url, params.header || {})
	let headers = {
		'Content-Type':'application/json'
	}
	// 如果需要 token, 除了登录注册以外.
	if (hasToken) {
		Object.assign(headers, {
			"token-sign": getState('token')
		})
	}

	return new Promise((resolve, reject) => {
		mui.ajax(url, {
			data: params.body || {},
			dataType: 'json',						//服务器返回json格式数据
			type: method,								//HTTP请求类型
			timeout: 10000,							//超时时间设置为10秒；
			headers: headers,	              
			success:function(data){
				resolve({
					result: true,
					data: data
				})
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				plus.nativeUI.toast('系统异常');
			}
		});
	})
}

export default fetch;