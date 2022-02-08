import * as THREE from "/modules/three.js-master/build/three.module.js"
import * as SCENE from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import Stats from '/modules/three.js-master/examples/jsm/libs/stats.module.js';
import {createMainPersonSwimming} from "/javascripts/mainPersonSwimming.js";
import {createMainPersonTradingWater} from "/javascripts/mainPersonTradingWater.js";
import {initSounds} from "/javascripts/audio.js";
// import { importObject } from "./scene";

let scene, camera, renderer, controls, mixer, mainPersonObjSwimming, mainPersonObjTrading, positionX, positionY, positionZ, stats;
let landscape;

const clock = new THREE.Clock();

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

//await init();
async function init() {
    //clock = new THREE.Clock();

    // Suppression de l'écran d'accueil
    const overlay = document.getElementById("overlay");
    overlay.remove();

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    /** WEBGL **/
    scene = await SCENE.createScene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createFirstPersonControls(camera, renderer);

    initSounds(scene);

    // scene.add(mesh);
    SCENE.importFBX(scene, landscape, '../assets/landscape/source/landscape.fbx', 0.25, 0, 0, 0);

    //create stats
    stats = new Stats();
    document.body.appendChild( stats.dom );

    //Add ambient light
    let ambient = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add( ambient );

    //Add mainPerson
    mainPersonObjSwimming = await createMainPersonSwimming(scene, mixer, camera);
    mainPersonObjTrading = await createMainPersonTradingWater(scene, mixer, camera);

    //update last position 
    updatePosition();

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
}

function animate() {
    requestAnimationFrame(animate);

    stats.update();

    const delta = clock.getDelta();
    controls.update( delta );

    if ( mainPersonObjTrading.obj &&  mainPersonObjTrading.mixer){
        if (positionX == camera.position.x && positionY == camera.position.y && positionZ == camera.position.z){
            camera.remove( mainPersonObjSwimming.obj );
            camera.add(mainPersonObjTrading.obj);
            scene.add(camera);
            mainPersonObjTrading.mixer.update(delta);
        }else{
            camera.remove( mainPersonObjTrading.obj );
            camera.add(mainPersonObjSwimming.obj);
            scene.add(camera);

            mainPersonObjSwimming.mixer.update(delta);

            updatePosition();
        }
    }
  
    renderer.render(scene, camera);
}

function updatePosition(){
    positionX = camera.position.x;
    positionY = camera.position.y;
    positionZ = camera.position.z;
}