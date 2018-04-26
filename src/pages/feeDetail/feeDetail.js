import mui from '../../helpers/middleware';
import { getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/feeDetail';
import './feeDetail.less';

const template = require('../../libs/art.template')


//点击取消跳转到history
const HISTORY_URL = 'history.html'

const task = {
	//状态
	state: {
		hidden:0,
		list: [],
		total: 0,
		//存放经过处理后的费用种类
		extraCategory: [],
		//存放复选框选中的费用种类，存到数组里做页面input渲染
		add_feeList: []
	},

	render: () => {
		const html = template('feeDetail-template', {
			list: task.state.list,
			total: Number(task.state.total).formatMoney(),
			OrderStatus: getQuery(mui,'OrderStatus'),
			hidden: task.state.hidden,
			extraCategory: task.state.extraCategory,
			add_feeList: task.state.add_feeList
		});		
		document.getElementById('feeDetail-mui-scroll').innerHTML = html;
		document.getElementById('header').style = task.state.hidden === 0 ? 'display: block' : 'display: none';
		// document.getElementById('addFee_checkbox').style = task.state.add_feeList.length === 0 ? 'z-index:100' : 'z-index:1';
	},

	//监听加一笔按钮显示复选框
	ListenerAddFee: () => {
		mui('#feeDetail-mui-scroll').on('tap', '#add_feeList', function(){			
			task.state.hidden = 1;
			// console.log("abc")
			task.render();
		})
	},

	//获取费用数据
	fetchFeeDetail:() => {
		app.feeDetail.fetchFee({
			id: getQuery(mui,'order_id')
		}).then(json => {
			//费用总金额
			json.data.forEach(item => {
				task.state.total += +item.Amount
			})

			task.state.list = json.data

			task.render();
		})
	},
	//获取费用种类数据
	fetchFeeCategory:() =>{
		app.feeDetail.feeCategory({

		}).then(json => {
			task.state.extraCategory = []
			//获取的费用种类做处理=>过滤作用
			for(var i = 0;i<json.data.length;i++){
				if(json.data[i].Category == 3){
					feeList:json.data
					task.state.extraCategory.push(json.data[i])
				}
			}
			// console.log(task.state.extraCategory)
			// console.log(task.state.hidden)
		})
	},
	//监听取消按钮，点击实现跳转到history页面
	listenCencel: () => {
		mui('#feeDetail-mui-scroll').on('tap', '#from_cancel', function(){
			mui.openWindow({
		    url:`${HISTORY_URL}`
			});
		})
	},
	//监听选择费用种类确认按钮，实现已选值存入add_feeList数组中
	ListenerCheckbox: () => {
		mui('#feeDetail-mui-scroll').on('tap','#addFee_btn',function(){
			// console.log("123")
			let checkbox = document.getElementsByName('addFee_checkbox');
			for (var key in checkbox  ){
				if(checkbox[key].checked){
					// console.log(checkbox[key].value)
					task.state.add_feeList.push(checkbox[key].value)
				}
			}
			//选中的值已存进数组**测试**
			// console.log(task.state.add_feeList)
			// document.getElementById("addFee_checkbox").style.z-index = -1;
			task.render();
			task.state.hidden = 1;
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

	task.ListenerAddFee()

	task.listenCencel()

	task.fetchFeeDetail()

	task.ListenerCheckbox()
});

