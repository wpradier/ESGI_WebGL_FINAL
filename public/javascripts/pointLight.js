import * as THREE from "/modules/three.js-master/build/three.module.js"

async function createPointLight(statueObj, scene) {
    let sphere, pointLightRight, pointLightLeft;

    sphere = new THREE.SphereGeometry( 2, 16, 8 ); // radius (par défaut 1), nb de segments horizontaux, nb de segments verticaux

    pointLightRight = new THREE.PointLight( 0xff0040, 2, 50 );
    pointLightRight.position.set(statueObj.obj.position.x - 220, statueObj.obj.position.y + 338, statueObj.obj.position.z - 475); // position (x, z, y)
    pointLightRight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

    pointLightLeft = new THREE.PointLight( 0xff0040, 2, 50 );
    pointLightLeft.position.set(statueObj.obj.position.x - 232, statueObj.obj.position.y + 338, statueObj.obj.position.z - 467); // position (x, z, y)
    pointLightLeft.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

    scene.add(pointLightRight);
    scene.add(pointLightLeft);

    return { "pointLightRight" : pointLightRight, "pointLightLeft": pointLightLeft };
}

export { createPointLight };