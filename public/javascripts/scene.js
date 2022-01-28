import * as THREE from "/modules/three.js-master/build/three.module.js"

async function addSkybox(scene) {

    const skyboxTextureLoader = new THREE.CubeTextureLoader();

    skyboxTextureLoader.setPath('/assets/skybox/');
    const skyboxTexture = await skyboxTextureLoader.loadAsync([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png',
    ])

    scene.background = skyboxTexture;
}

async function createScene() {
    const scene = new THREE.Scene();

    await addSkybox(scene);

    return scene;
}

export { createScene };