

##  声明式渲染

```
<div id="counter">
  Counter: {{ counter }}
</div>
```

```
const Counter = {
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}

Vue.createApp(Counter).mount('#counter')
```

现在数据和 DOM 已经被建立了关联，所有东西都是`响应式`的。
`counter`每秒递增，渲染的 DOM 也会更新。


```
<span v-bind:title="message">
  鼠标悬停几秒钟查看此处动态绑定的提示信息！
</span>
```
`v-bind`被称为`指令`。此处会绑定到 title 属性上。指令带有前缀 `v-`，以表示它们是 Vue 提供的特殊 attribute。


##  处理用户输入
通过 `v-on` 指令添加一个事件监听器，通过它调用在实例中定义的方法。

```
<div id="event-handling">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">反转 Message</button>
</div>
```

```
const EventHandling = {
  data() {
    return {
      message: 'Hello Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}

Vue.createApp(EventHandling).mount('#event-handling')
```


Vue 还提供了 `v-model` 指令，它能轻松实现*表单输入*和*应用状态*之间的**双向绑定**。

```
<div id="two-way-binding">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>
```

```
const TwoWayBinding = {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}

Vue.createApp(TwoWayBinding).mount('#two-way-binding')
```



##  条件与循环
### 条件
```
<div id="conditional-rendering">
  <span v-if="seen">现在你看到我了</span>
</div>
```

```
const ConditionalRendering = {
  data() {
    return {
      seen: true
    }
  }
}

Vue.createApp(ConditionalRendering).mount('#conditional-rendering')
```

### 循环
```
<div id="list-rendering">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

```
const ListRendering = {
  data() {
    return {
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue' },
        { text: 'Build something awesome' }
      ]
    }
  }
}

Vue.createApp(ListRendering).mount('#list-rendering')
```


##  组件化应用构建
在 Vue 中，组件本质上是一个具有预定义选项的实例。

```
<div id="todo-list-app">
  <ol>
     <!--
      现在我们为每个 todo-item 提供 todo 对象
      todo 对象是变量，即其内容可以是动态的。
      我们也需要为每个组件提供一个“key”，稍后再
      作详细解释。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```
const TodoList = {
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Vegetables' },
        { id: 1, text: 'Cheese' },
        { id: 2, text: 'Whatever else humans are supposed to eat' }
      ]
    }
  }
}

const app = Vue.createApp(TodoList)

app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})

app.mount('#todo-list-app')
```

假想的组件拆分：
```
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

##  与自定义元素的关系
Vue 的组件语法部分参考了web组件规范, https://developer.mozilla.org/zh-CN/docs/Web/Web_Components。
例如 Vue 组件实现了 Slot API（https://developer.mozilla.org/zh-CN/docs/Web/API/Element/slot） 与 is attribute。
但是，还是有几个关键差别：

* Web Components 规范已经完成并通过，但未被所有浏览器原生实现。目前 Safari 10.1+、Chrome 54+ 和 Firefox 63+ 原生支持 Web Components。相比之下，Vue 组件不需要任何 polyfill，并且在所有支持的浏览器之下表现一致 (IE 11 除外——请移步阅读这里的详情)。必要时，Vue 组件也可以包裹于原生自定义元素之内。
* Vue 组件提供了纯自定义元素所不具备的一些重要功能，最突出的是跨组件数据流、自定义事件通信以及构建工具集成。



