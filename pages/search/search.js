Page({
  data: {
    value: '小米8',
    items: [
      {
        title: '单行列表',
        extra: '详细信息',
      },
      {
        title: '单行列表1',
        extra: '详细信息',
      },
    ],
  },
  // 搜索
  handleInput(value) {
    this.setData({
      value,
    });
  },
  handleClear(value) {
    this.setData({
      value: '',
    });
  },
  handleFocus() {},
  handleBlur() {},
  handleCancel() {
    this.setData({
      value: '',
    });
  },
  handleSubmit(value) {
    my.alert({
      content: value,
    });
  },
  // 搜索结果列表
  onItemClick(ev) {
    my.alert({
      content: `点击了第${ev.index}行`,
    });
  },
});
