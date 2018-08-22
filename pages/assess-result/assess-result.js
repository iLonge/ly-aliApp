Page({
  data: {
    showBottom: false,
  },
  onButtomBtnTap() {
    this.setData({
      showBottom: true
    });
  },
  onPopupClose() {
    this.setData({
      showBottom: false
    });
  },
  onLoad() {
  },
});
