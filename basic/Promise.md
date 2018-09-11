

ES6 将`Promise`写进了语言标准，原生提供了Promise对象。

`Promise` 就是一个代表了异步操作最终完成或者失败的**对象**.

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的*结果*。
从语法上说，Promise 是一个*对象*，从它可以获取异步操作的消息。

大多数人都在使用由其他函数创建并返回的promise

Promise的特点
1.  对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。


Promise也有一些缺点。首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

如果某些事件不断地反复发生，一般来说，使用 [Stream](https://nodejs.org/api/stream.html) 模式是比部署Promise更好的选择。

### 基本用法

ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。
Promise*构造函数*接受一个函数作为参数，该函数的两个参数分别是resolve和reject。这两个函数，由 JavaScript 引擎提供。

```
const promise = new Promise( (resolve, reject)=>{
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
then方法可以接受两个回调函数作为参数。
第一个回调函数是Promise对象的状态变为resolved时调用，
第二个回调函数是Promise对象的状态变为rejected时调用。其中，第二个函数是可选的。
这两个函数都接受Promise对象传出的值作为参数。

```
promise.then((value)=>{
  // success
}, (error)=>{
  // failure
});
```

Promise新建后，会立即执行。

### 执行顺序

```
let promise = new Promise(function(resolve, reject) {
    console.log('Promise');
    resolve();
});

promise.then(function() {
    console.log('resolved.');
});

console.log('Hi!');
```

Promise 新建后立即执行，所以首先输出的是Promise。
然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以resolved最后输出。


reject函数的参数通常是Error对象的实例，表示抛出的错误，比如: `reject(new Error('Shit happen'));`
resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例，比如：

```
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```
p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。
如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；
如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行。


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
// Error: fail
```

p1是一个 Promise，3 秒之后变为rejected。
p2的状态在 1 秒之后改变，resolve方法返回的是p1。
由于p2返回的是另一个 Promise，导致p2自己的状态无效了，由p1的状态决定p2的状态。
所以，后面的then语句都变成针对后者（p1）。又过了 2 秒，p1变为rejected，导致触发catch方法指定的回调函数。


调用resolve或reject并不会终结 Promise 的参数函数的执行。

```
new Promise((resolve, reject)=>{
    resolve(1);
    console.log(2);
})
.then((num)=>{
    console.log(num)
})
```

调用resolve(1)以后，后面的console.log(2)还是会执行，并且会首先打印出来。
这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务

通常，resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，
而不应该直接写在resolve或reject的后面。
所以，最好在它们前面加上return语句，这样就不会有意外。



Promise.prototype.then()
Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。

采用链式的then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。


Promise.prototype.catch()
Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。
reject方法就等同于抛出错误。

```
getJSON('/posts.json').then(function(posts) {
    // ...
}).catch(function(error) {
    // 异步操作失败，抛出错误，这里能捕捉到
    // 异步操作成功，进入前面的then回调，但是执行出错，也能在这里捕捉到
    console.log('发生错误！', error);
});
```

// throw new Error('aa')


如果 Promise 状态已经变成resolved，再抛出错误是无效的。
```
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```


```
const promise1 = new Promise((resolve, reject)=>{
    setTimeout(() => {
        console.log(111)
        reject(new Error('promise1'))
    }, 1000);
})

const promise2 = new Promise((resolve, reject)=>{
    setTimeout(() => {
        console.log(222)
        reject(new Error('promise2 Err'))
    }, 1000);
})
.catch((err)=>{console.log(err)})   // 如果没有这一行，promise2的报错，将得不到处理

promise1.then(promise2)
.catch((err)=>{ console.log(err); })
```

建议总是使用catch方法，而不使用then方法的第二个参数。

如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。
```
try{
    const promise1 = new Promise((resolve, reject)=>{
        setTimeout(() => {
            console.log(111)
            reject(new Error('promise1'))
        }, 1000);
    })
}
catch(err){
    console.log(err); // 此处不会执行，因为这里无法获取 promise1 抛出的错误信息。
}
```

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
// 这里123还是被打印出来了，Promise 内部的错误不会影响到 Promise 外部的代码，
// 通俗的说就是“Promise 会吃掉错误”。
```

catch返回的也是 Promise对象。catch方法内，也可以抛出错误。但，这个错误不会被传递到外层，需要有catch方法来捕获。

```
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};
someAsyncThing().then(function() {
  return someOtherAsyncThing();
}).catch(function(error) {
  console.log('oh no', error);
  // 下面一行会报错，因为y没有声明
  y + 2;
}).catch(function(error) {
  console.log('carry on', error);
});
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]

```


### Promise.prototype.finally()

`finally`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

```
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。
这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

finally本质上是then方法的特例。

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

它的实现为:

```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```
上面代码中，不管前面的 Promise 是fulfilled还是rejected，都会执行回调函数callback。

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


### Promise.all()

Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```
const p = Promise.all([p1, p2, p3]);
```

Promise.all方法接受一个数组作为参数，
p1、p2、p3都是 Promise 实例，如果不是，就会先调用Promise.resolve方法，
将参数转为 Promise 实例，再进一步处理。
（Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）

p的状态由p1、p2、p3决定，分成两种情况。

（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。


```
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```

上面代码中，promises是包含 6 个 Promise 实例的数组，只有这 6 个实例的状态都变成fulfilled，或者其中有一个变为rejected，才会调用Promise.all方法后面的回调函数。

