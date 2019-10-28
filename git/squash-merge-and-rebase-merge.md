
##  普通merge

```
git checkout master
git merge feature-zhangwenan
git branch -D feature-zhangwenan
git push origin master
```
合并前如下：
![原来的](http://images.liuliqiang.info/2017-11-08-15101478786848.jpg)

合并后如下：
![合并后](http://images.liuliqiang.info/2017-11-08-15101481294797.jpg)

看似没什么问题，但是，很多时候，我们并不需要那么多的 commit，假设一个 Bug Fix，pr 了十几个 commit，如果作者给你 merge 了，这十几个commit，会给以后看代码的人带来极大的困惑，同时，也不方便项目管理，想回滚都很难！


## squash merge

```
git checkout master
git merge --squash feature-zwa
git commit "this is a squash merge"
```

`squash merge`虽然将多个commit合并成了一个，但是，合并后的内容需要我们进行commit。因此，原作者的信息就会丢失，而合并后的代码作者就是执行`squash merge`的用户。

![squash](http://images.liuliqiang.info/2017-11-08-15101488495274.jpg)

