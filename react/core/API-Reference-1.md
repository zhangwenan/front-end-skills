
# React 顶层 API
ES6 与 npm 时，可以通过编写 `import React from 'react'` 来引入。
当你使用 ES5 与 npm 时，则可以通过编写 `var React = require('react')` 来引入。


##  React.PureComponent
React.PureComponent 与 React.Component 很相似。
两者的区别在于 `React.Component` 并未实现 `shouldComponentUpdate()`，
而 `React.PureComponent` 中以浅层对比 `prop` 和 `state` 的方式来实现了该函数。

`React.PureComponent` 中的 `shouldComponentUpdate()` 仅作对象的*浅层比较*。
如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果。
仅在你的 props 和 state 较为简单时，才使用 React.PureComponent，
或者在深层数据结构发生变化时调用 forceUpdate() 来确保组件被正确地更新。
也可以考虑使用 immutable 对象加速嵌套数据的比较。

此外，`React.PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 prop 更新。因此，需确保所有子组件也都是“纯”的组件。


##  React.memo
```
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

React.memo 为高阶组件。它与 `React.PureComponent` 非常相似，但*只适用于函数组件*，而不适用 class 组件。

如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

`React.memo` 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 `useState` 或 `useContext` 的 Hook，当 context 发生变化时，它仍会重新渲染。

默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。
```
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

##  createElement()
```
React.createElement(
  type,
  [props],
  [...children]
)
```

##  cloneElement()
```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

##  createFactory()
此辅助函数已废弃，略。
建议使用`React.createElement()`来代替。
```
React.createFactory(type)
```

##  isValidElement()
验证对象是否为 React 元素，返回值为 true 或 false。
```
React.isValidElement(object)
```

##  React.Children
### React.Children.map
```
React.Children.map(children, function[(thisArg)])
```
如果 children 是一个 Fragment 对象，它将被视为单一子节点的情况处理，而不会被遍历。

### React.Children.forEach
```
React.Children.forEach(children, function[(thisArg)])
```
与 React.Children.map() 类似，但它不会返回一个数组。

### React.Children.count
```
React.Children.count(children)
```
返回 children 中的组件总数量，等同于通过 map 或 forEach 调用回调函数的次数。

### React.Children.only
```
React.Children.only(children)
```
验证 children 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。

### React.Children.toArray
```
React.Children.toArray(children)
```
将 children 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。
当你想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当你想要在向下传递 `this.props.children` 之前对内容重新排序或获取子集时。
注意，`React.Children.toArray()` 在拉平展开子节点列表时，更改 key 值以保留嵌套数组的语义。
也就是说，toArray 会为返回数组中的每个 key 添加前缀，以使得每个元素 key 的范围都限定在此函数入参数组的对象内。


##  React.Fragment

##  React.createRef

##  React.forwardRef

##  React.lazy
渲染 lazy 组件依赖该组件渲染树上层的 `<React.Suspense>` 组件。这是指定加载指示器（loading indicator）的方式。

##  React.Suspense
目前，懒加载组件是 `<React.Suspense>` 支持的唯一用例。
```
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

`React.lazy()` 和 `<React.Suspense>` 尚未在 ReactDOMServer 中支持。这是已知问题，将会在未来解决。






# React对JavaScript 环境的要求

React 16 依赖集合类型 Map 和 Set 。如果你要支持无法原生提供这些能力（例如 IE < 11）或实现不规范（例如 IE 11）的旧浏览器与设备，考虑在你的应用库中包含一个全局的 polyfill ，例如 core-js 或 babel-polyfill 。
https://github.com/zloirock/core-js
https://babeljs.io/docs/usage/polyfill/
https://www.npmjs.com/package/raf

```
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React 同时还依赖于 requestAnimationFrame（甚至包括测试环境）。 
你可以使用 raf 的 package 增添 requestAnimationFrame 的 shim：
```
import 'raf/polyfill';
```


# React.Component

##  生命周期图谱
https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

##  挂载
当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

* constructor()
* static getDerivedStateFromProps()
* render()
* componentDidMount()
即将过时生命周期：UNSAFE_componentWillMount()


##  更新
当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：

* static getDerivedStateFromProps()
* shouldComponentUpdate()
* render()
* getSnapshotBeforeUpdate()
* componentDidUpdate()

即将过时的生命周期：UNSAFE_componentWillUpdate()、UNSAFE_componentWillReceiveProps()

