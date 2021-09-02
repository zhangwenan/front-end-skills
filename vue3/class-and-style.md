

##  绑定 HTML Class

### 对象语法
`:class`是 `v-bind:class`的简写。

```
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

```
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

渲染结果为:
```
<div class="static active"></div>
```


```
<div :class="classObject"></div>
```

```
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

使用计算属性
```
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```


### 数组语法

```
<div :class="[activeClass, errorClass]"></div>
```

```
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

渲染结果:
```
<div class="active text-danger"></div>
```

三元表达式:
```
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

数组语法中也可以使用对象语法：
```
<div :class="[{ active: isActive }, errorClass]"></div>
```

##  在组件上使用
```
const app = Vue.createApp({})

app.component('my-component', {
  template: `<p class="foo bar">Hi!</p>`
})
```

```
<div id="app">
  <my-component class="baz boo"></my-component>
</div>
```

渲染结果:
```
<p class="foo bar baz boo">Hi</p>
```

带数据绑定class:
```
<my-component :class="{ active: isActive }"></my-component>
```

组件有多个根元素，需要定义哪些部分将接收这个类。可以使用 `$attrs` 组件属性执行操作：
```
<div id="app">
  <my-component class="baz"></my-component>
</div>
```

```
const app = Vue.createApp({})

app.component('my-component', {
  template: `
    <p :class="$attrs.class">Hi!</p>
    <span>This is a child component</span>
  `
})
```


##  绑定内联样式

### 对象语法

```
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

```
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```


直接绑定到一个样式对象。
```
<div :style="styleObject"></div>
```

```
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

### 数组语法

```
<div :style="[baseStyles, overridingStyles]"></div>
```


### 自动添加前缀
在 `:style` 中使用需要一个 vendor prefix (浏览器引擎前缀) 的 CSS property 时，Vue 将自动侦测并添加相应的前缀。
Vue 是通过运行时检测来确定哪些样式的 property 是被当前浏览器支持的。
如果浏览器不支持某个 property，Vue 会进行多次测试以找到支持它的前缀。

### 多重值
可以为 style 绑定中的 property 提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：
```
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```
只会渲染数组中**最后一个被浏览器支持的值**。

