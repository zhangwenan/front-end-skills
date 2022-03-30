

安装scrapy

```
pip3 install scrapy --user
```


设置环境变量
```
export PATH=${PATH}:/Users/xianzhou/Library/Python/3.7/bin
```


创建项目
```
scrapy startproject testscrapy
python3 -m scrapy startproject myproject
```

```
scrapy genspider -t basic book douban.com
scrapy list
```

## 乱码问题

```
python3 -m scrapy runspider getranks.py -O ranks.json -t json -s FEED_EXPORT_ENCODING=utf-8
// FEED_EXPORT_ENCODING=gb2312
```

入门： 
https://www.cnblogs.com/hongdanni/p/10585671.html