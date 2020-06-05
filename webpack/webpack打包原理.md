
# webpack打包原理


##  什么是webpack

webpack 是一个现代 JavaScript 应用程序的**静态**模块打包器(module bundler)。
当 webpack 处理应用程序时,它会递归地构建一个依赖关系图(dependency graph),其中包含应用程序需要的每个模块,然后将所有这些模块打包成一个或多个 bundle。

webpack 就像一条生产线,要经过一系列处理流程后才能将源文件转换成输出结果。这条生产线上的每个处理流程的职责都是单一的,多个流程之间有存在依赖关系,只有完成当前处理后才能交给下一个流程去处理。

**插件**就像是一个插入到生产线中的一个功能,在特定的时机对生产线上的资源做处理。webpack 通过 `Tapable` 来组织这条复杂的生产线。 webpack 在运行过程中会广播事件,插件只需要监听它所关心的事件,就能加入到这条生产线中,去改变生产线的运作。

webpack 的**事件流机制**保证了插件的有序性,使得整个系统扩展性很好。




##  webpack核心概念

* Entry
* Output
* Module: 一切皆模块,一个模块对应着一个文件。
* Chunk: 代码块,一个 Chunk 由多个模块组合而成,用于代码合并与分割。
* Loader: webpack本身只能理解JavaScript。本质上,`webpack loader` 将所有类型的文件,转换为可以直接引用的模块。
* Plugin


##  构建流程

1. 初始化参数：从**配置文件**和 **Shell** 语句中读取与合并参数,得出最终的参数。
2. 开始编译：用上一步得到的参数初始化 `Compiler` 对象,加载所有配置的插件,执行对象的 `run` 方法开始执行编译。
3. 确定入口：根据配置中的 entry 找出所有的入口文件。
4. 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
7. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。


## 实现简单的webpack

####  1. 定义 Compiler 类

```
class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options    
    
    // 入口    
    this.entry = entry    
    
    // 出口    
    this.output = output    
    
    // 模块    
    this.modules = []  
  }  
  
  // 构建启动  
  run() {}  
  
  // 重写 require函数,输出bundle  
  generate() {}
}
```

#### 2. 解析入口文件,获取 AST

使用`@babel/parser`,这是 babel7 的工具,来帮助我们分析内部的语法,包括 es6,返回一个 `AST` 抽象语法树。

```
// webpack.config.js
const path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  }
}
```

```
const fs = require('fs')
const parser = require('@babel/parser')
const options = require('./webpack.config')

const Parser = {  
  getAst: path => {    
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  }
}

class Compiler {
  constructor(options) {    
    // webpack 配置    
    const { entry, output } = options    
    
    // 入口    
    this.entry = entry    
    
    // 出口    
    this.output = output    
    
    // 模块    
    this.modules = []
  }  
  
  // 构建启动  
  run() {    
    const ast = Parser.getAst(this.entry)  
  }  
  
  // 重写 require函数,输出bundle  
  generate() {}
}
new Compiler(options).run()
```

#### 3. 找出所有依赖模块
Babel 提供了`@babel/traverse`(遍历)方法维护这 `AST` 树的整体状态,我们这里使用它来帮我们找出依赖模块。

```
const fs = require('fs')
const path = require('path')
const options = require('./webpack.config')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default


const Parser = {  
  getAst: path => {    
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  },
  getDependecies: (ast, filename) => {    
    const dependecies = {}    
    // 遍历所有的 import 模块,存入dependecies    
    
    traverse(ast, {      
      // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)      
      ImportDeclaration({ node }) {        
        const dirname = path.dirname(filename)
        // 保存依赖模块路径,之后生成依赖关系图需要用到
        const filepath = './' + path.join(dirname, node.source.value)        
        dependecies[node.source.value] = filepath
      }
    })
    return dependecies
  }
}

class Compiler {
  constructor(options) {    
    // webpack 配置    
    const { entry, output } = options    
    
    // 入口    
    this.entry = entry    
    
    // 出口    
    this.output = output    
    
    // 模块    
    this.modules = []
  }  
  
  // 构建启动  
  run() {
    const { getAst, getDependecies } = Parser
    const ast = getAst(this.entry)
    const dependecies = getDependecies(ast, this.entry)
  }
  
  // 重写 require函数,输出bundle  
  generate() {}
}
new Compiler(options).run()
```

