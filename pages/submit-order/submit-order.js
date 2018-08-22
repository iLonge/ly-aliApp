Page({
  data: {
    array: ['请选择快递公司','顺丰物流', '京东到家', '中通快运'],
    index: 0,
    dates: '2016-11-08',
    times: '12:00'
  },
  bindPickerChange(e) {
    alert('picker发送选择改变，携带值为', e.detail.value);
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
});
