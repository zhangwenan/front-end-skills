
##  Data Property

组件的 data 选项是一个*函数*。Vue 在创建新组件实例的过程中调用此函数。
它应该*返回一个对象*，然后 Vue 会通过响应性系统将其包裹起来，并以 `$data` 的形式存储在组件实例中。
为方便起见，该对象的任何顶级 property 也直接通过组件实例暴露出来：

```
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// 修改 vm.count 的值也会更新 $data.count
vm.count = 5
console.log(vm.$data.count) // => 5

// 反之亦然
vm.$data.count = 6
console.log(vm.count) // => 6

```

> 这些实例 property 仅在实例首次创建时被添加，所以，需要确保它们都在 data 函数返回的对象中。
> 必要时，要对尚未提供所需值的 property 使用 null、undefined 或其他占位的值。

虽然，可以直接将不包含在 data 中的新 property 添加到组件实例。但，由于该 property 不在背后的响应式 `$data` 对象内，所以 Vue 的响应性系统不会自动跟踪它。

Vue 使用 `$` 前缀通过组件实例暴露自己的内置 API。它还为内部 property 保留 `_` 前缀。
因此，应该避免使用这两个字符开头的的顶级 data property 名称。


##  方法

用 `methods` 选项向组件实例添加方法，它应该是一个包含所需方法的**对象**：

```
const app = Vue.createApp({
  data() {
    return { count: 4 }
  },
  methods: {
    increment() {
      // `this` 指向该组件实例
      this.count++
    }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4

vm.increment()

console.log(vm.count) // => 5
```

Vue 自动为 methods 绑定 `this`，以便于它始终指向组件实例。
这将确保方法在用作事件监听或回调时保持正确的 this 指向。
**在定义 methods 时应避免使用箭头函数**，因为这会阻止 Vue 绑定恰当的 this 指向。

这些 methods 和组件实例的其它所有 property 一样可以在组件的模板中被访问。
```
<button @click="increment">Up vote</button>
```

**从模板调用的方法不应该有任何副作用，比如更改数据或触发异步进程。如果你想这么做，应该换做生命周期钩子。**


##  防抖和节流
Vue 没有内置支持防抖和节流，但可以使用 Lodash 等库来实现。

如果某个组件仅使用一次，可以在 methods 中直接应用防抖：
```
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      // 用 Lodash 的防抖函数
      click: _.debounce(function() {
        // ... 响应点击 ...
      }, 500)
    }
  }).mount('#app')
</script>
```

这种方法对于可复用组件有潜在的问题，因为它们都共享相同的防抖函数。
为了使组件实例彼此独立，可以在生命周期钩子的 `created` 里添加该防抖函数:
```
app.component('save-button', {
  created() {
    // 用 Lodash 的防抖函数
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // 移除组件时，取消定时器
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... 响应点击 ...
    }
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `
})
```

