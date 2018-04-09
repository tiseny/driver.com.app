import '../../redux/login';
import './index.less';
const mui = require('../../libs/mui.min.js');

const task = {
	login: function() {
		const $loginbtn = document.getElementById('login');
		const $account = document.getElementById('account');
		const $password = document.getElementById('password');

		$loginbtn.addEventListener('tap', function(e) {
			// 开启loading
			mui(this).button('loading');
			app.login({
				userCode: $account.value,
				password: $password.value
			}, json => {
				if (json.result) {
					// 跳转到主页面
					console.log('// 跳转到主页面')
					// 
					mui(this).button('reset');
				}
			})
		})
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7'
});

// 调用h5 plus的事件系统
mui.ready(function() {

	// 登录时间
	task.login()

	// 退出
	let backButtonPress = 0;
	mui.back = function(event) {
		backButtonPress++;
		if (backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
});