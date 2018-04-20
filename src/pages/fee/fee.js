import mui from '../../helpers/middleware';
import { pageBack } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/fee';
import './fee.less';


const task = {
	fetchFee:() => {
		app.checkSheet.checkSheet({

		}).then(json => {
			console.log(json)
			const html = template('orderDetail-template', {data: json.data});
			document.getElementById('orderDetail-mui-scroll').innerHTML = html;
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

});


// 退出
pageBack(mui);