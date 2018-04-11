import mui from '../../helpers/middleware';
import { pageBack } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import './recieve.less';


const task = {
	switchTab: () => {
		mui('#mui-bar-tab').on('tap','.mui-tab-item', function(){
			document.getElementById("nav-title").innerHTML = this.querySelector('.mui-tab-label').innerHTML;
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

	// 监听 tabs 切换
	task.switchTab()

});


// 退出
pageBack(mui);