Page({
  data: {
    collapseData: {
      onTitleTap: 'handleTitleTap',
      panels: [
        {
          title: '信用回收参与条件',
          content: '现阶段信用回收仅对芝麻信用分620分及以上用户开放.芝麻信用分620分以下的用户可通过普通回收l流程回收j旧机。现阶段信用回收仅支持快递上门取件的回收方式。',
          expanded: true,
        },
        {
          title: '信用回收参与条件',
          content: '现阶段信用回收仅对芝麻信用分620分及以上用户开放.芝麻信用分620分以下的用户可通过普通回收l流程回收j旧机。现阶段信用回收仅支持快递上门取件的回收方式。',
          expanded: false,
        },
      ],
    },
  },
  handleTitleTap(e) {
    const { index } = e.currentTarget.dataset;
    const panels = this.data.collapseData.panels;
    // android does not supprt Array findIndex
    panels[index].expanded = !panels[index].expanded;
    this.setData({
      collapseData: {
        ...this.data.collapseData,
        panels: [...panels],
      },
    });
  },
});