
export default {
	state_prefix: '$app::',  																		// localStorage 数据缓存前缀
	url: 'http://api2.wlwulian.com',  													// 接口处理
	apiList: {
  	login: '/api/Passport', 																	// 登陆
    trailer: '/api/Trailer', 																	// 司机
    order: '/api/Order', 																			// 运单
    orderContainer: '/api/OrderContainer',  									// 保存订单流程
    orderContainerImage: '/api/OrderContainerImage', 					// 图片上传地址
    orderHistory: '/api/OrderHistory', 												// 历史运单
    evaluate: '/api/DriverEvaluate', 													// 评价
    feeCategory: '/api/CostItem', 														// 费用种类
    fee: '/api/OrderCost', 																		// 费用录入
    checkSheet: '/api/DriverCheckSheet' 											// 对账单
	}
}