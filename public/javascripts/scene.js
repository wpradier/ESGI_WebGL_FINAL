import * as THREE from "/modules/three.js-master/build/three.module.js"
import { OBJLoader } from "/modules/three.js-master/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/modules/three.js-master/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "/modules/three.js-master/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from '/modules/three.js-master/examples/jsm/loaders/GLTFLoader.js';
// import { Octree } from '/modules/three.js-master/examples/jsm/math/Octree.js';
// import {animate} from "/javascript/main.js";

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

async function exportObj(scene, objName, mtlFile, objFile, assetPath, scaleAxis, positionX, positionY, positionZ) {
    let objLoader = new OBJLoader();
    let mtlLoader = new MTLLoader();
    // mtlLoader.setBaseUrl(assetPath);
    mtlLoader.setPath(assetPath);

    mtlLoader.load(mtlFile, function(materials){
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.setPath(assetPath);
        objLoader.load(objFile, function(object){
            objName = object;
            objName.scale.set(scaleAxis, scaleAxis, scaleAxis);
            objName.position.set(positionX, positionY, positionZ);
            scene.add(objName);
        });
    });
}

async function exportFBX(scene, fbxName, fbxPath, scaleAxis, positionX, positionY, positionZ) {
    let fbxLoader = new FBXLoader();

    fbxLoader.load( fbxPath, function(object) {
        
        fbxName = object;

        fbxName.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;  
            }
        } );
        
        fbxName.scale.set(scaleAxis, scaleAxis, scaleAxis);
        fbxName.position.set(positionX, positionY, positionZ);
        scene.add(fbxName);
    });
}

async function exportGLTF(scene, gltfName, gltfPath, scaleAxis, positionX, positionY, positionZ){
    let gltfLoader = new GLTFLoader();

    gltfLoader.load(gltfPath, function animation(object) {
        object.scene.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
             } );
        gltfName = object;
        gltfName.scene.scale.set(scaleAxis, scaleAxis, scaleAxis);
        gltfName.scene.position.set(positionX, positionY, positionZ);
        scene.add(gltfName.scene);

        // const worldOctree = new Octree();
        // worldOctree.fromGraphNode( gltfName.scene ); //collisions
        // animate();
    });
}


export { createScene };
export { exportObj };
export { exportFBX };
export { exportGLTF };