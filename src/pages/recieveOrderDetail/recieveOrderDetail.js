import mui from '../../helpers/middleware';
import { pageBack, getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/orderDetail';
import './recieveOrderDetail.less';

const template = require('../../libs/art.template');

const task = {
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
      id: getQuery(mui,'id')
		}).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();
			//mui('#orderDetail-page').pullRefresh().endPulldownToRefresh(); 
			const html = template('recieveOrderDetail-template', {data: json.data});
			document.getElementById('recieveOrderDetail-mui-scroll').innerHTML = html;
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

});


// 退出
pageBack(mui);