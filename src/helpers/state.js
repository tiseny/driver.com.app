import config from '../config';
/**
 * 存储到localStorage 的数据
 * @param {string} name key
 * @param {string} data value
 */
function setState(name, data) {
	localStorage.setItem(`${config.state_prefix}_${name}`, data)
}

function getState(name) {
	return localStorage.getItem(`${config.state_prefix}_${name}`)
}

function clearState() {
	localStorage.clear()	
}

export {
	setState,
	getState,
	clearState
}
