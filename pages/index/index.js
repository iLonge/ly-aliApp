import list  from '../../components/list';

const app = getApp();

Page({
  ...list,
  data: {
    imgList: ['../../images/banner1.png'],
    hotRecycle: [],
    advList: ['../../images/adv1.png'],
    hotBrands: [],
    hotPhones: [],
    listData: {
      onItemTap: 'handleListItemTap',
      data: [
        {
          title: '回收流程',
          arrow: 'horizontal',
          extra: '了解回收',
        },
      ],
    },
  },

  // 跳转搜索
  search(){
    my.navigateTo({
      url:'/pages/search/search'
    })
  },

  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        //宽高比  
        ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
        imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },
  handleListItemTap(e) {
    my.showToast({
      content: `第${e.currentTarget.dataset.index}个Item`,
      success: res => {},
    });
  },

  successFun(res, selfObj) {
     if(res.status == "SUCCESS") {
      let hotBrands = res.result.rows.slice(0,8);
      selfObj.setData({
          hotBrands : hotBrands,
      });
     }
  },

  phoneFun(res, selfObj) {
     if(res.status == "SUCCESS") {
      let hotPhones = res.result.rows.slice(0,4);
      selfObj.setData({
          hotPhones : hotPhones
      });
     }
  }, 
  onReady() {
    app.getUserInfo()
    let hotOpts = JSON.stringify({
          pageSize : 10,
          pageIndex : 1
        });
    // 获取热门品牌
    app.request.requestPostApi(app.apiUrl + 'brands/list', hotOpts, this, this.successFun);
    // 获取热门手机
    app.request.requestPostApi(app.apiUrl + 'models/hot_list', hotOpts, this, this.phoneFun);

    // 
    // 获取热搜记录  
    const that=this;
    my.httpRequest({
      url: 'http://thirdtest.epbox.cn/channel_charge/api/models/hot_recycle',
      method: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': "application/json",
      },
      success: function(res) {
        const hotRecycle = res.data.result;
        that.setData({hotRecycle:hotRecycle})
      },
      fail: function(res) {
        console.error(res)
      },
    });
  }
});
