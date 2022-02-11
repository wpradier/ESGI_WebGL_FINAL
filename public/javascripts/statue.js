import * as THREE from "/modules/three.js-master/build/three.module.js"

import { FBXLoader } from '/modules/three.js-master/examples/jsm/loaders/FBXLoader.js'; // FBX looader

async function createStatue(scene, mixer, posX, posZ){
    const loaderObject = new FBXLoader();

    let obj = await loaderObject.loadAsync( './assets/statue/JumpingDown.fbx');

    mixer = new THREE.AnimationMixer( obj );

    const action = mixer.clipAction( obj.animations[ 0 ] );
    action.play();

    obj.position.x = posX;
    obj.position.y = -1190;
    obj.position.z = posZ;
    obj.rotation.y = 500;

    obj.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    obj.scale.set(1.75, 1.75, 1.75);

    scene.add( obj );

    return {"obj": obj, "mixer": mixer};
}

export { createStatue };