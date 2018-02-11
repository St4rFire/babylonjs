$(function() {

  // ------------------------
  // mesh choice
  // ------------------------

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
  const staticFolder = "babylon/";
  const meshPath = staticFolder + "mesh/";


  // ------------------------
  // scene setup
  // ------------------------

  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);
  scene.debugLayer.show();

  //scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
  //scene.collisionsEnabled = true;

  // setup camera
  var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/2 , Math.PI/5 * 2, 5, new BABYLON.Vector3(0, 1, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 3;
  camera.upperRadiusLimit = 20;
  camera.useBouncingBehavior = true;
  camera.useAutoRotationBehavior = true;
  camera.idleRotationSpinupTime = 5000;
  camera.idleRotationWaitTime = 3000;

  // camera.checkCollisions = true;
  // camera.applyGravity = true;

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
  var meshToColor;
  var mainMesh;
  loadMesh(scene, meshPath, currentMeshInfo, function(mainMeshPlayer, meshToColorPlayer) {
    meshToColor = meshToColorPlayer;
    mainMesh = mainMeshPlayer;
    camera.setTarget(mainMesh);

    // ------------------------
    // particle system setup
    // ------------------------
    addParticleTail(scene, staticFolder, null); //mainMesh
  });



  // ------------------------
  // The enemy
  // ------------------------
  loadMesh(scene, meshPath, currentMeshInfo, function(mainMeshEnemy, meshToColorEnemy) {

    updateMeshTextureByPath(scene, meshToColorEnemy, staticFolder + "mesh/spaceship/violet.png");
    addParticleTail(scene, staticFolder, mainMeshEnemy);

    var alpha = 0;
    scene.registerBeforeRender(function () {
      mainMeshEnemy.position = new BABYLON.Vector3(Math.cos(alpha) * 10, 0, Math.sin(alpha) * 10);
      alpha += 0.01;
    });
  });


  // var box = BABYLON.Mesh.CreateBox("crate", 2, scene);
  // box.material = new BABYLON.StandardMaterial("Mat", scene);
  // box.material.diffuseTexture = new BABYLON.Texture(staticFolder + "assets/textures/crate.png", scene);
  // box.position = new BABYLON.Vector3(10, -9, 0);
  mainMesh
  // var music = new BABYLON.Sound("Violons", staticFolder + "assets/sounds/violons11.wav", scene, function () {}, { loop: true, autoplay: true });
  // music.attachToMesh(box);






  // ------------------------
  // lens flare
  // ------------------------

  addLensFlare(scene, staticFolder);

  // ------------------------
  // Skybox
  // ------------------------

  addSkybox(scene, staticFolder);


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
        updateMeshTextureByBytes(scene, meshToColor, image);
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