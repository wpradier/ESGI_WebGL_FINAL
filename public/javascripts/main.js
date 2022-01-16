import * as THREE from "/modules/three.js-master/build/three.module.js"
import {createScene} from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import {createMainPerson} from "/javascripts/mainPerson.js";
import { positionMainPerson } from "/javascripts/mainPerson.js";

let scene, camera, renderer, controls, mixer, mainPersonObj;

const clock = new THREE.Clock();

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

init();
async function init() {
    //clock = new THREE.Clock();

    // Suppression de l'écran d'accueil
    const overlay = document.getElementById("overlay");
    overlay.remove();

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    /** WEBGL **/
    scene = await createScene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createFirstPersonControls(camera, renderer);


    scene.add(mesh);

    //Add mainPerson
    let ambient = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add( ambient );
    mainPersonObj = await createMainPerson(scene, mixer, camera);

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

    const delta = clock.getDelta();
    controls.update( delta );
    if ( mainPersonObj.mixer ){
        mainPersonObj.mixer.update( delta );
    }

    renderer.render(scene, camera);
}