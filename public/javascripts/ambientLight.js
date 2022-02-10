import * as THREE from "/modules/three.js-master/build/three.module.js"

function createAmbientLight(scene){
    let ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
    scene.add( ambient );
}

export { createAmbientLight };