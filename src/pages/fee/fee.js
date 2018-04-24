import mui from '../../helpers/middleware';
import { pageBack } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/fee';
import './fee.less';

const DETAIL_URL = 'orderDetail.html'
const FEEDETAIL_URL = 'feeDetail.html'

const template = require('../../libs/art.template');

const task = {
	listenSearch: () => {
		document.getElementById("search_btn").addEventListener("tap",function(){
	  	let value = document.getElementById("search_input").value
	  	console.log(value)
		});
	},
	listenForward: () => {
		mui('#fee-mui-scroll').on('tap', '.orderRow', function(){
			const id = this.getAttribute('data-id')
			mui.openWindow({
		    url:`${DETAIL_URL}?order_id=${id}`,
		    id: DETAIL_URL,
		    extras:{
	        order_id:id
		    }
			});
		})
	},
	
	listenFee: () => {
		mui('#fee-mui-scroll').on('tap', '.feeRow', function(){
			const id = this.getAttribute('data-id')
			const OrderStatus = this.getAttribute('data-OrderStatus')
			mui.openWindow({
		    url:`${FEEDETAIL_URL}?order_id=${id}`,
		    id: FEEDETAIL_URL,
		    extras:{
	        order_id:id
		    }
			});
		})
	},

	fetchFee:(value) => {
		app.fee.checkSheet({
			orderNo:value 
		}).then(json => {
			console.log(json)
			//费用总金额
			let total = 0;
			json.data.forEach(data => {
				total += +data.Amount
			})
			const html = template('fee-template', {
				data: json.data
			});
			document.getElementById('fee-mui-scroll').innerHTML = html;
			document.getElementById('total').innerHTML =  Number(total).formatMoney()
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

	task.fetchFee()

	task.listenForward()

	task.listenFee()

	task.listenSearch();
});


// 退出
pageBack(mui);