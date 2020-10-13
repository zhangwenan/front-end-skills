## 拉取github项目中的特定分支

```
git clone -b 1.x https://github.com/sorrycc/roadhog.git
```


##  拉取项目到非空目录

```
git init
git remote add origin PATH/TO/REPO
git fetch
git reset origin/master  # Required when the versioned files existed in path before "git init" of this repo.
##  git checkout -t origin/master
```

参考文档：https://stackoverflow.com/questions/2411031/how-do-i-clone-into-a-non-empty-directory