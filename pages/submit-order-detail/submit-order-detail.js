var app = getApp();
Page({
  data: {},
  makePhoneCall() {
    my.makePhoneCall({ number: '4008252250' });
  },
  submitOrder() {
    var that = this;
    // 下单接口
    my.zmRentTransition({      
      creditRentType: "creditRecycleSignContract",
      outOrderNo: that.data.orderId,   /** 外部订单号*/
      zmOrderNo: that.data.zmOrderNo,  /** 芝麻订单号*/
      success: (res) => {
         console.log(JSON.stringify(res))
        if(res.result.success){
          my.navigateTo({
            // 跳转订单下单结果页
            url: '../submit-order/submit-order?zmOrderNo='+that.data.zmOrderNo+'&outOrderNo='+that.data.orderId
          })
         
        }else{
          my.showToast({
            type: 'fail',
            content: '下单操作失败',
            duration: 2000
          });
        }
      }, 
      fail: (res) => {
        my.alert({ title: 'fail: ' + JSON.stringify(res)});
      }
    });
  },
  successFun(res, selfObj) {
    if(res.status == "SUCCESS") {
      let orderData = res.result;
      let algorithmProcess = orderData.algorithmProcess.replace(/<[^<>]*>/gi,'');
      let orderDetails = orderData.orderDetails;
      let optStrings = '';
      let secondAlgorithmProcess = orderData.secondAlgorithmProcess;
      orderDetails.map((item) => {
        optStrings += item.rightOptionName+',';
      });
      selfObj.setData({
        orderId: orderData.orderInfo.id,
        orderData: orderData,
        algorithmProcess: optStrings,
        orderDetails: orderDetails,
        secondAlgorithmProcess: secondAlgorithmProcess
      });
    }
    
  },
  onLoad(opt) {
    this.setData({
      orderId: opt.outOrderNo,
      zmOrderNo: opt.zmOrderNo,
      creditAmount: opt.creditAmount,
      amount: opt.amount,
      balance: parseFloat(opt.amount-opt.creditAmount).toFixed(2)
    })
  },
  onReady() {
    let param = {
          id: this.data.orderId
        };
    // 获取order详情
    app.request.requestGetApi(app.apiUrl1 + 'minbox_orders/show', param, this, this.successFun);
  },
});
