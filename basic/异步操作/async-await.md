
##  Async函数

```
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: "resolved"
}

asyncCall();
```


* Async函数体内部，可以使用`await`。
* Async函数，在错误处理上，会更加方便。可以直接加`.catch`
* Async函数的返回值，是`Promise`对象。即使返回的是基本类型，也会被隐式地包装。
```
async function foo() {
   return 1
}
// 等价于
async function foo() {
   return Promise.resolve(1);
}
```


```
// 顺序执行，逐个开始计时
var sequentialStart = async function() {

  const slow = await resolveAfter2Seconds();
  console.log(slow);

  const fast = await resolveAfter1Second();
  console.log(fast);
}

// 同时计时，最后一次性打印
var concurrentStart = async function() {
  // 立即创建Promise，并开始计时
  const slow = resolveAfter2Seconds();
  const fast = resolveAfter1Second();

  console.log(await slow); // 2秒后，打印
  console.log(await fast); // 2秒后，打印；fast这个promise，在1秒结束的时候就已经是resolve状态
}

// 同上
var concurrentPromise = function() {
  return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then((messages) => {
    console.log(messages[0]); // slow
    console.log(messages[1]); // fast
  });
}


// 同时开始，并行执行。这里，async函数，不会阻止async函数体外部的代码向下执行。
// 只有aysnc内部的代码执行，会被await挂起。
var parallel = async function() {
  await Promise.all([
      (async()=>console.log(await resolveAfter2Seconds()))(),
      (async()=>console.log(await resolveAfter1Second()))()
  ]);
}


// 同时开始，并行执行。同上。
var parallelPromise = function() {
  resolveAfter2Seconds().then((message)=>console.log(message));
  resolveAfter1Second().then((message)=>console.log(message));
}
```


##  使用async函数，重写promise链

```
function getProcessedData(url) {
  return downloadData(url) // 返回一个 promise 对象
    .catch(e => {
      return downloadFallbackData(url)  // 返回一个 promise 对象
    })
    .then(v => {
      return processDataInWorker(v); // 返回一个 promise 对象
    });
}
```

重写后：
```
async function getProcessedData(url) {
  let v;
  try {
    v = await downloadData(url);
  } catch (e) {
    v = await downloadFallbackData(url);
  }

  return processDataInWorker(v);
}
```
