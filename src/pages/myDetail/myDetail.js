import mui from '../../helpers/middleware';
import { getQuery } from '../../helpers/util';
import { setState, getState } from '../../helpers/state';
import '../../redux/myDetail';
import './myDetail.less';

const template = require('../../libs/art.template');

const task = {

    //获取my页面传递的参数
    fetchDetail: () => {
        mui.os.plus && plus.nativeUI.showWaiting('加载中...')
        app.myDetail.fetchDetail({}).then(json => {
            mui.os.plus && plus.nativeUI.closeWaiting()
            const html = template('myDetail-template', {
                data: json.data,
                id: getQuery(mui, 'part_id'),
                title: decodeURI(getQuery(mui, 'part_title'))
            })
            document.getElementById('myDetail-mui').innerHTML = html
        })
    }
}
// ios 导航状态
mui.init({
    statusBarBackground: '#f7f7f7',
    swipeBack: true
});
// 调用h5 plus的事件系统
mui._ready(function () {

    task.fetchDetail()

})

