const app = getApp(); 
const utils = require('../../utils/utils.js');
let orderId = '';
Page({
  data: {
    tabs: [
      {
        title: '待处理',
      },
      {
        title: '已结束',
      }
    ],
    tabBarUnderlineColor: '#18AF78', // 选中选项卡下划线颜色
    tabBarActiveTextColor: '#18AF78', // 选中选项卡字体颜色
    activeTab: 0,
    orderList: [],
    newList: []
  }, 
  getList() { // 获取订单列表
    let {alipayUserId} = my.getStorageSync({ key: 'alipay' }).data;
    let param = JSON.stringify({
      "pageSize": 20,
	    "pageIndex": 1,
      "aliUserId": alipayUserId,
      "state": 1
    });
    app.request.requestPostApi(app.apiUrl1 + 'minbox_orders/wechat_list', param, this, this.successFun);
  },
  cancleOrder(e) { // 取消订单
    let orderId = e.target.dataset.orderId;
    let state = e.target.dataset.state;
    let cancleParam = JSON.stringify({
      "orderId": orderId,
      "state": '10'
    });
  
    let that = this;
    my.confirm({
      title: '提示',
      content: '您是否想取消该订单？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if(result.confirm) {
          app.request.requestPostApi(
            app.apiUrl1 + 'minbox_orders/delete',
            cancleParam,
            this,
            function (res,obj) {
              if (res.status == "SUCCESS"){
                my.showToast({
                  type: 'success',
                  content: '操作成功',
                  duration: 1500,
                  success:() =>{
                    that.setData({
                      isCancle: res.result
                    })
                    that.onReady()
                  }
                });
              }
            },
            function (err,obj){
              my.showToast({
                type: 'fail',
                content: '操作失败',
                duration: 1500
              });
            }
          )
        }
      },
    });
  },
 
  goDetail(e){ // 查看详情
    const {id}=e.currentTarget.dataset
    my.navigateTo({
      url:`/pages/order-detail/order-detail?orderId=${id}`
    })
  },
  onReady() {
    my.showLoading({
      content: '加载中...'
    });
    this.getList();
  },
  successFun(res, selfObj) {
    if(res.status == "SUCCESS") {
      let orderList = res.result.rows;
      let newList = [];
      let waitDeal = [];
      for(var i=0;i<orderList.length; i++){
        if(orderList[i].state == "9" || orderList[i].state == "10") {
          newList.push(orderList[i]);
        }else {
          waitDeal.push(orderList[i])
        }
      }
      
      if(selfObj.data.activeTab == "0") {
        my.hideLoading();
        selfObj.setData({
          orderList: selfObj.setData({orderList: waitDeal})
        });
      }else if (selfObj.data.activeTab == "1") {
        selfObj.setData({
          orderList: selfObj.setData({orderList: newList})
        });
      }
      
    }
  },
  handleTabClick({ index }) {
    this.getList();
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.getList();
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
  handleDeliverClick(e) {
    my.redirectTo({
      url:'../deliver/deliver?order='+e.target.dataset.id
    })
  },
  handleSend: utils.throttle(function (e) { // 发货前判断订单状态
    orderId = e.target.dataset.orderId;
    let isExpressNo = {
          orderId: orderId
        };
    this.setData({
      orderId: orderId
    });
    app.request.requestGetApi(
      "http://wxtest.epbox.cn/recycling/express/ajax-check-pickup",
      isExpressNo,
      this,
      function (res,obj) {
        if(res.status == "SUCCESS") {
          let isPass = res.result; // 1.判断是否上门取件
          if(isPass) {
            my.navigateTo({
              url:`/pages/deliver/deliver?orderId=${obj.data.orderId}`
            })
          }else{
            obj.aliOrderConfirm();
          }
        }
      },
      function (err,obj){
        console.log(err)
      }
    )

  },1000),
  aliOrderConfirm() { // 2.查询支付宝小程序订单信息，没有则重新信用评估
    let OrderParam = JSON.stringify({
        orderId: this.data.orderId
    })
    app.request.requestPostApi(
      app.apiUrl1 + 'alipay_applet/alipay_order_by_order',
      OrderParam,
      this,
      function (res,obj) {
        console.log(JSON.stringify(res))
        if(res.status == "FAIL") {
          my.navigateTo({
            url:`/pages/assess-result/assess-result?orderId=${obj.data.orderId}`
          });
        }else{
          let {zmOrderNo, creditAmount, evalPrice} = res.result[0];
          obj.setData({
            zmOrderNo:  zmOrderNo,
            creditAmount: creditAmount,
            amount: evalPrice
          });
          obj.aliOrderStatus();
        }
      },
      function (err,obj){
        console.log(err)
      }
    )
  },
  aliOrderStatus() { // 3.支付宝小程序是否下单成功
    let OrderParam = JSON.stringify({
        orderId: this.data.orderId
    })
    app.request.requestPostApi(
      app.apiUrl1 + 'ali_order_expresses/ali_is_success_credit_order',
      OrderParam,
      this,
      function (res,obj) {
        if(res.status == "FAIL") {
          my.navigateTo({
            url:`/pages/submit-order-detail/submit-order-detail? outOrderNo=${obj.data.orderId}&zmOrderNo=${obj.data.zmOrderNo}&creditAmount=${obj.data.creditAmount}&amount=${obj.data.amount}`})
        }else{
          my.navigateTo({
            url:`/pages/submit-order/submit-order?outOrderNo=${obj.data.orderId}`
          })
        }
      },
      function (err,obj){
        console.log(err)
      }
    )
  }
});