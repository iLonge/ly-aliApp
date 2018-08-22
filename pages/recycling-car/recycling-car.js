Page({
  data: {
    isSelected: false,
    recylingLists: [
      {
        id: '12345',
        modal: '小米MIX2S 全面屏游戏手机',
        price: 2500,
        imgUrl: '../../images/icons/delet.png'
      },
      {
        id: '232345',
        modal: '小米5S 暗夜之眼拍照手机',
        price: 500,
        imgUrl: '../../images/icons/delet.png'
      },
    ]
  },

  handleChange(event) {
    var that = this;
    var this_checked = event.currentTarget.dataset.id;
    var recylingLists = this.data.recylingLists;

    for(var i=0;i<recylingLists.length;i++) {
      if(recylingLists[i].id == this_checked) {
        recylingLists[i].checked = true;
      } else {
        recylingLists[i].checked = false;
      }
    }
    that.setData({
      recylingLists: recylingLists
    })
  },
  handleDelet(e) {
    let that = this;
    let deldeid = e.currentTarget.dataset.id;
    let recylingLists = that.data.recylingLists;
    let newallData = [];

    for (var i in recylingLists) {
      var item = recylingLists[i];

      if (item.id != deldeid) {
        newallData.push(item);
      }
    }

    my.confirm({
      title: '温馨提示',
      content: '确定删除？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          that.setData({
            recylingLists: newallData
          })
          console.log()
          my.showToast({
            type: 'success',
            content: '删除成功',
            duration: 2000
          });
        }
      },
    });
  }

});
