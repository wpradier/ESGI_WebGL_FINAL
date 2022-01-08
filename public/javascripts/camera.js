import * as THREE from "/modules/three.js-master/build/three.module.js"

function createCamera () {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.z = 400;

    return camera;
}

export { createCamera };