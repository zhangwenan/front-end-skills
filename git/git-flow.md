

## Git Flow

### Git Flow是什么
Git Flow是一种成熟的分支管理模型，它能够应对绝大部分的场景。
注意, 它只是一个模型，而不是一个工具；你可以用工具去应用这个模型，也可以用最朴实的命令行。
所以，重要的是理解概念，不要执着于实行的手段。
可参看:
[A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)

Git Flow 就是给原本普普通通的分支赋予了不同的「职责」:
*   **master**: 最为稳定功能最为完整的随时可发布的代码
*   hotfix: 修复线上代码的 bug
*   **develop**: 永远是功能最新最全的分支
*   feature: 某个功能点正在开发阶段
*   release: 发布定期要上线的功能
其中, master、develop分支是主要分支，其他的分支是基于它们派生出来的。主要分支每种类型只能有一个，派生分支每个类型可以同时存在多个。各类型分支之间的关系用一张图来体现就是：
![2019-07-01-15-34-25](http://img.4455q.com/2019-07-01-15-34-25.png)
可参看: <https://github.com/xirong/my-git/blob/master/git-workflow-tutorial.md>

### 操作流程
首先，`master` 和 `develop`，设置为保护分支，除了各项目的负责人外不允许进行推送和删除等操作。

#### 功能开发
开发人员根据负责的功能，创建`feature`分支。多人合作的情况下，创建分支后需要推送并创建远程分支；否则，暂不创建远程分支，直到功能开发完毕再推送远程，并合并到 develop 分支。
功能开发并自测之后，推送到远程创建相应分支，并到 GitLab 上创建合并请求（merge request）给项目负责人。
项目负责人在收到合并请求时，先做下代码审核；有问题或者冲突就找开发人员去修改，没有问题就接受合并请求并删除对应的 feature 分支。

#### 测试
项目功能全部开发完成时，负责测试的人创建一个 release 分支部署到测试环境进行测试；若发现了 bug，相应的开发人员就在 release 分支上或者基于 release 分支创建一个分支进行修复。

#### 发布
项目功能通过测试后，运维同事将 release 分支合并进 master 和 develop 并打上 tag，然后打包发布到线上环境。
打 tag 时，建议在信息中详细描述这次发布的内容，如：添加了哪些功能，修复了什么问题。
tag的命名，建议使用语义化的版本号命名，<https://semver.org/lang/zh-CN/>

#### 问题修复
当发现线上环境的代码有小问题或者做些文案修改时，相关开发人员就在本地创建 hotfix 分支进行修改。

### 分支的命名
主要分支(master/develop)的名字是固定的，派生分支则需要自己命名的。命名规范推荐使用如下形式：
*   feature 分支：按照功能点（而不是需求）命名
*   release 分支：用发布时间命名，可以加上适当的前缀
*   hotfix 分支：issue 编号或 bug 性质等


### 工具选择
*   建议[SourceTree](https://www.sourcetreeapp.com/)

快捷键`Command ,`, 调出「Preferences」界面并切换到「Git」标签。
1.  勾选「Use rebase instead of merge by default for tracked branches」，这样在点「Pull」按钮拉取代码时会自动执行 `git pull --rebase`
2.  勾选「Do not fast-forward when merging, always create commit」以在每次合并时创建新的提交节点
![2019-07-01-15-47-05](http://img.4455q.com/2019-07-01-15-47-05.png)

点「Pull」按钮后出现的界面应该如下:
![2019-07-01-15-47-28](http://img.4455q.com/2019-07-01-15-47-28.png)

### Git常用命令
*   git fetch, 从远程仓库获取代码更新
*   git pull, 从远程仓库拉取最新代码到本地仓库
*   git status, 查看本地文件状态
*   git add, 将本地文件的修改添加到「提交列表」
*   git commit, 将「提交列表」中的文件提交到本地仓库
*   git stash, 将未提交的已修改文件添加到暂存区
*   git rebase, 更改提交所基于的节点
*   git merge, 合并其他分支的代码到当前分支
*   git push, 将提交到本地仓库的改变推送到远程仓库
*   git remote, 设置远程仓库源
*   git clone, 从远程仓库克隆代码到本地
*   git checkout, 切换分支或节点
*   git branch, 新建或删除分支
*   git reset, 将当前代码重置到指定提交节点
*   git revert, 把当前代码恢复到指定提交节点并产生新的提交节点

### Git Commit该怎么写
在具体开发工作中主要需要遵守的原则就是「使每次提交都有质量」，需要坚持以下几点:
1. 提交时的粒度是一个小功能点或者一个 bug fix，这样进行恢复等的操作时能够将「误伤」减到最低；
2. 用一句简练的话写在第一行，然后空一行稍微详细阐述该提交所增加或修改的地方；
3. 不要每提交一次就推送一次，多积攒几个提交后一次性推送，这样可以避免在进行一次提交后发现代码中还有小错误。
具体可参看: <https://mp.weixin.qq.com/s?__biz=MzAwNDYwNzU2MQ==&mid=401622986&idx=1&sn=470717939914b956ac372667ed23863c&scene=2&srcid=0114ZcTNyAMH8CLwTKlj6CTN&from=timeline&isappinstalled=0#wechat_redirect>

假如已经把代码提交了，对这次提交的内容进行检查时发现里面有个变量单词拼错了或者其他失误，**只要还没有推送到远程**，就有一个不被他人发觉你的疏忽的补救方法：
1. 把失误修正之后提交，可以用与上次提交同样的信息
![2019-07-01-15-39-20](http://img.4455q.com/2019-07-01-15-39-20.png)

2. 终端中执行命令 `git rebase -i [SHA]`，其中 SHA 是上一次提交之前的那次提交的，在这里是 `3b22372`
![2019-07-01-15-39-32](http://img.4455q.com/2019-07-01-15-39-32.png)

3. 这样就将两次提交的节点合并成一个，甚至能够修改提交信息！
![2019-07-01-15-39-42](http://img.4455q.com/2019-07-01-15-39-42.png)

历史可以篡改。前提是，**想要合并的那几次提交还没有推送到远程！**

### 代码合并
在将其他分支的代码合并到当前分支时，
如果那个分支是当前分支的父分支，为了保持图表的可读性和可追踪性，可以考虑用 git rebase 来代替 git merge；
反过来或者不是父子关系的两个分支以及互相已经 git merge 过的分支，就不要采用 git rebase 了，避免出现重复的冲突和提交节点。

### 避免无谓的merge
<https://ihower.tw/blog/archives/3843>


### 参看资料
*   [git官方文档](https://git-scm.com/book/zh/)
*   [廖雪峰Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)
