import { FirstPersonControls } from "/modules/three.js-master/examples/jsm/controls/FirstPersonControls.js";

function createFirstPersonControls (camera, renderer) {
    const controls = new FirstPersonControls(camera, renderer.domElement);


    controls.movementSpeed = 400; // 200
    controls.lookSpeed = 0.05;
    controls.noFly = true;
    controls.lookAt(0,0,0);

    return controls;
}

export { createFirstPersonControls };