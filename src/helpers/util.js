import { setState, getState, clearState } from './state';
import EXIF from '../libs/exif';

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
function photo(callback) {
	const cmr = plus.camera.getCamera(); 
	cmr.captureImage(function(p) {  
  //alert(p);//_doc/camera/1467602809090.jpg  
  	plus.io.resolveLocalFileSystemURL(p, function(entry) {  
		  //alert(entry.toLocalURL());//file:///storage/emulated/0/Android/data/io.dcloud...../doc/camera/1467602809090.jpg  
		  //alert(entry.name);//1467602809090.jpg  
		  const path = plus.io.convertLocalFileSystemURL(p)
	   	compressImage(path, entry, callback)
	  }, function(e) {  
	   	plus.nativeUI.toast("读取拍照文件错误：" + e.message);  
	  });  
 	}, function(e) {  
 	}, {  
	  filename: "_doc/camera/",  
	  index: 1  
 	});  
} 

//压缩图片  
function compressImage(url, file, callback){  
 	const name = `_doc/upload/${file.name}`;//_doc/upload/F_ZDDZZ-1467602809090.jpg  
	plus.zip.compressImage({  
   	src:url,//src: (String 类型 )压缩转换原始图片的路径  
   	dst:name,//压缩转换目标图片的路径  
   	quality:20,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
   	overwrite:true//overwrite: (Boolean 类型 )覆盖生成新文件  
  }, function(event) {  
   	//uploadf(event.target,pid);  
   	//event.target获取压缩转换后的图片url路  
   	//filename图片名称  
	 	let img = new Image();
		img.src = url;
		img.onload = function () {
			let that = this
	    //获取照片方向角属性，用户旋转控制 ,判断当前图片是否需要做旋转操作。
	    EXIF.getData(img, function() {  
	      /**
	       * 图片的旋转方向信息
	       * 1、图片没有发生旋转
	       * 6、顺时针90°
	       * 8、逆时针90°
	       * 3、180° 旋转
	       */
		    let base64 = getBase64Image(that, EXIF.getTag(this, 'Orientation'))
		    let bitData = base64.replace("data:image/png;base64,", "") 
		    callback(file.name, base64, bitData)
		    // 删除文件
		    file.remove(function() {
		    	console.log('删除成功')
		    }, function() {
					console.log('删除失败')    	
		    });
	    });
		}
		
  },function(error) {  
  	plus.nativeUI.toast("压缩图片失败")
 	}); 
}  


// 获取 base64 图片数据
//将图片压缩转成base64
function getBase64Image(img, orientation) {
	let width = img.width;
	let height = img.height;
	// 1 - 0度
	// 6 - 90度
	// 8 - -90度
	// 3 - 180度
	const ANGEL = {
		'1': '0',
		'3': '180',
		'6': '90',
		'8': '-90'
	} 
	//绘制图形
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = width;  /*设置新的图片的宽度*/
	canvas.height = height; /*设置新的图片的长度*/
	if (orientation == '6') {
		// 旋转大小
		canvas.width = height;  
		canvas.height = width; 

  	ctx.translate(height, 0);
    //清空画布指定像素
    ctx.clearRect(-width, -height, width, height); 
	  // 画布旋转 90度
		ctx.rotate(ANGEL[orientation] * Math.PI / 180); //把画布旋转90度	
		ctx.fillRect(width, height, width, height);
	}
	ctx.drawImage(img, 0, 0, width, height); /*绘图*/
	return canvas.toDataURL("image/jpeg", 0.5);
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

// 图片预览
function imagePreview(mui, src, deleteFunc) {
	const popup = document.createElement('div');
	const id = `fix-popup-${new Date().getTime()}`

	let html = `<div class="image-view-wrap"><img class="mui-media-object" src="${src}"></div>`

	if (deleteFunc) {
		html += `<div class="image-options"><a href="javascript:;" class="opt-btn" data-action="delete">删除</a></div>`
	}
  
  html += `<div class="popup-backdrop"></div>`
  
  // 设置id
	popup.setAttribute('id', id)
	popup.setAttribute('class', 'fix-popup')
  popup.innerHTML = html
	document.body.appendChild(popup)

	// 监听弹窗
	popup.addEventListener('tap', function(e) {
		const targetClass = e.target.getAttribute('class')
		// 如果不是操作元素
		if (targetClass.indexOf('opt-btn') === -1) {
			popup.parentNode.removeChild(popup);
		}
	})

	// 监听删除
	mui('.fix-popup').on('tap', '.opt-btn', function(e){
		e.stopPropagation();
		const action = this.getAttribute('data-action')
		switch(action) {
			case 'delete' : {
				mui.confirm('确认要删除图片？', '提示', ['是', '否'], function(e) {
					if (e.index == 0) {
						deleteFunc().then(()=>{
							popup.parentNode.removeChild(popup);	
						})
					} else {
						popup.parentNode.removeChild(popup);
					}
				})
			}; break;
		}
	})
}

export {
	getQuery,

	pageBack,
	goLogin,
	watchLocation,
	isLogin,
	callPhone,
	openMap,
	photo,
	imagePreview
}