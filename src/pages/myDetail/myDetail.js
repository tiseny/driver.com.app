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
        app.myDetail.fetchDetail({

        }).then(json => {
            mui.os.plus && plus.nativeUI.closeWaiting()
            //检查是否过期
            const checkData = () => {
                for (let i in json.data) {
                    // json数据存在且可转化成时间戳
                    if (!!json.data[i] && !isNaN(new Date(json.data[i].toString()).getTime())) {
                        let dateStr = json.data[i].toString().split(" ")[0]
                        json.data[i] = dateStr
                        const end_time = new Date(json.data[i].toString()).getTime()
                        const now_time = new Date().getTime()
                        const D_value = (end_time * 1) - (now_time * 1)
                        const days = D_value / 24 / 60 / 60 / 1000      //转换为天数
                        if (days >= 0 && days <= 30) {
                            json.data[i + '_end'] = '即将过期'
                        } else {
                            json.data[i + '_end'] = '已过期'
                        }
                    }
                }
            }
            checkData()
            const html = template('myDetail-template', {
                data: json.data,
                id: getQuery(mui, 'part_id'),
                title: decodeURI(getQuery(mui, 'part_title'))
            })
            document.getElementById('myDetail-mui').innerHTML = html
        }).catch(err => {
            console.log(err)
        })
    },

    // //获取评论
    fetchEvaluate: () => {
        app.myDetail.fetchEvaluate({

        }).then(json => {
            mui.os.plus && plus.nativeUI.closeWaiting()
            const html = template('myDetail-template', {
                data: json.data,
                id: getQuery(mui, 'part_id'),
                title: decodeURI(getQuery(mui, 'part_title'))
            })
            document.getElementById('evaluate-part').innerHTML = html
        }).catch(err => {
            console.log(err)
            console.log("评论接口未完成吗？")
        })
    },

    //密码修改
    changePass: () => {
        mui(".ui-page-myDetail").on('tap', '.mui-btn', function () {
            let check = true
            let param = []
            mui("#myDetail-mui input").each(function () {
                //若当前input为空，则提醒 
                if (!this.value || this.value.trim() == "") {
                    let label = this.previousElementSibling;
                    mui.toast(label.innerText + "不允许为空", { duration: 'long', type: 'div' });
                    check = false;
                    return false;
                }
                param.push(this.value.trim())
            });
            //新密码与确认密码是否相同
            if (check) {
                if (param[1] === param[2]) {
                    console.log(param)
                } else {
                    mui.toast('两次输入密码不一致', { duration: 'long', type: 'div' })
                }
            }

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

    // task.fetchEvaluate()

    task.changePass()

})

