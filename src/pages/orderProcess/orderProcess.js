import mui from '../../helpers/middleware';
import { pageBack, getQuery, imagePreview, photo } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/orderProcess';
import './orderProcess.less';

const template = require('../../libs/art.template');

const render = data => {
	document.getElementById('orderProcess-page').innerHTML = template('orderProcess-template', {
		data,
		title: decodeURI(getQuery(mui, 'action')),
		mode: getQuery(mui, 'mode')
	});
	// 初始化
	mui('.mui-input-row input').input(); 
}

const IMG_KEY = {
	// 提柜
	'柜后门':  'ORDER_CABINETREARDOOR',
	'封条': 'ORDER_SEALS',
	// 到场
	'工厂大门': 'ORDER_FACTORYGATE',
	// 离场
	'空柜': 'ORDER_BEFORESHIPMENT',
	'货装一半': 'ORDER_SHIPMENTING',
	'装好': 'ORDER_AFTERSHIPMENT',
	'封锁条': 'ORDER_LOCKSTRIP',
	// 还柜
	'过磅单': 'ORDER_WEIGHINGLIST',
	'还柜纸': 'ORDER_CABINETPAPER'
}

const task = {

	state: {
		pageData: {}
	},

	uploadImage: () => {
		mui('#orderProcess-page').on('tap', '.image-box-inner.plus', function() {
			const field = this.getAttribute('data-field');
			const index = this.getAttribute('data-index');
			const type = this.getAttribute('data-type');
			
			photo((path, base64) => {
				/*fetch.upaloadImage.call(this, {
		      orderId: getQuery(mui, 'order_id'),
		      businessKey: 
		    }, json => {
		      // 如果成功
		      if (json.result) {
		       
		      }
		    })*/
		    // 清空本地的图片路径
				task.state.pageData[field][index] = path
				render(task.state.pageData)
				//console.log(path, base64)
			})
		})
	},

	previewImage: () => {
		mui('#orderProcess-page').on('tap', '.image-box-inner.image', function() {
			const src = this.getAttribute('data-src');
			const mode = this.getAttribute('data-mode');
			const field = this.getAttribute('data-field');
			const index = this.getAttribute('data-index');

			if (src) {
				const deleteFunc = mode === 'add' ? () => {
					return new Promise((resolve,reject) => {
						// 清空本地的图片路径
						task.state.pageData[field][index] = ""
						render(task.state.pageData)

						resolve();
					})	
				} : null 
				imagePreview(mui, src, deleteFunc)
			}
		})
	},

	deleteImage: () => {
		mui('#orderProcess-page').on('tap', '.mui-input-row.camera .mui-icon-close', function() {
			const field = this.getAttribute('data-field');
			const index = this.getAttribute('data-index');

			mui.confirm('确认要删除图片？', '提示', ['是', '否'], function(e) {
				if (e.index == 0) {
					// 清空本地的图片路径
					task.state.pageData[field][index] = ""
					render(task.state.pageData)
				} 
			})
		})
	},

	// 获取 待解运单数据
	fetchDetail: () => {
		mui.os.plus && plus.nativeUI.showWaiting('加载中...');
		app.orderProcess.fetchDetail({
      orderId: getQuery(mui, 'order_id'),
      sectionName: "BORROW_CONTAINER"
		}).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();
			task.state.pageData = json.data
			// 数组默认为数组
			task.state.pageData.Attachs = task.state.pageData.Attachs || []
			render(task.state.pageData)
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

	task.previewImage()

	task.uploadImage()

	task.deleteImage();

});


// 退出
pageBack(mui);