##  AST
原文: https://developer.aliyun.com/article/696430

Babel可以将最新的Javascript语法编译成当前浏览器兼容的JavaScript代码，Babel工作流程分为三个步骤:

![1](https://gw.alicdn.com/tfs/TB11J7yMzTpK1RjSZKPXXa3UpXa-880-228.png)

抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。

* Babel提供了`@babel/parser`将代码解析成AST。
* Babel提供了`@babel/traverse`对解析后的AST进行处理。`@babel/traverse`能够接收`AST`以及`visitor`两个参数，AST是上一步parse得到的抽象语法树，visitor提供访问不同节点的能力，当遍历到一个匹配的节点时，能够调用具体方法对于节点进行处理。
* `@babel/types`用于定义AST节点，在`visitor`里做节点处理的时候用于替换等操作。
* Babel提供了`@babel/generator`将AST再还原成代码。

```
const parse = require('@babel/parser').parse;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generate = require('@babel/generator').default;


const ast = parse('const a = 1');

// 遍历AST，在匹配到变量声明（VariableDeclaration）的时候判断是否const操作时进行替换成var。
// t.variableDeclaration(kind, declarations)接收两个参数kind和declarations，这里kind设为var，将const a = 1解析得到的AST里的declarations直接设置给declarations
traverse(ast, {
  VariableDeclaration: function(path) {
    if(path.node.kind === 'const') {
      path.replaceWith(
        t.variableDeclaration('var', path.node.declarations)
      )
    }
    path.skip();
  }
})


let code = generate(ast).code;
```


##  Vue与React代码转换

Vue的结构分为style、script、template三部分。

### style
样式无需转换，通用

### script
* data需要转化为state
* props需要转化为defaultProps和propTypes
* components的引用需要提取到组件声明以外
* methods里的方法需要提取到组件的属性上
* 特殊的属性，比如computed，React里是没有这个概念的，可以考虑将computed里的值转化成函数方法
* 示例中的length，可以转化为length()这样的函数调用，在React的render()方法以及其他方法中调用。

Vue的生命周期和React的生命周期有些差别，但是基本都能映射
* created -> componentWillMount
* mounted -> componentDidMount
* updated -> componentDidUpdate
* beforeDestroy -> componentWillUnmount

在Vue内函数的属性取值是通过this.xxx的方式，而在Rax内需要判断是否state、props还是具体的方法，会转化成this.state、this.props或者this.xxx的方式。因此在对Vue特殊属性的处理中，我们对于data、props、methods需要额外做标记。

### template
* 针对文本节点和元素节点处理不一致，文本节点需要对内容{{title}}进行处理，变为{title}

Vue里有大量的增强指令，转化成React需要额外做处理，下面列举了部分指令的处理方式
* 事件绑定的处理，`@click -> onClick`
* 逻辑判断的处理，`v-if="item.show" -> {item.show && ……}`
* 动态参数的处理，`:title="title" -> title={title}`

还有一些是正常的html属性，但是React下是不一样的，例如`style -> className`。
指令里和model里的属性值需要特殊处理，这部分的逻辑其实和script里一样，例如需要{{title}}转变成{this.props.title}



##  Vue代码解析

```
<template>
  <div>
    <p class="title" @click="handleClick">{{title}}</p>
    <p class="name" v-if="show">{{name}}</p>
  </div>
</template>

<style>
.title {font-size: 28px;color: #333;}
.name {font-size: 32px;color: #999;}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {
      show: true,
      name: "name"
    };
  },
  mounted() {
    console.log(this.name);
  },
  methods: {
    handleClick() {}
  }
};
</script>
```

使用了Vue官方的`vue-template-compiler`来分别提取Vue组件代码里的template、style、script，考虑其他DSL的通用性后续可以迁移到更加适用的html解析模块，例如`parse5`等。通过`require('vue-template-compiler').parseComponent`得到了分离的template、style、script。
style不用额外解析成AST了，可以直接用于React代码。template可以通过`require('vue-template-compiler').compile`转化为AST值。script用`@babel/parser`来处理，对于script的解析不仅仅需要获得整个script的AST值，还需要分别将`data`、`props`、`computed`、`components`、`methods`等参数提取出来，以便后面在转化的时候区分具体属于哪个属性。以data的处理为例

```
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const analysis = (body, data, isObject) => {
  data._statements = [].concat(body); // 整个表达式的AST值
  
  let propNodes = [];
  if (isObject) {
    propNodes = body;
  } else {
    body.forEach(child => {
      if (t.isReturnStatement(child)) { // return表达式的时候
        propNodes = child.argument.properties;
        data._statements = [].concat(child.argument.properties); // 整个表达式的AST值
      }
    });
  }
  
  propNodes.forEach(propNode => {
    data[propNode.key.name] = propNode; // 对data里的值进行提取，用于后续的属性取值
  });
};

const parse = (ast) => {
  let data = {
  };

  traverse(ast, {
    ObjectMethod(path) {
      /*
      对象方法
      data() {return {}}
      */
      const parent = path.parentPath.parent;
      const name = path.node.key.name;
  
      if (parent && t.isExportDefaultDeclaration(parent)) {
        if (name === 'data') {
          const body = path.node.body.body;
          
          analysis(body, data);

          path.stop();
        }
      }
    },
    ObjectProperty(path) {
      /*
      对象属性，箭头函数
      data: () => {return {}}
      data: () => ({})
      */
      const parent = path.parentPath.parent;
      const name = path.node.key.name;
  
      if (parent && t.isExportDefaultDeclaration(parent)) {
        if (name === 'data') {
          const node = path.node.value;
  
          if (t.isArrowFunctionExpression(node)) {
            /*
            箭头函数
            () => {return {}}
            () => {}
            */
            if (node.body.body) {
              analysis(node.body.body, data);
            } else if (node.body.properties) {
              analysis(node.body.properties, data, true);
            }
          }
          path.stop();
        }
      }
    }
  });

  /*
    最终得到的结果
    {
      _statements, //data解析AST值
      list //data.list解析AST值
    }
  */
  return data;
};

module.exports = parse;
```

处理结果如下：
```
app: {
  script: {
    ast,
    components,
    computed,
    data: {
      _statements, //data解析AST值
      list //data.list解析AST值
    },
    props,
    methods
  },
  style, // style字符串值
  template: {
    ast // template解析AST值
  }
}
```


##  React代码的转化
最终转化的React代码会包含两个文件（css和js文件）。
用style字符串直接生成index.css文件，index.js文件结构如下图，transform指将Vue AST值转化成React代码的伪函数。

```
import { createElement, Component, PropTypes } from 'React';
import './index.css';

export default class Mod extends Component {
  ${transform(Vue.script)}

  render() {
    ${transform(Vue.template)}
  }
}
```

script AST值的转化不一一说明，思路基本都一致，这里主要针对Vue data继续说明如何转化成React state，最终解析Vue data得到的是`{_statements: AST}`这样的一个结构，转化的时候只需要执行如下代码

```
const t = require('@babel/types');

module.exports = (app) => {
  if (app.script.data && app.script.data._statements) {
    // classProperty 类属性 identifier 标识符 objectExpression 对象表达式
    return t.classProperty(t.identifier('state'), t.objectExpression(app.script.data._statements));
  } else {
    return null;
  }
};
```

针对template AST值的转化，我们先看下Vue template AST的结构：
```
{
  tag: 'div',
  children: [{
    tag: 'text'
  },{
    tag: 'div',
    children: [……]
  }]
}
```
转化的过程就是遍历上面的结构针对每一个节点生成渲染代码，这里以v-if的处理为例说明下节点属性的处理，实际代码中会有两种情况：
* 不包含v-else的情况，`<div v-if="xxx"/>转化为{ xxx && <div /> }`
* 包含v-else的情况，`<div v-if="xxx"/><text v-else/>转化为{ xxx ? <div />: <text /> }`

经过`vue-template-compiler`解析后的template AST值里会包含`ifConditions`属性值，如果`ifConditions`的长度大于1，表明存在v-else，具体处理的逻辑如下：

```
if (ast.ifConditions && ast.ifConditions.length > 1) {
  // 包含v-else的情况
  let leftBlock = ast.ifConditions[0].block;
  let rightBlock = ast.ifConditions[1].block;

  let left = generatorJSXElement(leftBlock); //转化成JSX元素
  let right = generatorJSXElement(rightBlock); //转化成JSX元素
    
  child = t.jSXExpressionContainer( //JSX表达式容器
    // 转化成条件表达式
    t.conditionalExpression(
      parseExpression(value),
      left,
      right
    )
  );
} else {
  // 不包含v-else的情况
  child = t.jSXExpressionContainer( //JSX表达式容器
    // 转化成逻辑表达式
    t.logicalExpression('&&', parseExpression(value), t.jsxElement(
      t.jSXOpeningElement(
        t.jSXIdentifier(tag), attrs),
      t.jSXClosingElement(t.jSXIdentifier(tag)),
      children
    ))
  );
}
```

template里引用的属性/方法提取，在AST值表现上都是标识符(Identifier)，可以在traverse的时候将`Identifier`提取出来。
这里用了一个比较取巧的方法，在template AST值转化的时候我们不对这些标识符做判断，而在最终转化的时候在render return之前插入一段引用。以下面的代码为例

```
<text class="title" @click="handleClick">{{title}}</text>
<text class="list-length">list length:{{length}}</text>
<div v-for="(item, index) in list" class="list-item" :key="`item-${index}`">
  <text class="item-text" @click="handleClick" v-if="item.show">{{item.text}}</text>
</div>
```
我们能解析出template里的属性/方法以下面这样一个结构表示：
```
{
  title,
  handleClick,
  length,
  list,
  item,
  index
}
```
在转化代码的时候将它与app.script.data、app.script.props、app.script.computed和app.script.computed分别对比判断，能得到title是props、list是state、handleClick是methods，length是computed，最终我们在return前面插入的代码如下：
```
let {title} = this.props;
let {state} = this.state;
let {handleClick} = this;
let length = this.length();
```

最终的转换结果
```
import { createElement, Component, PropTypes } from 'React';

export default class Mod extends Component {
  static defaultProps = {
    title: 'title'
  }
  static propTypes = {
    title: PropTypes.string
  }
  state = {
    show: true,
    name: 'name'
  }
  componentDidMount() {
    let {name} = this.state;
    console.log(name);
  }
  handleClick() {}
  render() {
    let {title} = this.props;
    let {show, name} = this.state;
    let {handleClick} = this;
    
    return (
      <div>
        <p className="title" onClick={handleClick}>{title}</p>
        {show && (
          <p className="name">{name}</p>
        )}
      </div>
    );
  }
}
```

实际使用过程中研发同学的编码习惯差别也比较大，需要处理很多特殊情况。
这套思路也可以用于小程序互转等场景，减少编码的重复劳动，但是在这类跨端的非保准Web场景需要考虑更多，例如小程序环境特有的组件以及API等，还需要持续做尝试。

