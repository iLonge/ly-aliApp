// 搜索页面
var app = getApp(); 

Page({
  data: {
    data:[],//搜索结果
    rowsState:true,//列表状态
  },
  onLoad(query){
    // 页面加载
  },

  // 用户输入重置状态
  onInput(){
    this.setData({data:[],rowsState:true})
  },

    // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },

  // 用户搜索
  search(query){
    const {value}=query.detail
    // 搜索机型
    this.searchfun(value)
  },

  // 跳转评估价格 
  assessPhone(item){
    const {id,brandId,brandName,name}=item.target.dataset.phone
    my.navigateTo({
      url:`/pages/assess/assess?modalId=${id}&brandId=${brandId}&brandName=${brandName}&modalName=${name}`
    })
  },

  //搜索
  searchfun(value){
    let searchDate = JSON.stringify({q:value});
    //获取型号
    my.showLoading({content: '加载中...',delay:0,success:()=>{
        // 防止hideLoading 无效
        setTimeout(()=>{
          my.hideLoading();
        },3000)
      }
    });
    app.request.requestPostApi(app.apiUrl + 'api/basic/base/hint', searchDate, this,(data,that)=>{
      my.hideLoading();
      if(data.status=="SUCCESS"){
         if(data.result.total>0){
           that.setData({data:data.result.rows,rowsState:true})
         }else{
          that.setData({rowsState:false})
         }
      }else{
        my.showToast({
          type: 'fail',
          content: data.message,
          duration: 3000,
        })
      }
       
    });
  },


  onReady() {
    // 页面加载完成




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