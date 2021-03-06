# JSON5 更舒服的 JSON 格式





### 什么是 JSON5



[JSON5](http://json5.org/) 是对 JSON 的一种推荐扩展，旨在使人类更易于手动编写和维护。 它通过直接从 ECMAScript 5 添加一些最小的语法功能来实现这一点。 JSON5 仍然是 JavaScript 的严格子集，不添加任何新的数据类型，并且可以处理所有现有的 JSON 内容。 

先通过一个例子看看 JSON5 的结构

```json
{ 
    foo: '11.1.5，bar', 
    while: true, 
    this: 'is a \
multi-line string', 
    
    // this is an inline comment 
    here: 'is another', // inline comment 
    
    /* this is a block comment 
    that continues on another line */ 
    
    hex: 0xDEADbeef, 
    half: .5, 
    delta: +10, 
    to: Infinity, // and beyond! 
    
    finally: 'a trailing comma', 
    oh: [ 
    	"we shouldn't forget", 
    	'arrays can have', 
    	'trailing commas too', 
    ], 
    'gulp-jshint': "^2.0.0", 
}
```





####  JSON5与JSON 格式的区别



* `key` 只要是有效的标识符，则可以不加引号。即使是 ES5 中的保留关键字
* `key-value` 都可以使用单引号
* 对象和数组尾巴都可跟着逗号
*  字符串可以是多行的，只要加上反斜杠 
* 数字可以是十六进制（基数为16）／以小数点开头或结尾／包括Infinity，-Infinity，NaN和-NaN／以明确的加号开始。 
* 允许使用注视，单行多行都可以





JSON5 更像 Javascript 对象了，也更适合人们编写了。但是，它并不是 JSON 官方的扩展，所以需要 `json5` 作为文件扩展名，下面的 `package.json5` 是现在普遍的写法。



```json
// This file is written in JSON5 syntax, naturally, but npm needs a regular
// JSON file, so compile via `npm run build`. Be sure to keep both in sync!
{
	name: 'json5',
	version: '0.5.0',
	description: 'JSON for the ES5 era.',
	keywords: ['json', 'es5'],
	author: 'Aseem Kishore <aseem.kishore@gmail.com>',
	contributors: [
		// TODO: Should we remove this section in favor of GitHub's list?
		// https://github.com/json5/json5/contributors
		'Max Nanasy <max.nanasy@gmail.com>',
		'Andrew Eisenberg <andrew@eisenberg.as>',
		'Jordan Tucker <jordanbtucker@gmail.com>',
	],
	main: 'lib/json5.js',
	bin: 'lib/cli.js',
	files: ["lib/"],
	dependencies: {},
	devDependencies: {
		gulp: "^3.9.1",
		'gulp-jshint': "^2.0.0",
		jshint: "^2.9.1",
		'jshint-stylish': "^2.1.0",
		mocha: "^2.4.5"
	},
	scripts: {
		build: 'node ./lib/cli.js -c package.json5',
		test: 'mocha --ui exports --reporter spec',
			// TODO: Would it be better to define these in a mocha.opts file?
	},
	homepage: 'http://json5.org/',
	license: 'MIT',
	repository: {
		type: 'git',
		url: 'https://github.com/json5/json5',
	},
}
```





### JSON5的使用



Node

```shell
$ yarn add json5
// 或者
$ npm install json5
```

```javascript
var JSON5 = require('json5');
```



Browser

```html
<script src="json5.js"></script>
// 引入json5.js后，会添加一个名为JSON5的全局对象
```



转换:

```javascript
var obj = JSON5.parse('{unquoted:"key",trailing:"comma",}');
var str = JSON5.stringify(obj);
```

