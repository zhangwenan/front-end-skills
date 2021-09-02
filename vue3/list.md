

##  v-for
```
<ul id="array-rendering">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

```
Vue.createApp({
  data() {
    return {
      items: [
        { message: 'Foo' }, 
        { message: 'Bar' }
      ]
    }
  }
}).mount('#array-rendering')
```



**在 v-for 块中，我们可以访问所有父作用域的 property。**
```
<ul id="array-with-index">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```
Vue.createApp({
  data() {
    return {
      parentMessage: 'Parent',
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  }
}).mount('#array-with-index')
```

**也可以用 of 替代 in 作为分隔符**
```
<div v-for="item of items"></div>
```

**可以用 v-for 来遍历一个对象的 property**

```
<ul id="v-for-object" class="demo">
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

// 第2个参数为对象的 property 名称 (也就是键名 key)
// 第3个参数为索引
```
<ul id="v-for-object" class="demo">
  <li v-for="(value, name, index) in myObject">
    {{ index }}. {{ name }}: {{ value }}
  </li>
</ul>
```


```
Vue.createApp({
  data() {
    return {
      myObject: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}).mount('#v-for-object')
```

> 在遍历对象时，会按 `Object.keys()` 的结果遍历，但是不能保证它在不同 JavaScript 引擎下的结果都一致。


###  维护状态
当 Vue 正在更新使用 `v-for` 渲染的元素列表时，它默认使用**“就地更新”**的策略。
如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。

这个默认的模式是高效的，但是**只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出**。

加上`key`属性，则不使用就地更新策略。`key`的值，建议使用字符串或者数值，而不是对象或者数组之类的非基本类型值。
```
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```
建议尽量使用key，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。



##  数组更新检测

### 变更方法
Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：
* push()
* pop()
* shift()
* unshift()
* splice()
* sort()
* reverse()
变更方法，顾名思义，会变更调用了这些方法的原始数组。即，改变原始数组。

### 替换数组
非变更方法，比如，`filter()`,`concat()`,`slice()`。它们不会变更原始数组，而总是返回一个新数组。
当使用非变更方法时，可以用新数组替换旧数组：
```
example1.items = example1.items.filter(item => item.message.match(/Foo/))
```
Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的启发式方法，
所以，用一个含有相同元素的数组去替换原来的数组是非常高效的操作。


## 显示过滤/排序后的结果
有时，我们想要显示一个数组经过过滤或排序后的版本，而不实际变更或重置原始数据。
在这种情况下，可以创建一个计算属性，来返回过滤或排序后的数组。

```
<li v-for="n in evenNumbers" :key="n">{{ n }}</li>
```

```
data() {
  return {
    numbers: [ 1, 2, 3, 4, 5 ]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(number => number % 2 === 0)
  }
}
```

在计算属性不适用的情况下 (例如，在嵌套 v-for 循环中) 你可以使用一个方法：
```
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
</ul>
```

```
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

##  在 v-for 里使用值的范围
v-for 也可以接受整数。在这种情况下，它会把模板重复对应次数。
```
<div id="range" class="demo">
  <span v-for="n in 10" :key="n">{{ n }} </span>
</div>
```


### 在 <template> 中使用 v-for
```
<ul>
  <template v-for="item in items" :key="item.msg">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

###  v-for 与 v-if 一同使用
> 不推荐在同一元素上使用 v-if 和 v-for。

当它们处于同一节点，`v-if` 的优先级比 `v-for` 更高，这意味着 `v-if` 将没有权限访问 `v-for` 里的变量：
```
<!-- This will throw an error because property "todo" is not defined on instance. -->

<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

可以修改如下：
```
<template v-for="todo in todos" :key="todo.name">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

### 在组件上使用 v-for

```
<my-component v-for="item in items" :key="item.id"></my-component>
```
这里，任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。
为了把迭代数据传递到组件里，我们要使用 props：

```
<my-component
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
></my-component>
```
不自动将 item 注入到组件里的原因是，这会使得组件与 v-for 的运作紧密耦合。
明确组件数据的来源能够使组件在其他场合重复使用。

```
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Add a todo</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="E.g. Feed the cat"
    />
    <button>Add</button>
  </form>
  <ul>
    <todo-item
      v-for="(todo, index) in todos"
      :key="todo.id"
      :title="todo.title"
      @remove="todos.splice(index, 1)"
    ></todo-item>
  </ul>
</div>
```

```
const app = Vue.createApp({
  data() {
    return {
      newTodoText: '',
      todos: [
        {
          id: 1,
          title: 'Do the dishes'
        },
        {
          id: 2,
          title: 'Take out the trash'
        },
        {
          id: 3,
          title: 'Mow the lawn'
        }
      ],
      nextTodoId: 4
    }
  },
  methods: {
    addNewTodo() {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})

app.component('todo-item', {
  template: `
    <li>
      {{ title }}
      <button @click="$emit('remove')">Remove</button>
    </li>
  `,
  props: ['title'],
  emits: ['remove']
})

app.mount('#todo-list-example')
```

