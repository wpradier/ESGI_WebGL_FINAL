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
import {createChest} from "/javascripts/createChest.js";
import {createGui} from "/javascripts/createGui.js";
import {GUI} from "/modules/three.js-master/examples/jsm/libs/dat.gui.module.js";

// import { importObject } from "./scene";


let scene, camera, renderer, controls, mixer, mainPersonObjSwimming, mainPersonObjTrading, positionX, positionY, positionZ, stats, statueObj, statueObj2, pointLight, pointLight2, pointLightActive, raycaster;
let landscape, rotationPoint, mask, maskLight, chestOpenSound, chestCloseSound, bgMusic, ambientLight, chest;


let status = "closed";

const clock = new THREE.Clock();

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

const pointer = new THREE.Vector2();

await init();
async function init() {

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
    statueObj = await createStatue(scene, mixer, 2100, 5950);
    statueObj2 = await createStatue(scene, mixer, 2600, 5750);
    //Add ambient light
    ambientLight = await createAmbientLight(scene);
    //Add pointLight
    pointLight = await createPointLight(statueObj, scene);
    pointLight2 = await createPointLight(statueObj2, scene);
    // Add coral obj
    await createCoral(scene);
    //collision of the statue
    raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onPointerMove );

    initSounds(scene);

    const chestRequiredSounds = await initSounds(camera);
    chestOpenSound = chestRequiredSounds["chestOpenSound"];
    chestCloseSound = chestRequiredSounds["chestCloseSound"];
    bgMusic = chestRequiredSounds["bgMusic"];

    const chestRequiredValues = await createChest(scene);
    rotationPoint = chestRequiredValues["rotationPoint"];
    mask = chestRequiredValues["mask"];
    maskLight = chestRequiredValues["maskLight"];
    chest = chestRequiredValues["chest"];

    // Add spotLight
    await createSpotLight(false, scene, chest);

    createGui({bgMusic, controls, ambientLight});

    
    //SCENE.exportObj(scene, landscape, 'temple-landscape.mtl', 'temple-landscape.obj', '../assets/landscape/source/', 25, 0, 0, 0);
    SCENE.exportGLTF(scene, landscape, '../assets/landscape/source/temple-landscape.glb', 25, -10000, -4000, 3000);

	//
    //create stats
    stats = new Stats();
    document.body.appendChild( stats.dom );

    //Add mainPerson
    mainPersonObjSwimming = await createMainPersonSwimming(scene, mixer, camera);
    mainPersonObjTrading = await createMainPersonTradingWater(scene, mixer, camera);

    //update last position sync function animate() {
    requestAnimationFrame(animate);


    updatePosition();

    document.body.appendChild(renderer.domElement);

    window.addEventListener('keydown', keyDownEvent);
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

    if ( statueObj.mixer){
        statueObj.mixer.update(delta);
        statueObj2.mixer.update(delta);
    }

    // Updates the ray with a new origin and direction
    raycaster.setFromCamera( pointer, camera );
    // recup intersections between ray and object
    const intersects = raycaster.intersectObjects( statueObj.obj.children);

    if (statueObj.obj){
        if ( intersects.length > 0 ) {
            pointLight.pointLightRight.visible = true;
            pointLight.pointLightLeft.visible = true;
        } else {
            pointLight.pointLightRight.visible = false;
            pointLight.pointLightLeft.visible = false;
        }
    }

    const intersects2 = raycaster.intersectObjects( statueObj2.obj.children);

    if (statueObj2.obj){
        if ( intersects2.length > 0 ) {
            pointLight2.pointLightRight.visible = true;
            pointLight2.pointLightLeft.visible = true;
        } else {
            pointLight2.pointLightRight.visible = false;
            pointLight2.pointLightLeft.visible = false;
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
        mask.position.y = -5;
        status = "closed"
    }
  
    renderer.render(scene, camera);
}

function keyDownEvent(event) {
    if (event.keyCode === 69) {
        if (camera.position.distanceTo(chest.position) <= 200) {
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

// export { animate };
