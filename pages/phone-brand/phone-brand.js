var app = getApp(); 
Page({
  data: {
    tabs: [],
    tabBarlineColor: "#18AF78",
    tabBarActiveTextColor: "#18AF78",
    userPhone: '',
    networkType: ''
  },
  getSystemInfoPage() {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          userPhone: res.brand + res.model 
        })
      }
    })
  },
  successFun(res, selfObj) {
     if(res.status == "SUCCESS") {
      let brands = res.result.rows;
      console.log(brands)
      selfObj.setData({
          tabs : brands,
      });
     }
  },
  onShow(){
    this.getSystemInfoPage();
  },
  onReady() {
    let brandOpts = JSON.stringify({
          pageSize : 10,
          pageIndex : 1
        });
    // 获取热门品牌
    app.request.requestPostApi(app.apiUrl + 'brands/list', brandOpts, this, this.successFun);
  }
});
