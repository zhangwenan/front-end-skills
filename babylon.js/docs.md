
babylon.js可以导入、导出多种格式的文件。

* Scene。场景用于放置物体
* Camera。用于设定观察视角
* Light。光线
* Model。物体
* Mesh。物体都是由一个个简单几何结构组成的。这些几何结构称为 Mesh(网格)


```
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
// 当前只有一个scene的情况下，第3个参数可以省略

const box = BABYLON.MeshBuilder.CreateBox("box", {});
```



##  Babylon.js Playground
Playground上创建的模型，可以保存和导出。比如，导出`.babylon`、`GLB`格式。
`Inspector` > `Tools` > `Scene Export`

##  可以直接导入使用的文件格式
`.babylon`、`.gltf`、`.glb`。以上几种格式，对于babylon.js而言，是没有区别的。
使用不同文件格式导出，其导出方式会有不同。导出后，内部的目录结构也会有所不同。
不同格式的文件，导入到babylon之后，可能会有细微的变化。
https://doc.babylonjs.com/start/chap1/first_import#warning


```
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
<babylon model="Path to File"></babylon>
```

### 禁止默认行为
```
<babylon extends="minimal" model="path to model file"></babylon>
// 使用minimal设置，可以去掉babylon的一些默认行为。比如，默认创建的ground，可能与载入的资源重叠
```

### 调整camera角度
禁止默认行为的同时，也会禁止默认的camera角度设置。因此，需要自行调整。
camera的调整，必须在model载入之前。model一旦在view中加载完成，camera属性就无法修改了。
因此，要移出<babylon>标签的`model`属性，异步操作完成后，再加载`model`。
```
<babylon id="myViewer" extends="minimal"></babylon>
<script>
    BabylonViewer.viewerManager.getViewerPromiseById('myViewer').then((viewer) => {
      viewer.onSceneInitObservable.add(() => {
          viewer.sceneManager.camera.radius = 15; //set camera radius/ Camera的观察距离
          viewer.sceneManager.camera.beta = Math.PI / 2.2; //angle of depression/ Camera的观察角度
      });
      viewer.onEngineInitObservable.add((scene) => {
          viewer.loadModel({
              url: "https://assets.babylonjs.com/meshes/village.glb"
          });
      });
    });
</script>
```

```
// 限制视角
camera.upperBetaLimit = Math.PI / 2.2;
```


##  SceneLoader.ImportMeshAsync

资源的导入是异步的。

```
BABYLON.SceneLoader.ImportMeshAsync(model name, folder path, file name, scene);
// model name，可以指定导入的model，一个、多个或者全部。一个babylon文件中，可能包含多个model
// scene，可选。默认是，当前的scene
```

```
BABYLON.SceneLoader.ImportMeshAsync("", "/relative path/", "myFile"); //empty string all meshes
BABYLON.SceneLoader.ImportMeshAsync("model1", "/relative path/", "myFile"); //Name of model for one model
BABYLON.SceneLoader.ImportMeshAsync(["model1", "model2"], "/relative path/", "myFile"); //Array of model names
```

```
BABYLON.SceneLoader.ImportMeshAsync("", "/relative path/", "myFile").then((result) => {
    result.meshes[1].position.x = 20;
    const myMesh1 = scene.getMeshByName("myMesh_1");
    myMesh1.rotation.y = Math.PI / 2;
});
```

##  坐标系
y轴，表示的是，与水平面垂直的方向。

##  纹理
```
const roofMat = new BABYLON.StandardMaterial("roofMat");
roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
```

##  faceUV
正方体的`faceUV`数组中，0表示背面；1表示正面；2表示右侧面；3表示左侧面；4表示顶面；5表示底面。
```
const boxMat = new BABYLON.StandardMaterial("boxMat");
boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png")
const faceUV = []
faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0)
faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0)
faceUV[2] = new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0)
faceUV[3] = new BABYLON.Vector4(0.75, 0.0, 1.0, 1.0)
const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true})
box.material = boxMat;
```

##  合并Mesh
直接合并的话，合并后的Mesh，只能应用一个material，也就是数组中的最后一个mesh所带的material，此处，是roof的material
```
const house = BABYLON.Mesh.MergeMeshes([box, roof])
const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
```

##  Mesh Parent
合并的mesh，局部物体不能独立进行翻转等操作。因此，需要用到mesh parent。形成父子关系。比如，轮胎属于汽车，并且可以独立转动


##  多边形挤出（Extruding Polygons）
```
  //base
  const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
  ]

  //curved front
  for (let i = 0; i < 20; i++) {
      outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
  }

  //top
  outline.push(new BABYLON.Vector3(0, 0, 0.1));
  outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

  //back formed automatically
  const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2});
```

##  动画
```
scene.beginAnimation(wheelRB, 0, 30, true);
```

##  常用方法
```
// 添加平面
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10});

// 添加长方体、正方体
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
box.scaling.x = 2
box.scaling.y = 1.5
box.scaling.z = 3
box.scaling = new BABYLON.Vector3(2, 1.5, 3);

// 位置修改
box.position.x = -2;
box.position.y = 4.2;
box.position.z = 0.1;
box.position = new BABYLON.Vector3(-2, 4.2, 0.1);

// 方向/角度调整（弧度表示）
box.rotation.y = Math.PI / 4;
box.rotation.y = BABYLON.Tools.ToRadians(45);

// 添加声音
const music = new BABYLON.Sound("cello", "sounds/cellolong.wav", scene, null, { loop: true, autoplay: true });
const bounce = new BABYLON.Sound("bounce", "sounds/bounce.wav", scene);
setInterval(() => bounce.play(), 3000);

// 圆柱体
BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1});

// 三棱柱
BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1, tessellation: 3});

// 纹理
const groundMat = new BABYLON.StandardMaterial("groundMat");
groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
ground.material = groundMat; //Place the material property of the ground
```



##  Model导出
https://doc.babylonjs.com/extensions/glTFExporter

##  资源导入
https://doc.babylonjs.com/divingDeeper/importers