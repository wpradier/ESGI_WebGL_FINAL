import * as THREE from "/modules/three.js-master/build/three.module.js"
import * as SCENE from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import Stats from '/modules/three.js-master/examples/jsm/libs/stats.module.js';
import {createMainPersonSwimming} from "/javascripts/mainPersonSwimming.js";
import {createMainPersonTradingWater} from "/javascripts/mainPersonTradingWater.js";
import {initSounds} from "/javascripts/audio.js";
import {createChest} from "/javascripts/createChest.js";
// import { importObject } from "./scene";

let scene, camera, renderer, controls, mixer, mainPersonObjSwimming, mainPersonObjTrading, positionX, positionY, positionZ, stats;
let landscape, rotationPoint, mask, maskLight, chestOpenSound, chestCloseSound;

let status = "closed";

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


    /** WEBGL **/
    scene = await SCENE.createScene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createFirstPersonControls(camera, renderer);

    const chestRequiredSounds = await initSounds(camera);
    chestOpenSound = chestRequiredSounds["chestOpenSound"];
    chestCloseSound = chestRequiredSounds["chestCloseSound"];

    const chestRequiredValues = await createChest(scene);
    rotationPoint = chestRequiredValues["rotationPoint"];
    mask = chestRequiredValues["mask"];
    maskLight = chestRequiredValues["maskLight"];


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

    window.addEventListener('keydown', keyDownEvent);
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

    /*** CHEST OPENING CONTROL ***/

    if (status === "opening") {
        rotationPoint.rotation.z -= 0.01
        mask.position.y += 0.24
    } else if (status === "closing") {
        rotationPoint.rotation.z += 0.03
        mask.position.y -= 0.72
    }

    if (rotationPoint.rotation.z <= -1.5708) {
        rotationPoint.rotation.z = -1.5708;
        status = "opened"
    } else if (rotationPoint.rotation.z >= 0) {
        rotationPoint.rotation.z = 0;
        mask.position.y = 0;
        status = "closed"
    }
  
    renderer.render(scene, camera);
}

function keyDownEvent(event) {
    if (event.keyCode === 69) {
        console.log(camera.position.distanceTo(mask.position))
        if (camera.position.distanceTo(mask.position) <= 200) {
            if (status === "closed") {
                chestOpenSound.play();
                maskLight.intensity = 1;
                status = "opening"
            } else if (status === "opened") {
                chestCloseSound.play();
                maskLight.intensity = 0;
                status = "closing"
            }
        }
    }
}

function updatePosition() {
    positionX = camera.position.x;
    positionY = camera.position.y;
    positionZ = camera.position.z;
}