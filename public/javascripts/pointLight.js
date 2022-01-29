import * as THREE from "/modules/three.js-master/build/three.module.js"

async function createPointLight(statueObj) {
    let sphere, pointLightRight, pointLightLeft;

    sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

    pointLightRight = new THREE.PointLight( 0xff0040, 2, 50 );
    pointLightRight.position.set(statueObj.obj.position.x - 7, statueObj.obj.position.y + 192.5, statueObj.obj.position.z + 300); // position (x, z, y)
    pointLightRight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

    pointLightLeft = new THREE.PointLight( 0xff0040, 2, 50 );
    pointLightLeft.position.set(statueObj.obj.position.x - 15.5, statueObj.obj.position.y + 192.5, statueObj.obj.position.z + 300); // position (x, z, y)
    pointLightLeft.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

    return { "pointLightRight" : pointLightRight, "pointLightLeft": pointLightLeft };
}

export { createPointLight };