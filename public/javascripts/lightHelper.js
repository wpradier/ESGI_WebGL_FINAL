import * as THREE from "/modules/three.js-master/build/three.module.js"

function createLightHelper(scene, spotLight, visibility) {
    // Helper lines for the light direction
    const lightHelper = new THREE.SpotLightHelper( spotLight );
    // By default is not visible
    lightHelper.visible = visibility;

    scene.add( lightHelper );
}

export { createLightHelper };