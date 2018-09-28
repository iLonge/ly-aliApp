var app = getApp();
Page({
  data: {
    active: 'method-active',
    showModal: false,
    scale: 12,
    longitude: '',
    latitude: ''
  },
  makePhoneCall() {
    my.makePhoneCall({ number: '4008252250' });
  },
   // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
  submitOrder() {
    var that = this;
    // 下单接口
    my.zmRentTransition({      
      creditRentType: "creditRecycleSignContract",
      outOrderNo: that.data.orderId,   /** 外部订单号*/
      zmOrderNo: that.data.zmOrderNo,  /** 芝麻订单号*/
      success: (res) => {
         console.log(JSON.stringify(res))
        if(res.result.success){
          my.navigateTo({
            // 跳转订单下单结果页
            url: '../submit-order/submit-order?zmOrderNo='+that.data.zmOrderNo+'&outOrderNo='+that.data.orderId
          })
         
        }else{
          my.showToast({
            type: 'fail',
            content: '下单操作失败',
            duration: 2000
          });
        }
      }, 
      fail: (res) => {
        my.alert({ title: 'fail: ' + JSON.stringify(res)});
      }
    });
  },
  recyclingCredit() {
    this.setData({active:'method-active',showModal:false})
  },
  recyclingMachine() {  //  机器回收
    let that = this;
        this.setData({active:'',showModal:true})
  },
  closeModal() {
    this.setData({active:'method-active',showModal:false})
  },
  successFun(res, selfObj) {
    if(res.status == "SUCCESS") {
      let orderData = res.result;
      let algorithmProcess = orderData.algorithmProcess.replace(/<[^<>]*>/gi,'');
      let orderDetails = orderData.orderDetails;
      let optStrings = '';
      let secondAlgorithmProcess = orderData.secondAlgorithmProcess;
      orderDetails.map((item) => {
        optStrings += item.rightOptionName+',';
      });
      selfObj.setData({
        orderId: orderData.orderInfo.id,
        orderData: orderData,
        algorithmProcess: optStrings,
        orderDetails: orderDetails,
        secondAlgorithmProcess: secondAlgorithmProcess
      });
    }
    
  },
  onLoad(opt) {
    this.getPosition();
    this.setData({
      orderId: opt.outOrderNo,
      zmOrderNo: opt.zmOrderNo,
      creditAmount: opt.creditAmount,
      amount: opt.amount,
      balance: parseFloat(opt.amount-opt.creditAmount).toFixed(2)
    })
  },
  onReady() {
    let param = {
          id: this.data.orderId
        };
    // 获取order详情
    app.request.requestGetApi(app.apiUrl1 + 'minbox_orders/show', param, this, this.successFun);
  },
  onShow() {
     // 使用 my.createMapContext 获取 map 上下文
    this.mapCtx = my.createMapContext('map')
    this.mapCtx.moveToLocation();
    this.changeCenter();
    this.changeMarkers();
  },
  
  moveToLocation() {
    this.mapCtx.moveToLocation()
  },
  
  regionchange(e) {
    console.log('regionchange', e);
	// 注意：如果缩小或者放大了地图比例尺以后，请在 onRegionChange 函数中重新设置 data 的
	// scale 值，否则会出现拖动地图区域后，重新加载导致地图比例尺又变回缩放前的大小。
	if (e.type === 'end') {
      this.setData({
        scale: e.scale
      });
    }
  },

  changeCenter() {
    let that = this;
    this.setData({
      longitude: that.longitude,
      latitude: that.latitude
    });
  },
  changeMarkers() {
     let that = this;
    this.setData({
      markers: [
        {
          iconPath: "/images/icons/position.png",
          id: 9,
          latitude: '34.223479',
          longitude:  '108.887724',
          width: 20,
          height: 20,
          title: '机器A',
          callout:{content:'hehehe'}
        },
        {
            iconPath: "/images/icons/position.png",
            id: 10,
            latitude: '34.223429',
            longitude:  '108.887734',
            width: 20,
            height: 20,
            title: '机器B',
            callout:{content:'lalala'}
        },
        {
            iconPath: "/images/icons/position.png",
            id: 11,
            latitude: '34.223379',
            longitude:  '108.886724',
            width: 20,
            height: 20,
            title: '机器C',
            callout:{content:'hahaha'}
        },
        {
            iconPath: "/images/icons/position.png",
            id: 11,
            latitude: '34.233379',
            longitude:  '108.886724',
            width: 20,
            height: 20,
            title: '机器D',
            callout:{content:'hahaha'}
        }
      ]
    });
  },
   markertap(e) {
    console.log('marker tap', e);
    // my.openLocation({
    //   longitude: e.longitude,
    //   latitude: e.latitude,
    //   name: '支付宝',
    //   address: '延平门地铁站'
    // });
  },
  getPosition() {
    let that = this;
     my.getLocation({
      success(res) {
        my.hideLoading();
        // that对象为Page可以设置数据刷新界面
        that.setData({
          hasLocation: true,
          longitude: res.longitude,
          latitude: res.latitude
        })
        console.log(res.longitude+'----'+res.latitude)
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  }
});
