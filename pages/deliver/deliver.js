var app = getApp();
Page({
  data: {
  },
   // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
  onLoad(query) {
    this.setData({
      orderId: query.orderId
    })
    this.queryExpress();
  },
  queryExpress() { // 获取物流公司
    var expressParam = JSON.stringify({pageIndex:1,pageSize:100});
    app.request.requestPostApi(
      app.apiUrl1 + 'min_expresses/min_expresses',
      expressParam,
      this,
      function (res,obj){
        if (res.status == "SUCCESS") {
          // let express = res.result.rows.map((item,index)=>{
          //   return {companyId:item.companyId,expressCompany:item.expressCompany,id:item.id}
          // })
           let express = {
                  companyId:res.result.rows[0].companyId,
                  expressCompany:res.result.rows[0].expressCompany,
                  id:res.result.rows[0].id
                }
          obj.setData({
            express: [express]
          })
        }        
      },
      function (err,obj){
        if (err) {
          console.log(err,"err");
          my.alert({
            title:"快递列表加载失败",
            content: "请检查网络稍后尝试",
          });
        }
      },
    )
  },
  handlePickChange(e){
    if (!this.data.express){
      this.queryExpress();
    }else{
      this.setData({
        index: e.detail.value
      })
    }
  },
  handleSubmit(e){ 
    let {expressCompany,expressNo,expressPickIndex} = e.detail.value;
    // 下单物流信息核对php
    let isExpressNo = {
      orderId: this.data.orderId,
      mailNo: expressNo,
      expressCompany: this.data.express[expressPickIndex].id
    };

    app.request.requestGetApi(
      "http://wxtest.epbox.cn/recycling/express/ajax-check-pickup",
      isExpressNo,
      this,
      function (res,obj) {
        if(!res.result) {
          my.alert({
            title:"提交失败",
            content: "快递单号不正确",
          });
        }else{
          // 创建物流
          let expressParam = JSON.stringify({
                orders: [obj.data.orderId],
                expressNo: expressNo,
                companyId: obj.data.express[expressPickIndex].id,
                expressCompany: expressCompany,
                state: 1
              })
              console.log(expressParam)
          if( expressCompany && expressNo && expressPickIndex.toString() ){
            app.request.requestPostApi(
              app.apiUrl1 + "ali_order_expresses/create",
              expressParam,
              obj,
              function (res,obj) {
                if (res.status == 'SUCCESS'){
                  my.showToast({
                    type: 'success',
                    content: '提交成功',
                    duration: 1500,
                    success: () => {
                      my.switchTab({
                        url: '/pages/order-center/order-center'
                      })
                      console.log(1)
                    },
                  });
                }else {
                  my.alert({
                    title:"提交失败",
                    content: "请检查订单或快递信息后重试",
                  });
                }
              },
              function (err,obj){
                console.log(err)
                if (err) {
                  my.alert({
                    title:"提交失败",
                    content: "请检查网络稍后重试",
                  });
                }
              }
            )
          }else {
            my.alert({
              title:"提交失败",
              content: "请填入参数",
            });
          }
        }
      },
      function (err,obj){
        console.log(err)
      }
    )
  }
});