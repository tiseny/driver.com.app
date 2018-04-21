import '../libs/fastclick';
import { pageBack, watchLocation, isLogin, goLogin } from './util';

Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var number = this,
    negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

const mui = require('../libs/mui.min.js');

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
	    }
		}
		Object.assign(conifg, params)
		mui.openWindow(conifg)
	}

	// 判断是否已经登录
	isLogin(mui);

	// 定位信息
	watchLocation(mui);

	// 退出
	pageBack(mui)

	return mui
}

export default middleware()