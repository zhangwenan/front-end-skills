
## generator

`function*` 这种声明方式，会定义一个生成器函数(generator function)，它返回一个 `Generator`对象。

调用一个`生成器函数`并不会马上执行它里面的语句，而是返回一个生成器的`迭代器（iterator）对象`。
当这个迭代器的 `next()` 方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现`yield`的位置为止，`yield`后紧跟迭代器要返回的值。

`next()`方法返回一个对象，这个对象包含两个属性：`value` 和 `done`。

调用 `next()`方法时，如果传入了参数，那么这个参数会传给*上一条执行的 yield语句左边的变量*。比如：

```
function p(v) {
  return new Promise(function(resolve, reject) {
    setTimeout(()=>{resolve(v)}, 1000)
  })
}

function* g(v) {
  let x = yield p('aaaa');  // 比如，这种写法，第2次调用next('222')后，x会是222，打印的就是222
  console.log(x);
}

let gen = g();
gen.next()
```


##  generator转换成async/await写法

```
function getApi(params) {
  return new Promise((resolve) => {
    // 模拟ajax
    setTimeout(() => {
      resolve('api result: ' + params)
    }, 1000)
  })
}

function* gen(stage0) {
  console.log(stage0)
  let stage1 = yield getApi('startParams')
  console.log('stage1', stage1)
  let stage2 = yield getApi(stage1)
  console.log('stage2', stage2)
  let stage3 = yield getApi(stage2)
  console.log('stage3', stage3)
  return 'all Done!!'
}

function run(generator, v) {
  // 需要注意的是，如果这里的next没有入参。那么，后面的执行是无法得到上一次执行的结果的。会是undefined
  let { value, done } = generator.next(v);
  if (!done) {
    value.then((res) => {
      run(generator, res);
    })
  } else {
    console.log(value)
  }
}

run(gen('start'))
```

改造后：
```
function getApi(params) {
  return new Promise((resolve) => {
    // 模拟ajax
    setTimeout(() => {
      resolve('api result: ' + params)
    }, 1000)
  })
}

async function getAllApi() {
  let stage1 = await getApi('startParams')
  console.log('stage1', stage1)
  let stage2 = await getApi(stage1)
  console.log('stage2', stage2)
  let stage3 = await getApi(stage2)
  console.log('stage3', stage3)
  return 'all Done!!'
}

getAllApi()
```

`yield`后面可以跟一个`Promise`。
因此，类似`yield next`，`next`可以是一个`Promise`。
类似`yield func()`，`func()`可以是一个`Promise`。


##  yield*
`yield*` 表达式用于委托给另一个`generator` 或`可迭代对象`。

### 委托给其他生成器
```
function* g1() {
  yield 2;
}

function* g2() {
  yield 1;
  yield* g1();
  yield 3;
}

var iterator = g2();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```


### 委托给其他可迭代对象  
```
function* g3() {
  yield* [1, 2];
  yield* "34";
  yield* arguments;
}

var iterator = g3(5, 6);

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: "3", done: false }
console.log(iterator.next()); // { value: "4", done: false }
console.log(iterator.next()); // { value: 5, done: false }
console.log(iterator.next()); // { value: 6, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### yield* 表达式的值
`yield*` 是一个表达式，不是语句，所以它会有自己的值。

```
function* g4() {
  yield* [1, 2, 3];
  return "foo";
}

var result;

function* g5() {
  result = yield* g4();
}

var iterator = g5();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true },
                              // 此时 g4() 返回了 { value: "foo", done: true }

console.log(result);          // "foo"
```



##  使用generator生成斐波那契数列

```
function* fab(max) {
    var count = 0, last = 0, current = 1;

    while(max > count++) {
        yield current;
        var tmp = current;
        current += last;
        last = tmp;
    }
}

var o = fab(10), ret, result = [];

while(!(ret = o.next()).done) {
    result.push(ret.value);
}

console.log(result); // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```


### 使用迭代器遍历二维数组并转换成一维数组

```
function* iterArr(arr) {            //迭代器返回一个迭代器对象
  if (Array.isArray(arr)) {         // 内节点
      for(let i=0; i < arr.length; i++) {
          yield* iterArr(arr[i]);   // (*)递归
      }
  } else {                          // 离开
      yield arr;
  }
}
// 使用 for-of 遍历:
var arr = ['a', ['b', 'c'], ['d', 'e']];
for(var x of iterArr(arr)) {
        console.log(x);               // a  b  c  d  e
 }

// 或者直接将迭代器展开:
var arr = [ 'a', ['b',[ 'c', ['d', 'e']]]];
var gen = iterArr(arr);
arr = [...gen];                        // ["a", "b", "c", "d", "e"]
```