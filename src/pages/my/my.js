import mui from '../../helpers/middleware';
import { goLogin } from '../../helpers/util';
import '../../redux/my';
import './my.less'

const task =  {
	// 退出登录
	quit: () => {
		const $quitBtn = document.getElementById('quit')
		$quitBtn.addEventListener('tap', function(e) {
			mui(this).button('loading');
			app.my.quit().then(json => {
				mui(this).button('reset');
				if (json.result) {
					goLogin(mui)
				}
			})
		})
	}

}

// 调用h5 plus的事件系统
mui._ready(function() {

	task.quit()
	
});