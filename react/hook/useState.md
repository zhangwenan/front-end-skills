# useState

要使函数组件具有状态管理，可以`useState()` Hook。
`useState(initialValue)`, 返回一个包含2个元素的数组:*状态值*和*状态更新函数*。
状态更新函数，可以接收状态值，或者，一个函数（如下例）。

状态添加到函数组件需要4个步骤: 启用状态、初始化、读取和更新。

```
import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [flag, setFlag] = useState(false);
  return (
    <div className="App">
      <div>{flag ? "开" : "关"}</div>
      <div>
        <button
          type="button"
          onClick={() => {
            setFlag((prev) => !prev);
          }}
        >
          点击1
        </button>
      </div>
    </div>
  );
}
```

## 多种状态

通过多次调用`useState()`，一个函数组件可以拥有多个状态。

```
function MyComponent() {
 const [state1, setState1] = useState(initial1);
 const [state2, setState2] = useState(initial2);
 const [state3, setState3] = useState(initial3);
 // ...
}
```

**每当 React 重新渲染组件时，都会执行useState(initialState)。**
如果初始状态是原始值（数字，布尔值等），则不会有性能问题。当初始状态需要昂贵的性能方面的操作时，可以通过为`useState(computeInitialState)`提供一个函数来使用状态的延迟初始化，如下所示：

```
const [flag, setFlag] = useState(() => {
  console.log("useState invoked");
  return false;
});
```

getInitialState()仅在初始渲染时执行一次，以获得初始状态。在以后的组件渲染中，不会再调用getInitialState()，从而跳过昂贵的操作。


##  Hook原则

* 仅顶层调用 Hook。不能在循环，条件，嵌套函数等中调用`useState()`。在多个`useState()`调用中，渲染之间的调用顺序必须相同。
* 仅从React 函数调用 Hook。必须仅在函数组件或自定义钩子内部调用`useState()`。

##  过时状态

```
setTimeout(() => {
  setCount(count + 1);  // 最终的数字不是我们预期的
}, 3000);

setTimeout(() => {
  setCount((count) => count + 1);   // 符合预期
}, 3000);
```

##  复杂状态管理

useState()用于管理简单状态。对于复杂的状态管理，可以使用`useReducer()`。

```
// useState()实现
import React, { useRef, useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [movies, setMovies] = useState([{name: 'heat'}]);
  const add = (movie) => {
    setMovies([...movies, movie])
  }

  const remove = index => {
    setMovies([
      ...movies.slice(0, index),
      ...movies.slice(index+1)
    ])
  }
  return (
    <div className="App">
      <div></div>
    </div>
  );
}
```

```
// 将状态管理提取到reducer中
// 好处在于，reducer可以单独提取，与其他组件重用，做到了关注点分离
// 并且，即使没有组件，也可以对reducer进行单元测试。
import React, { useReducer, useRef, useEffect, useState } from "react";
import "./styles.css";

function reducer(state, action) {
  switch(action.type) {
    case 'add':
      return [...state, action.item];
    case 'remove':
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]
    default:
      throw new Error()
  }
}

export default function App() {
  const [state, dispatch ] = useReducer(reducer, [{name: 'heat'}]);
  return (
    <div className="App">
      <div></div>
    </div>
  );
}
```




## 状态 vs 引用
假设场景：计算组件渲染的次数。
简单的实现：使用`useState`初始化一个count,并在每次渲染时更新它(使用`useEffect()`)
`useEffect()`在每次渲染后调用`setCount`函数。一旦count更新，组件就会重新渲染。
这样就陷入了循环。

```
import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount((count) => count + 1);
  });
  return (
    <div className="App">
      <div>{count}</div>
    </div>
  );
}
```

```
import React, { useRef, useEffect } from "react";
import "./styles.css";

export default function App() {
  const countRef = useRef(0);
  useEffect(() => {
    countRef.current ++;
  });
  return (
    <div className="App">
      <div>{countRef.current}</div>
    </div>
  );
}
```

