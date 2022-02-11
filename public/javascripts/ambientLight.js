import * as THREE from "/modules/three.js-master/build/three.module.js"

function createAmbientLight(scene){
    let ambient = new THREE.AmbientLight( 0x788afc, 1 );
    scene.add( ambient );

    return ambient;
}

export { createAmbientLight };