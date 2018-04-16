import mui from '../../helpers/middleware';
import { pageBack } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/recieve';
import './recieve.less';

const template = require('../../libs/art.template');

const DETAIL_URL = 'orderDetail.html'

const task = {

	listenForward: () => {
		mui('#recieve-mui-scroll').on('tap', '.orderRow', function(){
			const id = this.getAttribute('data-id')
			mui.openWindow({
		    url:`${DETAIL_URL}?id=${id}`,
		    id:DETAIL_URL,
		    extras:{
	        id
		    }
			});
		})
	},

	// 获取 待解运单数据
	fetchRecieveList: () => {
		mui.os.plus && plus.nativeUI.showWaiting('加载中...');
		app.recieve.fetchRecieveList({
      orderNode: "RECEIVED"
		}).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();
			mui('#recieve-page').pullRefresh().endPulldownToRefresh();
			if (json.result) {
				document.getElementById('recieve-mui-scroll').innerHTML = template('recieve-template', {
					list: json.data
				});
			}
		})
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: false,
	pullRefresh : {
    container:"#recieve-page",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down : {
    	height:50,//可选,默认50.触发下拉刷新拖动距离,
      auto: true,//可选,默认false.首次加载自动下拉刷新一次
      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
      callback : task.fetchRecieveList //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }
  }
});


// 调用h5 plus的事件系统
mui._ready(function() {

	task.fetchRecieveList()

	task.listenForward()

});


// 退出
pageBack(mui);