//帮助中心

const app = getApp()

Page({
  data: {
    creditCard:null,// 信用回收
    express:null,// 快递回收
    machine:null,// 机器回收
    store:null,// 门店回收
    other:null,// 其他问题
    state:false,//是否加载完成
  },
  // 查看详情
  viewDetail(e){
    const {id}=e.target.dataset
    my.navigateTo({
      url:`/pages/help-detail/help-detail?id=${id}`
    })
  },
  // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
  // 搜索
  getSearch(e){
    const {value}=e.detail
    if(value==""){
       my.alert({
        title: '亲',
        content: '请输入关键字',
        buttonText: '我知道了',
      });
    }else{
      // 跳转到搜索结果页
      my.navigateTo({
        url:`/pages/help-list/help-list?keyword=${value}`
      })
    }
  },

  // 页面加载
  onLoad(query){
    my.showLoading({content: '加载中...'});
    //获取分类 信用回收
    const creditCard=JSON.stringify({qType:"1",state:"0"}) 
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', creditCard, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        const {rows}=res.result
        that.setData({creditCard:rows})
      }
    });
    //获取分类 快递回收
    const expressDate=JSON.stringify({qType:"2",state:"0"}) 
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', expressDate, this,(res,that)=>{
      
      if(res.status=="SUCCESS"){
        const {rows}=res.result
        that.setData({express:rows})
      }
    });

    //获取分类 机器回收
    const machineDate=JSON.stringify({qType:"3",state:"0"}) 
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', machineDate, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        const {rows}=res.result
        that.setData({machine:rows})
      }
    });

    //获取分类 其他问题
    const otherDate=JSON.stringify({qType:"4",state:"0"}) 
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', otherDate, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        my.hideLoading();
        const {rows}=res.result
        that.setData({other:rows,state:true})
      }
    });
  },
  // 页面加载完成
  onReady() {
    
  },
  // 页面显示 
  onShow() {
    
  },
  // 页面隐藏
  onHide() {
    
  },
  // 页面被关闭
  onUnload() {
    
  },


})