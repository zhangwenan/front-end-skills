
##  git reset soft/hard/mixed模式的区别

*   HEAD, 表示当前分支的版本顶端，即:在当前分支的最近一次提交
*   Index(staging area), 即将被提交的文件集合。`git add`后的文件，会变成该状态
*   Working Copy, 代表工作区的文件集合

第一次checkout一个分支，HEAD就指向当前分支的最近一次commit。
此时，HEAD、INDEX、Working Copy，三者的文件集都是相同的。
对一个文件修改，那么Working Copy发生改变。
执行`git add`，Index发生改变，则Index和Working Copy相同了。
再执行`git commit`，HEAD发生改变，则Working Copy、Index、HEAD三者再次相同。


git reset命令，是用来将当前branch重置到另外一个commit的，而这个动作可能会将index以及work tree同样影响。
比如，如果当前master branch如下:
```
- A - B - C (HEAD, master)
```

执行`git reset B`，那么分支状态将变成如下:
```
- A - B(HEAD, master)
// C is still here, but there's no branch pointing to it anymore
```
`git checkout`与`git reset`不同，
如果执行的是`git checkout B`，那么分支状态将会变成如下:
```
- A - B(HEAD) - C(master)
```

此时, HEAD和master branch不在一个commit上，也就是进入了detached HEAD STATE。
HEAD、work tree、Index都指向了B，而master branch依然指向C。
如果，这时执行新的commit D，分支将如下:
```
- A - B - C(master)
        \ 
         D(HEAD)
```

```
git reset HEAD  // 不会发生任何事情
git reset HEAD~1
// HEAD~1是“the commit right before HEAD”的别名，或者说：put differently "HEAD's parent"

git reset HEAD~2    // 将HEAD从顶端的commit往下移动两个更早的commit
```

![git reset](./git-reset.png)


### git reset参数

####    soft
--soft参数, 告诉Git重置HEAD到另外一个commit, 不做其他任何改变。这意味着, Index,working copy都不会做任何变化, 所有的在original HEAD和你重置到的那个commit之间的所有变更集都放在stage(index)区域中

![git reset soft](./git-reset-soft.png)


####    hard
--hard参数, 将重置HEAD返回到另外一个commit, 重置Index以便反映HEAD的变化，并且重置working copy也使得其完全匹配起来。这是一个比较危险的动作，具有破坏性，数据因此可能会丢失！
如果真是发生了数据丢失又希望找回来，那么只有使用：[git reflog](http://blog.csdn.net/ibingow/article/details/7541402)命令了。你的所有本地修改将丢失。如果我们希望彻底丢掉本地修改但是又不希望更改branch所指向的commit，则执行git reset --hard = git reset --hard HEAD. i.e. don't change the branch but get rid of all local changes.另外一个场景是简单地移动branch从一个到另一个commit而保持index/work区域同步。这将确实令你丢失你的工作，因为它将修改你的work tree！

![git reset hard](./git-reset-hard.png)

####    mixed(default)
--mixed, 是reset的默认参数。它将重置HEAD到另外一个commit,并且重置index以便和HEAD相匹配，但是working copy不会被更改。所有该branch上从original HEAD（commit）到你重置到的那个commit之间的所有变更将作为local modifications保存在working area中，（被标示为local modification or untracked via git status)，但是并未staged的状态，你可以重新检视然后再做修改和commit

![git reset mixed](./git-reset-mixed.png)




http://marklodato.github.io/visual-git-guide/index-zh-cn.html