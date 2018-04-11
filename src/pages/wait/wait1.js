import mui from '../../helpers/middleware';
import { pageBack } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import './wait.less';

mui.init({
	swipeBack: false
});

var mainWebView; //当前主webview
var navtitle;
var curTabItem; //当前被选中tabitem
var barItemUrl = ['baritemHtml/home.html', 'baritemHtml/category.html', 'baritemHtml/xinyuandan.html', 'baritemHtml/cart.html', 'baritemHtml/mine.html'];
var barItemWebView = {}; //每个tabitem所对应显示的页面对象
 //父子模版页面
var headerWebView;
var contentWebView;
//商品详情的父子模版
var detailTem;
var detailsub;

mui._ready(function() {
	//改变statusbar
	navtitle = document.getElementById('nav-title');
	mainWebView = plus.webview.currentWebview();
	//判断是否已经登陆,若没有登陆将预加载登陆页面，知道登陆成功为止close登陆页面
	judgelogin();
	//初始化商品详情页面。
	initProductDetail();
	//初始化页面,
	inittabitemWebviews();
	//为每个bar－item添加点击事件
	addEventForTabitem();
	//创建父子模版类
	initParentChildTemplate();
	//接收自定义的事件页面切换
	changeWebViewEvent();
	
	//判断是否已经获取session_key
	if (!localStorage.getItem('session_key')) {
		
	}else {
		closeStartScreent();
	}
});

//关闭启动页面
function closeStartScreent(){
	//创建父子模版完成后关闭启动页面
	plus.navigator.closeSplashscreen();
}

//判断是否已经登陆
function judgelogin(){
//			//测试语句
//			localStorage.removeItem('user');
	//判断是否已经登录成功//localstorage在页面关闭的时候也同样存在，sessionstorage页面关闭数据不存在
	if (!localStorage.getItem('user')) {
		mui.preload({
			url:'Mine/login.html',
			id:'Mine/login.html',
			styles:{
				top:'0px',
				bottom:'0px'
			}
		});
	}
}

function initProductDetail(){
	//独立的父子模版页面
	detailTem = mui.preload({
		url:'product-detail-tem.html',
		id:'product-detail-tem.html',
		styles:{
			top:'0px',
			bottom:'0px'
		}
	});
   detailsub = mui.preload({
		url:'',
		id:'Home/product-detail-needtem.html',
		styles:{
			top:'44px',
			bottom:'0px',
			bounce: 'vertical',
			bounceBackground:'#DCDCDC'
		}
	});
	detailsub.hide();
	detailTem.hide();
	detailsub.addEventListener('loaded',function(){
		detailsub.show();
	},false);
	detailTem.addEventListener('hide',function(){
		detailsub.hide();
	},false);
	detailTem.append(detailsub);
}

 //初始化每个tabitem所对应的页面
function inittabitemWebviews() {
	for (var i = 0; i < barItemUrl.length; i++) {
		barItemWebView[i] = mui.preload({
			url: barItemUrl[i],
			id: barItemUrl[i],
			styles: {
				top: '44px',
				bottom: '51px',
				left: '0px',
				bounce: 'vertical',
				bounceBackground: '#DCDCDC'
			},
			waiting: {
   				autoShow: false
   			}
		});
//				if (i != 0) {
			barItemWebView[i].hide();
//				}
		mainWebView.append(barItemWebView[i]);
	}
	
	barItemWebView[0].show();
}
//为每个tabitem添加监听
function addEventForTabitem() {
	mui('.mui-bar-tab').on('tap', '.mui-tab-item', function() {
		var tabitem = this;
		if (tabitem == curTabItem) {
			return;
		}
		curTabItem = tabitem;
		navtitle.innerText = tabitem.children[tabitem.children.length - 1].innerText;
		//设置将显示当前webview
		showCurWebView(tabitem.getAttribute('href'));
	});
}

//设置webview的切换显示的函数
function showCurWebView(href) {
	var index = 0;
	for (var i = 0; i < barItemUrl.length; i++) {
		if (href == barItemUrl[i]) {
			index = i;
		} else {
			barItemWebView[i].hide();
		}
	}
	barItemWebView[index].show();
}

