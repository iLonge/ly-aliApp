## list
| 属性 | 说明 | 类型 | 默认值 |
|----|----|----|----|
|className| 自定义class | String| |

### slots
|slotName | 说明 |
|----|----|
|header | 可选，列表头部|
|footer | 可选，用于渲染列表尾部|

### using

```
// page.json
{
  "defaultTitle": "小程序AntUI组件库",
  "usingComponents":{
    "list":"mini-antui/es/list/index",
    "list-item":"mini-antui/es/list/list-item/index"
  }
}
```

### examples

```axml
// page.axml
<list>
  <view slot="header">列表头部</view>
  <block a:for="{{items}}">
    <list-item
      key="item-{{index}}"
      last="{{index === (items.length - 1)}}"
    >
      {{item.title}}
      <view class="am-list-brief">{{item.brief}}</view>
    </list-item>
  </block>
  <view slot="footer">列表尾部</view>
</list>
```

## list-item

| 属性 | 说明 | 类型 | 默认值 |
|----|----|----|----|
|className| 自定义的class | String| |
|thumb| 缩略图 | 图片地址 |  |
|arrow| 是否带剪头 | Boolean | `false` |
|align| 子元素垂直对齐，可选`top`,`middle`,`bottom` | String | `middle` |
|index| 列表项的唯一索引| string | |
|onClick| 点击list-item时调用此函数 | function({index}) | |
|last | 是否是列表的最后一项|boolean|false |
|disabled| 不可点击，且无hover效果 | Boolean | `false` |
|multipleLine | 多行 | Boolean | `false` |
|wrap | 是否换行，默认情况下，文字超长会被隐藏 | Boolean | `false` |

### slots

| slotname | 说明 |
|----|----|
|extra | 可选，用于渲染列表项右边说明|

### examples

```axml
<list-item
  className="{{index === 0 ? 'am-list-sticky' : ''}}"
  thumb="{{item.thumb}}"
  arrow="{{item.arrow}}"
  align="{{item.align}}"
  index="{{index}}"
  onClick="onItemClick"
  key="items-{{index}}"
  multipleLine="{{true}}"
  wrap="{{true}}"
>
  {{item.title}}
  <view class="am-list-brief">{{item.brief}}</view>
  <view slot="extra">
    {{item.extra}}
  </view>
</list-item>

```
