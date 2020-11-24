# https://v4.webpack.docschina.org/guides/hot-module-replacement/


### loader
webpack 只能理解 JavaScript 和 JSON 文件。
`loader` 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。

```
module.exports = {
  // ...
  // 遇到 .txt文件，先用 raw-loader转换一下
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```


### plugin
loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

多数插件可以通过选项(option)自定义。
你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
    // html-webpack-plugin 为应用程序生成 HTML 一个文件，并自动注入所有生成的 bundle
  ]
};
```


### mode
通过选择 `development`, `production` 或 `none` 之中的一个，来设置 mode 参数，
你可以启用 webpack 内置在相应环境下的优化。其默认值为 `production`。

### browser compatibility
webpack 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。
webpack 的 `import()` 和 `require.ensure()` 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要 提前加载 polyfill。



# entry

```
entry: './path/to/my/entry/file.js'
// 相当于
entry: {
  main: './path/to/my/entry/file.js'
}

// 打包结果
main.js
```

```
entry: ['./path/to/my/entry/file1.js', './path/to/my/entry/file2.js']

// 打包结果，包含file1.js, file2.js
main.js 
```

```
entry: {
  a: './path/to/my/entry/file1.js',
  b: './path/to/my/entry/file2.js'
}
// 打包结果
a.js, b.js
```

##  optimization.splitChunks
在 webpack < 4 的版本中，通常将 vendor 作为单独的入口起点添加到 entry 选项中，以将其编译为单独的文件（与 CommonsChunkPlugin 结合使用）。
而在 webpack 4 中不鼓励这样做。而是使用 `optimization.splitChunks` 选项，将 vendor 和 app(应用程序) 模块分开，并为其创建一个单独的文件。**不要 为 vendor 或其他 非执行起点 创建 entry。**



# output
`entry`可以指定多个，但，`output`只能指定一个位置。

多入口文件的情况下，可以通过占位符，设置不同文件名。
```
output: {
  filename: '[name].js',
  path: __dirname + '/dist'
}
```

```
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, './home/proj/cdn/assets/[hash]'),
    publicPath: 'http://cdn.example.com/assets/[hash]/'
  }
};
```
如果在编译时，不知道最终输出文件的 publicPath 是什么地址，则可以将其留空，并且在运行时通过入口起点文件中的 `__webpack_public_path__` 动态设置。

占位符：https://webpack.docschina.org/configuration/output#output-filename



# loader
loader 用于对模块的源代码进行转换。
loader 可以使你在 `import` 或 "`load`(加载)" 模块时预处理文件。

```
npm install --save-dev css-loader ts-loader
```

```
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};

```

有3种方式可以，指定loader。
1. 配置方式（推荐）：在 webpack.config.js 文件中指定 loader。
2. 内联方式：在每个 import 语句中显式指定 loader。
3. CLI 方式：在 shell 命令中指定它们。

```
// 内联方式
// 使用 ! 前缀，将禁用所有已配置的 normal loader(普通 loader)
import Styles from '!style-loader!css-loader?modules!./styles.css';

// 使用 !! 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）
import Styles from '!!style-loader!css-loader?modules!./styles.css';

// 使用 -! 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```
另外，选项可以传递查询参数，例如 `?key=value&foo=bar`，或者一个 JSON 对象，例如 `?{"key":"value","foo":"bar"}`。

```
// Cli方式
webpack --module-bind pug-loader --module-bind 'css=style-loader!css-loader'
```

##  loader特性

* loader 支持链式调用。链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照相反的顺序执行。链中的第一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader，依此类推。最后，链中的最后一个 loader，返回 webpack 所期望的 JavaScript。
* loader 可以是同步的，也可以是异步的。
* loader 运行在 Node.js 中，并且能够执行任何操作。
* 除了常见的通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 loader 字段直接引用一个模块。
* loader 能够产生额外的任意文件。


##  plugin
webpack 插件是一个具有 apply 方法的 JavaScript 对象。
`apply` 方法会被 `webpack compiler` 调用，并且在整个编译生命周期都可以访问 compiler 对象。

