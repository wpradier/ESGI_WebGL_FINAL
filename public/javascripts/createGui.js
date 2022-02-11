import {GUI} from "/modules/three.js-master/examples/jsm/libs/dat.gui.module.js";



function createGui (updateObjects) {
    const gui = new GUI();
    //console.log("BASE VOLUME : " + updateObjects["bgMusic"].getVolume() * 100);
    const guiParams = {
        "Volume": 50,//updateObjects["bgMusic"].getVolume() * 100
        "Speed": 10
    };

    const updateVolume = function (val) {
        updateObjects.bgMusic.setVolume(val / 100);
    };

    gui.add(guiParams, "Volume", 0, 100, 1).onChange(updateVolume);

}

export {createGui};