##  卸载
当组件从 DOM 中移除时会调用如下方法：
* componentWillUnmount()

##  错误处理
当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：
* static getDerivedStateFromError()
* componentDidCatch()

##  其他API
setState()
forceUpdate()

##  class属性
defaultProps
displayName



##  constructor()
如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。

通常，在 React 中，构造函数仅用于以下两种情况：
* 通过给 this.state 赋值对象来初始化内部 state。
* 为事件处理函数绑定实例

在 constructor() 函数中不要调用 setState() 方法。
如果你的组件需要使用内部 state，请直接在构造函数中为 this.state 赋值初始 state：
```
constructor(props) {
  super(props);
  // 不要在这里调用 this.setState()
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```
只能在构造函数中直接为 this.state 赋值。如需在其他方法中赋值，你应使用 this.setState() 替代。

##  setState()
将 setState() 视为**请求**而不是立即更新组件的命令。
为了更好的感知性能，React 会延迟调用它，然后通过一次传递更新多个组件。React 并不会保证 state 的变更会立即生效。

这使得在调用 setState() 后立即读取 this.state 成为了隐患。
为了消除隐患，请使用 `componentDidUpdate` 或者 `setState` 的回调函数（`setState(updater, callback)`），这两种方式都可以保证在应用更新后触发。
如需基于之前的 state 来设置当前的 state，请阅读下述关于参数 updater 的内容。

除非 `shouldComponentUpdate()` 返回 false，否则 `setState()` 将始终执行重新渲染操作。
如果可变对象被使用，且无法在 `shouldComponentUpdate()` 中实现条件渲染，那么仅在新旧状态不一时调用 `setState()`可以避免不必要的重新渲染。




##  forceUpdate()
```
component.forceUpdate(callback)
```
调用 `forceUpdate()` 将致使组件调用 render() 方法，此操作会跳过该组件的 `shouldComponentUpdate()`。
但其子组件会触发正常的生命周期方法，包括 `shouldComponentUpdate()` 方法。如果标记发生变化，React 仍将只更新 DOM。

通常你应该避免使用 `forceUpdate()`，尽量在 `render()` 中使用 this.props 和 this.state。



##  defaultProps
defaultProps 可以为 Class 组件添加默认 props。这一般用于 props 未赋值，但又不能为 null 的情况。例如：
```
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};

```

```
render() {
  return <CustomButton /> ; // props.color 将设置为 'blue'
}

render() {
  return <CustomButton color={null} /> ; // props.color 将保持是 null
}
```


# ReactDOM
React 支持所有的现代浏览器，包括 IE9 及以上版本，但是需要为旧版浏览器比如 IE9 和 IE10 引入相关的 polyfills 依赖。
注意，不支持那些不兼容 ES5 方法的旧版浏览器，但如果你的应用包含了 polyfill，例如 es5-shim 和 es5-sham 你可能会发现你的应用仍然可以在这些浏览器中正常运行。但是如果你选择这种方法，你便需要孤军奋战了。

##  render()
```
ReactDOM.render(element, container[, callback])
```


##  hydrate()


##  unmountComponentAtNode()
```
ReactDOM.unmountComponentAtNode(container)
```
从 DOM 中卸载组件，并将其事件处理器（event handlers）和 state 一并清除。
如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 true，如果没有组件可被移除将会返回 false。



##  findDOMNode()
findDOMNode 是一个访问底层 DOM 节点的应急方案（escape hatch）。
在大多数情况下，不推荐使用该方法，因为它会破坏组件的抽象结构。严格模式下该方法已弃用。

大多数情况下，你可以绑定一个 ref 到 DOM 节点上，可以完全避免使用 findDOMNode。


##  createPortal()
```
ReactDOM.createPortal(child, container)
```
创建 portal。Portal 将提供一种将子节点渲染到 DOM 节点中的方式，该节点存在于 DOM 组件的层次结构之外。



# ReactDOMServer

ReactDOMServer 对象允许你将组件渲染成静态标记。通常，它被使用在 Node 服务端上：
```
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

下述方法可以被使用在服务端和浏览器环境。
* renderToString()
* renderToStaticMarkup()

下述附加方法依赖一个只能在服务端使用的 package（stream）。它们在浏览器中不起作用。
* renderToNodeStream()
* renderToStaticNodeStream()


