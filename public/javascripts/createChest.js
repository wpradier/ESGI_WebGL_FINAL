import * as THREE from "/modules/three.js-master/build/three.module.js";
import { OBJLoader } from "/modules/three.js-master/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/modules/three.js-master/examples/jsm/loaders/MTLLoader.js";


async function createChest(scene) {
    const chest = new THREE.Object3D();

    const stoneTexture = new THREE.TextureLoader().load("assets/chest/stone-texture.jpg");
    const stoneMaterial = new THREE.MeshPhongMaterial( { map: stoneTexture } );

    const goldTexture = new THREE.TextureLoader().load("/assets/chest/gold-texture.jpg")
    const goldMaterial = new THREE.MeshPhongMaterial( { map: goldTexture } );

    const maskLight = new THREE.PointLight(0xC323D8, 0, 100);

    const rotationPoint = new THREE.Object3D();

    const chestMtlLoader = new MTLLoader();
    const chestObjLoader = new OBJLoader();
    chestMtlLoader.setPath('/assets/chest/');
    chestObjLoader.setPath('/assets/chest/');

    /* LOAD BODY */
    const bodyMat = await chestMtlLoader.loadAsync('chestBody.mtl');

    chestObjLoader.setMaterials(bodyMat);
    const chestBody = await chestObjLoader.loadAsync('chestBody.obj');
    chestBody.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
            child.material = stoneMaterial;
        }
    });

    /* LOAD TOP */

    const topMat = await chestMtlLoader.loadAsync('chestTop.mtl');

    chestObjLoader.setMaterials(topMat);
    const chestTop = await chestObjLoader.loadAsync('chestTop.obj');
    chestTop.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;
            child.material = stoneMaterial;
        }
    });

    chestBody.scale.set(30, 30, 30);
    chestTop.scale.set(30, 30, 30);

    /* LOAD MASK */

    const mask = await chestObjLoader.loadAsync('Mask_death_obj.obj');
    mask.traverse( function (child) {
        if (child instanceof THREE.Mesh ) {
            child.receiveShadow = true;
            child.castShadow = true;
            child.material = goldMaterial;
        }
    })

    mask.scale.set(0.6, 0.6, 0.6);
    mask.rotation.y = -1.5708; // 90° in radians
    mask.position.set(0, -5, 0);


    const rotationPosition = 30; // Position of the rotation point relative to the chest

    chestTop.position.set(-rotationPosition, 0, 0);
    rotationPoint.position.set(rotationPosition, 30, 0)

    rotationPoint.add(chestTop);

    mask.add(maskLight);

    chest.add(chestBody);
    chest.add(rotationPoint);
    chest.add(mask);

    //chest.scale.set(0.3, 0.3, 0.3);

    chest.rotation.y = 1.5708; // 90° in radians

    scene.add(chest);

    return {rotationPoint, mask, maskLight}
}

export {createChest};