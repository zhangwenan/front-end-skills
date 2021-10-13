
# Hook
Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

##  没有破坏性改动
Hook, 是完全可选的。100% 向后兼容的。
另外，也没有计划从 React 中移除 class。


##  Effect Hook
React 组件中执行的数据获取、订阅或者手动修改 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。

`useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。
它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。



通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里。

```
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```


### Hook 使用规则
Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：
* 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
* 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中。）

配套的lint插件：https://www.npmjs.com/package/eslint-plugin-react-hooks

##  自定义Hook
有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：高阶组件和 render props。
*自定义 Hook* 可以在不增加组件的情况下达到同样的目的。

```
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

```
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

这两个组件的 state 是完全独立的。
Hook 是一种复用**状态逻辑**的方式，它不复用 state 本身。
事实上 Hook 的每次调用都有一个完全独立的 state，因此你可以在单个组件中多次调用同一个自定义 Hook。

自定义 Hook 更像是一种约定而不是功能。如果函数的名字以 “use” 开头并调用其他 Hook，我们就说这是一个自定义 Hook。 


##  其他Hook
```
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

```
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```


# 使用 State Hook

##  Hook是什么
Hook 是一个特殊的*函数*，它可以让你“钩入” React 的特性。
例如，useState 是允许你在 React 函数组件中添加 state 的 Hook。

什么时候我会用 Hook？ 
如需在函数组件中添加一些`state`，以前的做法是将其它转化为 `class`。现在可以使用 Hook实现。
使用 Hook 其中一个目的，就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。

调用 useState 方法的时候做了什么? 
它定义一个 “state 变量”。我们的变量叫 count，但是我们可以叫他任何名字，比如 banana。
这是一种在函数调用时保存变量的方式。useState 是一种新方法，它与 class 里面的 this.state 提供的功能完全相同。

```
import React, { useState } from 'react';

function Example() {
  // 在函数组件中存储内部 state
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

useState创建的state变量，在更新时，总是替换。
而class组件中的state变量，在更新时，是合并。


# 使用Effect Hook
```
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

改用`useEffect`之后，就不需要重复写2次了。
```
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。
默认情况下，`useEffect` 会在第一次渲染之后和每次更新之后都会执行。
React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。

传递给 `useEffect` 的函数在每次渲染中都是不同的。
这正是我们可以在 `effect` 中获取最新的 `count` 的值，而不用担心其过期的原因。
每次我们重新渲染，都会生成新的 `effect`，替换掉之前的。
某种意义上讲，`effect` 更像是渲染结果的一部分，每个 effect “属于”一次特定的渲染。


与 `componentDidMount` 或 `componentDidUpdate` 不同，
使用 `useEffect` 调度的 `effect` 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。
大多数情况下，`effect` 不需要同步地执行。
在个别情况下（例如测量布局），有单独的 `useLayoutEffect` Hook 供你使用，其 API 与 useEffect 相同。


## 需要清除的 effect

```
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```
使用生命周期函数迫使我们拆分这些逻辑代码，即使这两部分代码都作用于相同的副作用。

改用Hook后，
```
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

为什么要在 effect 中返回一个函数？ 
这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。
如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

React 何时清除 effect？ 
React 会在组件卸载的时候执行清除操作。
effect 在每次渲染的时候都会执行。这就是为什么 React 会在执行当前 effect 之前对上一个 effect 进行清除。
`useEffect` 默认就会处理。它会在调用一个新的 effect 之前对前一个 effect 进行清理。

```
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // 运行第一个 effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // 运行下一个 effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // 运行下一个 effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 清除最后一个 effect
```

##  提示: 通过跳过 Effect 进行性能优化

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。
在 class 组件中，我们可以通过在 componentDidUpdate 中添加对 prevProps 或 prevState 的比较逻辑解决：
```
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

```
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
```
请确保数组中包含了所有外部作用域中会随时间变化并且在 effect 中使用的变量。
如果想执行只运行一次的 `effect`（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。

推荐启用 `eslint-plugin-react-hooks` 中的 `exhaustive-deps` 规则。
此规则会在添加错误依赖时发出警告并给出修复建议。
https://www.npmjs.com/package/eslint-plugin-react-hooks#installation
https://github.com/facebook/react/issues/14920


# Hook规则
* 只在最顶层使用 Hook
* 只在 React 函数中调用 Hook（在 React 的函数组件中调用 Hook / 在自定义 Hook 中调用其他 Hook）

##  ESLint插件
```
npm install eslint-plugin-react-hooks --save-dev
```

```
// 你的 ESLint 配置
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
```




