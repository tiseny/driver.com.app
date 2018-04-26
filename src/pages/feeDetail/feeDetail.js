import mui from '../../helpers/middleware';
import { getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/feeDetail';
import './feeDetail.less';

const template = require('../../libs/art.template')

//费用选择
const extraCategory = []
//费用录入费用列表
const add_feeList = []
//点击取消跳转到history
const HISTORY_URL = 'history.html'

const task = {
	//状态
	state: {
		hidden:0
	},
	//监听加一笔按钮显示复选框
	ListenerAddFee: () => {
		mui('#feeDetail-mui-scroll').on('tap', '#add_feeList', function(){
			
			task.state.hidden=1;
			console.log(task.state.hidden);
		})
	},

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
			const html = template('feeDetail-template', {
				list: json.data,
				total: Number(total).formatMoney(),
				OrderStatus: getQuery(mui,'OrderStatus'),
				hidden: task.state.hidden,
				extraCategory:extraCategory
			});		
			document.getElementById('feeDetail-mui-scroll').innerHTML = html;
		})
	},
	//获取费用种类数据
	fetchFeeCategory:() =>{
		app.feeDetail.feeCategory({

		}).then(json => {
			//获取的费用种类做处理=>过滤作用
			for(var i = 0;i<json.data.length;i++){
				if(json.data[i].Category == 3){
					feeList:json.data
					extraCategory.push(json.data[i])
				}
			}
			console.log(extraCategory)
			console.log(task.state.hidden)
		})
	},
	//监听取消按钮，点击实现跳转到history页面
	listenCencel: () => {
		mui('#feeDetail-mui-scroll').on('tap', '#from_cancel', function(){
			mui.openWindow({
		    url:`${HISTORY_URL}`
			});
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

	task.fetchFeeCategory()

	task.fetchFeeDetail()

	task.ListenerAddFee()

	task.listenCencel()
});

