import { setState, getState } from './state';

const mui = require('../libs/mui.min.js');
const BLANK_LIST = ['^/login.*', '^/register.*'];
const LOGIN_URL = 'login.html'

function isLogin() {
	const url = window.location.pathname
	const isValidUrl = BLANK_LIST.some(reg => new RegExp(reg).test(url))
	// 如果是非黑名单内的url
	// 如果不存在token. 则打回到 login.html
	if (!getState('token') && !isValidUrl) {
		mui.openWindow({
		  url: LOGIN_URL,
		  id: LOGIN_URL,
		});
	}
}

function middleware() {
	// 重新定义 
	mui._ready = func => {
		if (mui.os.plus) {
			mui.plusReady(func)
		} else {
			mui.ready(func)
		}
	}

	mui._toast = msg => {
		if (mui.os.plus) {
			plus.nativeUI.toast(msg)
		} else {
			mui.toast(msg)
		}
	}

	mui._openWindow = params => {
		let conifg = {
			styles:{
	      top: '44px',					//新页面顶部位置
	      bottom: '50px'				//新页面底部位置
	    },
	    extras:{
	      											//自定义扩展参数，可以用来处理页面间传值
	    },
	    createNew:false,				//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    waiting:{
	      autoShow:true,				//自动显示等待框，默认为true
	      title:'正在加载...',	//等待对话框上显示的提示内容
	    }
		}
		Object.assign(conifg, params)
		mui.openWindow(conifg)
	}

	// 判断是否已经登录
	isLogin();

	return mui
}

export default middleware()