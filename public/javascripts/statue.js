import * as THREE from "/modules/three.js-master/build/three.module.js"

import { FBXLoader } from '/modules/three.js-master/examples/jsm/loaders/FBXLoader.js'; // FBX looader

async function createStatue(scene, mixer){
    const loaderObject = new FBXLoader();

    let obj = await loaderObject.loadAsync( './assets/statue/JumpingDown.fbx');

    mixer = new THREE.AnimationMixer( obj );

    const action = mixer.clipAction( obj.animations[ 0 ] );
    action.play();

    obj.position.y = 0;
    obj.position.x = 0;
    obj.position.z = - 260;

    obj.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    scene.add( obj );

    return {"obj": obj, "mixer": mixer};
}

export { createStatue };