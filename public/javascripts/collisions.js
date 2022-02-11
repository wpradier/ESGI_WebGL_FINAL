import * as THREE from "/modules/three.js-master/build/three.module.js"

//instances 
function instanceBoxSize( instWidth, instHeight, instDepth){

    new THREE.BoxGeometry(instWidth, instHeight, instDepth);
}

function makeInstance(scene, instanceName, geometry, color, x, y, z) {
  [THREE.BackSide, THREE.FrontSide].forEach((side) => {
    let material = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.7,
      transparent: true,
      side,
    });

    instanceName = new THREE.Mesh(geometry, material);
    instanceName.position.set(x, y, z);
    console.log(instanceName.position.set(x, y, z));
    scene.add(instanceName);

  });
}

function hsl(h, s, l) {
    console.log("hsl");  
    return (new THREE.Color()).setHSL(h, s, l);
}

export {makeInstance};
export {hsl};
export {instanceBoxSize};