####  4. AST 转换为 code

将 AST 语法树转换为浏览器可执行代码,我们这里使用`@babel/core` 和 `@babel/preset-env`。

```
const fs = require('fs')
const path = require('path')
const options = require('./webpack.config')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

const Parser = {  
  getAst: path => {    
    // 读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  },
  getDependecies: (ast, filename) => {    
    const dependecies = {}    
    // 遍历所有的 import 模块,存入dependecies    
    
    traverse(ast, {      
      // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)      
      ImportDeclaration({ node }) {        
        const dirname = path.dirname(filename)
        // 保存依赖模块路径,之后生成依赖关系图需要用到
        const filepath = './' + path.join(dirname, node.source.value)        
        dependecies[node.source.value] = filepath
      }
    })
    return dependecies
  },
  getCode: ast => {
    // AST转换为code    
    const { code } = transformFromAst(ast, null, {      
      presets: ['@babel/preset-env']    
    })
    return code  
  }
}

class Compiler {
  constructor(options) {    
    // webpack 配置    
    const { entry, output } = options    
    
    // 入口    
    this.entry = entry    
    
    // 出口    
    this.output = output    
    
    // 模块    
    this.modules = []
  }  
  
  // 构建启动  
  run() {
    const { getAst, getDependecies, getCode } = Parser
    const ast = getAst(this.entry)
    const dependecies = getDependecies(ast, this.entry)
    const code = getCode(ast)
  }
  
  // 重写 require函数,输出bundle  
  generate() {}
}
new Compiler(options).run()
```

#### 5. 递归解析所有依赖项,生成依赖关系图

```
class Compiler {
  // ...

  // 构建启动  
  run() {    
    // 解析入口文件
    const info = this.build(this.entry)
    this.modules.push(info)
    this.modules.forEach(({ dependecies }) => {
      // 判断有依赖对象,递归解析所有依赖项
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]))
        }
      }
    })
    
    // 生成依赖关系图
    const dependencyGraph = this.modules.reduce(
      (graph, item) => ({
        ...graph,
        // 使用文件路径作为每个模块的唯一标识符,保存对应模块的依赖对象和文件内容
        [item.filename]: {
          dependecies: item.dependecies,
          code: item.code
        }
      }),
      {}
    )
  }
  
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser
    const ast = getAst(filename)
    const dependecies = getDependecies(ast, filename)
    const code = getCode(ast)
    
    return {
      // 文件路径,可以作为每个模块的唯一标识符
      filename,
      
      // 依赖对象,保存着依赖模块路径
      dependecies,
      
      // 文件内容
      code
    }
  }

  // ...
}
```

####  6. 重写 require 函数,输出 bundle

```
class Compiler {
  // ...

  run() {
    // ...
    this.generate(dependencyGraph);
  }

  // ...
  
  // 重写 require函数 (浏览器不能识别commonjs语法),输出bundle
  generate(code) {
    // 输出文件路径
    const filePath = path.join(this.output.path, this.output.filename)    
    
    const bundle = `(function(graph){      
      function require(module){        
        function localRequire(relativePath){          
          return require(graph[module].dependecies[relativePath])        
        }        
        var exports = {};        
        (function(require,exports,code){          
          eval(code)        
        })(localRequire,exports,graph[module].code);        
        return exports;      
      }      
      require('${this.entry}')    
    })(${JSON.stringify(code)})`
    
    // 把文件内容写入到文件系统    
    fs.writeFileSync(filePath, bundle, 'utf-8')  
  }
}
```

####  7. 调用执行