//初始化父子模版函数
function initParentChildTemplate() {
	headerWebView = mui.preload({
		url: 'template-main.html',
		id: 'template-main.html',
		styles: {
			top:'0px',
			bottom:'0px'
		},
		extras: {
			mtype: 'main'
		}
	});
	contentWebView = mui.preload({
		url: '',
		id: 'template-sub.html',
		styles: {
			top: '44px',
			bottom: '0px',
			bounce: 'vertical',
			bounceBackground:'#DCDCDC'
		},
		extras: {
			mtype: 'sub'
		}
	});
	contentWebView.hide();
	headerWebView.hide();
	contentWebView.addEventListener('loaded', function() {
		contentWebView.show();
	}, false);
	headerWebView.addEventListener('hide', function() {
		//设置statusbar
//				plus.navigator.setStatusBarBackground('#41cea9');
		contentWebView.hide();
	}, false);
	headerWebView.addEventListener('show',function(){
		//设置statusbar
//				plus.navigator.setStatusBarBackground('#f7f7f7');
	});
	headerWebView.append(contentWebView);
}

//添加监听事件
function changeWebViewEvent() {
	window.addEventListener('newWebView', function(options) {

		var id = options.detail.id;
		var href = options.detail.href;
		var aniShow = options.detail.aniShow;
		var title = options.detail.title;
		//是否显示按钮
		var isBars = options.detail.isBars;
		var barsIcon = options.detail.barsIcon;
		var categoryID = options.detail.categoryID;
		
		//需要特殊处理的地方，比如说登陆页面模态，需要有时候被控制在内存中。
		if (id == 'Mine/login.html') {
			var loginWebView = plus.webview.getWebviewById(id);
			if (loginWebView) {
				loginWebView.show(aniShow);
			}else {
				//这个条件下面是为了适应当登录页面并没有初始化，或者初始化之后用户又已经登录了这个页面被删除之后再次登录
				loginWebView = mui.preload({
					url:'Mine/login.html',
					id:'Mine/login.html',
					styles:{
						top:'0px',
						bottom:'0px'
					}
				});
				loginWebView.addEventListener('loaded',function(){
					loginWebView.show(aniShow);
				},false);
			}
		}else if(id == 'Home/product-detail-needtem.html'){ 
			var productID = options.detail.product_id;
			mui.fire(detailTem,'detailTemplate',{
				id:id,
 					aniShow: aniShow,
 					target: href,
 					product_id:productID
			});
			
			if (mui.os.ios||(mui.os.android&&parseFloat(mui.os.version)<4.4)) {
				detailsub.loadURL(id);
				detailTem.show(aniShow);
			}
		}else if (~id.indexOf('.html')) {
			if (!~id.indexOf('needtem.html')) {
				mui.openWindow({
					url:href,
					id:id,
					styles:{
						popGesture:'close'
					},
					show:{
						aniShow:aniShow
					},
					waiting:{
						autoShow:false
					}
				});
			}else {
				//headerWebView.hide();如果在这里添加这个代码，会导致监听事件在下面contentwebview show之后又隐藏掉它
				contentWebView.hide();
				//像template-main传送事件让他更改标题
				mui.fire(headerWebView,'templateFire',{
					id:id,
					title: title,
   					aniShow: aniShow,
   					target: href,
   					isBars:isBars,
   					barsIcon:barsIcon,
   					categoryID:categoryID
				});
				
				//如果为展示category或者商品信息的页面，需要每次都重新加载，因为存在刷新页面信息的东西;
				//再次加载页面显示的也是之前加载的页面信息，所以这里，在这个页面返回的时候将里面的数据清空
				if(mui.os.ios||(mui.os.android&&parseFloat(mui.os.version)<4.4)){
					var str = contentWebView.getURL();
					var index = str.indexOf('www/');
					str = str.substring(index+4);
					if ((!~id.indexOf('category-detail') && !~id.indexOf('goods-detail') )&&(contentWebView.getURL() == href || str == href)) {
						console.log("loaded");
						contentWebView.show();
					}else {
						console.log("new load");
						contentWebView.loadURL(href);
					}
					headerWebView.show(aniShow,150);
				}
			}
		}
	}, false);
}

// 退出
pageBack(mui);