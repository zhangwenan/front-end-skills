##  模板语法

Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层组件实例的数据。
所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。
结合响应性系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

也可以不用模板，直接写渲染 (render) 函数，使用可选的 JSX 语法。


##  插值

### 文本
数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值：

```
<span>Message: {{ msg }}</span>
```

通过使用 `v-once` 指令，也能执行一次性地插值，当数据改变时，插值处的内容不会更新。

```
<span v-once>这个将不会改变: {{ msg }}</span>
```


### 原始HTML

```
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### Attribute
Mustache 语法不能在 HTML attribute 中使用，然而，可以使用 `v-bind` 指令：

```
<div v-bind:id="dynamicId"></div>
```
如果绑定的值是 null 或 undefined，那么该 attribute 将不会被包含在渲染的元素上。


###  使用 JavaScript 表达式
```
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

有个限制，**每个绑定都只能包含单个表达式**，所以下面的例子都不会生效。
```
<!--  这是语句，不是表达式：-->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```


##  指令
指令 (Directives) 是带有 `v-` 前缀的特殊 attribute。指令 attribute 的值预期是单个 JavaScript 表达式 (v-for 和 v-on 是例外情况)。
指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。

```
<p v-if="seen">现在你看到我了</p>
```


### 参数

一些指令能够接收*一个“参数”*，在指令名称之后以冒号表示。例如：

```
<a v-bind:href="url"> ... </a>

<a v-on:click="doSomething"> ... </a>
```

### 动态参数
可以在指令参数中使用 JavaScript 表达式，方法是用方括号括起来

```
<!--
注意，参数表达式的写法存在一些约束，如之后的“对动态参数表达式的约束”章节所述。
-->
<a v-bind:[attributeName]="url"> ... </a>

<a v-on:[eventName]="doSomething"> ... </a>
```

### 修饰符
修饰符 (modifier) 是以半角句号。指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。
例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`：

```
<form v-on:submit.prevent="onSubmit">...</form>
```

##  缩写

### `v-bind`缩写
```
<!-- 完整语法 -->
<a v-bind:href="url"> ... </a>

<!-- 缩写 -->
<a :href="url"> ... </a>

<!-- 动态参数的缩写 -->
<a :[key]="url"> ... </a>
```

### `v-on` 缩写
```
<!-- 完整语法 -->
<a v-on:click="doSomething"> ... </a>

<!-- 缩写 -->
<a @click="doSomething"> ... </a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

它们看起来可能与普通的 HTML 略有不同，但 `:` 与 `@` 对于 attribute 名来说都是合法字符，在所有支持 Vue 的浏览器都能被正确地解析。而且，它们不会出现在最终渲染的标记中。


##  注意事项

### 对动态参数值约定

动态参数预期会求出一个字符串，异常情况下值为`null`。这个特殊的 `null` 值可以被显性地用于移除绑定。
任何其它非字符串类型的值都将会触发一个警告。

###  对动态参数表达式约定
动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。例如：
```
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

### JavaScript 表达式
模板表达式都被放在沙盒中，只能访问一个*受限的列表*，如 `Math` 和 `Date`。不应该在模板表达式中试图访问用户定义的全局变量。


