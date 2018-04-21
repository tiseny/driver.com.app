import mui from '../../helpers/middleware';
import { getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/feeDetail';
import './feeDetail.less';

const template = require('../../libs/art.template')


const task = {
	//获取费用数据
	fetchFeeDetail:() => {
		app.fee.fetchFee({
			id: getQuery(mui,'order_id')
		}).then(json => {
			//费用总金额
			let total = 0;
			json.data.forEach(item => {
				total += +item.Amount
			})
			const html = template('fee-template', {
				list: json.data,
				total: Number(total).formatMoney(),
				OrderStatus: getQuery(mui,'OrderStatus')
			});		
			document.getElementById('fee-mui-scroll').innerHTML = html;
		})
	}	
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: false
});


// 调用h5 plus的事件系统
mui._ready(function() {

	task.fetchFeeDetail()
	
});

