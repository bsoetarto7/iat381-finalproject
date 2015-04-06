eCardApp.controller('photoStiching', function ($scope, eCardAppService){
 // This is our projection matrix.
  var camera;

  // This is where all mesh will be stored.
  var scene;

  // Should we use canvas? WebGL? SVG? DOM+CSS? This object determines that.
  var renderer;

  // This will be our cube object. Typically, "geometry" will represent an array
  // of vertices, and its connections (in other words, their edges).
  var geometry;

  // This is where we will be representing the "texture" used on our cube.
  // (material does not always imply that it will represent a texture. It can
  // also represent the ways to represent vertices and edges.)
  var material;

  // This is where we convert the vertex and material data into a mesh that we
  // will draw onto our scene.
  var meshes = [];

  // This is where we will be drawing our sky box.
  var sceneCube;

  // This is the camera for our cube object.
  var cameraCube;

  var CRATE_WIDTH = 200;

  // Considering this is JavaScript, the code inside this `init` function really
  // does not need to be in here. However, it allows us to keep our code clean so
  // whatever.

  var id;
  function init() {

    // Initialize our renderer.
    renderer = new THREE.WebGLRenderer();
    // If things hit the fan, then comment out the above line, and uncomment the
    // following:
    //
    //renderer = new THREE.CanvasRenderer();

    // Set the size of our renderer (pretty much a DOM element with width and
    // height style properties set to the current window size).
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    var photorotation = document.getElementById('pictureRotation');
    
    photorotation.appendChild( renderer.domElement );

    // Initialize our object that will represent a projection matrix.
    camera = new THREE.PerspectiveCamera(
      // The angle in degrees that will represent the perspective. The wider the
      // angle, the more we achieve a fish-eye view. The narrower, we go closer
      // to a telescope.
      75,
      // The aspect ratio. This is crucial. It will determine how to project a
      // square on our scene. We get the aspect ratio wrong, then the square will
      // apear more like a rectangle.
      window.innerWidth / window.innerHeight,
      // This determines how close an object needs to be in order to "disappear".
      1,
      // This determines how far an object needs to be in order to "disappear".
      10000000
    );

    cameraCube = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000000
    );


    // The position of the camera in our scene.
    camera.position.z = 500;
    camera.position.y = 500;

    // Initialize a scene to draw to, for both our main scene, and the cubemap.
    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();


    // add subtle blue ambient lighting
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);



    urL = eCardAppService.getUserImage();
    
    console.log(String(urL[0][2]));

    var urls = [
      String(urL[0][2]),
      String(urL[0][0]),
      '../img/white.jpg',
      '../img/white.jpg',
      String(urL[0][1]),
      '../img/white.jpg',
    ];

    var textureCube = THREE.ImageUtils.loadTextureCube(urls);
    textureCube.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
      overdraw: true
    }),

    cubemesh = new THREE.Mesh(new THREE.BoxGeometry( 100, 100, 100 ), material);
    sceneCube.add(cubemesh);
  }

  var cameraTheta = 0;
  var previousTime = Date.now();
  var boxesTheta = 0;

  // This is where our draw loop happens.
  //
  // In a non-JavaScript world, the draw loop and "game" happen asynchronously;
  // but considering how this is JavaScript, and that all synchronous code is
  // blocking (even asynchronous ones!), they are therefore intertwined.
  function animate() {

    var currentTime = Date.now();
    var time = currentTime - previousTime;
    previousTime = currentTime;

    window.addEventListener("devicemotion", function(event) {        
    }, true);

    window.ondevicemotion = function(event) {

      if(event.rotationRate.beta >0.3){

        cameraTheta += time * 0.002;
        camera.position.x = Math.sin(cameraTheta) * 5000;
        camera.position.z = Math.cos(cameraTheta) * 5000;
      }
      if(event.rotationRate.beta < -0.3){

        cameraTheta += time * -0.002;
        camera.position.x = Math.sin(cameraTheta) * 5000;
        camera.position.z = Math.cos(cameraTheta) * 5000;
      }

     
            
            
    }

    

    // // `requestAnimationFrame` calls a function only when it's appropriate. Here,
    // // we're asking `requestAnimationFrame` to call `animate`. This allows us to
    // // run our game loop.
    id = requestAnimationFrame(animate);

    boxesTheta += time * 0.03;

    for (var i = 0; i < meshes.length; i++) {
      meshes[i].position.y = Math.sin((boxesTheta+i)/9)*100;
    }

    // cameraTheta += time * 0.0003;
    // camera.position.x = Math.sin(cameraTheta) * 5000;
    // camera.position.z = Math.cos(cameraTheta) * 5000;

    camera.lookAt(scene.position);
    cameraCube.rotation.copy(camera.rotation);

    renderer.render(sceneCube, cameraCube);
    renderer.render(scene, camera);

  }

  var homeButton = document.getElementById('toGoHome');

  homeButton.onclick = function(){
    cancelAnimationFrame(id);
    scene = null;
  }

  init();
  animate();

});
