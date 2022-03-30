
* 场景
* 相机
* 渲染器

##  坐标系
Three使用右手坐标系。
|位置|普通坐标系|Three所用坐标系|
|---|---|---|
|左上角|(0, 0)|(-1, 1)|
|左下角|(0, 2)|(-1, -1)|
|右上角|(2, 0)|(1, 1)|
|右下角|(2, 2)|(1, -1)|
转换公式:
```
x1 = (x/w) * 2 - 1
y1 = -(y/h) * 2 + 1
```

##  Mesh
在Three中，Mesh的构造函数是：`Mesh( geometry, material )` geometry是它的形状，material是它的材质。

### Material材质
材质，是物体表面除了形状以外所有可视属性的集合。比如，色彩、纹理、光滑度、反射率、折射率、发光度等。


##  投影
正交投影与透视投影。
正交投影相机的视景体是一个长方体，OrthographicCamera的构造函数：`OrthographicCamera( left, right, top, bottom, near, far )`
透视投影相机的视景体是个四棱台，它的构造函数是：`PerspectiveCamera( fov, aspect, near, far ) `

##  光
* 环境光AmbientLight
* 点光源PointLight
* 聚光灯SpotLight
* 方向光DirectionalLight
* 半球光HemisphereLight

##  Renderer
Renderer绑定一个canvas对象。把看到的东西渲染到屏幕上。

光栅化。https://www.jianshu.com/p/54fe91a946e2?open_source=weibo_search
坐标系空间变换。https://www.jianshu.com/p/09095090c07f
光照模型：http://www.yanhuangxueyuan.com/WebGL_course/light.html

OpenGL: 跨平台的图形库
WebGL: 基于OpenGL，面向web的图形库
Three.js: 封装WebGL，简化操作。


##  辅助坐标系
AxesHelper， https://threejs.org/docs/index.html#api/zh/helpers/AxesHelper


##  格式转换
https://www.aspose.app/
https://github.com/facebookincubator/FBX2glTF


##  相关技术
WebXR