var app = getApp();
var orderId;
var creditAmount;
var aliUserId =  app.globalData.alipayUserId;
var riskPass; // 风险评估是否通过
Page({
  data: {
    brandId: null,
    showBottom: false,
  },
  onButtomBtnTap(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      showBottom: true
    });
    let popupContentList;
    let popupTitle = '';
    let popupContent = '';
    if(type == '3') {
      // 根据 brandId 来判断安卓/苹果来显示popup内容
      if(this.data.brandId == 1) {
        popupContentList = [
          '1.苹果磁盘基于单个文件进行加密',
          '2.抹掉所有数据，等于抹掉所有文件',
          '3.此前FBI也遇到了破解iphone的难题',
          '作为普通用户，iphone的信息安全指的信赖。'
        ];
        popupTitle = "苹果安全小贴士";
        popupContent = '苹果手机只能恢复出厂设置，无须担心数据泄露风险，请当心，这是真的！美国FBI都破解不了。';
      }else {
        popupContentList = [
          '1.删除手机相关账号及密码',
          '2.恢复出厂重置手机。',
          '4.信息重复覆盖技术，个人隐私不担忧。',
          '通过电脑或者下载，存入一些无关紧要的文件或者视频，将硬盘空间占满，反复覆盖，数据恢复一般只能恢复最上层的数据，我们用一些无关紧要的内容把用户的个人信息覆盖，这样即便信息被恢复，也不会影响到个人隐私。'
        ];
        popupTitle = "安卓安全小贴士";
        popupContent = '壹站收为保障您安卓手机/平板内的隐私，不在快递途中、质检和交易过程中被泄露，我们粉碎您的隐私，更以严格的政策来管理所有数据的处理方式。';
      }
    }else if(type == '2'){
      popupContentList = [
        '所需条件',
        '1.芝麻分大于等于580',
        // '2.支付宝实名认证用户，需账户本人提交（如果审核不通过，您可以选择普通回收，最快3天到账！）',
        '预付款说明',
        '1.提交信用回收订单，立即收款！',
        '2.芝麻分750分以上，预付70%，最高上限2000元；',
        '3.芝麻分700-749分，预付70%，最高上限1500元；',
        '4.芝麻分650-699分，预付50%，最高上限700元；',
        '5.芝麻分580-649分，预付50%，最高上限200元；'
      ];
      popupTitle = '';
      popupContent = '';
    }else if(type == '1'){
      popupTitle = "估价说明";
      popupContentList = [
        '1.估价基于您自检选择的机器情况进行标准的评估报价，绝不压价。',
        '2.在收到您的机器后，质检工程师将根据机器实际情况给到您更加专业准确的回收价格！'
      ]
    }

    this.setData({
      popupTitle: popupTitle,
      popupContent: popupContent,
      popupContentList: popupContentList
    })
  },
  onPopupClose() {
    this.setData({
      showBottom: false
    });
  },
  // 信用回收
  creditRent() {
    var that = this;
    my.startZMCreditRent({
      creditRentType: "creditRecycleRiskEvaluate",
      category: "ZMSC_9_1_1", /** 保持不变 */
      itemId: "2018071101000222123453435660",
      outOrderNo: orderId,
      amount: that.data.evalPrice,/** 回收物品评估价值 */
      channel: "zm",
      success: (res) => {
        my.showLoading({
          content: '加载中...'
        });
        let isPass = res.result.success;
            riskPass = res.result.data.riskPass;
            creditAmount = res.result.data.creditAmount;
        // 1.支付宝小程序订单创建
        let createParam = JSON.stringify({
              "orderId": res.result.data.outOrderNo,
              "zmOrderNo": res.result.data.zmOrderNo, 
              "success":  isPass, 
              "creditAmount": creditAmount,      // (预估值必传) 
              "user_id": app.globalData.alipayUserId,              // (支付宝userId必传) 
              "riskPass": riskPass,              // (风险评估是否通过) 
              "zmRisk":"",                       // (N存在风险，不建议享受信用服务) 
              "zmFace":"",    // (N芝麻认证失败，可能是非本人操作，不建议享受信用服务) 
              "userName":"",  // (姓名) 
              "mobile":"",    // (联系电话) 
              "zmGrade":"",   // (较差、中等、良好、优秀、极好5个级别) 
              "remark":""     // (备注) 
            });
        app.request.requestPostApi(app.apiUrl1 + 'alipay_applet/create_alipay_small_order', createParam, this, (res) => {
          if(res.status == "SUCCESS") {
            my.hideLoading();
            that.setData({
              creditAmount: creditAmount,
            });
          }
        });

        if(res.result.success) {
          // 3.支付宝订单确认接口
          let confirmParam = JSON.stringify({
                "zmOrderNo": res.result.data.zmOrderNo,
                "orderId": res.result.data.outOrderNo  
              });
          app.request.requestPostApi(app.apiUrl1 + 'alipay_applet/order_info_confirm', confirmParam, this, (res) => {
            if(res.status == "SUCCESS") {
              console.log('支付宝订单确认')
            }
          });
          if(isPass && riskPass && creditAmount) {
            // 4.修改支付宝小程序订单信息接口
            let updateParam = JSON.stringify({
                  "id": res.result.data.outOrderNo, // (订单id) 
                  "prePayPrice": creditAmount      // (预付款值)
                });
            app.request.requestPostApi(app.apiUrl1 + 'orders/update_alipay_small_order', updateParam, this, (res) => {
              if(res.status == "SUCCESS") {
                // console.log('4.修改支付宝小程序订单信息接口SUCCESS')
              }
            },(err) => {console.log(err)});

            my.navigateTo({
              // 跳转至确定订单页
              url: '/pages/submit-order-detail/submit-order-detail?zmOrderNo='+res.result.data.zmOrderNo+'&outOrderNo='+res.result.data.outOrderNo+'&creditAmount='+res.result.data.creditAmount+'&amount='+that.data.evalPrice
            })
          } else {
            my.alert({
              title: '亲',
              content: '信用评估失败',
              buttonText: '我知道了'
            });
          }
        }else{
          my.showToast({
            type: 'fail',
            content: res.result.error.errorMsg,
            duration: 2500
          });
        }
      },
      fail: (res) => {
          console.log(JSON.stringify(res).error.errorMsg)
      }
    })
  },
  successFun(res, selfObj) {
    console.log(res)
    if(res.status == "SUCCESS") {
      let data = res.result;
      let orderData = res.result;
      let algorithmProcess = orderData.algorithmProcess.replace(/<[^<>]*>/gi,'');
      let orderDetails = orderData.orderDetails;
      let optStrings = '';
      let secondAlgorithmProcess = orderData.secondAlgorithmProcess;
      orderDetails.map((item) => {
        optStrings += item.questionName + ':' +item.rightOptionName + ';';
      });
      selfObj.setData({
        brandId: data.orderInfo.brandId,
        evalPrice: data.orderInfo.evalPrice,
        orderId: orderData.orderInfo.id,
        orderData: orderData,
        algorithmProcess: optStrings,
        orderDetails: orderDetails,
        secondAlgorithmProcess: secondAlgorithmProcess
      });
    }
  },
  onLoad(options) {
    orderId = options.orderId;
  },
  onReady() {
    let orderOpts = {
          id: orderId
        }; 
    // 订单信息
    app.request.requestGetApi(app.apiUrl1 + 'minbox_orders/show', orderOpts, this, this.successFun);

    if(this.data.brandId == 1) {
      var popupContent = '苹果手机只能恢复出厂设置，无须担心数据泄露风险，请当心，这是真的！美国FBI都破解不了。';
    }else {
      var popupContent = '壹站收为保障您安卓手机/平板内的隐私，不在快递途中、质检和交易过程中被泄露，我们粉碎您的隐私，更以严格的政策来管理所有数据的处理方式。';
    }
    this.setData({popupContent: popupContent})
  }
});
