import * as THREE from "/modules/three.js-master/build/three.module.js"
import * as SCENE from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import {createStatue} from "/javascripts/statue.js";
import {createPointLight} from "/javascripts/pointLight.js";
import {createSpotLight} from "/javascripts/spotLight.js";
import {createAmbientLight} from "/javascripts/ambientLight.js";
import {createCoral} from "/javascripts/coral.js";
import Stats from '/modules/three.js-master/examples/jsm/libs/stats.module.js';
import {createMainPersonSwimming} from "/javascripts/mainPersonSwimming.js";
import {createMainPersonTradingWater} from "/javascripts/mainPersonTradingWater.js";
import {initSounds} from "/javascripts/audio.js";
// import { importObject } from "./scene";

let scene, camera, renderer, controls, mixer, mainPersonObjSwimming, mainPersonObjTrading, positionX, positionY, positionZ, stats, statueObj, pointLight, pointLightActive, raycaster;
let landscape;

const clock = new THREE.Clock();

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

const pointer = new THREE.Vector2();

await init();
async function init() {
    //clock = new THREE.Clock();

    // Suppression de l'écran d'accueil
    const overlay = document.getElementById("overlay");
    overlay.remove();

    /** WEBGL **/
    scene = await SCENE.createScene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createFirstPersonControls(camera, renderer);

    const loader = new THREE.TextureLoader();
    loader.setPath( 'assets/skybox/' ); // emplacement des textures

    //Add statue
    statueObj = await createStatue(scene, mixer);
    // Add spotLight
    await createSpotLight(false, scene, statueObj.obj);
    //Add ambient light
    await createAmbientLight(scene);
    //Add pointLight
    pointLight = await createPointLight(statueObj, scene);
    pointLightActive = false;
    // Add coral obj
    await createCoral(scene);
    //collision of the statue
    raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onPointerMove );

    initSounds(scene);

    // scene.add(mesh);
    SCENE.importFBX(scene, landscape, '../assets/landscape/source/landscape.fbx', 0.25, 0, 0, 0);

    //create stats
    stats = new Stats();
    document.body.appendChild( stats.dom );

    //Add mainPerson
    mainPersonObjSwimming = await createMainPersonSwimming(scene, mixer, camera);
    mainPersonObjTrading = await createMainPersonTradingWater(scene, mixer, camera);

    //update last position 
    updatePosition();

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
    await animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
}

function onPointerMove( event ) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

async function animate() {
    requestAnimationFrame(animate);

    stats.update();

    const delta = clock.getDelta();
    controls.update( delta );

    if ( statueObj.mixer)
        statueObj.mixer.update(delta);

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( statueObj.obj.children, true );

    if (statueObj.obj){
        if ( intersects.length > 0 ) {
            pointLight.pointLightRight.visible = true;
            pointLight.pointLightLeft.visible = true;
        } else {
            pointLight.pointLightRight.visible = false;
            pointLight.pointLightLeft.visible = false;
        }
    }

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