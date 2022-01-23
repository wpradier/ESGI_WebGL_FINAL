import * as THREE from "/modules/three.js-master/build/three.module.js"
import {createScene} from "/javascripts/scene.js";
import {createCamera} from "/javascripts/camera.js";
import {createRenderer} from "/javascripts/renderer.js";
import {createFirstPersonControls} from "/javascripts/firstPersonControls.js";
import {createMainPerson} from "/javascripts/mainPerson.js";
import {createMainPersonStatic} from "/javascripts/mainPerson.js";
import {createMainPersonGetUp} from "/javascripts/mainPerson.js";

let scene, camera, renderer, controls, mixer, mainPersonObj, mainPersonObjGetUp, mainPersonObjStatic, positionX, positionY, positionZ, i;
const clock = new THREE.Clock();

const startButton = document.getElementById("start");
startButton.addEventListener('click', init);

await init();
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
    mainPersonObjStatic = await createMainPersonStatic(scene, mixer, camera);
    mainPersonObjGetUp = await createMainPersonGetUp(scene, mixer, camera);
    positionX = camera.position.x;
    positionY = camera.position.y;
    positionZ = camera.position.z;

    i = 0;

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

    if ( mainPersonObjStatic.obj &&  mainPersonObjStatic.mixer){
        if (positionX == camera.position.x && positionY == camera.position.y && positionZ == camera.position.z){
            camera.remove( mainPersonObj.obj );
            if (i == 30){
                mainPersonObjGetUp.action.play();
                camera.add(mainPersonObjGetUp.obj);
                camera.remove( mainPersonObj.obj );
                scene.add(camera);
                mainPersonObjGetUp.mixer.update(delta);
                i++;
            }else{
                mainPersonObjGetUp.action.stop();
                camera.remove(mainPersonObjGetUp.obj);
                camera.add(mainPersonObjStatic.obj);
                scene.add(camera);
                mainPersonObjStatic.mixer.update(delta);
            }
        }else{
            mainPersonObjGetUp.action.stop();
            camera.remove( mainPersonObjStatic.obj );
            camera.remove( mainPersonObjGetUp.obj );
            camera.add(mainPersonObj.obj);
            scene.add(camera);

            i = 0;

            mainPersonObj.mixer.update(delta);

            positionX = camera.position.x;
            positionY = camera.position.y;
            positionZ = camera.position.z;
        }
    }

    renderer.render(scene, camera);
}