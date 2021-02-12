"use strict"

var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var assetsManager = null; 
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {

// This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);


  // This creates and initially positions a follow camera     
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

  // This positions the camera
  camera.setPosition(new BABYLON.Vector3(0, 3, -11));
  
  //camera.target is set after the target's creation// This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  
  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // // This creates and positions a free camera (non-mesh)
  // var camera1 = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -8), scene);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  var color = new BABYLON.StandardMaterial("color", scene);
  color.emissiveTexture = new BABYLON.Texture("textures/color.jpg", scene);

  var color0 = new BABYLON.StandardMaterial("color0", scene);
  color0.ambientTexture = new BABYLON.Texture("textures/color0.webp", scene);

  var color1 = new BABYLON.StandardMaterial("color1", scene);
  color1.ambientTexture = new BABYLON.Texture("textures/color1.jpg", scene);

////////////////////////////////////////////    SPHERE AND GROUND MESHS    ////////////////////////////////////////////////
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
  sphere.position.y = 1;
  sphere.position.x = 0;
  sphere.position.z = 0;
  sphere.material = color;

  var sphere0 = BABYLON.MeshBuilder.CreateSphere("sphere0", { diameter: 2, segments: 32 }, scene);
  sphere0.position.x = -1.5;
  sphere0.position.y = 0;
  sphere0.position.z = 0;
  sphere0.material = color0;

  var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 2, segments: 32}, scene);
  sphere1.position.x = 2;
  sphere1.position.y = 1;
  sphere1.position.z = 0;
  sphere1.material = color1;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 13, height: 13 }, scene);
  const material_ground = new BABYLON.StandardMaterial('material_ground', scene);
  material_ground.diffuseColor = new BABYLON.Color3(153/255, 255/255, 230/255);
  ground.material = material_ground

////////////////////////////////////////////////    SPHERE AND GROUND MESHS    //////////////////////////////////////////////
  
////////////////////////////////////////////////////////    SELECT     ///////////////////////////////////////////////////////
var selected = null;
    scene.onPointerObservable.add(function(evt){
        if(selected) {
            //selected.material.diffuseColor = BABYLON.Color3.Gray();
            selected = null;
        }
        if(evt.pickInfo.hit && evt.pickInfo.pickedMesh && evt.event.button === 0){
            selected = evt.pickInfo.pickedMesh;
            //evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Green();
        }
    }, BABYLON.PointerEventTypes.POINTERUP);
    
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var pointerDown = function (mesh) {
      currentMesh = mesh;
      startingPoint = getGroundPosition();
      if (startingPoint) { // we need to disconnect camera from canvas
          setTimeout(function () {
              camera.detachControl(canvas);
          }, 0);
      }
}

    var pointerUp = function () {
      if (startingPoint) {
          camera.attachControl(canvas, true);
          startingPoint = null;
          return;
      }
    }

    var pointerMove = function () {
      if (!startingPoint) {
          return;
      }
      var current = getGroundPosition();
      if (!current) {
          return;
      }

      var diff = current.subtract(startingPoint);
      currentMesh.position.addInPlace(diff);

      startingPoint = current;

  }

    scene.onPointerObservable.add((pointerInfo) => {      		
        switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				if(pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != ground) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh)
                }
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
                    pointerUp();
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:          
                    pointerMove();
				break;
        }
    });

//////////////////////////////////////////////////////////    SELECT     //////////////////////////////////////////////////////

/////////////////////////////////////////////////////////     DRAG       //////////////////////////////////////////////////
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragAxis: new BABYLON.Vector3(1, 0, 0) });
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragYxis: new BABYLON.Vector3(0, 1, 0) });
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragZxis: new BABYLON.Vector3(0, 0, 1) });

  // Use drag plane in world space
  pointerDragBehavior.useObjectOrientationForDragging = false;

  // Listen to drag events
  pointerDragBehavior.onDragStartObservable.add((event) => {
    console.log("dragStart");
    console.log(event);
  })
  pointerDragBehavior.onDragObservable.add((event) => {
    console.log("drag");
    console.log(event);
  })
  pointerDragBehavior.onDragEndObservable.add((event) => {
    console.log("dragEnd");
    console.log(event);
  })
  
  // If handling drag events manually is desired, set move attached to false
  // pointerDragBehavior.moveAttached = false;
  sphere0.addBehavior(pointerDragBehavior);


  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragAxis: new BABYLON.Vector3(1, 0, 0) });
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragYxis: new BABYLON.Vector3(0, 1, 0) });
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragZxis: new BABYLON.Vector3(0, 0, 1) });

  // Use drag plane in world space
  pointerDragBehavior.useObjectOrientationForDragging = false;

  pointerDragBehavior.onDragStartObservable.add((event) => {
    console.log("dragStart");
    console.log(event);
  })
  pointerDragBehavior.onDragObservable.add((event) => {
    console.log("drag");
    console.log(event);
  })
  pointerDragBehavior.onDragEndObservable.add((event) => {
    console.log("dragEnd");
    console.log(event);
  })
  sphere1.addBehavior(pointerDragBehavior);


  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragAxis: new BABYLON.Vector3(1, 0, 0) });
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragYxis: new BABYLON.Vector3(0, 1, 0) });
  var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragZxis: new BABYLON.Vector3(0, 0, 1) });

  // Use drag plane in world space
  pointerDragBehavior.useObjectOrientationForDragging = false;

  pointerDragBehavior.onDragStartObservable.add((event) => {
    console.log("dragStart");
    console.log(event);
  })
  pointerDragBehavior.onDragObservable.add((event) => {
    console.log("drag");
    console.log(event);
  })
  pointerDragBehavior.onDragEndObservable.add((event) => {
    console.log("dragEnd");
    console.log(event);
  })
  sphere.addBehavior(pointerDragBehavior);

  
