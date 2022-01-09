import * as THREE from "/modules/three.js-master/build/three.module.js"

import {createLightHelper} from "/javascripts/lightHelper.js";

function createSpotLight(scene) {
    // SpotLight (color, intensity)
    const spotLight = new THREE.SpotLight( 0xffffff, 1 );

    paramsSpotLight(spotLight);
    paramsShadowsSpotLight(spotLight);
    createLightHelper(scene, spotLight, true);

    scene.add( spotLight);
}

function paramsSpotLight(spotLight) {
    spotLight.position.set( 15, 300, 35 );
    // Maximum size of the spotlight angle whose upper bound is Math.PI/4
    // The angle is radian
    spotLight.angle = Math.PI / 4;
    // percent of the spotlight cone attenuated due to penumbra
    spotLight.penumbra = 0.1;
    // he amount the light dims along the distance of the light ??? pas compris
    spotLight.decay = 2;
    // distance of the projection of the spotLight
    spotLight.distance = 200;
}

function paramsShadowsSpotLight(spotLight){
    // dynamic shadows projected
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 512; // 512 value default
    spotLight.shadow.mapSize.height = 512; // 512 value default
    spotLight.shadow.camera.near = 0.5; // 0.5 value default
    spotLight.shadow.camera.far = 500; // 500 value default
    spotLight.shadow.focus = Math.PI / 4; // focus is equal angle of the spotlight
}

export { createSpotLight };