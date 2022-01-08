import { OrbitControls } from "/modules/three.js-master/examples/jsm/controls/OrbitControls.js";

function createOrbitControls (camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
}

export { createOrbitControls };