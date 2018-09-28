// 帮助详情
const app = getApp()

Page({
  data: {
    info:null,//问题内容
  },
   // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
  // 页面加载
  onLoad(query) {
    const {id}=query
    const searchData=JSON.stringify({id:id})
    my.showLoading({content: '加载中...'});
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', searchData, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        my.hideLoading();
        const {rows}=res.result
        that.setData({
          info:{
            title:rows[0]["question"],
            content:rows[0]["answer"].replace(/<[^<>]*>/gi,'')
          }
        })
      }
    });
  },
  // 页面加载完成
  onReady() {
    
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
   // 返回自定义分享信息
  },

})
