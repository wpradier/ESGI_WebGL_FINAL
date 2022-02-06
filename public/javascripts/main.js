import * as THREE from "/modules/three.js-master/build/three.module.js"
import {createScene} from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import {createStatue} from "/javascripts/statue.js";
import {createPointLight} from "/javascripts/pointLight.js";
import {createSpotLight} from "/javascripts/spotLight.js";
import {createAmbientLight} from "/javascripts/ambientLight.js";
import {createCoral} from "/javascripts/coral.js";

let scene, camera, renderer, controls, clock, mixer, statueObj, pointLight, pointLightActive, raycaster, parentTransform;

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

const pointer = new THREE.Vector2();

async function init() {
    clock = new THREE.Clock();

    // Suppression de l'écran d'accueil
    const overlay = document.getElementById("overlay");
    overlay.remove();

    /** WEBGL **/

    // COLLISION TEST
    raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onPointerMove );

    scene = await createScene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createFirstPersonControls(camera, renderer);

    const loader = new THREE.TextureLoader();
    loader.setPath( 'assets/skybox/' ); // emplacement des textures

    //Add statue
    statueObj = await createStatue(scene, mixer);
    // Add spotLight
    await createSpotLight(true, scene);
    //Add ambient light
    await createAmbientLight(scene);
    //Add pointLight
    pointLight = await createPointLight(statueObj, scene);
    pointLightActive = false;
    // Add coral obj
    await createCoral(scene);

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


async function animate() {
    requestAnimationFrame(animate);

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

    // add EventListener the function logKey when a keydown
    await window.addEventListener('keydown', logKey);

    renderer.render(scene, camera);
}

async function logKey(event) {
    // when keydown 'a', ...
    if (event.keyCode === 65)
    {
        if (pointLightActive == false){
            scene.add(pointLight.pointLightRight);
            scene.add(pointLight.pointLightLeft);
            pointLightActive = true;
        }else{
            scene.remove(pointLight.pointLightRight);
            scene.remove(pointLight.pointLightLeft);
            pointLightActive = false;
        }

    }
}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}