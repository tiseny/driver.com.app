import mui from '../../helpers/middleware';
import { pageBack, getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/orderProcess';
import './orderProcess.less';

const template = require('../../libs/art.template');

const task = {
	// 获取 待解运单数据
	fetchDetail: () => {
		const title = decodeURI(getQuery(mui, 'action'))

		mui.os.plus && plus.nativeUI.showWaiting('加载中...');
		app.orderProcess.fetchDetail({
      orderId: getQuery(mui, 'order_id'),
      sectionName: "BORROW_CONTAINER"
		}).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();
			document.getElementById('orderProcess-page').innerHTML = template('orderProcess-template', {
				title,
				data: json.data,
				mode: getQuery(mui, 'mode')
			});
			// 初始化
			mui('.mui-input-row input').input(); 
		})
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: true,
});


// 调用h5 plus的事件系统
mui._ready(function() {

	task.fetchDetail()

});


// 退出
pageBack(mui);