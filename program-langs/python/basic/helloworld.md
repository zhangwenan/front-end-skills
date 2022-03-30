

```
python3 -V

## 升级pip3
pip3 install --upgrade pip --user

## 查看安装的包
pip3 list
pip3 list | grep Scrapy
```

##  包的安装

实际操作中，`pip3`命令可能需要间接来执行。

```
python3 -m pip list
python3 -m pip install scrapy
```


##  文件读写
```
import json

with open('nested_list.json','r') as f:
    data = json.loads(f.read())
```

##  多个爬虫框架
https://blog.csdn.net/qq_41396296/article/details/81100158


##  Python操作数据库


##  多版本、多环境如何共存？


##  下载加速

https://blog.csdn.net/sandalphon4869/article/details/105681186