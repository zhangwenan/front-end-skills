
# https://es6.ruanyifeng.com/#docs/intro

##  babel配置
`.babelrc`配置

```
{
  "presets": [],
  "plugins": []
}
```

presets字段设定转码规则，官方提供的常见规则集有：`@babel/preset-env`, `@babel/preset-react`

`@babel/node`: 提供REPL环境，直接运行代码
`@babel/register`: 重写`require`，对.js/.jsx/.es/.es6文件，自动使用babel转码。

### polyfill

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API。
比如Iterator、Generator、Set、Map、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

可以使用`core-js`和`regenerator-runtime`(后者提供generator函数的转码)，为当前环境提供一个垫片。
Babel 默认不转码的 API 非常多，详细清单可以查看`babel-plugin-transform-runtime`模块的`definitions.js`文件。
https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/runtime-corejs3-definitions.js

### 浏览器环境
Babel 也可以用于浏览器环境，使用@babel/standalone模块提供的浏览器版本，将其插入网页。
https://babeljs.io/docs/en/babel-standalone.html


# let和const
##  变量提升
```
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```
变量foo用var命令声明，会发生变量提升，即脚本开始运行时，变量foo已经存在了，但是没有值，所以会输出undefined。

##  暂时性死区
ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。
凡是在声明之前就使用这些变量，就会报错。
总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。
这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。
暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。


```
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```
上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。只要用到该变量就会报错。

“暂时性死区”，意味着`typeof`不再是一个百分之百安全的操作。
```
typeof x; // ReferenceError，在暂时性死区中操作，会报错
let x;

typeof undeclared_variable // "undefined"，对一个未声明的变量操作，会返回undefined
```

##  块级作用域
ES5，只有全局作用域、函数作用域。
ES6，通过let增加了块级作用域。

```
var tmp = new Date();

function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }
}

f(); // undefined
```

```
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```

块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了。
```
// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}
```

使用const声明一个对象的时候，只能保证，该指向该对象的地址不变。
```
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

需要使用`Object.freeze`，冻结对象。
```
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```

彻底冻结一个对象，还需要遍历。
```
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

##  顶层对象的属性
顶层对象，在浏览器环境指的是`window`对象，在 Node 指的是`global`对象。
ES5 之中，**顶层对象的属性**与全局变量是等价的。

```
window.a = 1;
a // 1

a = 2;
window.a // 2

// 这里，顶层对象的属性赋值与全局变量的赋值，是同一件事。
```

ES6，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；
另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。
也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

```
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```
全局变量a由var命令声明，所以它是顶层对象的属性；
全局变量b由let命令声明，所以它不是顶层对象的属性，返回undefined。


##  globalThis对象

ES2020 在语言标准的层面，引入globalThis作为顶层对象。
也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

垫片库，https://github.com/ungap/global-this，模拟了这个提案，可以在所有环境拿到globalThis。


# 变量的解构赋值(Destructuring)
```
let [ , , third] = ["foo", "bar", "baz"];

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []

let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

事实上，只要某种数据结构具有 `Iterator` 接口，都可以采用数组形式的解构赋值。
```
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

```
// 只有当一个数组成员严格等于undefined，默认值才会生效。`===`成立
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

```
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```


##  对象的解构赋值
对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。
```
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined

// 这里，foo是匹配的模式，baz才是变量。
```


```
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

// 这里，p是模式，不是变量。因此，不会被赋值
```

```
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```

```
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```

对象的解构赋值可以取到继承的属性。
```
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo // "bar"
```

##  交换变量
```
let x = 1;
let y = 2;
[y, x ] = [x, y];
```

##  遍历Map结构
```
const map = new Map();
map.set('a', 1);
map.set('b', 2);

for(let [key, value] of map) {
  // ...
}

for(let [, value] of map) {
  // ...
}
```


# 字符串的扩展
##  字符的 Unicode 表示法
ES6 加强了对 Unicode 的支持，允许采用`\uxxxx`形式表示一个字符，其中xxxx表示字符的 Unicode 码点。



