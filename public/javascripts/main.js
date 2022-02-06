import * as THREE from "/modules/three.js-master/build/three.module.js"
import {createScene} from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import {createCoral} from "/javascripts/coral.js";

let scene, camera, renderer, controls, clock;

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

await init();
async function init() {
    clock = new THREE.Clock();

    // Suppression de l'écran d'accueil
    const overlay = document.getElementById("overlay");
    overlay.remove();

    /** WEBGL **/
    scene = await createScene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createFirstPersonControls(camera, renderer);

    await createCoral(scene);

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

    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}