////////////////////////////////////////////////////     DRAG       //////////////////////////////////////////////////

///////////////////////////////////////////////////     ROTATION    //////////////////////////////////////////////////////
// The first parameter can be used to specify which mesh to import. Here we import all meshes
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var panel = new BABYLON.GUI.StackPanel();
  panel.height = "200px";
  panel.width = "220px";
  panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  advancedTexture.addControl(panel);

  var header = new BABYLON.GUI.TextBlock();
  header.text = "Y-rotation: 0 deg";
  header.height = "30px";
  header.color = "white";
  panel.addControl(header); 

  var slider = new BABYLON.GUI.Slider();
  slider.minimum = 0;
  slider.maximum = 2 * Math.PI;
  slider.value = 0;
  slider.height = "20px";
  slider.width = "200px";
  slider.onValueChangedObservable.add(function(value) {
      header.text = "Y-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
      if (currentMesh) {
          currentMesh.rotation.y = value;
      }
  });
  panel.addControl(slider);
  
  var panel = new BABYLON.GUI.StackPanel();
  panel.width = "220px";
  panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  advancedTexture.addControl(panel);

  var header = new BABYLON.GUI.TextBlock();
  header.text = "X-rotation: 0 deg";
  header.height = "30px";
  header.color = "white";
  panel.addControl(header); 

  var slider = new BABYLON.GUI.Slider();
  slider.minimum = 0;
  slider.maximum = 2 * Math.PI;
  slider.value = 0;
  slider.height = "20px";
  slider.width = "200px";
  slider.onValueChangedObservable.add(function(value) {
      header.text = "X-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
      if (currentMesh) {
          currentMesh.rotation.x = value;
      }
  });
  panel.addControl(slider);  

  sphere.rotation.y = slider.value;
  sphere.rotation.x = slider.value;
////////////////////////////////////////////////////    ROTATION     /////////////////////////////////////////////////


  // function doImport(data) {
  //   BABYLON.SceneLoader.ImportMesh(("name", "", 'data:' + data, scene, function (object) {
  //     // You can apply properties to object.
  //     object.scaling = new BABYLON.Vector3(1, 1, 1);
  //   }));
  // }

//////////////////////////////////////////////////      RELOAD       ///////////////////////////////////////////////////////
  document.getElementById("restart-btn").addEventListener("click",function () {
    location.reload(); 
  });
/////////////////////////////////////////////////       RELOAD       //////////////////////////////////////////////////////  


/////////////////////////////////////////////////       SAVE SCENE       //////////////////////////////////////////////////////  
  var objectUrl;
  document.getElementById("save-btn").addEventListener("click",function () {
    if (confirm('Do you want to download that scene?')) {
      doDownload('scene', scene);
    } else {
      // Do nothing!
    }
  });
  var objectUrl;
  function doDownload(filename, scene) {
      if(objectUrl) {
          window.URL.revokeObjectURL(objectUrl);
      }
      
      var serializedScene = BABYLON.SceneSerializer.Serialize(scene);
          
      var strMesh = JSON.stringify(serializedScene);
      
      if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9){
          filename += ".babylon";
      }
              
      var blob = new Blob ( [ strMesh ], { type : "octet/stream" } );
         
      // turn blob into an object URL; saved as a member, so can be cleaned out later
      objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
      
      var link = window.document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      var click = document.createEvent("MouseEvents");
      click.initEvent("click", true, false);
      link.dispatchEvent(click);          
  }
/////////////////////////////////////////////////       SAVE SCENE       ////////////////////////////////////////////////////// 

  return scene;
};



// function myFunction() {
//   document.getElementById("button").innerHTML = "Hello World";
// }


var engine;
var scene;
var loadFile = function (event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src) // free memory
  }
};
var initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  scene = createScene();

  assetsManager = new BABYLON.AssetsManager(scene);

  //called when a single task has been sucessfull
  assetsManager.onTaskSuccessObservable.add(function (task) {

    // var mesh = task.loadedMeshes[0]; //will hold the mesh that has been loaded recently
    console.log('task successful', task);
  });

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log('task failed', task.errorObject.message, task.errorObject.exception);
  });
};
initFunction().then(() => {
  sceneToRender = scene
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});


//Upload input for file type
const htmlInput = document.getElementById("is-local-files");

htmlInput.onchange = function (evt) {
  var files = evt.target.files;
  var filename = files[0].name;
  var blob = new Blob([files[0]]);

  BABYLON.FilesInput.FilesToLoad[filename] = blob;
  
  assetsManager.addMeshTask('task1', "", "file:", filename);
  assetsManager.load();
  return scene;
};




//   "change",
//   event => {
//     let filesToLoad = null;
//     // Handling data transfer via drag'n'drop
//     if (event && event.dataTransfer && event.dataTransfer.files) {
//       filesToLoad = event.dataTransfer.files;
//     }
//     // Handling files from input files
//     if (event && event.target && event.target.files) {
//       filesToLoad = event.target.files;
//     }
//     if (filesToLoad.length == 0) {
//       return;
//     }

//     const format = filesToLoad[0].name.split(".").pop();
//     BABYLON.SceneLoader.Append("", "data:" + getBase64(Array.from(filesToLoad)[0]), engine, () => console.log('Mesh loaded! yay'));
//     // BABYLON.SceneLoader.Load("http://www.link.com/folderMeshAndTextures/", "mesh.babylon", engine, function (newScene) { });
//   },
//   false
// );

//function doImport() {

//   var f = browseBut.files[0];
//   if (f) {
//     var r = new FileReader();
//     r.onloadend = function (evt) { doImport(evt.target.result) };
//     //r.readAsText(f);
//   }
//   else {
//     alert("Failed to load file");
//   }
// };
