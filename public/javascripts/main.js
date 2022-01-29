import * as THREE from "/modules/three.js-master/build/three.module.js"
import {createScene} from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import {createStatue} from "/javascripts/statue.js";
import {createPointLight} from "/javascripts/pointLight.js";
import {createSpotLight} from "/javascripts/spotLight.js";
import {createAmbientLight} from "/javascripts/ambientLight.js";

let scene, camera, renderer, controls, clock, mixer, statueObj, pointLight, pointLightActive, spotLight, lightHelper;

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

await init();
async function init() {
    clock = new THREE.Clock();

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

    //scene.add(mesh);

    const loader = new THREE.TextureLoader();
    loader.setPath( 'assets/skybox/' ); // emplacement des textures

    //Add statue
    statueObj = await createStatue(scene, mixer);
    // Add spotLight
    await createSpotLight(true, scene);
    //Add ambient light
    await createAmbientLight(scene);
    //Add pointLight
    pointLight = await createPointLight(statueObj);
    pointLightActive = false;


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