import * as THREE from "/modules/three.js-master/build/three.module.js"

function createRenderer () {
    const renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
}

export { createRenderer };