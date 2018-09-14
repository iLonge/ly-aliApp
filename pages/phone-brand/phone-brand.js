// 型号选择

var app = getApp(); 
Page({
  data: {
    tabs: [],
    tabBarlineColor: "#18AF78",
    tabBarActiveTextColor: "#18AF78",
    userPhone: '',
    networkType: '',
    leftHeight:0,//左侧高度
    screenHeight:0,//屏幕高度
    current:0, //选中项目
    cuerrentBrand:0,//选中品牌

    // 左部选中状态
    tabBarActiveTextColor: '#000000',
    tabBarInactiveTextColor: '#7c7c7c',
    tabBarActiveBgColor: '#ffffff',
    tabBarInactiveBgColor: '#EFEFEF',
    tabBarlineColor: '#18b078',

    // 右部型号
    modal:null,
  },

  //跳转搜索
  search(){
    my.navigateTo({
      url:'/pages/search/search'
    })
  },

  // 评估手机
  assess(e){
    const {modalId,brandId,brandName,modalName}=e.target.dataset
    my.navigateTo({
      url:`/pages/assess/assess?modalId=${modalId}&brandId=${brandId}&brandName=${brandName}&modalName=${modalName}`
    })
  },

  // 切换左部菜单
  brand(e){
    const {index,brandId}=e.currentTarget.dataset
    this.setData({current:index,cuerrentBrand:null},()=>{
      this.getModal(brandId) //获取型号
    })
  },

  // 获取型号
  getModal(brandId){
    let brandData = JSON.stringify({
          brandId:brandId,
          pageSize:1000,
          pageIndex:1
        });
        
    //获取型号
    my.showLoading({content: '加载型号...',delay:0,success:()=>{
        // 防止hideLoading 无效
        setTimeout(()=>{
          my.hideLoading();
        },3000)
      }
    });
    app.request.requestPostApi(app.apiUrl + 'models/model_list', brandData, this,(data,that)=>{
      my.hideLoading();
      that.setData({modal:data.result.rows})
    });
    
  },


  // 获取系统信息
  getSystemInfoPage() {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          userPhone: res.brand + res.model,
          screenHeight:res.screenHeight
        })
      }
    })
  },

  // 获取成功
  successFun(res, selfObj) {
     if(res.status == "SUCCESS") {
      let brands = res.result.rows;
      selfObj.setData({tabs : brands},()=>{
        const {cuerrentBrand}=selfObj.data
        if(cuerrentBrand==="null"){
          // 初始化数据
          let brandData = JSON.stringify({
              brandId:brands[0]["id"],
              pageSize:1000,
              pageIndex:1
            });

          //loading
          my.showLoading({content: '加载型号...',delay:0,success:()=>{
              // 防止hideLoading 无效
              setTimeout(()=>{
                my.hideLoading();
              },3000)
            }
          });
          // 请求型号
          app.request.requestPostApi(app.apiUrl + 'models/model_list', brandData, this,(data,that)=>{
            my.hideLoading();
            selfObj.setData({modal:data.result.rows,current:0})
          });
        }
      });
     }
  },
  // 页面加载
  onLoad(query){
    this.setData({current:null,cuerrentBrand:query.id})
    if(query.id!=="null"){
      this.getModal(query.id) //获取型号
    }
  },
  // 页面展示
  onShow(){},
  // 加载完成
  onReady(){
    const that=this
    let brandOpts = JSON.stringify({
          pageSize : 100,
          pageIndex : 1
        });
    // 获取热门品牌
    app.request.requestPostApi(app.apiUrl + 'brands/list', brandOpts, this, this.successFun);
    this.getSystemInfoPage();
  }
});
