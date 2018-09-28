Page({
  data: {},
  onLoad() {},
  // 分享
  onShareAppMessage() { 
    return {
      title: '壹站收',
      desc: '壹站收小程序。',
      path: 'pages/index/index'
    };
  },
});
