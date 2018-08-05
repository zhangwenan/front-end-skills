

### JSON.stringify

语法 `JSON.stringify(value[, replacer[, space]])`

*   space表示格式化后的缩进的空白字符个数   *

```
console.log(JSON.stringify({ x: 5, y: 6 }));
// "{"x":5,"y":6}"

console.log(JSON.stringify([new Number(3), new String('false'), new Boolean(false)]));
// "[3,"false",false]"

console.log(JSON.stringify({ x: [10, undefined, function(){}, Symbol('')] }));
// "{"x":[10,null,null,null]}"

console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
// ""2006-01-02T15:04:05.000Z""


```



```
function replacer(key, value) {
  // Filtering out properties
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}

var foo = {foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7};
JSON.stringify(foo, replacer);
// '{"week":45,"month":7}'
```

