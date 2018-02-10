$(function() {

  // ------------------------
  // mesh choice
  // ------------------------

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


  // ------------------------
  // scene setup
  // ------------------------

  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);
  //scene.debugLayer.show();

  // setup camera
  var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/2 , Math.PI/5 * 2, 5, new BABYLON.Vector3(0, 1, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 3;
  camera.upperRadiusLimit = 20;
  camera.useBouncingBehavior = true;
  camera.useAutoRotationBehavior = true;
  camera.idleRotationSpinupTime = 5000;
  camera.idleRotationWaitTime = 3000;

  // setup light 1
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  // light.diffuse = new BABYLON.Color3(0, 1, 0);
  // light.specular = new BABYLON.Color3(0, 1, 0);
  light.intensity = 0.7;

  // setup light 2
  var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, -2, 0), scene);
  light2.diffuse = new BABYLON.Color3(1, 0, 0);
  light2.specular = new BABYLON.Color3(1, 0, 0);
  light2.intensity = 0.7;



  // ------------------------
  // mesh setup
  // ------------------------

  // es https://www.eternalcoding.com/?p=313
  // model rotation http://www.html5gamedevs.com/topic/20306-how-to-rotate-mesh-instead-of-the-camera/
  // http://www.babylonjs-playground.com/#CGXLT#5

  const meshPath = staticFolder + meshFolder + currentMeshInfo.meshName + "/"+ currentMeshInfo.meshName + ".babylon";
  var mainMesh;
  var meshToColor;
  BABYLON.SceneLoader.ImportMesh(currentMeshInfo.mainMesh, "", meshPath, scene, function (newMeshes, particleSystems) {

    // find mainMesh and meshToColor
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

    // scale only main mash, the binded ones will follow
    if(currentMeshInfo.scale) {
      mainMesh.scaling = currentMeshInfo.scale;
    }

    camera.setTarget(mainMesh);

  });


  // ------------------------
  // particle system setup
  // ------------------------

  var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture(staticFolder + "assets/lensflare/" + "flare.png", scene);

  // Where the particles come from
  var fountain = BABYLON.Mesh.CreateBox("foutain", 0.1, scene);
  fountain.rotate(new BABYLON.Vector3(1, 0, 0), 5 * Math.PI / 12, BABYLON.Space.LOCAL);
  fountain.translate(BABYLON.Axis.Z, 0.7, BABYLON.Space.WORLD);
  fountain.translate(BABYLON.Axis.Y, 0.2, BABYLON.Space.WORLD);
  fountain.isVisible = false;

  // Where the particles come from
  particleSystem.emitter = fountain; // the starting object, the emitter
  particleSystem.minEmitBox = new BABYLON.Vector3(-0.3, 0, 0); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.3, 0, 0); // To...

  // Colors of all particles
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  // Size of each particle (random between...
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.5;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.5;

  // Emission rate
  particleSystem.emitRate = 1500;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
  particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 3;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();


  // ------------------------
  // lens flare
  // ------------------------
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
  var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1),  lensFlareFolder + "flare.png", lensFlareSystem);
  var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1),    lensFlareFolder + "lens5.png", lensFlareSystem);
  var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1),    lensFlareFolder + "lens4.png", lensFlareSystem);

  // ------------------------
  // Skybox https://www.babylonjs.com/demos/lens/
  // ------------------------
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(staticFolder + "assets/skybox/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  skybox.material.disableLighting = true;


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



  // ------------------------
  // upload texture listener
  // ------------------------

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
        var texture = new BABYLON.Texture('data:new_texture' + e.timeStamp, scene, true,
          true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, image, true);

        if (!meshToColor.material) {
          meshToColor.material = new BABYLON.StandardMaterial("newMaterial", scene);
        }

        meshToColor.material.diffuseTexture = texture;
      };
    })(f);
    reader.readAsDataURL(f);
  });

  // ------------------------
  // take screenshot
  // ------------------------

  $('#takescreenshot').on('click',  function (evt) {
    BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
  });

});