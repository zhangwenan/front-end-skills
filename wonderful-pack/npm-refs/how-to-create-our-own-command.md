
#   如何发布自己的npm包并制作成命令行工具

### npm init

```
mkdir mycmd && cd mycmd
npm init
```

`npm init`的提示信息如下

|字段|描述|
|-|-|
|name|包名，默认是当前文件夹的名字。|
|version| 版本，默认是1.0.0 |
|description| 描述 |
|entry point| 入口文件，默认 index.js |
|test command| 测试命令 |
|git repository| git仓库地址 |
|keyword| 包的关键词，贴切的关键词能让更多的人搜索到我们的npm包 |
|author| 推荐写npm账号或者github账号|
|license| 开源协议, 默认ISC |

执行成功后, 当前目录会多出一个`package.json`文件。然后，创建`index.js`、`app.js`和`lib/main.js`。目录结构如下

```
├── app.js
├── index.js
├── lib
│   └── main.js
└── package.json
```

`index.js`的代码如下:

```
module.exports = require('./lib/main');
```

`lib/main.js`的代码如下

```
module.exports = {
    say: ()=>{
        console.log('This is my module');
    }
}
```

`app.js`的代码如下:

```
let m = require('./index');
m.say();
```

此时执行`node app.js`,就能看到相应的输出了。



### npm publish

执行`npm publish`即可发布。如果修改了代码，想要发布更新，需要修改版本号，再执行发布。



### 生成命令工具

推荐使用[commander](https://github.com/tj/commander.js) 来创建自己的命令行工具。

首先，在当前目录下，执行以下命令

```
npm install commander
```

然后，创建`bin/cmdPower.js`，其代码如下:

```
#!/usr/bin/env node

var cmdPowerLib = require('../lib/main');
var program = require('commander');

program.version('v' + require('../package.json').version)
    .description('Zhangwenan\'s First command');

program.command('say <words>')
.alias('s')
.description('say something')
.action((words)=>{
    cmdPowerLib.say(words);
})

program.parse(process.argv)

if(program.args.length === 0){
    program.help()
}
```

然后，在`package.json`文件中，加入如下信息 

```
"bin": {
    "cmdPower": "./bin/cmdPower.js"
},
```

此时，代码已经可以成功运行

```
node bin/cmdPower.js s ' What a wonderful thing'
// This is my module  What a wonderful thing
```

### npm link

最后，在当前目录下，执行`npm link`,就会将`cmdPower`命令加入到全局的symbolic link，我们就能直接使用`cmdPower`命令了。
另外，使用`npm install . -g`也可以达到相同的效果。

```
cmdPower s ' From cmdPower'
// This is my module  From cmdPower
```

### 示例代码

示例代码，请参考: [myCmd](https://github.com/zhangwenan/front-end-skills/tree/master/examples/myCmd)



参考文章:

*   <https://segmentfault.com/a/1190000002918295>
*   <http://www.jianshu.com/p/36d3e0e00157>
