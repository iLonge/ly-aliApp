export function getNextAreaList(areaId,level) {
  let paramLite=level==1?{provinceId:areaId}:{cityId:areaId}
  var param = JSON.stringify({
      pageIndex: '1',
      pageSize: '100',
      ...paramLite
    });
  return new Promise((resolve,reject) => {
    
    my.httpRequest({
      url:'http://litetest.epbox.cn/epbox_lite/api/cities/list',
      method: 'POST',
      data: param, 
      dataType: 'json',
      headers: {
          'Content-Type': "application/json",
          'cipher':my.getStorageSync({key:'cipher'}).data
      },
      success(res){
          let list=[]
          console.log(res)
          for(let item of res.data.result.rows){
              list.push({
                  id:item.id,//id对应地区ID
                  name:item.name//name对应地区名称
              })
          }
          //成功回调 要确保数组中的对象有id和name字段
          resolve(list);

      },
      fail(err){
          //失败回调
          reject(err)
      }
    })
  })
}