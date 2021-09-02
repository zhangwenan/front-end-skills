

##  监听事件


可以使用 `v-on` 指令 (通常缩写为 `@` 符号) 来监听 DOM 事件，并在触发事件时执行一些 JavaScript。
用法为 `v-on:click="methodName"` 或使用快捷方式 `@click="methodName"`


### 事件处理方法

```
<div id="event-with-method">
  <!-- `greet` 是在下面定义的方法名 -->
  <button @click="greet">Greet</button>
</div>
```

```
Vue.createApp({
  data() {
    return {
      name: 'Vue.js'
    }
  },
  methods: {
    greet(event) {
      // `methods` 内部的 `this` 指向当前活动实例
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM event
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
}).mount('#event-with-method')
```


### 内联处理器中的方法
除了直接绑定到一个方法，也可以在内联 JavaScript 语句中调用方法：

```
<div id="inline-handler">
  <button @click="say('hi')">Say hi</button>
  <button @click="say('what')">Say what</button>
</div>
```

```
Vue.createApp({
  methods: {
    say(message) {
      alert(message)
    }
  }
}).mount('#inline-handler')
```

有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 `$event` 把它传入方法：
```
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

```
// ...
methods: {
  warn(message, event) {
    // 现在可以访问到原生事件
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

##  多事件处理器

事件处理程序中可以有多个方法，这些方法由逗号运算符分隔：

```
<!-- 这两个 one() 和 two() 将执行按钮点击事件 -->
<button @click="one($event), two($event)">
  Submit
</button>
```

```
// ...
methods: {
  one(event) {
    // 第一个事件处理器逻辑...
  },
  two(event) {
   // 第二个事件处理器逻辑...
  }
}
```

##  事件修饰符

Vue.js 为 `v-on` 提供了事件修饰符。
* .stop
* .prevent
* .capture
* .self
* .once
* .passive


```
<!-- 阻止单击事件继续传播 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div @click.self="doThat">...</div>


```

使用修饰符时，*顺序*很重要；相应的代码会以同样的顺序产生。
因此，用 `v-on:click.prevent.self` 会阻止所有的点击，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击。


```
<!-- 点击事件将只会触发一次 -->
<a @click.once="doThis"></a>
```
`.once` 修饰符还能被用到自定义的组件事件上。

Vue 还对应 `addEventListener` 中的 `passive` 选项提供了 `.passive` 修饰符。
```
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发   -->
<!-- 而不会等待 `onScroll` 完成                   -->
<!-- 这其中包含 `event.preventDefault()` 的情况   -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` 修饰符尤其能够提升移动端的性能。
不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。
请记住，`.passive` 会告诉浏览器你不想阻止事件的默认行为。


## 按键修饰符
```
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

可以直接将 `KeyboardEvent.key` 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
```
<input @keyup.page-down="onPageDown" />
```

##  按键别名

Vue 为最常用的键提供了别名：
* .enter
* .tab
* .delete (删除和退格)
* .esc
* .space
* .up
* .down
* .left
* .right


##  系统修饰键
* .ctrl
* .alt
* .shift
* .meta

```
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

##  .exact 修饰符
```
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

##  鼠标按钮修饰符
* .left
* .right
* .middle
限制处理函数仅响应特定的鼠标按钮。

##  为什么在 HTML 中监听事件？
略

