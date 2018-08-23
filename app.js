import request from './service/request.js'
App({
  todos: [
    { text: 'Learning Javascript', completed: true },
    { text: 'Learning ES2016', completed: true },
    { text: 'Learning 支付宝小程序', completed: false },
  ],
  userInfo: null,
  name: 'wanglong',
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);
      my.getAuthCode({
        scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
        success: (res) => {
          console.log(res.authCode)
          let authcode =  res.authCode;
          if (res.authCode) {
            // 认证成功
            // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
            my.httpRequest({ 
              // headers: {
              //   'authorization': token,
              //   'Content-Type': "application/json"
              // },
              method: 'POST',
              url: this.apiUrl + 'api/alipay/get_user_id_by_auth_code',
              data: JSON.stringify({
                auth_code: res.authCode
              }),
              success: (res) => {
                console.log(res.data.message) 
                // 授权成功并且服务器端登录成功 
              },
              fail: (res) => {
                console.log(res)
                // 根据自己的业务场景来进行错误处理
              },
            });
          }
        },
      });
    });
  },
  request: request,
  apiUrl: 'http://litetest.epbox.cn/epbox_lite/',
  apiUrl1: 'http://thirdtest.epbox.cn/channel_charge/api/'
});
