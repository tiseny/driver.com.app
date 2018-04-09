const URL = 'https://api2.wlwulian.com'

export default {
	state_prefix: '$app::',  																					// localStorage 数据缓存前缀
	url: URL,  																                        // 接口处理
	apiList: {
  	login: URL + '/api/Passport', 																	// 登陆
    trailer: URL + '/api/Trailer', 																	// 司机
    order: URL + '/api/Order', 																			// 运单
    orderContainer: URL + '/api/OrderContainer',  									// 保存订单流程
    orderContainerImage: URL + '/api/OrderContainerImage', 					// 图片上传地址
    orderHistory: URL + '/api/OrderHistory', 												// 历史运单
    evaluate: URL + '/api/DriverEvaluate', 													// 评价
    feeCategory: URL + '/api/CostItem', 														// 费用种类
    fee: URL + '/api/OrderCost', 																		// 费用录入
    checkSheet: URL + '/api/DriverCheckSheet' 											// 对账单
	}
}