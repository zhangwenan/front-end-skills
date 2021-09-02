
##  表单输入绑定
`v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值，
而总是将当前活动实例的数据作为数据来源。
因此，应该通过 JavaScript 在组件的 data 选项中声明初始值。

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：
* `text` 和 `textarea` 元素使用 `value` property 和 `input` 事件；
* `checkbox` 和 `radio` 使用 `checked` property 和 `change` 事件；
* `select` 字段将 `value` 作为 prop 并将 `change` 作为事件。

对于需要使用输入法 (如中文、日文、韩文等) 的语言，你会发现 `v-model` 不会在输入法组织文字过程中得到更新。
如果你也想响应这些更新，请使用 `input` 事件监听器和 `value` 绑定，而不是使用 `v-model`。


### 文本 (Text)

```
<input v-model="message" placeholder="edit me" />
<p>Message is: {{ message }}</p>
```

### 多行文本 (Textarea)
```
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br />
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

```
<!-- bad, 错误 -->
<textarea>{{ text }}</textarea>

<!-- good, 正确 -->
<textarea v-model="text"></textarea>
```


### 复选框 (Checkbox)
```
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

```
<div id="v-model-multiple-checkboxes">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames" />
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
  <label for="mike">Mike</label>
  <br />
  <span>Checked names: {{ checkedNames }}</span>
</div>
```

```
Vue.createApp({
  data() {
    return {
      checkedNames: []
    }
  }
}).mount('#v-model-multiple-checkboxes')
```

### 单选框 (Radio)
```
<div id="v-model-radiobutton">
  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">One</label>
  <br />
  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Two</label>
  <br />
  <span>Picked: {{ picked }}</span>
</div>
```

```
Vue.createApp({
  data() {
    return {
      picked: ''
    }
  }
}).mount('#v-model-radiobutton')
```

### 选择框 (Select)
```
<div id="v-model-select" class="demo">
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
```

```
Vue.createApp({
  data() {
    return {
      selected: ''
    }
  }
}).mount('#v-model-select')
```

多选时 (绑定到一个数组)：
```
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br />
<span>Selected: {{ selected }}</span>
```

```
<div id="v-model-select-dynamic" class="demo">
  <select v-model="selected">
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
```

##  值绑定

### 复选框 (Checkbox)
```
<input type="checkbox" v-model="toggle" true-value="yes" false-value="no" />
```

### 单选框 (Radio)
```
<input type="radio" v-model="pick" v-bind:value="a" />
```

```
// 当选中时
vm.pick === vm.a
```


### 选择框选项 (Select Options)
```
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option :value="{ number: 123 }">123</option>
</select>
```

```
// 当被选中时
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

##  修饰符
### .lazy
在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步 (除了上述输入法组织文字时)。
你可以添加 `lazy` 修饰符，从而转为在 `change` 事件_之后_进行同步：

```
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" />
```


### .number
自动将用户的输入值转为数值类型
```
<input v-model.number="age" type="number" />
```

### .trim
自动过滤用户输入的首尾空白字符

```
<input v-model.trim="msg" />
```