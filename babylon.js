var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(20, 200, 400));
   camera.attachControl(canvas, true);
    
   
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // Light
    var light = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), scene);

    // Ground
    var ground = BABYLON.Mesh.CreateGround("ground", 200, 200, 1, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.specularColor = BABYLON.Color3.Black();
    ground.material = groundMaterial;
    // Meshes
    var greenMat = new BABYLON.StandardMaterial("ground", scene);
    greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.emissiveColor = BABYLON.Color3.Green();
    

     var greenBox = BABYLON.Mesh.CreateBox("green", 20, scene);
        greenBox.material = greenMat;
        greenBox.position.x = 0;
        greenBox.position.y = 10;   
        greenBox.position.z = 0;
// Events
    var clicked = false;
    

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var button = BABYLON.GUI.Button.CreateSimpleButton("workerButton", "Worker");
    button.width = "80px";
    button.height = "40px";
	button.color = "white";
	button.background = "green";

    button.onPointerUpObservable.add(function() {
    clicked = !clicked;

 if(clicked){

     var getGroundPosition = function () {
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

   var onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground ; });
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition(evt);

            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }
        }
    } 

    var onPointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var onPointerMove = function (evt) {
        if (!startingPoint) {
            return;
        }

        var current = getGroundPosition(evt);

        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

   canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function () {
       canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);





}

}else {
    greenBox.isPickable=false;
		        
		        }




	});



    advancedTexture.addControl(button);

    

    return scene;
};