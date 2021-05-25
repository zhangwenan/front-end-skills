

```
npm install -g typescript
```


##  数组
```
let list: number[] = [1, 2, 3];

// 等同于。以下是数组泛型的写法
let list: Array<number> = [1, 2, 3];
```

##  元组 Tuple
元组类型允许表示一个已知*元素数量*和*类型*的**数组**，各元素的类型不必相同。

```
let x: [number, string];
x = [10, 'hello'];  // OK
x = ['hello', 10];  // Error

// 当访问一个越界的元素，会使用`联合类型`替代。
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```

##  枚举
```
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

console.log(Color.Red, Color.Green, Color.Blue);    // 0  1  2
// 枚举类型的值，默认从0开始递增。

enum E {E1, E2 = 5, E3, E4, E5 = 100, E6}
console.log(E.E1, E.E2, E.E3, E.E4, E.E5, E.E6);    // 0 5 6 7 100 101
// 枚举类型，后一个成员的值，是前一个成员的值+1

// 枚举类型，可以通过数值进行反查
console.log(E[100]);    // 'E5'
```



##  类型注解

greeter.ts
```
function greeter(person: string) {
    return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.innerHTML = greeter(user);
```

执行`tsc greeter.ts`，会提示类型错误。但是，文件会被正常生成。


##  接口

```
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```



##  类

```
class Student {
    fullName: string;

    // 在构造函数的参数上使用public等同于创建了同名的成员变量
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```



### 装饰器
```
tsc --target ES5 --experimentalDecorators
```

或者，tsconfig.json:
```
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

装饰器使用 `@expression`这种形式，`expression`求值后必须为一个**函数**，它会在运行时被调用，被装饰的声明信息做为参数传入。


####  装饰器组合。
```
@f @g x
```

```
@f
@g
x
```

```
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

打印结果:
```
f(): evaluated
g(): evaluated
g(): called
f(): called
```

