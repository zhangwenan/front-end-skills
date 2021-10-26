
#   Iterator（遍历器）
遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。
任何数据结构只要部署 `Iterator` 接口，就可以完成遍历操作。

`Iterator` 的作用有三个：
1. 为各种数据结构，提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令`for...of`循环。

Iterator 的遍历过程是这样的。
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，**遍历器对象本质上，就是一个指针对象。**
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。
每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。

```
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++]} :
        {done: true};
    }
  };
}
```

由于 Iterator 只是把接口规格加到数据结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的，完全可以写出没有对应数据结构的遍历器对象，或者说用遍历器对象模拟出数据结构。

如果使用 TypeScript 的写法，*遍历器接口（Iterable）*、*指针对象（Iterator）*和*next方法返回值*的规格可以描述如下。

```
interface Iterable {
  [Symbol.iterator]() : Iterator,
}

interface Iterator {
  next(value?: any) : IterationResult,
}

interface IterationResult {
  value: any,
  done: boolean,
}
```

一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。
凡是部署了Symbol.iterator属性的数据结构，就称为，部署了遍历器接口。

ES6 规定，默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性，
或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（`iterable`）。

`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的**遍历器生成函数**。
执行这个函数，就会返回一个遍历器。

至于属性名`Symbol.iterator`，它是一个表达式，返回Symbol对象的iterator属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内。

```
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```


```
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```


```
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

通过遍历器实现指针结构：
```
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next };

  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return { done: false, value: value };
    }
    return { done: true };
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i); // 1, 2, 3
}
```

为对象添加 Iterator 接口
```
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        }
        return { value: undefined, done: true };
      }
    };
  }
};
```

对于类似数组的对象（**存在数值键名和length属性**），部署 Iterator 接口，有一个简便方法，就是`Symbol.iterator`方法直接引用数组的 Iterator 接口。
```
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.querySelectorAll('div')] // 可以执行了
```
NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。
上面代码中，我们将它的遍历接口改成数组的Symbol.iterator属性，可以看到没有任何影响。

```
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

```
var $iterator = ITERABLE[Symbol.iterator]();
var $result = $iterator.next();
while (!$result.done) {
  var x = $result.value;
  // ...
  $result = $iterator.next();
}
```


##  调用 Iterator 接口的场合
### 解构赋值
对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。

```
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

### 扩展运算符
扩展运算符（...）也会调用默认的 Iterator 接口。

```
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。
```
let arr = [...iterable];
```

### yield*
`yield*`后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
```
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

### 其他场合
由于数组的遍历会调用遍历器接口，所以，任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。
*   for...of
*   Array.from()
*   Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
*   Promise.all()
*   Promise.race()

##  字符串的 Iterator 接口
覆盖原生的`Symbol.iterator`方法，可以达到修改遍历器行为的目的。

```
var str = new String("hi");

[...str] // ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

[...str] // ["bye"]
str // "hi"
```

##  Iterator 接口与 Generator 函数
`Symbol.iterator()`方法的最简单实现，是使用 `Generator` 函数。
```
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```


##  遍历器对象的 return()，throw()
如果`for...of`循环提前退出（通常是因为出错，或者有break语句），就会调用return()方法。
如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return()方法。

```
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}
```

下面的两种情况，都会触发执行return()方法。
```
// 情况一。输出文件的第一行以后，就会执行return()方法，关闭这个文件
for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;
}

// 情况二。会在执行return()方法关闭文件之后，再抛出错误。
for (let line of readLinesSync(fileName)) {
  console.log(line);
  throw new Error();
}
```

```
const arr = ['red', 'green', 'blue'];

arr.forEach(function (element, index) {
  console.log(element); // red green blue
  console.log(index);   // 0 1 2
});
```

`for...in`循环读取键名;
`for...of`循环读取键值。

```
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
  // for...of循环不会返回数组arr的foo属性。
}
```

##  entries()、keys()、values()

* entries() 返回一个遍历器对象，用来遍历`[键名, 键值]`组成的数组。对于数组，键名就是索引值；对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
* keys() 返回一个遍历器对象，用来遍历所有的键名。
* values() 返回一个遍历器对象，用来遍历所有的键值。

并不是所有类似数组的对象都具有 Iterator 接口，当它没有Iterator接口时，一个简便的解决方法，就是使用`Array.from`方法将其转为数组。

```
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```


##  对象
```
let es6 = {
  edition: 6,
  committee: "TC39",
  standard: "ECMA-262"
};

for (let e of es6) {
  console.log(e);
}
// TypeError: es6[Symbol.iterator] is not a function
```

对象未部署 Iterator接口的时候，无法使用 `for...of`进行遍历。
一种解决方法是，使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组。

```
for(let key of Object.keys(someObj)) {
  console.log(someObj[key])
}
```

另一个方法是使用 Generator 函数将对象重新包装一下。
```
const obj = { a: 1, b: 2, c: 3 }

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, '->', value);
}
// a -> 1
// b -> 2
// c -> 3
```

##  各种遍历方法的对比

最原始的写法就是for循环。
```
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index]);
}
```

for循环写法比较麻烦，因此数组提供内置的forEach方法。
```
myArray.forEach(function (value) {
  console.log(value);
  // 无法中途跳出forEach循环，break命令或return命令都不能奏效。
});
```

`for...in`循环可以遍历数组的键名。
```
for (var index in myArray) {
  console.log(myArray[index]);
}
```
`for...in`循环有几个缺点。
1. 数组的键名是数字，但是，`for...in`循环是以字符串作为键名，比如“0”、“1”、“2”。
2. `for...in`循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
3. 某些情况下，`for...in`循环会以任意顺序遍历键名。
总之，`for...in`循环主要是为遍历对象而设计的，不适用于遍历数组。


`for...of`循环。可以与break、continue和return配合使用。
```
for (var n of fibonacci) {
  if (n > 1000)
    break;
  console.log(n);
}
```

