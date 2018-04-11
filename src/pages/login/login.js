import mui from '../../helpers/middleware';
import { pageBack } from '../../helpers/util';
import '../../redux/login';
import './login.less';

const FORWARD_URL = 'home.html';

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
			}).then(json => {
				mui(this).button('reset');
				if (json.result) {
					mui.openWindow({
					  url: FORWARD_URL,
					  id: FORWARD_URL,
					  preload: true,
						show: {
							aniShow: 'pop-in'
						},
						styles: {
							popGesture: 'hide'
						},
						waiting: {
							autoShow: false
						}
					});
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
mui._ready(function() {

	// 登录时间
	task.login()

});


pageBack(mui);
