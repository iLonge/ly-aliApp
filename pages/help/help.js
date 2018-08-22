//帮助中心

const app = getApp()

Page({
  data: {
    creditCard:null,// 信用回收
    express:null,// 快递回收
    machine:null,// 机器回收
    store:null,// 门店回收
    other:null,// 其他问题
  },
  // 查看详情
  viewDetail(){
    my.navigateTo({
      url:'/pages/help-detail/help-detail?id=1'
    })
  },
  // 页面加载
  onLoad(query){},
  // 页面加载完成
  onReady() {
    //获取分类
    const creditCard=JSON.stringify({qType:""}) //信用回收
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', creditCard, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        // that.setData({creditCard:})
      }
    });
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