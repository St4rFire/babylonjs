$(function() {

  const staticFolder = "babylon/";
  const meshFolder = "mesh/";

  const spaceShipMeshInfo = {
    meshName: "spaceship",
    mainMesh: "p2_wedge_geo",
    meshToColor : " / 2",
    scale: new BABYLON.Vector3(0.001, 0.001, 0.001)
  };

  const bagMeshInfo = {
    meshName: "bag",
    mainMesh: "Box",
  };

  const currentMeshInfo = spaceShipMeshInfo;


  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);

  // createScene function that creates and return the scene
  var createScene = function () {

    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/2 , Math.PI/5 * 2, 5, new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // import mesh   https://www.eternalcoding.com/?p=313
    const meshPath = staticFolder + meshFolder + currentMeshInfo.meshName + "/"+ currentMeshInfo.meshName + ".babylon";
    BABYLON.SceneLoader.ImportMesh(currentMeshInfo.mainMesh, "", meshPath, scene, function (newMeshes, particleSystems) {

      // find mainMesh and meshToColor
      var mainMesh;
      var meshToColor;
      for(var i = 0; i < newMeshes.length; i++) {
        var mesh = newMeshes[i];

        if(currentMeshInfo.mainMesh == mesh.name) {
          mainMesh = mesh;
        }
        if(currentMeshInfo.meshToColor && currentMeshInfo.meshToColor == mesh.name) {
          meshToColor = mesh;
        }
      }

      if(!mainMesh) {
        console.log(currentMeshInfo.mainMesh + " not found");
        return;
      }

      if(!meshToColor) {
        meshToColor = mainMesh;
      }

      if(currentMeshInfo.scale) {
        mainMesh.scaling = currentMeshInfo.scale;
      }


      // upload texture listener
      $('#upload').on('change', function (evt) {
        var files = evt.target.files; // FileList object
        if (!files) {
          return;
        }

        var f = files[0];

        // Only process image files.
        if (!f.type.match('image.*')) {
          return;
        }

        // apply new texture
        var reader = new FileReader();
        reader.onload = (function (theFile) {
          return function (e) {

            var image = e.target.result;
            var texture = new BABYLON.Texture('data:my_image_name' + e.timeStamp, scene, true,
              true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, image, true);

            if (!meshToColor.material) {
              meshToColor.material = new BABYLON.StandardMaterial("myMaterial", scene);
            }

            meshToColor.material.diffuseTexture = texture;
          };
        })(f);
        reader.readAsDataURL(f);
      });
    });

    // take screenshot
    $('#takescreenshot').on('click',  function (evt) {
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
    });

    //lens flare
    var light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(21.84, 50, -28.26), scene);
    var lightSphere0 = BABYLON.Mesh.CreateSphere("Sphere0", 16, 0.5, scene);
    lightSphere0.material = new BABYLON.StandardMaterial("white", scene);
    lightSphere0.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    lightSphere0.material.specularColor = new BABYLON.Color3(0, 0, 0);
    lightSphere0.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    lightSphere0.position = light0.position;

    var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light0, scene);
    var lensFlareFolder = staticFolder + "assets/lensflare/";
    var flare00 = new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1),      lensFlareFolder + "lens5.png", lensFlareSystem);
    var flare01 = new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1),lensFlareFolder + "lens4.png", lensFlareSystem);
    var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1),    lensFlareFolder + "lens4.png", lensFlareSystem);
    var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1),  lensFlareFolder + "Flare.png", lensFlareSystem);
    var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1),    lensFlareFolder + "lens5.png", lensFlareSystem);
    var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1),    lensFlareFolder + "lens4.png", lensFlareSystem);

    // Skybox https://www.babylonjs.com/demos/lens/
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(staticFolder + "assets/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.material.disableLighting = true;



    // model rotation
    // http://www.html5gamedevs.com/topic/20306-how-to-rotate-mesh-instead-of-the-camera/
    //   http://www.babylonjs-playground.com/#CGXLT#5

    return scene;
  };


  // call the createScene function
  var scene = createScene();
  scene.debugLayer.show();

  // run the render loop
  engine.runRenderLoop(function(){
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener('resize', function(){
    engine.resize();
  });
});