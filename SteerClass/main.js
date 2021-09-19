import {sceneFromJSON} from './scene.js';
import {scene,initThree, postMessage} from './threemain.js';
import {Agent as AgentJ} from './agentJ.js';
import {Agent as AgentK} from './agentK.js';

/////////////////////////////////////////////////////////
// global variables
var camera, renderer;
var agentJ, agentK;

// program starts here ...
init();
animate();


function init() {

  initThree();

//  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 500;
  camera.position.y = 400;


  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);

  /////////////////////////////////////////////////////////////////////


  // scene grid [-400,400]x[-400,400]
  var gridXZ = new THREE.GridHelper(800, 80, 'red', 'white');
  scene.add(gridXZ);

  // in scene.js
  sceneFromJSON ( );  // using LevelDesigner

  //////////////////////////////////////////////////////////////////////////
  	let size = 10; // halfsize of agent
  	//let randXZ = [-400 + Math.random()*800, -400 + Math.random()*800];
//    agentJ = new AgentJ(new THREE.Vector3(randXZ[0], 0, randXZ[1]), size);
    //agentJ = new AgentJ(new THREE.Vector3(500, 0, 0), size);
    agentJ = new AgentJ(randomStart(), size);

  	//randXZ = [-400 + Math.random()*800, -400 + Math.random()*800];
    //agentK = new AgentK(new THREE.Vector3(200,0,-200), size);
    agentK = new AgentK(randomStart(), size);
	agentJ.setEnemy(agentJ);
	agentK.setEnemy(agentK);
}

function randomStart() {
  var pos = new THREE.Vector3();
  var done = false;
  do {
    pos.x = -400 + Math.random()*800;
    pos.y = 0;
    pos.z = -400 + Math.random()*800;
    for(var i = 0; i < scene.obstacles.length; i++) {
      if(scene.obstacles[i].center.distanceTo(pos) < scene.obstacles[i].size)
        break;
    }
    if(i == scene.obstacles.length)
      done = true;
  } while (! done);
  return pos;
}

function animate() {

  agentJ.setEnemy(agentK)
  agentK.setEnemy(agentJ)
  agentJ.update(0.01)
  agentK.update(0.01)
  $('#score').text (agentJ.name + '[' + agentJ.score.toFixed(1) + '] ... ' + agentK.name + '[' + agentK.score.toFixed(1) + ']');

  // check agent crossing obstacles ...
  scene.obstacles.forEach ( function (obs) { obs.checkCollision (agentJ)} );
  scene.obstacles.forEach ( function (obs) { obs.checkCollision (agentK)} );

  if (scene.targets.length > 0)
  	requestAnimationFrame(animate);
  else
	if (agentJ.score<agentK.score)
		alert (agentK.name+ " Win!")
	else
		alert (agentJ.name+ " Win!")

  render();
}

function render() {
  renderer.render(scene, camera);
}
