import { AreaPicker } from "../../components/areaSelector/selector.js"

var app = getApp();
var param = {};
Page(Object.assign({}, AreaPicker,{
  data: {
    expressArr: [],
    index: 0,
    name: '',
    mobile: '',
    dates: '2018-08-29',
    times: '12:00',
    province: "",//省 {id,name}
    city: "",//市
    district: "",//县 区
    //street: null,//村 街道 
  },
    // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
  onAreaCommit(locationList) {//当用户更换地区
    this.setData({
      province: locationList[0] || {},
      city: locationList[1] || {},
      district: locationList[2] || {},
      //street: locationList[3] || {},
    });
  },
  handleSubmit(e) {
    let {contact,tel,detailAddress} = e.detail.value;
    let province = this.data.province.name;
    let city = this.data.city.name;
    let district = this.data.district.name;
    let that = this;
    let submitParam = JSON.stringify({
          orderId: this.data.orderId,
          customer: contact,
          phoneNo: tel,
          address: province + city + district + detailAddress,
        });
    if(contact !="" && tel !="" && detailAddress != "" && district) {
      app.request.requestPostApi(
        app.apiUrl1 + "cusomer_info/create",
        submitParam,
        this,
        function (res,obj) {
          if (res.status == "SUCCESS"){
            my.alert({
              title:"提交成功",
              content: "您的回寄信息已提交成功",
              success(result){
                my.navigateTo({
                  url: '../../pages/order-center/order-center'
                });
              }
            });
          }else { 
            my.alert({
              title:"提交失败",
              content: "请检查订单或快递信息后重试"
            });
          }
        },
        function (err,obj){
          if (err) {
            my.alert({
              title:"提交失败",
              content: "请检查网络稍后重试"
            });
          }
        }
      )
    }else {
      my.alert({
        title:"提交失败",
        content: "请完善提交信息"
      });
    }
  },
  successFun(res, selfObj) {
    if(res.status == "SUCCESS") {
      let expressArr = [];
      let rows = res.result.rows;
      rows.map((item) => {
        expressArr.push(item.expressCompany);
      })
      selfObj.setData({
        expressArr : expressArr,
      });
    }
  },
  onLoad(opts) {
    var that = this;
    this.setData({
      orderId: opts.orderId
    });
  },
  onReady() {
    // 获取快递公司列表
    let expressParam = JSON.stringify({pageIndex:1,pageSize:100});
    app.request.requestPostApi(app.apiUrl1 + 'min_expresses/min_expresses', expressParam, this, this.successFun);
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },
}));