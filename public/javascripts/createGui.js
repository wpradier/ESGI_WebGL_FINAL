import {GUI} from "/modules/three.js-master/examples/jsm/libs/dat.gui.module.js";



function createGui (updateObjects) {
    const gui = new GUI();


    const guiParams = {
        "Volume": updateObjects["bgMusic"].getVolume() * 100,
    };

    const updateVolume = function (val) {
        updateObjects["bgMusic"].setVolume(val / 100);
    };

    gui.add(guiParams, "Volume", 0, 100, 1).onChange(updateVolume);

    const speedFolder = gui.addFolder("Speeds");
    const speedParams = {
        "Movement": updateObjects["controls"].movementSpeed,
        "Rotation": updateObjects["controls"].lookSpeed
    }

    const updateMovementSpeed = function (val) {
        updateObjects["controls"].movementSpeed = val;
    }
    const updateLookSpeed = function (val) {
        updateObjects["controls"].lookSpeed = val;
    }

    speedFolder.add(speedParams, "Movement", 100, 600, 1).onChange(updateMovementSpeed);
    speedFolder.add(speedParams, "Rotation", 0.01, 0.1, 0.01).onChange(updateLookSpeed);


    const lightFolder = gui.addFolder("Lights");
    const lightParams = {
        "Ambient": updateObjects["ambientLight"].intensity
    };

    const updateAmbientLight = function (val) {
        updateObjects["ambientLight"].intensity = val;
    };

    lightFolder.add(lightParams, "Ambient", 0, 2, 0.1).name("Ambient intensity").onChange(updateAmbientLight);
}

export {createGui};