# DOM 元素

React 实现了一套独立于浏览器的 DOM 系统，兼顾了性能和跨浏览器的兼容性。我们借此机会完善了浏览器 DOM 实现的一些特殊情况。

在 React 中，所有的 DOM 特性和属性（包括事件处理）都应该是小驼峰命名的方式。
例如，与 HTML 中的 tabindex 属性对应的 React 的属性是 tabIndex。
例外的情况是 aria-* 以及 data-* 属性，一律使用小写字母命名。比如, 你依然可以用 aria-label 作为 aria-label。

##  属性差异

### checked
`defaultChecked` 是非受控组件的属性，用于设置组件首次挂载时是否被选中。

### className
React中的标签，使用`className`。
如果你在 React 中使用 Web Components（这是一种不常见的使用方式），请使用 `class` 属性代替。


### dangerouslySetInnerHTML
`dangerouslySetInnerHTML` 是 React 为浏览器 DOM 提供 `innerHTML` 的替换方案。

```
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor
由于 `for` 在 JavaScript 中是保留字，所以 React 元素中使用了 `htmlFor` 来代替。
```
// Html
<label for="female">Female</label>
<input type="radio" name="sex" id="female" />
```

```
// React JSX
<label htmlFor="female">Female</label>
<input type="radio" name="sex" id="female" />
```

### selected
`<option>` 组件支持 `selected` 属性。

### style
样式不会自动补齐前缀。如需支持旧版浏览器，要手动补充对应的样式属性：
```
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```
浏览器引擎前缀都应以大写字母开头，除了 `ms`。

React 会自动添加 ”px” 后缀到内联样式为数字的属性后。
如需使用 ”px” 以外的单位，要自行添加。
```
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```


### suppressContentEditableWarning
通常，当拥有子节点的元素被标记为 `contentEditable` 时，React 会发出一个警告，因为这不会生效。
`suppressContentEditableWarning`属性将禁止此警告。尽量不要使用该属性，除非你要构建一个类似 Draft.js 的手动管理 contentEditable 属性的库。


### suppressHydrationWarning
不要过度使用它。你可以在 `ReactDOM.hydrate()` 中了解更多关于 hydration 的信息。


### All Supported HTML Attributes
```
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API

// html元素
<a href="http://www.microsoft.com/" tabindex="3">Microsoft</a>  // 全小写
document.getElementsByTagName('a')[0].tabIndex    // 小驼峰
```

可以使用自定义属性，但要注意属性名全都为小写。


# 合成事件

