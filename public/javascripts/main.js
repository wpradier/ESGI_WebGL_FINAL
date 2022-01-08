import * as THREE from "/modules/three.js-master/build/three.module.js"
import {createScene} from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createOrbitControls} from "/javascripts/orbitControls.js";

let scene, camera, renderer;

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

async function init() {
    
    // Suppression de l'écran d'accueil
    const overlay = document.getElementById("overlay");
    overlay.remove();

    /** WEBGL **/
    scene = await createScene();
    camera = createCamera();
    renderer = createRenderer();

    createOrbitControls(camera, renderer);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}