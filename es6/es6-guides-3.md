
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