ConsoleLogOnBuildWebpackPlugin.js
```
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('webpack 构建过程开始！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

webpack.config.js
```
plugins: [
  new webpack.ProgressPlugin(), // 内置插件
  new (require('./ConsoleLogOnBuildWebpackPlugin'))()
]
```

### Node API 方式

some-node-script.js
```
const webpack = require('webpack'); // 访问 webpack 运行时(runtime)
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function(err, stats) {
  // ...
});
```
该示例和 webpack 运行时(runtime)本身 极其类似。


##  配置

由于 webpack 遵循 CommonJS 模块规范，因此，你可以在配置中使用
* 通过 require(...) 引入其他文件
* 编写并且执行函数，生成部分配置

##  模块
在模块化编程中，开发者将程序分解为功能离散的 `chunk`，并称之为 *模块*。

与 Node.js 模块相比，webpack 模块能以各种方式表达它们的依赖关系。下面是一些示例：

* ES2015 `import` 语句, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
* CommonJS `require()` 语句
* AMD `define` 和 `require` 语句
* css/sass/less 文件中的 `@import` 语句。
* stylesheet `url(...)` 或者 HTML `<img src=...>` 文件中的图片链接。

### 模块解析

当打包模块时，webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 来解析文件路径。

使用 enhanced-resolve，webpack 能解析三种文件路径：

```
// 绝对路径
import '/home/me/file';
import 'C:\\Users\\me\\file';

// 相对路径
import '../src/file1';
import './file2';

// 模块路径
import 'module';
import 'module/lib/file';
```

在 `resolve.modules` 中指定的所有目录检索模块。 
另外，可以通过配置别名的方式来替换初始模块路径，具体请参照 `resolve.alias` 配置选项。

一旦根据上述规则解析路径后，resolver 将会检查路径是指向文件还是文件夹。如果路径指向文件：
* 如果文件具有扩展名，则直接将文件打包。
* 否则，使用 `resolve.extensions` 选项作为文件扩展名来解析，此选项告诉解析器能够接受哪些扩展名（例如 .js，.jsx）

如果路径指向一个文件夹，则进行如下步骤寻找具有正确扩展名的文件：
* 如果文件夹中包含 package.json 文件，则会根据 `resolve.mainFields` 配置中的字段顺序查找，并根据 package.json 中的符合配置要求的第一个字段来确定文件路径。
* 如果不存在 package.json 文件或 `resolve.mainFields` 没有返回有效路径，则会根据 `resolve.mainFiles` 配置选项中指定的文件名顺序查找，看是否能在 `import/require` 的目录下匹配到一个存在的文件名。
* 然后使用 `resolve.extensions` 选项，以类似的方式解析文件扩展名。

####  解析loader
loader 的解析规则也遵循特定的规范。但是，**`resolveLoader` 配置项可以为 loader 设置独立的解析规则。**

####  缓存
每次文件系统访问文件都会被缓存，以便于更快触发对同一文件的多个并行或串行请求。
在 watch 模式 下，只有修改过的文件会被从缓存中移出。如果关闭 watch 模式，则会在每次编译前清理缓存。


### Module Federation

????


### target

webpack 的 target 属性，不要和 output.libraryTarget 属性混淆.
```
module.exports = {
  target: 'node'
};
```
target 设置为 node，webpack 将在类 Node.js 环境编译代码。(使用 Node.js 的 require 加载 chunk，而不加载任何内置模块，如 fs 或 path)。


**多traget**
虽然 webpack 不支持 向 target 属性传入多个字符串，但是可以通过设置两个独立配置，来构建对 library 进行同构：

```
const path = require('path');
const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

