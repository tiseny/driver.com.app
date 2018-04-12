import mui from '../../helpers/middleware';
import '../../redux/my';
import { clearState } from '../../helpers/state';
import './my.less'

const LOGIN_URL = 'login.html'

const task =  {

	// 退出登录
	quit: () => {
		const $quitBtn = document.getElementById('quit')
		$quitBtn.addEventListener('tap', function(e) {
			mui(this).button('loading');
			app.my.quit().then(json => {
				mui(this).button('reset');
				if (json.result) {
					// 清除 所有 localStorage
					clearState()
					// 
					mui._toast('退出成功！')
					mui.openWindow({
						url: LOGIN_URL,
					  id: LOGIN_URL,
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
					})
					// 关闭
				}
			})
		})
	}

}

// 调用h5 plus的事件系统
mui._ready(function() {

	task.quit()
	
});