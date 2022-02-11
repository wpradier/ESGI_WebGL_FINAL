import * as THREE from "/modules/three.js-master/build/three.module.js"

function createSpotLight(active, scene, chest){
    let spotLight;
    const targetObject = new THREE.Object3D();

    // SpotLight (color, intensity)
    spotLight = new THREE.SpotLight( 0xffffff, 10 );

    targetObject.position.set(chest.position.x, chest.position.y, chest.position.z);
    //the spotLight targets the object and not the center of the scene
    spotLight.target = targetObject;


    spotLight.position.set( 0 ,  900, 0 );
    // Maximum size of the spotlight angle whose upper bound is Math.PI/4
    // The angle is radian
    spotLight.angle = Math.PI / 8;
    // percent of the spotlight cone attenuated due to penumbra
    spotLight.penumbra = 0.1;
    // he amount the light dims along the distance of the light
    spotLight.decay = 2;
    // distance of the projection of the spotLight
    spotLight.distance = 500;

    // specify the shape, as well as the size
    const coneGeo = new THREE.ConeGeometry(210, 1100, 110); //Base radius, Height, Number of segmented faces around the circumference
    // Material chosen with opcaity color to make it visible and transparent to make it transparent
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true });
    //add the material and the cone scale to the cone variable
    const cone = new THREE.Mesh(coneGeo, coneMaterial);
    // position(x,y,z)of the cone using the pointing target
    cone.position.set(targetObject.position.x, targetObject.position.y, targetObject.position.z); // position
    scene.add(cone);

    paramsShadow(spotLight);
    creatLightHelper(active, spotLight, scene);

    scene.add(targetObject);
    targetObject.add( spotLight );
}

function paramsShadow(spotLight){
    // dynamic shadows projected/

    spotLight.castShadow = true;

    //shadow width
    spotLight.shadow.mapSize.width = 512; // 512 value default
    //shadow height
    spotLight.shadow.mapSize.height = 512; // 512 value default
    spotLight.shadow.camera.near = 0.5; // 0.5 value default
    // shadow distance
    spotLight.shadow.camera.far = 500; // 500 value default
    spotLight.shadow.focus = Math.PI / 4; // focus is equal angle of the spotlight
}

function creatLightHelper(active, spotLight, scene){
    let lightHelper;

    // Helper lines for the light direction
    lightHelper = new THREE.SpotLightHelper( spotLight );
    // By default is not visible
    lightHelper.visible = active;
    scene.add( lightHelper );
}

export { createSpotLight };


