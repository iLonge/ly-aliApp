import request  from './service/request.js'

App({
  // 小程序初始化
  onLaunch() {
    const that=this
    //获取token 并获取userid
    request.getCipher((data)=>{
      my.setStorage({key: 'cipher',data: data.result, success:()=>console.log(`Cipher验证：${my.getStorageSync({key:'cipher'}).data}`)});
      that.getUserInfo(data.result);
    },(e)=> console.log(e))
  },

  // 获取用户信息
  getUserInfo(cipher) {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);
      my.getAuthCode({
        scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
        success: (res) => {
           my.getAuthUserInfo({
            success: ({ nickName, avatar }) => {
              this.globalData.nickName = nickName;
              this.globalData.avatar = avatar
            }
          });
          let authcode =  res.authCode;
          if (res.authCode) {
                // 获取alipayUserId 支付宝用户id
                my.httpRequest({
                  method: 'POST',
                  url: this.apiUrl1+'alipay_applet/get_user_id_by_auth_code', 
                  data:JSON.stringify({
                    authCode:authcode
                  }),
                  headers: {
                      'Content-Type': "application/json",
                      'cipher':cipher
                  },
                  success: (res) => {
                   const {status}=res.data,{userId}=res.data.result
                   if(status=="SUCCESS"){
                     this.globalData.alipayUserId = userId;
                     this.globalData.authcode = authcode;
                     my.setStorage({
                      key: 'alipay',
                      data:{
                        auth_code:authcode,
                        alipayUserId:userId
                      },
                      success: function() {
                        console.log(`用户信息：${userId}  信息写入成功`)
                      }
                    });
                   }
                  },
                });
          }
        }
      });
    });
  },
  globalData:{
    nickName: '',
    avatar: '',
    alipayUserId: ''
  },
  request: request,
  apiUrl: 'http://litetest.epbox.cn/epbox_lite/',
  apiUrl1: 'http://thirdtest.epbox.cn/channel_charge/api/'
});
