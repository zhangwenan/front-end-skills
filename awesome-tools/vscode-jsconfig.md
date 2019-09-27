
VSCode对JS的支持有2种模式：
1. 文件范围。没有jsconfig.json文件，那么，编辑一个文件的时候，代码智能补全只针对当前文件中的方法和内容，以及显式引入的文件中的方法。
2. 项目范围。有jsconfig.json文件，那么，VSCode会将jsconfig.json所在目录当做一个项目，智能补全会扫描当前项目中的所有方法。

如果一个项目，分为server端和client端，那么，分别创建jsconfig.json，就可以让智能提示，对无关项目的代码不做扫描和提示。


## exclude

```
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6"
  },
  "exclude": ["node_modules"]
}
```

## include

```
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6"
  },
  "include": ["src/**/*"]
}
```

## Using Webpack Aliases

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "ClientApp/*": ["./ClientApp/*"]
    }
  }
}
```

然后，import`ClientApp`目录下的模块时，就会有提示。

##  其他配置项

<https://code.visualstudio.com/docs/languages/jsconfig#_jsconfig-options>

