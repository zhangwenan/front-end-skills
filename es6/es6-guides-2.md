
# Set 和 Map

##  Set
```
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56

// 类似于
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
```

```
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

// 在 Set 内部，两个NaN是相等的。
```

```
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2

// 在 Set内部，两个空对象不相等
```

* Set.prototype.add(value)
* Set.prototype.delete(value)
* Set.prototype.has(value)
* Set.prototype.clear(): 没有返回值

###  Set的4个遍历方法
Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
* Set.prototype.keys()
* Set.prototype.values() : Set结构没有键名，只有键值(或者说键名和键值是同一个值)。所以，values()和keys()行为一样。
* Set.prototype.entries() : 返回键值对的遍历器
* Set.prototype.forEach()

```
for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
这意味着，可以省略values方法，直接用for...of循环遍历 Set。
```
Set.prototype[Symbol.iterator] === Set.prototype.values

let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
// red
// green
// blue

// 扩展运算符 ... 内部使用for...of循环，所以也可以用于 Set 结构。
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']
```

```
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```


使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
```
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```


###  数组去重
```
// 去除数组的重复成员
[...new Set(array)]

// Array.from方法可以将 Set 结构转为数组。
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);

// 去除字符串里面的重复字符
[...new Set('ababbc')].join('')
// "abc"
```

### WeakSet
`WeakSet` 的成员只能是对象。
`WeakSet` 不可遍历。没有size属性。因为成员都是弱引用，随时可能消失。
`WeakSet` 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。
也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

垃圾回收机制根据对象的可达性（reachability）来判断回收，如果对象还能被访问到，垃圾回收机制就不会释放这块内存。


##  Map
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用*字符串*当作键。
ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是，各种类型的值（包括对象）都可以当作键。

```
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

Set和Map都可以用来生成新的 Map。
```
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```


Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。
**这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。**
```
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。
```
map[Symbol.iterator] === map.entries

for (let [key, value] of map.entries()) {
  console.log(key, value);
}

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
```

Map转为数组
```
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

Map 还有一个forEach方法，接受的第二个参数，用来绑定this。
```
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
```

### 对象转为Map

```
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```

### WeakMap

