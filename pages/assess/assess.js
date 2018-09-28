//评估页面
const app = getApp()
const utils = require('../../utils/utils.js')
Page({
  data: {
    phoneState:false,//默认开机状态
    funLookOption:null,//功能性外观选项
    funLookState:false,//是否展示外观功能性问题
    modelOption:[],//小型号选项
    baseOption:[],//基本信息
    modalId:null,//型号ID
    modelName:"",//型号名
    brandId:null,//品牌ID
    brandName:"",//品牌名
    baseIdArr:[],//基础信息ID
    baseModelId:"",//苹果小型号ID
    hasSelectBase:false,//是否选择基本信息

    // 选择的数据
    isOpen:null, //开机状态
    detailId:null,//小型号
    faqString:{},//外观参数
    funArr:[],//功能参数

    // 订单的参数
    infoId:"",
    orderId:"",

    // 顶部进度
    topSche:0,
    //顶部9/10步骤是否显示
    topStepstate:true,
    topStepValue:null,
    topStepAllNum:null,
  },

  // 选择开机关机
  selectPhoneState(e){
    const {value}=e.detail
    const {modalId,brandId,funLookOption,orderId}=this.data
    if(value=="1"){
      // 获取小型号 
       const modelDate=JSON.stringify({modelId:modalId,brandId:brandId,orderId:orderId}) 
       app.request.requestPostApi(app.apiUrl + 'models/base_model_list', modelDate, this,(res,that)=>{
         if(res.status=="SUCCESS"){
           if(res.result.detailId==0){
             that.setData({
               modelOption:res.result.list,
               topSche:0,
               baseOption:[],//基础信息
             })
           }else{
              // 没有小型号 直接请求基本信息
              const modelDate=JSON.stringify({modelId:modalId,brandId:brandId,baseModelId:""}) 
              app.request.requestPostApi(app.apiUrl + 'models/base_ids', modelDate, this,(res,that)=>{
                const {status,result}=res
                if(status=="SUCCESS"){
                  //判断是否存在基础信息
                  if(result.titles.length!==0){
                    // 获取所有基本信息列表
                    const baseType = new Set()
                    const title=[] //类别包括重复
                    result.params.forEach((c,i)=>{
                      title.push(c.group)
                    })
                    title.forEach(x => baseType.add(x));
                    let titleArr=Array.from(baseType) //转换为数组

                    //重新拼接的基础信息数组 用于渲染模板
                    let baseArr=[] 
                    for(let z=0;z<titleArr.length;z++){
                      baseArr[z]={}
                      z==0?baseArr[z].style="inherit":baseArr[z].style="none"  //可实现第一个隐藏
                      baseArr[z].row=[]
                      baseArr[z].title=titleArr[z]
                      for(let i=0;i<result.params.length;i++){
                        if(result.params[i]["group"]===titleArr[z]){
                          baseArr[z].row.push(result.params[i])
                        }
                      }
                    }
                    // 加入选中状态字段
                    baseArr.forEach((c,i)=>{
                      baseArr[i].row.forEach((item,index)=>{
                        baseArr[i].row[index].check=false
                      })
                    })
                    
                    
                    const allNum=Object.keys(funLookOption.outward.typeData).length+baseArr.length+1
                    that.setData({
                      baseOption:baseArr,
                      topStepstate:true,
                      topStepValue:`1/${allNum}`,
                      topStepAllNum:allNum,
                    })
                  }else{
                    const allNum=Object.keys(funLookOption.outward.typeData).length+1
                    // 显示外观以及问题选项
                    that.setData({
                      funLookState:true,
                      topStepstate:true,
                      topStepValue:`1/${allNum}`,
                      topStepAllNum:allNum,
                    })
                  }
                }
              })
           }
         }
       })
        this.setData({
          phoneState: true,
          topSche: 0
        })
    }else{
      this.setData({
        phoneState:false,
        topSche:100,
        topStepstate:false,
        detailId:null,//小型号
        faqString:{},//外观参数
        funArr:[],//功能参数
        baseOption:[],//基础信息
      })
    }
    // 存储开机数据
    this.setData({isOpen:value})
  },


  // 选择型号  getbaseDate
  selectModel(e){
    const {value}=e.detail,{funLookState,funLookOption,baseOption}=this.data
    // 防止二次选择 清空基本信息与外观功能显示
    
    // 重置基本信息选中
    baseOption.forEach((c,i)=>{
      baseOption[i].row.forEach((item,index)=>{
        baseOption[i].row[index].check=false
      })
    })
    // 重置外观与问题选中
    const {outward,functions}=funLookOption
    for(let i in outward.typeData){
      outward.typeData[i].options.forEach((n,z)=>{
        outward.typeData[i].options[z].check=false
      })
    }
    for(let i in functions.typeData){
      functions.typeData[i].options.forEach((n,z)=>{
        functions.typeData[i].options[z].check=false
      })
    }

    this.setData({funLookState:false,baseOption:[],funLookOption:null},()=>{
      this.setData({
        baseOption:baseOption, //基础信息
        // 外观
        funLookOption:{
          outward:outward,
          functions:functions,
        },
        faqString:{},//外观参数
        funArr:[],//功能参数
        hasSelectBase:false,
      })
      this.getbaseDate(value.split(","))
    })

    
  },


  // 选择基础信息
  selectBaseOption(e){
    const {index}=e.currentTarget.dataset  //当前点击的列
    const {value}=e.detail //当前选择的值
    const {baseOption,baseIdArr,topStepAllNum,topSche,hasSelectBase,modelOption}=this.data
    
    // 新增基础信息ID
    baseIdArr[index]=value
    // 判断是否存在小型号
    const numSet=modelOption.length!==0?2:1
    // 显示接下来的项目
    let nextIndex=index+1
    const nowTopSche=topSche>parseInt((nextIndex+numSet)/topStepAllNum*100)?topSche:parseInt((nextIndex+numSet)/topStepAllNum*100) //进度
    const topStepValue=hasSelectBase?null:{topStepValue:`${nextIndex+numSet}/${topStepAllNum}`}

    if(baseOption.length>nextIndex){

      baseOption.forEach((t, i)=>{
        if(nextIndex==i){
          t.style="inherit"
        }
      })
     
      this.setData({
        baseOption:baseOption,
        topSche:nowTopSche, //进度
        ...topStepValue
      })
    }else if(baseOption.length===nextIndex){
      // 请求detailId
      let ids=baseIdArr.join(",")
      this.getDetailId(ids)
      // 进度
      this.setData({
        ...topStepValue,
        topSche:nowTopSche,
        hasSelectBase:true,
      })
    }
  },


  // 获取detailId
  getDetailId(ids){
    const {modalId,brandId,baseModelId}=this.data
    const modelDate=JSON.stringify({
      modelId:modalId,
      brandId:brandId,
      baseModelId:baseModelId,
      ids:ids
    }) 
    app.request.requestPostApi(app.apiUrl + 'models/detail', modelDate, this,(res,that)=>{
      if(res.status=="SUCCESS"){
        // 存储 detailId 并且展示外观问题
        that.setData({detailId:res.result.detailId,funLookState:true})
      }
    })
  },

  // 外观问题
  lookQuestion(e){
    const {id,index}=e.currentTarget.dataset,{value}=e.detail,{faqString,topStepAllNum,baseOption,modelOption}=this.data
    const str=id+","+value
    const strIndex='"'+index+'"'
    faqString[strIndex]=str

    let faqArr={}
    for(let i in faqString){
      faqArr[i]=faqString[i]
    }
    // 判断是否存在小型号
    const numSet=modelOption.length!==0?2:1
    const num=baseOption.length+Object.keys(faqArr).length+numSet
    this.setData({
      faqString:faqArr,
      topSche:parseInt(num/topStepAllNum*100),
      topStepValue:`${num}/${topStepAllNum}`,
    })

  },

  // 功能问题
  funQuestion(e){
    const {value}=e.detail
    this.setData({funArr:value})
  },


  // 请求基本信息
  getbaseDate(baseModelId){
    const {modalId,brandId,modelOption,funLookOption,topSche}=this.data
    // 小型号ID
    let bmId,modalName
    baseModelId!==undefined?baseModelId[1]==0?modalName=baseModelId[0]:modalName="":""
    // 请求数据
    const modelDate=JSON.stringify({modelId:modalId,brandId:brandId,baseModelId:bmId,baseModel:modalName})
    // 型号条目与外观条目
    const num=Object.keys(funLookOption.outward.typeData).length+2
    
    app.request.requestPostApi(app.apiUrl + 'models/base_ids', modelDate, this,(res,that)=>{
        const {status,result}=res
        if(status=="SUCCESS"){
          // 判断是否存在基本信息
          if(result.titles.length!==0){
              // 获取所有基本信息列表
              const baseType = new Set()
              const title=[] //类别包括重复
              result.params.forEach((c,i)=>{
                title.push(c.group)
              })
              title.forEach(x => baseType.add(x)); 
              let titleArr=Array.from(baseType) //转换为数组

              //重新拼接的基础信息数组 用于渲染模板
              let baseArr=[] 
              for(let z=0;z<titleArr.length;z++){
                baseArr[z]={}
                z==0?baseArr[z].style="inherit":baseArr[z].style="none"  //可实现第一个隐藏
                baseArr[z].row=[]
                baseArr[z].title=titleArr[z]
                for(let i=0;i<result.params.length;i++){
                  if(result.params[i]["group"]===titleArr[z]){
                    baseArr[z].row.push(result.params[i])
                  }
                }
              }
              // 加入选中状态字段
              baseArr.forEach((c,i)=>{
                baseArr[i].row.forEach((item,index)=>{
                  baseArr[i].row[index].check=false
                })
              })
              // 统计所有条目
              const allNum=num+baseArr.length
              that.setData({
                baseOption:baseArr,
                topStepstate:true,
                topStepValue:`2/${allNum}`,
                topStepAllNum:allNum,
                topSche:parseInt(2/allNum*100)
              })
            }else{
              // 存储detailId 显示外观与功能
              this.setData({
                detailId:result.detailId,
                funLookState:true,
                topStepstate:true,
                topStepValue:`2/${num}`,
                topStepAllNum:num,
                topSche:parseInt(2/num*100)
              })
            }
        }
    })
  },

  // 查看定价并生成订单
  checkPrice:utils.throttle(function() {
     const {brandId,modalId,faqString,funArr,isOpen,detailId,topSche,modelName,brandName}=this.data
     let faqStrArr=[],d=0
     my.showLoading({
        content: '加载中...'
      });
     for(let i in faqString){
       faqStrArr[d]=faqString[i]
       d++
     }
     const faq=faqStrArr.concat(funArr).join(":")
     //判断是否选择完成
     if(topSche!==100){
       my.hideLoading();
       my.showToast({
          type: 'fail',
          content: '请选择评估项目',
          duration: 3000,
       })
     }else{
        // 判断是否选择解锁账户
        if(faq.indexOf("74,416")==-1 && faq.indexOf("44541")==-1 && faq.indexOf("44539")==-1){
          // 查看价格
          const optionDate=JSON.stringify({brandId:brandId,modelId:modalId,faqString:faq,isOpen:isOpen,detailId:detailId,resource:'2',modelName:modelName,brandName:brandName}) 
          app.request.requestPostApi(app.apiUrl + 'api/testing/ref_prices', optionDate, this,(res,that)=>{
            const {status,result}=res
            if(status=="SUCCESS"){
             // const {infoId}=result,userId=my.getStorageSync({key:'alipay'}).data.alipayUserId
             const {infoId}=result,userId=app.globalData.alipayUserId
              const infoData=JSON.stringify([{resource:13,evaluationId:infoId,aliUserId:userId}])
              //生成订单
              app.request.requestPostApi(app.apiUrl + 'api/testing/create', infoData, this,(res,that)=>{
                if(res.status=="SUCCESS"){
                  const {result}=res
                  my.hideLoading();
                  my.navigateTo({
                    url:`/pages/assess-result/assess-result?orderId=${result}&infoId=${infoId}&userId=${userId}`
                  })
                }
              })
            }
          })
        }else{
          my.hideLoading();
          my.alert({
            title: '亲',
            content: '账户必须为已解锁',
            buttonText: '我知道了',
          });
        }
     }
  },3000),



  // 页面加载
  onLoad(query) {console.log(query)
    const {modalId,brandId,modalName,brandName}=query
    my.setNavigationBar({
      title: `${brandName} ${modalName}`,
    });
    //存储型号与品牌ID
    this.setData({modalId:modalId,brandId:brandId,modelName:modalName,brandName:brandName})

    // 获取功能性外观问题
    const testDate=JSON.stringify({modelId:modalId,brandId:brandId}) 
    app.request.requestPostApi(app.apiUrl + 'api/testing/questions_result', testDate, this,(res,that)=>{
      if(res.status=="SUCCESS"){
       
        const outward=res.result.outward,functions=res.result.functions
        // 加入check项目
        for(let i in outward.typeData){
          outward.typeData[i].options.forEach((n,z)=>{
            outward.typeData[i].options[z].check=false
          })
        }
        // 加入check项目
        for(let i in functions.typeData){
          functions.typeData[i].options.forEach((n,z)=>{
            functions.typeData[i].options[z].check=false
          })
        }

        that.setData({
          funLookOption:{
            functions:res.result.functions,
            outward:outward,
          }
        })
      }
      
    })
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
})
