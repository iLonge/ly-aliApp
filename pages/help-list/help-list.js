// 搜索结果页
const app = getApp()
Page({
  data: {
    search:null,//搜索结果
  },
  // 页面加载
  onLoad(query) {
    const {keyword}=query
    const searchData=JSON.stringify({answer:keyword,state:"0"}) 
    my.showLoading({content: '加载中...'});
    app.request.requestPostApi(app.apiUrl1 + 'help_center/list', searchData, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        my.hideLoading();
        const {rows}=res.result
        that.setData({search:rows})
      }
    });
  },

  //查看详情
  goDetail(e){
    const {id}=e.target.dataset
    my.navigateTo({
      url:`/pages/help-detail/help-detail?id=${id}`
    })
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
  // 标题被点击
  onTitleClick() {
    
  },
  // 页面被下拉
  onPullDownRefresh() {
    
  },
  // 页面被拉到底部
  onReachBottom() {
    
  },
  // 返回自定义分享信息
  onShareAppMessage() {
   
  },
})