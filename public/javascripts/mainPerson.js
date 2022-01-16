import * as THREE from "/modules/three.js-master/build/three.module.js"

import { FBXLoader } from '/modules/three.js-master/examples/jsm/loaders/FBXLoader.js'; // FBX looader

async function createMainPerson(scene, mixer, camera){
    const loaderObject = new FBXLoader();

    let obj = await loaderObject.loadAsync( './assets/mainPerson/Swimming.fbx');

    mixer = new THREE.AnimationMixer( obj );

    const action = mixer.clipAction( obj.animations[ 0 ] ); // obj.animation ne fonctionne pas
    action.play();

    positionMainPerson(obj, camera;

    obj.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    camera.add( obj );
    scene.add(camera);

    return {"obj": obj, "mixer": mixer};
}

function positionMainPerson(obj, camera){
    obj.position.y = camera.position.y - 100;
    obj.position.x = camera.position.x - 10;
    obj.rotation.y = camera.rotation.y - 550;
}

export { createMainPerson };
export { positionMainPerson };
