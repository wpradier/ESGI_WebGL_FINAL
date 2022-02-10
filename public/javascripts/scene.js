import * as THREE from "/modules/three.js-master/build/three.module.js"
import { OBJLoader } from "/modules/three.js-master/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/modules/three.js-master/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "/modules/three.js-master/examples/jsm/loaders/FBXLoader.js";

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

async function importObj(scene, objName, mtlPath, objPath, scaleAxis, positionX, positionY, positionZ) {
    let mtlLoader = new MTLLoader();
    let objLoader = new OBJLoader();

    mtlLoader.load(mtlPath, function(materials){
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, function(object){
            objName = object;
            objName.scale.set(scaleAxis, scaleAxis, scaleAxis);
            objName.position.set(positionX, positionY, positionZ);
            scene.add(objName);
        });
    });
}

async function importFBX(scene, fbxName, fbxPath, scaleAxis, positionX, positionY, positionZ) {
    let fbxLoader = new FBXLoader();

    fbxLoader.load( fbxPath, function(object) {
        fbxName = object;
        fbxName.scale.set(scaleAxis, scaleAxis, scaleAxis);
        fbxName.position.set(positionX, positionY, positionZ);
        scene.add(fbxName);

        object.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;  
            }
        } );
    });
}

export { createScene };
export { importObj };
export { importFBX };