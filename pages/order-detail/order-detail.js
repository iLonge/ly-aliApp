var app = getApp();
Page({
  data: {
    orderData: '',
    orderId: '',
    orderDetails: '',
    copy: '',
  },
  handlePaste(e) {
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
  successFun(res, selfObj) {
    if(res.status == "SUCCESS") {
      let orderData = res.result;   
      let algorithmProcess = orderData.algorithmProcess.replace(/<[^<>]*>/gi,'');
      //let orderDetails = orderData.orderDetails.join(',');

      let orderDetails = orderData.orderDetails;
      let optString = '';
      orderDetails.map((item) => {
        optString += item.questionName+':'+item.rightOptionName + ';';
      })
      selfObj.setData({
          orderId: orderData.orderInfo.id,
          orderData : orderData,
          algorithmProcess: optString,
          orderDetails: orderDetails
      });
    }
  },

  onReady() {
    let param = {
          id: "H9326808220001"
        };
    // 获取热门品牌
    app.request.requestGetApi(app.apiUrl1 + 'minbox_orders/show', param, this, this.successFun);
  }
});
 