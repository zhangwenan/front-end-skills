### Function Component

Function Component 是更彻底的状态驱动抽象，甚至没有 Class Component 生命周期的概念，只有一个状态，而 React 负责同步到 DOM。 这是理解 Function Component 以及 useEffect 的关键。


####  从几个疑问开始

* 🤔 如何用 useEffect 代替 componentDidMount?
* 🤔 如何用 useEffect 取数？参数 [] 代表什么？
* 🤔useEffect 的依赖可以是函数吗？是哪些函数？
* 🤔 为何有时候取数会触发死循环？
* 🤔 为什么有时候在 useEffect 中拿到的 state 或 props 是旧的？



### Capture Value特性
可以认为每次 Render 的内容都会形成一个快照并保留下来，因此当状态变更而 Rerender 时，就形成了 N 个 Render 状态，而每个 Render 状态都拥有自己固定不变的 Props 与 State。
不仅是对象，函数在每次渲染时也是独立的。这就是 *Capture Value* 特性

```
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

初始状态下 count 值为 0，而随着按钮被点击，在每次 Render 过程中，count 的值都会被固化为 1、2、3：
```
// During first render
function Counter() {
  const count = 0; // Returned by useState()
  // ...
  <p>You clicked {count} times</p>;
  // ...
}

// After a click, our function is called again
function Counter() {
  const count = 1; // Returned by useState()
  // ...
  <p>You clicked {count} times</p>;
  // ...
}

// After another click, our function is called again
function Counter() {
  const count = 2; // Returned by useState()
  // ...
  <p>You clicked {count} times</p>;
  // ...
}
```

####  每个Render都有自己的事件处理

```
const App = () => {
  const [temp, setTemp] = React.useState(5);

  const log = () => {
    setTimeout(() => {
      console.log("3 秒前 temp = 5，现在 temp =", temp);
    }, 3000);
  };

  return (
    <div
      onClick={() => {
        log();
        setTemp(3);
        // 3 秒前 temp = 5，现在 temp = 5
      }}
    >
      xyz
    </div>
  );
};
```
执行 `setTemp(3)` 时会交由一个全新的 Render 渲染，所以不会执行 log 函数。
而 3 秒后执行的内容是由 temp 为 5 的那个 Render 发出的，所以结果自然为 5。
原因就是 temp、log 都拥有 `Capture Value` 特性。


####  每次 Render 都有自己的 Effects
`useEffect` 也一样具有 Capture Value 的特性。
`useEffect` 在实际 DOM 渲染完毕后执行，那 `useEffect` 拿到的值也遵循 Capture Value 的特性

```
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

##  如何绕过Capture Value
利用 `useRef` 就可以绕过 Capture Value 的特性。
可以认为 `ref` 在所有 Render 过程中保持着唯一引用，因此所有对 ref 的赋值或取值，拿到的都只有一个最终状态，而不会在每个 Render 间存在隔离。
可以简洁的认为，ref 是 Mutable 的，而 state 是 Immutable 的。

```
function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    // Set the mutable latest value
    latestCount.current = count;
    setTimeout(() => {
      // Read the mutable latest value
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });
  // ...
}
```

### 回收机制
如果通过 `useEffect` 注册了监听事件，那么，在组件被销毁时，需要通过 `useEffect` 的返回值，来销毁监听。

```
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  };
});
```

在组件被销毁时，会执行返回值函数内回调函数。同样，由于 Capture Value 特性，每次 “注册” “回收” 拿到的都是成对的固定值。

### 用同步取代“生命周期”
Function Component 不存在生命周期，它仅仅描述 UI 状态，React 会将其同步到 DOM。

既然是**状态同步**，那么每次渲染的状态都会固化下来，这包括 state、props、useEffect 以及写在 Function Component 中的所有函数。

使用同步，而放弃了生命周期，这会带来一些性能问题，所以我们需要告诉 React 如何比对 Effect。


### 告诉 React 如何对比 Effects

虽然 React 在 DOM 渲染时会 diff 内容，只对改变部分进行修改，而不是整体替换，但却做不到对 Effect 的增量修改识别。因此需要开发者通过 useEffect 的第二个参数告诉 React 用到了哪些外部变量：

```
useEffect(() => {
  document.title = "Hello, " + name;
}, [name]); // 只有name改变的时候，useEffect才会被执行
```












##  其他参考
a-complete-guide-to-useeffect: https://overreacted.io/a-complete-guide-to-useeffect/
精读Function Component 与 Class Component : https://github.com/dt-fe/weekly/blob/master/95.%E7%B2%BE%E8%AF%BB%E3%80%8AFunction%20VS%20Class%20%E7%BB%84%E4%BB%B6%E3%80%8B.md
精读React hook: https://github.com/dt-fe/weekly/blob/master/79.%E7%B2%BE%E8%AF%BB%E3%80%8AReact%20Hooks%E3%80%8B.md
怎么用React Hook造轮子 https://github.com/dt-fe/weekly/blob/master/80.%E7%B2%BE%E8%AF%BB%E3%80%8A%E6%80%8E%E4%B9%88%E7%94%A8%20React%20Hooks%20%E9%80%A0%E8%BD%AE%E5%AD%90%E3%80%8B.md



