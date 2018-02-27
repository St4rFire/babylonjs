$(function() {


  if (!BABYLON.Engine.isSupported()) {
    return
  }

  // ------------------------
  // mesh choice
  // ------------------------

  const bagMeshInfo = {
    fileName: "bag",
    meshName: "Box",
  };


  const bagTestok = {
    fileName: "test",
    meshName: "root",
    scale: new BABYLON.Vector3(0.1, 0.1, 0.1)
  };

  const currentMeshInfo = bagTestok;
  const staticFolder = "babylon/";
  const meshPath = staticFolder + "mesh/";


  // ------------------------
  // scene setup
  // ------------------------

  // avoid missing polygons
  var removeBackFaceCulling = function (scene) {
    $.each(scene.materials, function( index, value ) {
      value.backFaceCulling = false;
    });
  };


  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);
  scene.debugLayer.show();
  scene.clearColor = new BABYLON.Color3(1, 1, 1);

  // setup camera
  var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/2 , Math.PI/5 * 2, 50, new BABYLON.Vector3(0, 1, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 30;
  camera.upperRadiusLimit = 100;
  camera.useBouncingBehavior = true;
  camera.useAutoRotationBehavior = true;
  camera.idleRotationSpinupTime = 5000;
  camera.idleRotationWaitTime = 3000;

  // setup light 1
  var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 10, 1), scene);
  light.intensity = 0.7;

  // setup light 2
  var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, -2, 0), scene);
  light2.specular = new BABYLON.Color3(0, 0, 0);
  light2.intensity = 2;



  // ------------------------
  // mesh setup
  // ------------------------

  var mainMash;

  const fullMeshPath = meshPath + currentMeshInfo.fileName + "/"+ currentMeshInfo.fileName + ".babylon";
  BABYLON.SceneLoader.ImportMesh(currentMeshInfo.meshName, "", fullMeshPath, scene,
    function (newMeshes, particleSystems) {
      if (newMeshes) {
        mainMash = newMeshes[0];

        if(currentMeshInfo.scale) {
          mainMash.scaling = currentMeshInfo.scale;
        }

        removeBackFaceCulling(scene);
        camera.setTarget(mainMash);
      }
    },
    function (progressEvent) {
      console.log("On progress " + progressEvent);
    },
    function (scene, message, exception) {
      console.log("Error loading mesh " + fullMeshPath + " : " + message);
    }
  );


  // ------------------------
  // run the render loop
  // ------------------------

  engine.runRenderLoop(function(){
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener('resize', function(){
    engine.resize();
  });


  window.scene = scene;


  // ------------------------
  // upload texture listener
  // ------------------------

  $('#upload').on('change', function (evt) {
    var files = evt.target.files; // FileList object
    if (!files) {
      return;
    }

    var file = files[0];

    // Only process image files.
    if (!file.type.match('image.*')) {
      return;
    }

    // apply new texture
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {

        var image = e.target.result;
        
        var texture = new BABYLON.Texture('data:new_texture' + new Date().getTime(), scene, true,
          true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, image, true);

        if (!mainMash.material) {
          mainMash.material = new BABYLON.StandardMaterial("newMaterial" + new Date().getTime(), scene);
        }

        // try to change only subMaterials to preserve other settings
        if (mainMash.material.subMaterials) {
          mainMash.material.subMaterials[0].diffuseTexture = texture;
        } else {
          mainMash.material.diffuseTexture = texture;
        }

        removeBackFaceCulling(scene);
      };
    })(file);
    reader.readAsDataURL(file);
  });


  // ------------------------
  // take screenshot
  // ------------------------

  $('#takescreenshot').on('click',  function (evt) {
    BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
  });


});