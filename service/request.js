/**
 * POST请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestPostApi(url, params, sourceObj, successFun, failFun, completeFun) {
    requestApi(url, params, 'POST', sourceObj, successFun, failFun, completeFun)
}

function requestGetApi(url, params, sourceObj, successFun, failFun, completeFun) {
    requestApi(url, params, 'GET', sourceObj, successFun, failFun, completeFun)
}

function requestApi(url, params, method, sourceObj, successFun, failFun, completeFun) {
    my.httpRequest({
        url: url, 
        method: method,
        data: params, 
        dataType: 'json',
        headers: {
            'Content-Type': "application/json",
            'cipher':my.getStorageSync({key:'cipher'}).data
        }, 
        success: function (res) {
            typeof successFun  == 'function' && successFun(res.data, sourceObj)
        },
        fail: function (res) {
            typeof failFun == 'function' && failFun(res.data, sourceObj)
        },
        complete: function (res) {
            typeof completeFun == 'function' && completeFun(res.data, sourceObj)
        }
    })
}

// 获取token
const getCipher=(successFun, failFun)=>{
    my.httpRequest({
          url: "http://thirdtest.epbox.cn/channel_charge/api/alipay_applet/alipay_get_cipher", 
          method: "post", 
          success: function (res) {
              typeof successFun  == 'function' && successFun(res.data)
          },
          fail: function (res) {
              typeof failFun == 'function' && failFun(res.data)
          },
      })
}

module.exports = { 
	requestPostApi,
  requestGetApi,
  getCipher,
}
