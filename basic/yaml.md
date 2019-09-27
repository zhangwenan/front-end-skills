YAML中允许表示三种格式，分别是常量值，对象和数组。使用#作为注释，YAML中只有行注释。

```
#即表示url属性值；
url: http://www.4455q.com

#即表示server.host属性的值；
server:
    host: http://www.4455q.com 

#数组，即表示server为[a,b,c]
server:
    - 120.168.117.21
    - 120.168.117.22
    - 120.168.117.
    
#常量
pi: 3.14   #定义一个数值3.14
hasChild: true  #定义一个boolean值
name: '你好YAML'   #定义一个字符串
```

##  基本格式要求
1. 大小写敏感；
2. 使用缩进代表层级关系；
3. 缩进只能使用空格，不能使用TAB，不要求空格个数，只需要相同层级左对齐（一般2个或4个空格）


YAML，支持流式(flow)语法表示对象。比如，

```
key: {child-key: value, child-key2: value2}

# 等同于

key: 
  child-key: value
  child-key2: value2

companies:
  -
    id: 1
    name: company1
    price: 200W
  -
    id: 2
    name: company2
    price: 500W

# 等同于
companies: [{id:1, name:company1, price:200W}, {id:2, name:company2, price:500W}]
```


```
# 对象的属性是一个数组[complexkey1,complexkey2]，对应的值也是一个数组[complexvalue1,complexvalue2]
? 
  - complexkey1
  - complexkey2
: 
  - complexvalue1
  - complexvalue2
```


```
# 可以理解为 [[Java,LOL]]
-
  - Java
  - LOL
```


##  常量
常量，包括：整数，浮点数，字符串，NULL，日期，布尔，时间。

```
boolean: 
  - TRUE  #true,True都可以
  - FALSE  #false，False都可以
float:
  - 3.14
  - 6.8523015e+5  #可以使用科学计数法
int:
  - 123
  - 0b1010_0111_0100_1010_1110    #二进制表示
null:
  nodeName: 'node'
  parent: ~  #使用~表示null
string:
  - 哈哈
  - 'Hello world'  #可以使用双引号或者单引号包裹特殊字符
  - newline
    newline2    #字符串可以拆成多行，每一行会被转化成一个空格
date:
  - 2018-02-17    #日期必须使用ISO 8601格式，即yyyy-MM-dd
datetime: 
  - 2018-02-17T15:02:31+08:00    #时间使用ISO 8601格式，时间和日期之间使用T连接，最后使用+代表时区
```


##  特殊符号

`---`表示一个文档的开始。以下例子，定义了两个profile，一个是development，一个production。
```
server:
  address: 192.168.1.100
---
spring:
  profiles: development
  server:
    address: 127.0.0.1
---
spring:
  profiles: production
  server:
    address: 192.168.1.120
```


`---`和`...`可以配合使用。比如以下例子，相当于在一个yaml文件中连续写了两个yaml配置项。
```
---
time: 20:03:20
player: Sammy Sosa
action: strike (miss)
...
---
time: 20:03:47
player: Sammy Sosa
action: grand slam
...
```


`!!`可以用作强制类型转换。
```
string:
  - !!str 54321
  - !!str true

# 相当于把数字和布尔类型强转为字符串
```

```
# 未验证
--- !!set
- Mark McGwire: 65
- Sammy Sosa: 63
- Sammy Sosa: 63
- Ken Griffy: 58
```
将数组解析为set，转化的内容就是：[{Ken Griffy=58}, {Mark McGwire=65}, {Sammy Sosa=63}]，重复的Sammy Sosa去掉。


```
#   > 保留末尾的换行
#   | 保留所有的换行符
#   其他情况下的换行符，都会被一个空格替换。
accomplishment: >
  Mark set a major league
  home run record in 1998.
stats: |
  65 Home Runs
  0.278 Batting Average
location:
  gsgsg3s.gsgsg
  eieksx

# 相当于
# { 
#    accomplishment: 'Mark set a major league home run record in 1998.\n',
#    stats: '65 Home Runs\n0.278 Batting Average\n',
#    location: 'gsgsg3s.gsgsg eieksx' }
```

`|`符号常见用于在YAML中配置HTML片段：
```
phraseTemplate: |
  <p style="color: red">
    some template ${msg}
  </p>
```

##  引用
重复的内容在YAML中可以使用`&`来完成锚点定义，使用`*`来完成锚点引用。

```
hr:
- Mark McGwire
- &SS Sammy Sosa
rbi:
- *SS 
- Ken Griffey
```
相当于：`{ hr: [ 'Mark McGwire', 'Sammy Sosa' ], rbi: [ 'Sammy Sosa', 'Ken Griffey' ] }`


```
SS: &a Sammy Sosa
hr:
- Mark McGwire
- *a
rbi:
- *a 
- Ken Griffey
```
相当于`{ SS: 'Sammy Sosa',hr: [ 'Mark McGwire', 'Sammy Sosa' ],rbi: [ 'Sammy Sosa', 'Ken Griffey' ] }`


```
default: &default
  - Mark McGwire
  - Sammy Sosa
hr: *default
```
相当于`{ default: [ 'Mark McGwire', 'Sammy Sosa' ],hr: [ 'Mark McGwire', 'Sammy Sosa' ] }`


##  合并
```
merge:
  - &CENTER { x: 1, y: 2 }
  - &LEFT { x: 0, y: 2 }
  - &BIG { r: 10 }
  - &SMALL { r: 1 }
  
sample1: 
  <<: *CENTER
  r: 10
    
sample2:
  <<: [ *CENTER, *BIG ]
  other: haha
    
sample3:
  <<: [ *CENTER, *BIG ]
  r: 100
```

相当于

```
{ merge: [ { x: 1, y: 2 }, { x: 0, y: 2 }, { r: 10 }, { r: 1 } ],
  sample1: { x: 1, y: 2, r: 10 },
  sample2: { x: 1, y: 2, r: 10, other: 'haha' },
  sample3: { x: 1, y: 2, r: 100 } }
```