```
const databasePromise = connectDatabase();

const booksPromise = databasePromise
  .then(findAllBooks);

const userPromise = databasePromise
  .then(getCurrentUser);

Promise.all([
  booksPromise,
  userPromise
])
.then(([books, user]) => pickTopRecommentations(books, user));
```

如果作为参数的 Promise 实例，自己定义了catch方法，
那么它一旦被rejected，并不会触发Promise.all()的catch方法。

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
```

上面代码中，p1会resolved，p2首先会rejected，
但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，p2指向的实际上是这个实例。
该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved，
因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数。
如果p2没有自己的catch方法，就会调用Promise.all()的catch方法。


### Promise.race() 

Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```
const p = Promise.race([p1, p2, p3]);
```
上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。
那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

Promise.race方法的参数与Promise.all方法一样，
如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，
将参数转为 Promise 实例，再进一步处理。


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

上面代码中，如果 5 秒之内fetch方法无法返回结果，变量p的状态就会变为rejected，从而触发catch方法指定的回调函数。



### Promise.resolve()

Promise.resolve方法, 可将现有对象转为 Promise 对象。

```
const jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

上面代码将 jQuery 生成的deferred对象，转为一个新的 Promise 对象。

```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

Promise.resolve方法的参数分成四种情况

1.  参数是一个 Promise 实例
如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。

2.  参数是一个thenable对象
thenable对象指的是具有then方法的对象，比如下面这个对象。
```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```
Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。
```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
```
上面代码中，thenable对象的then方法执行后，对象p1的状态就变为resolved，从而立即执行最后那个then方法指定的回调函数，输出 42。

3.  参数不是具有then方法的对象，或根本就不是对象
如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。

```
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```
上面代码生成一个新的 Promise 对象的实例p。
由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），
返回 Promise 实例的状态从一生成就是resolved，所以回调函数会立即执行。
Promise.resolve方法的参数，会同时传给回调函数。

4.  不带有任何参数
Promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。
所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve方法。
```
const p = Promise.resolve();

p.then(function () {
  // ...
});
```

需要注意的是，立即resolve的 Promise 对象，
是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时。

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

上面代码中，setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出。

### Promise.reject()

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

```
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

上面代码生成一个 Promise 对象的实例p，状态为rejected，回调函数会立即执行。

注意，Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
这一点与Promise.resolve方法不一致。

```
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```

上面代码中，Promise.reject方法的参数是一个thenable对象，
执行以后，后面catch方法的参数不是reject抛出的“出错了”这个字符串，而是thenable对象。

### 应用

```
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```



### Generator 函数与 Promise 的结合

使用 Generator 函数管理流程时，遇到异步操作，通常返回一个Promise对象。

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

上面代码的 Generator 函数g之中，有一个异步操作getFoo，它返回的就是一个Promise对象。函数run用来处理这个Promise对象，并调用下一个next方法。


### Promise.try()

如果不知道或者不想区分，函数f是同步函数还是异步操作，但是想用 Promise 来处理它。
因为这样就可以不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误。
一般就会采用下面的写法。

```
Promise.resolve().then(f);
```
上面的写法有一个缺点，就是如果f是同步函数，那么它会在本轮事件循环的末尾执行。

```
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```
上面代码中，函数f是同步的，但是用 Promise 包装了以后，就变成异步执行了。

```
const f = () => console.log('now');
(async () => f())();
console.log('next');
// now
// next
```
上面代码中，第二行是一个立即执行的匿名函数，会立即执行里面的async函数，
因此如果f是同步的，就会得到同步的结果；如果f是异步的，就可以用then指定下一步，就像下面的写法。

```
(async () => f())()
.then(...)
```
需要注意的是，async () => f()会吃掉f()抛出的错误。所以，如果想捕获错误，要使用promise.catch方法。
```
(async () => f())()
.then(...)
.catch(...)
```

另外，也可以用如下写法
```
const f = () => console.log('now');
(
  () => new Promise(
    resolve => resolve(f())
  )
)();
console.log('next');
// now
// next
```

鉴于这是一个很常见的需求，所以现在有一个提案，提供Promise.try方法替代上面的写法。

```
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```

事实上，Promise.try存在已久，Promise 库[Bluebird](http://bluebirdjs.com/docs/api/promise.try.html)、[Q](https://github.com/kriskowal/q/wiki/API-Reference#promisefcallargs)和[when](https://github.com/cujojs/when/blob/master/docs/api.md#whentry)，早就提供了这个方法。


```
function getUsername(userId) {
  return database.users.get({id: userId})
  .then(function(user) {
    return user.name;
  });
}
```
上面代码中，database.users.get()返回一个 Promise 对象，如果抛出异步错误，可以用catch方法捕获，就像下面这样写。

```
database.users.get({id: userId})
.then(...)
.catch(...)
```

但是database.users.get()可能还会抛出同步错误（比如数据库连接错误，具体要看实现方法），这时你就不得不用try...catch去捕获。

```
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}
```

实际上，可以统一用promise.catch()捕获所有同步和异步的错误。

```
Promise.try(database.users.get({id: userId}))
  .then(...)
  .catch(...)
```

Promise.try就是模拟try代码块，就像promise.catch模拟的是catch代码块。




























