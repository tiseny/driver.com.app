import mui from '../../helpers/middleware';
import { pageBack, getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/feeDetail';
import './feeDetail.less';

const template = require('../../libs/art.template')

//费用选择
hidden:false;
const extraCategory = []


const task = {
	//获取费用数据
	fetchFeeDetail:() => {
		app.feeDetail.fetchFee({
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
	},
	//获取费用种类数据
	fetchFeeCategory:() =>{
		app.feeDetail.feeCategory({

		}).then(json => {
			console.log(json)
			feeList:json.data
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

	task.fetchFeeCategory()

	
});


// 退出
pageBack(mui);
