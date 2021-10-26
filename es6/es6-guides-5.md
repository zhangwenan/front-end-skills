
# Generator函数

Generator 函数有多种理解角度。
语法上，首先可以把它理解成，`Generator` 函数是一个状态机，封装了多个内部状态。
执行 `Generator` 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个*遍历器对象生成函数*。
返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。
一是，function关键字与函数名之间有一个星号；
二是，函数体内部使用yield表达式，定义不同的内部状态。

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。

`yield`表达式是暂停执行的标记，而`next`方法可以恢复执行。
Generator 函数从上次`yield`表达式停下的地方，一直执行到下一个`yield`表达式。
`next`方法返回的对象中，`value`属性就是当前yield表达式的值; `done`属性的值，表示遍历是否结束。
如果没有`return`，那么最后返回的对象中，`value`是undefined。

```
function* foo(x, y) { ··· }
```

遍历器对象的next方法的运行逻辑如下。
* 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
* 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
* 如果该函数没有return语句，则返回的对象的value属性值为undefined。

只有当调用next方法、内部指针指向该语句时才会执行，因此，相当于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。
比如：
Generator 函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。
```
function* f() {
  console.log('执行了！')
}

var generator = f();

setTimeout(function () {
  generator.next()
}, 2000);
```

`yield`表达式如果用在另一个表达式之中，必须放在圆括号里面。
```
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

`yield`表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
```
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

##  Generator函数 与 Iterator 接口的关系
由于 Generator 函数就是*遍历器生成函数*，因此，可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。

Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。
```
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true

let arr = [];
let i = arr[Symbol.iterator]();
i[Symbol.iterator]() === i
// true
```

##  next 方法的参数
`yield`表达式本身没有返回值，或者说总是返回`undefined`。
`next`方法可以带一个参数，该参数就会被当作上一个`yield`表达式的返回值。

```
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```






