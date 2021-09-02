
#  组件基础

##  基本实例

```
// 创建一个Vue 应用
const app = Vue.createApp({})

// 定义一个名为 button-counter 的新全局组件
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
})

app.mount('#components-demo')
```

```
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

因为组件是可复用的组件实例，所以它们与根实例接收相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。

为了能在模板中使用，这些组件必须先注册以便 Vue 能够识别。
这里有两种组件的注册类型：**全局注册**和**局部注册**。


##  通过 Prop 向子组件传递数据

```
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```

```
<div id="blog-post-demo" class="demo">
  <blog-post title="My journey with Vue"></blog-post>
  <blog-post title="Blogging with Vue"></blog-post>
  <blog-post title="Why Vue is so fun"></blog-post>
</div>
```


```
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

```
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

##  监听子组件事件

父级组件可以像处理原生 DOM 事件一样通过 `v-on` 或 `@` 监听子组件实例的任意事件，
同时子组件可以通过调用内建的 `$emit` 方法并传入事件名称来触发一个事件。

```
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
      @enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
```

```
app.component('blog-post', {
  props: ['title'],
  emits: ['enlargeText'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button @click="$emit('enlargeText')">
        Enlarge text
      </button>
    </div>
  `
})
```

###  使用事件抛出一个值

```
<button @click="$emit('enlargeText', 0.1)">
  Enlarge text
</button>
```

父级组件监听这个事件的时候，可以通过 `$event` 访问到被抛出的这个值
```
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

```
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

```
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### 在组件上使用 v-model
```
<input v-model="searchText" />
```
相当于

```
<input :value="searchText" @input="searchText = $event.target.value" />
```

当用在组件上时，`v-model` 则会这样：
```
<custom-input v-model="searchText"></custom-input>
```
相当于:
```
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

```
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

或者
```
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) { 
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

##  通过插槽分发内容

可以使用`<slot>` 作为我们想要插入内容的占位符。
```
<alert-box>
  Something bad happened.
</alert-box>
```
```
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```


##  动态组件

```
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component :is="currentTabComponent"></component>
```

##  解析 DOM 模板时的注意事项
```
<table>
  <blog-post-row></blog-post-row>
</table>
```
这个自定义组件 `<blog-post-row>` 会被作为无效的内容提升到外部，并导致最终渲染结果出错。
我们可以使用特殊的 `v-is` 指令作为一个变通的办法：

```
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

```
<!-- 错误的，这样不会渲染任何东西 -->
<tr v-is="blog-post-row"></tr>

<!-- 正确的 -->
<tr v-is="'blog-post-row'"></tr>
```

HTML attribute 名不区分大小写，因此浏览器将所有大写字符解释为小写。
这意味着当你在 DOM 模板中使用时，驼峰 prop 名称和 event 处理器参数需要使用它们的 kebab-cased (横线字符分隔) 等效值：

```
app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```
<!-- 在HTML则是横线字符分割 -->

<blog-post post-title="hello!"></blog-post>
```

如果我们从以下来源使用模板的话，就没有这条限制：

* 字符串模板 (例如：template: '...')
* 单文件组件
* `<script type="text/x-template">`


