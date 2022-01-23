import * as THREE from "/modules/three.js-master/build/three.module.js"

import { FBXLoader } from '/modules/three.js-master/examples/jsm/loaders/FBXLoader.js'; // FBX looader

async function createMainPersonSwimming(scene, mixer, camera){
    const loaderObject = new FBXLoader();

    let obj = await loaderObject.loadAsync( './assets/mainPerson/Swimming.fbx');

    mixer = new THREE.AnimationMixer( obj );

    const action = mixer.clipAction( obj.animations[ 0 ] );
    action.play();

    obj.position.y = camera.position.y - 50;
    obj.position.x = camera.position.x - 0;
    obj.position.z = camera.position.z - 342;
    obj.rotation.y = camera.rotation.y - 600;

    obj.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    camera.add( obj );
    scene.add( camera );

    return {"obj": obj, "mixer": mixer};
}

export { createMainPersonSwimming };
