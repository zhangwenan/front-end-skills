#   模块化

|方式|导出|引入|
|-|-|-|
|ES6|```export {firstName};```|```import * as circle from './circle';```|
|CommonJS|```module.exports = myFunc;```|```var $ = require('jquery');```|

模块化的好处: 
*   解决命名冲突
*   依赖管理
*   代码更加可读
*   提高复用性

示例1:
```
function fn1() {
  // ...
}
function fn2() {
  // ...
}
```
缺点：污染全局，命名容易冲突


示例2, 使用对象的属性:
```
var myModule = {
  var1: 1,
  fn1: function() {},
}
```
缺点: 没有私有变量，外部可以修改。


示例3, 立即执行函数: 
```
;(function() {
  // ....
})()
```

##  CommonJS
Node.js设计了 CommonJS
```
// a.js
module.exports = {
  a: 1,
}
// or
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```


require基本实现
```
var module = require('./a.js')
module.a
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
  a: 1,
}
// 基本实现
var module = {
  id: 'xxxx', // 我总得知道怎么去找到他吧
  exports: {}, // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function(module) {
  // 导出的东西
  var a = 1
  module.exports = a
  return module.exports
}
// 然后当我 require 的时候去找到独特的
// id，然后将要使用的东西用立即执行函数包装下，over
```
`module.exports` 和 `exports`，用法相似，但是不能对 `exports`直接赋值，不会有任何效果。

```
var a = {}
a.exports = {}
// 把 e 看成 exports，现在 e === a.exports
var e = a.exports
// 引用的关系，同时也修改了 a.exports
e.c = 1
console.log(a.exports.c) // -> 1

// 但是当给 e 赋值的话就等于修改了引用了, 所以并没有修改 a.exports
e = xxxx
```

CommonJS规范是 Node 独有的，浏览器中使用就需要用到 `Browserify` 解析了，所以后面又蹦出了两个规范。


##  AMD && CMD
AMD 是由 `RequireJS` 提出的，CMD 由 `SeaJS` 提出。两者用法基本相似，当然现在用的人应该也不多了，了解即可。
```
// AMD
define(['./a', './b'], function(a, b) {
  a.do()
  b.do()
})
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  var b = require('./b')
  b.doSomething()
})
```

##  ES6模块
```
// 引入的语法就这样 import，XXX 这里有很多语法变化
import XXX from './a.js'

// 导出也有很多语法变化的写法，基本的就这两个，反正语法没什么难得
export function a() {}
export default function() {}
```