const clientConfig = {
  target: 'web', // <=== 默认为 'web'，可省略
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```
上述示例中，将会在 dist 文件夹下创建 lib.js 和 lib.node.js 文件。
参考： 
https://github.com/TheLarkInn/compare-webpack-target-bundles
https://github.com/chentsulin/electron-react-boilerplate



##  manifest
webpack 和 webpack 插件, 似乎“知道”应该哪些文件生成。
答案是，webpack 通过 manifest，可以追踪所有模块到输出 bundle 之间的映射。

### runtime
`runtime`，以及伴随的 `manifest` 数据，主要是指：
在浏览器运行过程中，webpack 用来连接模块化应用程序所需的所有代码。
它包含：在模块交互时，连接模块所需的加载和解析逻辑。包括：已经加载到浏览器中的连接模块逻辑，以及尚未加载模块的延迟加载逻辑。

当 compiler 开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 "`manifest`"，
当完成打包并发送到浏览器时，`runtime` 会通过 `manifest` 来解析和加载模块。
无论你选择哪种 模块语法，那些 import 或 require 语句现在都已经转换为 `__webpack_require__` 方法，
此方法指向模块标识符(`module identifier`)。
通过使用 `manifest` 中的数据，`runtime` 将能够检索这些标识符，找出每个标识符背后对应的模块。

通过使用内容散列(`content hash`)作为 bundle 文件的名称，这样在文件内容修改时，会计算出新的 hash，
浏览器会使用新的名称加载文件，从而使缓存无效。
一旦你开始这样做，你会立即注意到一些有趣的行为。
**即使某些内容明显没有修改，某些 hash 还是会改变。**这是因为，注入的 runtime 和 manifest 在每次构建后都会发生变化。

https://survivejs.com/webpack/optimizing/separating-manifest/
https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
https://webpack.js.org/guides/caching/


##  HMR (hot module replacement)

### 在应用程序中
1. 应用程序要求 `HMR runtime` 检查更新。
2. `HMR runtime` 异步地下载更新，然后通知应用程序。
3. 应用程序要求 `HMR runtime` 应用更新。
4. `HMR runtime` 同步地应用更新。
你可以设置 HMR，以使此进程自动触发更新，或者你可以选择要求在用户交互时进行更新

### 在compiler中
除了普通资源，`compiler` 需要发出 "`update`"，将之前的版本更新到新的版本。"`update`" 由两部分组成：
1. 更新后的 manifest (JSON)
2. 一个或多个 updated chunk (JavaScript)

manifest 包括新的 compilation hash 和所有的 updated chunk 列表。
每个 chunk 都包含着全部更新模块的最新代码（或一个 flag 用于表明此模块需要被移除）。

compiler 会确保在这些构建之间的模块 ID 和 chunk ID 保持一致。
通常将这些 ID 存储在内存中（例如，使用 webpack-dev-server 时），但是也可能会将它们存储在一个 JSON 文件中。


### 在模块中

HMR 是*可选*功能，只会影响包含 HMR 代码的模块。
举个例子，通过 `style-loader` 为 style 追加补丁。
为了运行追加补丁，`style-loader` 实现了 HMR 接口；当它通过 HMR 接收到更新，它会使用新的样式替换旧的样式。

类似的，当在一个模块中实现了 HMR 接口，你可以描述出当模块被更新后发生了什么。
然而在多数情况下，不需要在每个模块中强行写入 HMR 代码。
如果一个模块没有 HMR 处理函数，更新就会冒泡(bubble up)。
这意味着一个处理函数就能够更新整个模块树。如果在模块树的一个单独模块被更新，那么整组依赖模块都会被重新加载。


### 在runtime中
对于模块系统运行时(module system runtime)，会发出额外代码，来跟踪模块 `parents` 和 `children` 关系。
在管理方面，runtime 支持两个方法 `check` 和 `apply`。

`check` 方法，发送一个 HTTP 请求来更新 manifest。
如果请求失败，说明没有可用更新。
如果请求成功，会将 updated chunk 列表与当前的 loaded chunk 列表进行比较。
每个 loaded chunk 都会下载相应的 updated chunk。
当所有更新 chunk 完成下载，runtime 就会切换到 ready 状态。

`apply` 方法，将所有 updated module 标记为无效。
对于每个无效 module，都需要在模块中有一个 update handler，或者在此模块的父级模块中有 update handler。
否则，会进行无效标记冒泡，并且父级也会被标记为无效。继续每个冒泡，直到到达应用程序入口起点，或者到达带有 update handler 的 module（以最先到达为准，冒泡停止）。如果它从入口起点开始冒泡，则此过程失败。

之后，所有无效 module 都会被（通过 dispose handler）处理和解除加载。
然后更新当前 hash，并且调用所有 `accept` handler。runtime 切换回 `idle` 状态，一切照常继续。


##  内部原理

所有的文件，都是一个`模块`。
在打包过程中，模块会被合并成 `chunk`。
chunk 合并成 `chunk组`，并形成一个通过模块互相连接的图(`ModuleGraph`)。

```
module.exports = {
  entry: './index.js'
};
```
这会创建出一个名为 main 的 chunk 组（main 是入口起点的默认名称）。
此 *chunk组*包含 `./index.js` 模块。随着 parser 处理 ./index.js 内部的 import 时， 新模块就会被添加到此 chunk 中。

**一个 chunk 组中可能有多个 chunk。例如，SplitChunksPlugin 会将一个 chunk 拆分为一个或多个 chunk。**

### chunk
chunk有两种形式:
* initial(初始化) 是入口起点的 main chunk。此 chunk 包含为入口起点指定的所有模块及其依赖项。
* non-initial 是可以延迟加载的块。可能会出现在使用 动态导入(dynamic imports) 或者 SplitChunksPlugin 时。

每个 chunk 都有对应的 asset(资源)。资源，是指输出文件（即打包结果）。


webpack.config.js
```
module.exports = {
  entry: './src/index.jsx'
};
```

./src/index.js
```
import React from 'react';
import ReactDOM from 'react-dom';

import('./app.jsx').then(App => ReactDOM.render(<App />, root));
```
这会创建出一个名为 main 的 initial chunk。其中包含：`./src/index.jsx`，`react`，`react-dom`
然后会为 `./app.jsx` 创建 non-initial chunk，这是因为 `./app.jsx` 是动态导入的。
最终的output，会有 `/dist/main.js`, `/dist/394.js`
默认情况下，`non-initial chunk` 没有名称，因此会使用唯一 ID 来替代名称。 
在使用动态导入时，我们可以通过使用 magic comment(魔术注释) 来显式指定 chunk 名称
```
import(
  /* webpackChunkName: "app" */
  './app.jsx'
).then(App => ReactDOM.render(<App />, root));
```

####  output
输出文件的名称会受配置中的两个字段的影响。
* output.filename - 用于 initial chunk 文件
* output.chunkFilename - 用于 non-initial chunk 文件
这些字段中会有一些*占位符*。常用的占位符如下：
* [id] - chunk id（例如 [id].js -> 485.js）
* [name] - chunk name（例如 [name].js -> app.js）。如果 chunk 没有名称，则会使用其 id 作为名称
* [contenthash] - 输出文件内容的 md4-hash（例如 [contenthash].js -> 4ea6ff1de66c537eb9b2.js）




# 指南

通过在 `npm run build` 命令和你的参数之间添加两个中横线，可以将自定义参数传递给 webpack，例如：`npm run build -- --colors`。


### sourcemap

```
devtool: 'inline-source-map',
```


### watch模式

* webpack watch mode(webpack 观察模式), `webpack --watch`
* webpack-dev-server (无需刷新) 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，并提供server访问, `"start": "webpack-dev-server --open",`
* webpack-dev-middleware
webpack-dev-middleware 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。 `webpack-dev-server`在内部就使用了这个中间件，当然，它也可以作为一个单独的 package 来使用。示例如下：

```
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// 告诉 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

##  HMR模块替换

如果你在技术选型中使用了 `webpack-dev-middleware` 而没有使用 `webpack-dev-server`，请使用 `webpack-hot-middleware` package，以在你的自定义 server 或应用程序上启用 HMR。

```
devServer: {
  contentBase: './dist',
  hot: true
},
// ...
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```

```
import dialog from '../detail/dialog/index';

if (typeof dialog === 'function') dialog();

if (module.hot) {
  module.hot.accept('../detail/dialog', function () {
    console.log('Accepting the updated printMe module!');
  })
}
```

`style-loader`，能够使用HMR来替换 CSS，它实际上就使用了 `module.hot.accept`，在 CSS 依赖模块更新之后，会将其 patch(修补) 到 <style> 标签中。



### 通过Node.js API使用webpack-dev-server
```
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
```


### tree shaking
使用的是，TerserPlugin
略

### 生产环境

遵循不重复原则(Don't repeat yourself - `DRY`)，保留一个 "common(通用)" 配置。
为了将这些配置合并在一起，我们将使用一个名为 `webpack-merge` 的工具。

####  指定mode
许多 library 通过与 `process.env.NODE_ENV` 环境变量关联，以决定 library 中应该引用哪些内容。
从 webpack v4 开始, 指定 mode 会自动地配置 *DefinePlugin*

`NODE_ENV` 是一个由 Node.js 暴露给执行脚本的**系统环境变量**。
通常用于决定在开发环境与生产环境(dev-vs-prod)下，server tools(服务器工具)、build scripts(构建脚本) 和 client-side libraries(客户端库) 的行为。
然而，与预期相反，无法在构建脚本 webpack.config.js 中，将 process.env.NODE_ENV 设置为 "production"，请查看 #2537,https://github.com/webpack/webpack/issues/2537。因此，在 webpack 配置文件中，process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js' 这样的条件语句，无法按照预期运行。

但是，任何位于 `/src` 的本地代码都可以关联到 `process.env.NODE_ENV` 环境变量。以下有效：

src/index.js
```
  import { cube } from './math.js';

  // 有效
  if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
  }

  function component() {
    var element = document.createElement('pre');

    element.innerHTML = [
      'Hello webpack!',
      '5 cubed is equal to ' + cube(5)
    ].join('\n\n');

    return element;
  }

  document.body.appendChild(component());
```





## 代码分离
通常有3种方式:
* 入口起点：使用 entry 配置手动地分离代码。
* 防止重复：使用 SplitChunksPlugin 去重和分离 chunk。
* 动态导入：通过模块的内联函数调用来分离代码。

### 入口起点，entry points

缺点：如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中。
比如，两个入口文件 a.js, b.js，两者都引入了 lodash，那么2个结果文件，都会包含lodash


### 防止重复(prevent duplication)
使用，SplitChunksPlugin，提取公共代码。

```
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

* mini-css-extract-plugin：用于将 CSS 从主应用程序中分离。
* bundle-loader：用于分离代码和延迟加载生成的 bundle。
* promise-loader：类似于 bundle-loader ，但是使用了 promise API。


### 动态导入(dynamic import)
两种方法:
* ES的 `import()` 语法
* webpack的 `require.ensure` 语法

`import()` 调用会在内部用到 promises。如果在旧版本浏览器中使用 import()，记得使用一个 polyfill 库（例如 es6-promise 或 promise-polyfill），来 shim Promise。





