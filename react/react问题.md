Access-Control-Allow-Origin: * HTTP，为什么对错误处理体验有影响。
https://react.docschina.org/docs/cdn-links.html#why-the-crossorigin-attribute


建议将元素用括号包裹。避免自动插入分号陷进。
https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi


extend React.Component，不调用父类的构造函数，super(props)，会有什么问题？

state 和 props 之间的区别是什么？


##  懒加载
React.lazy(() => import('./OtherComponent'));
与webpack打包的import()有啥区别？

## Context的缺陷
由于组件依赖于context，会导致组件的复用性变差。
如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案。
https://react.docschina.org/docs/composition-vs-inheritance.html


```
import { Button } from 'antd';


const ThemeContext = React.createContext('light');


class Btn extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>Btn theme: { this.context }</div>
  }
}
Btn.contextType = ThemeContext;

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  // static contextType = ThemeContext;
  render() {
    return <div>
      <ThemeContext.Provider value="dark">
        <div>
          <div>Theme1: { this.context }</div>
          <Btn />
        </div>
      </ThemeContext.Provider>
    </div>
  }
}
App.contextType = ThemeContext;
// Theme1: light
// Btn theme: dark
```
