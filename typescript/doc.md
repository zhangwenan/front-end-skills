

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

##  Any

```
let list: any[] = [1, true, "free"];
list[1] = 100;
```


Object有点类似any，但是，`Object`类型的变量只是允许你给它赋任意值，却不能够在它上面调用任意的方法，即使它真的有这些方法。

```
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```


##  Void
void类型像是与any类型相反，它表示没有任何类型。

声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
```
let unusable: void = undefined;
```

## Null 和 Undefined
TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。

```
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

默认情况下`null`和`undefined`是所有类型的**子类型**。也就是说，可以把`null`和`undefined`赋值给`number`类型的变量。

但是，如果指定了`--strictNullChecks`标记，null和undefined只能赋值给void和它们各自。这能避免很多常见问题。 
也许在某处你想传入一个 `string`或`null`或`undefined`，可以使用**联合类型** string | null | undefined。

建议尽可能地使用`--strictNullChecks`

## Never
`never`类型表示的是那些永不存在的值的类型。
例如，`never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；
变量也可能是 never类型，当它们被永不为真的类型保护所约束时。


`never`类型是任何类型的*子类型*，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。即使 any也不可以赋值给never。

```
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```


##  Object
object表示*非原始类型*，也就是除number，string，boolean，symbol，null或undefined之外的类型。

使用object类型，就可以更好的表示像Object.create这样的API。例如：

```
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```


##  类型断言

通过*类型断言*这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 

类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，**只是在编译阶段起作用**。

```
let someValue: any = "this is a string";


let strLength1: number = (<string>someValue).length;
let strLength2: number = (someValue as string).length;
// 以上两种写法是等价的。
// 在使用JSX语法的时候，只有`as`写法的断言是被允许的。
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

