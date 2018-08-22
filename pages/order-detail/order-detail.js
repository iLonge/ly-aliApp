var app = getApp();
Page({
  data: {
    orderId: '',
    orderDetails: '',
    orederCode: '865874513',
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
      let orderDetails = orderData.orderDetails.join(',');
      console.log(orderDetails)
      selfObj.setData({
          orderData : orderData,
          algorithmProcess: algorithmProcess,
          orderDetails: orderDetails
      });
      console.log(res)
    }
  },

  onReady() {
    let param = {
          id: "H9326808150002"
        };
    // 获取热门品牌
    app.request.requestGetApi(app.apiUrl1 + 'minbox_orders/show', param, this, this.successFun);
  }
});
 