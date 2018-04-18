import mui from '../../helpers/middleware';
import { pageBack, getQuery, callPhone, openMap } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/orderDetail';
import './recieveOrderDetail.less';

const template = require('../../libs/art.template');

const ORDER_STATUS = {
	'提归确认': 21,
	'到场确认': 22,
	'离场确认': 23,
	'还柜确认': 24
}

const FORWARD_URL = 'orderProcess.html'

const task = {

	listenForward: () => {
		mui('#recieveOrderDetail-mui').on('tap', '.mui-media', function() {
			const action = this.getAttribute('data-action')
			const order_id = this.getAttribute('data-id')
			const isvalid = this.getAttribute('data-valid')
			const mode = this.getAttribute('data-mode')

			if (isvalid) {
				mui.openWindow({
			    url:`${FORWARD_URL}?order_id=${order_id}&action=${action}&mode=${mode}`,
			    id: FORWARD_URL,
			    extras:{
		        action,
		        order_id,
		        mode
			    }
				});
			}
		})
	},

	listenMobile: () => {
		mui('body').on('tap', '.sys-mobile', function() {
			const mobile = this.getAttribute('data-mobile')

			callPhone(mobile);
		})
	},

	listenAddress: () => {
		mui('body').on('tap', '.sys-address', function() {
			const address = this.getAttribute('data-address')

			openMap(address)
		})
	},

	// 获取 待解运单数据
	fetchDetail: () => {
		mui.os.plus && plus.nativeUI.showWaiting('加载中...');
		app.orderDetail.fetchDetail({
      id: getQuery(mui,'order_id')
		}).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();
			//mui('#orderDetail-page').pullRefresh().endPulldownToRefresh(); 
			const html = template('recieveOrderDetail-template', {
				data: json.data
			});
			document.getElementById('recieveOrderDetail-mui').innerHTML = html;
		})
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: true
});


// 调用h5 plus的事件系统
mui._ready(function() {

	task.fetchDetail()

	task.listenMobile()

	task.listenAddress()

	task.listenForward()

});


// 退出
pageBack(mui);