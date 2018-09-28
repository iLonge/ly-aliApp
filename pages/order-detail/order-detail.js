const utils = require('../../utils/utils.js')
var app = getApp();
Page({
  data: {
    orderData: '',
    orderId: '',
    orderDetails: '',
    copy: '',
    secondAlgorithmProcess: '', // 后台二次验机（质检详情）
    isReturn: false
  },
    // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
  handlePaste(e) { // 复制
    let that = this;
    my.setClipboard({
      text: e.currentTarget.dataset.text,
      success: function (res) {
        my.showToast({
          type: 'success',
          content: '复制成功',
          duration: 1500
        });
      }
    })
  },
  handleReturnAddress() {
    my.navigateTo({
      url: '../../pages/return-address/return-address?orderId=' + this.data.orderId
    })
  },
  HandleReject() {  // 取消回收
    // let rejectParam = JSON.stringify({
    //       orderId: this.data.orderId,
    //       customer: "客户姓名(收件人）", 
    //       phoneNo: "客户手机号（收件人电话）", 
    //       address: "客户地址（收件人地址）" 
    //     });
    // app.request.requestPostApi(
    //   app.apiUrl1 + "reviewUser/agree",
    //   rejectParam,
    //   this,
    //   function (res,obj) {
    //     if(res.status == "FAIL") {
    //       my.showToast({
    //         type: 'fail',
    //         content: res.message,
    //         duration: 1500
    //       });
    //     }else{
    //       my.showToast({
    //         type: 'success',
    //         content: '取消成功',
    //         duration: 1500,
    //         success: () => {
    //           my.navigateBack(-1);
    //         },
    //       });
    //      }
    //   },
    //   function (err,obj){
    //     console.log(err)
    //   }
    // )
      my.redirectTo({
        url: '/pages/return-address/return-address?orderId=' + this.data.orderId
      })
  },
  HandleAgree() {
    my.showLoading({
      content: '请稍等...',
    });
    let agreeParam = JSON.stringify({
          orderId: this.data.orderId,
          resource: 13,
        });
    app.request.requestPostApi(
      app.apiUrl1 + "reviewUser/agree",
      agreeParam,
      this,
      function (res,obj) {
        if(res.status == "FAIL") {
          my.showToast({
            type: 'fail',
            content: '操作失败',
            duration: 2000
          });
        } else {
         my.alert({
            title: '亲',
            content: '您的订单回收成功!',
            buttonText: '我知道了',
            success: () => {
                my.switchTab({
                  url: '/pages/order-center/order-center'
                })
            },
          });
        }
        my.hideLoading();
      },
      function (err,obj){
        console.log(err)
      }
    )
  },
  handleSend: utils.throttle(function () { // 发货前判断订单状态
    let isExpressNo = {
          orderId: this.data.orderId
        };
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
         if(res.status == "FAIL") {
          my.navigateTo({
            url:`/pages/assess-result/assess-result?orderId=${obj.data.orderId}`
          });
        }else if(res.status == "SUCCESS"){
          if(res.result[0].riskPass == "true") {
             let {zmOrderNo, creditAmount, evalPrice} = res.result[0];
             console.log()
            obj.setData({
              zmOrderNo:  zmOrderNo,
              creditAmount: creditAmount,
              amount: evalPrice
            });
            obj.aliOrderStatus();
          } else{
            my.navigateTo({
              url:`/pages/assess-result/assess-result?orderId=${obj.data.orderId}`
            });
          }
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
            url:`/pages/submit-order-detail/submit-order-detail?outOrderNo=${obj.data.orderId}&zmOrderNo=${obj.data.zmOrderNo}&creditAmount=${obj.data.creditAmount}&amount=${obj.data.amount}`
          })
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
  },
  successFun(res, selfObj) {
    if(res.status == "SUCCESS") {
      let orderData = res.result;
      let algorithmProcess = orderData.algorithmProcess.replace(/<[^<>]*>/gi,'');
      let orderDetails = orderData.orderDetails;
      let optStrings = '';
      let secondAlgorithmProcess = orderData.secondAlgorithmProcess;
      orderDetails.map((item) => {
        optStrings += item.questionName + ':' +item.rightOptionName + ';';
      });
      let OrderParam = JSON.stringify({
          orderId: selfObj.data.orderId
      })
      app.request.requestPostApi(
        app.apiUrl1 + 'cusomer_info/list',
        OrderParam,
        this,
        function (res,obj) {
          if(res.status == "SUCCESS") {
            if(orderData.orderInfo.state == 11 && res.result[0] ==null) {
              selfObj.setData({
                isReturn: true
              });
            }
          }
        },
        function (err,obj){
          console.log(err)
        }
      )
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
      orderId: opt.orderId
    })
  },
  onShow() {
    let param = {
          id: this.data.orderId
        };
    // 获取order详情
    app.request.requestGetApi(app.apiUrl1 + 'minbox_orders/show', param, this, this.successFun);
  }
});
 