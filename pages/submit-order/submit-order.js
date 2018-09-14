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
          orderId: this.data.outOrderNo,
          contact: contact,
          tel: tel,
          address: detailAddress,
          province: province,
          city: city,
          county: district,
          remark: ''
        });
    if(contact !="" && tel !="" && detailAddress != "" && district) {
      // 下单
      app.request.requestPostApi(
        "http://wxtest.epbox.cn/shop/NewSf/order",
        submitParam,
        this,
        function (res,obj) {
          console.log(JSON.stringify(res))
          if (res.status == 200){
           my.navigateTo({url:'../submit-status/submit-status?orderId='+that.data.outOrderNo});
          }else { 
            my.alert({
              title:"提交失败",
              content: "请检查订单或快递信息后重试",
            });
          }
        },
        function (err,obj){
          console.log(JSON.stringify(res))
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
        content: "请完善提交信息",
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
      name: opts.name,
      mobile: opts.mobile,
      outOrderNo: opts.outOrderNo
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
   //  点击时间组件确定事件  
  bindTimeChange(e) {
    this.setData({
      times: e.detail.value
    })
  }, 
  //  点击日期组件确定事件  
  bindDateChange(e) {
    this.setData({
      dates: e.detail.value
    })
  }
}));