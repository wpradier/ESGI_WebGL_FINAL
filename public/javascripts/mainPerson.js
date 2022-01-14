import * as THREE from "/modules/three.js-master/build/three.module.js"

import { FBXLoader } from '/modules/three.js-master/examples/jsm/loaders/FBXLoader.js'; // FBX looader

async function createMainPerson(scene, mixer, camera){
    const loaderObject = new FBXLoader();

    let obj = await loaderObject.loadAsync( './assets/mainPerson/Swimming.fbx');

    mixer = new THREE.AnimationMixer( obj );

    const action = mixer.clipAction( obj.animations[ 0 ] ); // obj.animation ne fonctionne pas
    action.play();

    positionMainPerson(obj, camera);

    obj.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    scene.add( obj );

    return {"obj": obj, "mixer": mixer};
}

function positionMainPerson(obj, camera){
    obj.position.y = camera.position.y - 100;
    obj.position.x = camera.position.x;
    obj.position.z = camera.position.z;
    obj.rotation.y = camera.rotation.y - 550;
    obj.rotation.x = camera.rotation.x;
    obj.rotation.z = camera.rotation.z;
}

export { createMainPerson };
export { positionMainPerson };
