import { setState, getState, clearState } from './state';
const BLANK_LIST = ['^/login.*', '^/register.*'];
const LOGIN_URL = 'login.html'

let geoWatch = null

function isLogin(mui) {
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

function goLogin(mui) {
	// 清除 所有 localStorage
	clearState()

	mui.openWindow({
		url: LOGIN_URL,
	  id: LOGIN_URL,
	  preload: true,
		show: {
			aniShow: 'pop-in'
		},
		styles: {
			popGesture: 'hide'
		},
		waiting: {
			autoShow: false
		}
	})

	// 销毁页面
	const homePage = plus.webview.getWebviewById('home.html');  
	plus.webview.close(homePage, "none");
}

// 监听定位
function watchLocation(mui) {
	mui.plusReady(function() {
		// 如果已经登录了
		if (getState('token')) {
			geoWatch = plus.geolocation.getCurrentPosition(function(position) {
	    	// coords 经纬度
	    	const coords = {
	    		lng: position.coords.longitude,
	    		lat: position.coords.latitude
	    	}
	    	// address
	    	//const address = `${position.address.province}${position.address.city}${position.address.district}${position.address.street}`
	    	//plus.nativeUI.toast(JSON.stringify(position))
	    	// 清楚监听位置
	    	plus.geolocation.clearWatch( geoWatch ); 
	    	geoWatch = null
	    }, function(e) {
	      //plus.nativeUI.toast("异常:" + e.message);
	      // 清楚监听位置
	      plus.geolocation.clearWatch( geoWatch ); 
	    	geoWatch = null
	    },{ provider: 'baidu' });
		}
    
  });
}

// 调用系统电话
function callPhone(number) {
	plus.nativeUI.confirm(`拨打${number}？`,function(e) {
		if (e.index == 0) {
			plus.device.dial(number, true)
		}	
	}, "温馨提示", ["是","否"])
}

// 打开系统地图，导航
function openMap(address) {
	plus.maps.openSysMap();
}

// 拍照 
function photo(mui) {

}

function pageBack(mui) {
	// 退出
	let backButtonPress = 0;
	mui._back = function(event) {
		backButtonPress++;
		if (backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
}

function getQuery(mui,name) {
  const str = location.search.replace('?', '');
  const obj = {};
  const arr = str.split('&');
  const len = arr.length;

  if (len > 0) {
    for (let i = 0; i < len; i++) {
      const tempArr = arr[i].split('=');
      if (tempArr.length === 2) {
        obj[tempArr[0]] = tempArr[1];
      }
    }
  }

  let queryValue = name ? obj[name] : obj
  // 如果是支持plus
  if (mui.os.plus) {
  	const pw = plus.webview.currentWebview()
  	queryValue = pw[name]
  }

  return queryValue
}

export {
	getQuery,


	pageBack,
	goLogin,
	watchLocation,
	isLogin,
	callPhone,
	openMap,
	photo
}