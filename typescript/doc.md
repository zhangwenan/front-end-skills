

```
npm install -g typescript
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

