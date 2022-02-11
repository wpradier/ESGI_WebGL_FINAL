import * as THREE from "/modules/three.js-master/build/three.module.js"
import { OBJLoader } from "/modules/three.js-master/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/modules/three.js-master/examples/jsm/loaders/MTLLoader.js";

async function createCoral(){
    let coralMat;
    const coral_mtl_loader = new MTLLoader();
    const coral_loader = new OBJLoader();
    coralMat = await coral_mtl_loader.loadAsync('assets/obj/coral/coral.mtl')
    coral_loader.setMaterials(coralMat);
    let coral = await coral_loader.loadAsync('assets/obj/coral/coral.obj');
    coral.traverse( function (child) {
        if (child instanceof THREE.Mesh ) {
            child.receiveShadow = true;
            child.castShadow = true
        }
    })
    coral.scale.set(1000, 1000, 1000);

    return coral;
}

export { createCoral };
