
##  生命周期

##  调用setState()的时候，用的是浅合并。

##  React中，数据是向下流动的。单向数据流。父组件或者子组件，都无法知道某个组件是否有状态，即state无法被外部访问
双向数据绑定又是怎样的？框架设计模式。MVVM/MVC，对应的框架有哪些

## 反向数据流
让数据反向传递：处于较低层级的表单组件更新较高层级的组件中的`state`。
受控组件的实现中，子组件对父组件中的state操作，就是反向的。

##  浅拷贝、深拷贝

##  React中的大小写、命名习惯
html元素，使用小写。
自定义组件，使用小驼峰。

html元素的事件，使用小写，比如onclick
react组件的事件，使用小驼峰，比如onClick

受控组件，接收的参数，习惯上可以命名为：`value`、`onChange`；`temperature`、`onTemperatureChange`


##   public class fields 语法
```
class LoggingButton extends React.Component {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```
https://babeljs.io/docs/en/babel-plugin-proposal-class-properties

如果使用箭头函数，来解决this指向的问题。那么，每次渲染 LoggingButton 时都会创建不同的回调函数。
在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。我们通常建议在构造器中绑定或使用 class fields 语法来避免这类性能问题。


##  向事件传递参数
```
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
// 事件对象以及更多的参数将会被隐式的进行传递。
```

## bind

##  元素变量
变量，可以保存元素或者组件
```
let button = <LoginButton onClick={this.handleLoginClick} />;

render () {
  return <div>{button}</div>
}
```

## react中，不能嵌套变量
{a && 'acontent' {b && 'bcontent'}}

## 在组件的 render 方法中返回 null 并不会影响组件的生命周期。像，componentDidUpdate等方法 依然会被调用。

## 列表为什么需要一个key
a key should be provided for list items
key 帮助 React 识别哪些元素改变了，比如被添加或删除。
不指定显式的 key 值，那么 React 将默认使用索引用作为列表项目的 key 值。
不得已的情况，才会使用index作为key。这样会带来性能上的负面影响。
https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
https://react.docschina.org/docs/reconciliation.html#recursing-on-children



##  受控组件、非受控组件、成熟解决方案
有时使用受控组件会很麻烦，因为你需要为数据变化的每种方式都编写事件处理函数，并通过一个 React 组件传递所有的输入 state。
当你将之前的代码库转换为 React 或将 React 应用程序与非 React 库集成时，这可能会令人厌烦。
在这些情况下，你可能希望使用非受控组件, 这是实现输入表单的另一种方式。
非受控组件：https://react.docschina.org/docs/uncontrolled-components.html
成熟方案： https://formik.org/
自定义组件，需要修改父组件的state时，其实也是通过“受控组件”来解决的。
也就是，传入一个onCustomChange事件，通过事件来操作父组件的state

##  React开发者工具
https://github.com/facebook/react/tree/master/packages/react-devtools

## React.lazy, Suspense, error boundary

## React.createContext