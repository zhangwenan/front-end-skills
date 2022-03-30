


```
function a() {
  console.log(this)
}

let b = () => {
  console.log(this)
}

let newDiv = document.createElement('div', {})
let newContent = document.createTextNode("yyyy!");
newDiv.appendChild(newContent);
newDiv.onclick = a
document.body.appendChild(newDiv)


let newDiv = document.createElement('div', {})
let newContent = document.createTextNode("yyyy!");
newDiv.appendChild(newContent);
newDiv.onclick = b
document.body.appendChild(newDiv)

let obj = {
  f: a
}
obj.f();


let obj2 = {
  f: b
}
obj2.f();


let obj3 = {}
a.bind(obj3)
b.bind(obj3);

a.call(undefined);  // 依然指向window
b.call({}); // 箭头函数调用call,依然指向window


class Foo {
  hello (name) {
    return `hello${name}`
  }

  doGreet(name) {
    return console.log(this.hello(name))
  }
}
const foo = new Foo();
(['nick', 'john']).forEach(foo.doGreet) // Cannot read properties of undefined (reading 'hello')



class作用域


// this指向是undefined
class P2 {
    constructor(name) { this.name = name}
    name() {return this.name}
    say() {console.log(this);console.log(this.name())}
    // say/name方法，都挂载了prototype上
}
let xianzhou = new P2('myname');
[1].forEach(xianzhou.say) // Cannot read properties of undefined (reading 'name')
xianzhou.say(); // Uncaught TypeError: this.name is not a function

// 解决办法是:
class Foo {
  constructor () {
    this.doGreet = this.doGreet.bind(this)
  }
  // ...
}



// bind只能绑定一次，只有第一次生效
function yes () {console.log(this); }
let nn = yes.bind({name:2})
let mm = nn.bind({name: 100})
mm()
// {name: 2}
```




