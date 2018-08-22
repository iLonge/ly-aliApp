Page({
  data: {
    tabs: [
      {
        title: '待处理',
      },
      {
        title: '已结束',
      }
    ],
    tabBarUnderlineColor: '#18AF78', // 选中选项卡下划线颜色
    tabBarActiveTextColor: '#18AF78', // 选中选项卡字体颜色
    activeTab: 0,
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
});
