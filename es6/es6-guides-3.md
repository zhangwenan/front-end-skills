
# Promise

##  Promise的缺点
* 无法取消Promise，一旦新建它就会立即执行，无法中途取消。
* 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
* 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）


```
promise.then(successFunc, failFunc);
```

**resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例**
```
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
```

```
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => { console.log('1111'); reject(new Error('fail')) }, 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => { console.log('2222'); resolve(p1) }, 1000)
})

p2
  .then(result => console.log(result), reject => { console.log('111reject'); console.log(reject); })
  .catch(error => { console.log('catch'); console.log(error) })
// 2222
// 1111
// 111reject
// Error: fail
```


```
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// 注意这里的顺序
// Promise
// Hi!
// resolved
```

调用resolve或reject并不会终结 Promise 的参数函数的执行。
```
new Promise((resolve, reject) => {
  resolve(1); // resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
  console.log(2); // 这里仍然会执行，并且，在resolve之前就先打印了
}).then(r => {
  console.log(r);
});
// 2
// 1
```

##  Promise.prototype.then()
`then`方法是定义在原型对象`Promise.prototype`上的。

```
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)    // 回调函数，可以返回promise对象
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```

##  Promise.prototype.catch()

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```

等价于：
```
// 写法一
const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
});
promise.catch(function(error) {
  console.log(error);
});

// 写法二
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
});
promise.catch(function(error) {
  console.log(error);
});
```
**如果 Promise 状态已经变成resolved，再抛出错误是无效的。**
Promise 在`resolve`语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。
一般来说，不需要在`then()`方法里面定义 `Reject` 状态的回调函数（即then的第二个参数），总是使用`catch`方法。

`Promise` 对象抛出的错误不会传递到外层代码，即不会有任何反应。简单来说，就是Promise会吃掉错误。
```
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

Node.js 有一个`unhandledRejection`事件，专门监听未捕获的reject错误。

```
process.on('unhandledRejection', function (err, p) {
  // err是错误对象，
  // p是报错的 Promise 实例，它可以用来了解发生错误的环境信息。
  throw err;
});
```

```
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  setTimeout(function () { throw new Error('test') }, 0)
});
promise.then(function (value) { console.log(value) });
// ok
// Uncaught Error: test
```
Promise 指定在下一轮“事件循环”再抛出错误。此时，Promise 的运行已经结束了，
所以，这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

##  Promise.prototype.finally() 
`finally`方法里面的操作，与状态无关的，不依赖于 Promise 的执行结果。
```
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```
不管前面的 Promise 是fulfilled还是rejected，都会执行回调函数callback。

finally方法总是会返回原来的值。
```
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})

// reject 的值是 3
Promise.reject(3).finally(() => {})
```

##  Promise.all()

```
// 普通的try/catch
try {
  throw new Error('test');
} catch(e) {
  reject(e);
}

// Promise的catch接收一个函数
p.then((r)=>{
  // ...
}).catch(error => console.log(error))
```

`Promise.all()`方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

```
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]

// p2 执行完catch方法后，也会变成resolved，
// 因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数。
```

##  Promise.race() 
```
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

##  Promise.allSettled()
```
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results); // results数组的每个成员都是一个对象
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

##  Promise.any()
只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；
如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。

```
Promise.any([
  fetch('https://v8.dev/').then(() => 'home'),
  fetch('https://v8.dev/blog').then(() => 'blog'),
  fetch('https://v8.dev/docs').then(() => 'docs')
]).then((first) => {  // 只要有一个 fetch() 请求成功
  console.log(first);
}).catch((error) => { // 所有三个 fetch() 全部请求失败
  console.log(error);
});
```
如果所有三个操作都变成rejected，那么await命令就会抛出错误。
`Promise.any()`抛出的错误，不是一个一般的 Error 错误对象，而是一个 `AggregateError` 实例。
它相当于一个数组，每个成员对应一个被rejected的操作所抛出的错误。下面是 AggregateError 的实现示例。

```
// new AggregateError() extends Array

const err = new AggregateError();
err.push(new Error("first error"));
err.push(new Error("second error"));
// ...
throw err;
```

```
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results); // [-1, Infinity]
});
```

##  Promise.resolve()
```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

* 参数是一个Promise实例。则原样返回
* 不带任何参数。则，直接返回一个resolved状态的 Promise 对象。
* 参数不是具有`then()`方法的对象，或根本就不是对象。则，返回新的 Promise 对象，状态为`resolved`
* 参数是一个`thenable`对象。则将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。
```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);  // 42
});
```

注意，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。
```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```
`setTimeout(fn, 0)`在下一轮“事件循环”开始时执行，
`Promise.resolve()`在本轮“事件循环”结束时执行，
`console.log('one')`则是立即执行，因此最先输出。


##  Promise.reject()
```
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
```
Promise.reject('出错了')
.catch(e => {
  console.log(e === '出错了')
})
// true
```

##  Generator 函数与 Promise 的结合
```
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  const it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);
```


##  Promise.try()
