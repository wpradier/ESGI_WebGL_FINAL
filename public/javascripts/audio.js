import * as THREE from "/modules/three.js-master/build/three.module.js"


async function initSounds(camera) {
    let splashSound, bgMusic, chestOpenSound, chestCloseSound, buffer;

    const listener = new THREE.AudioListener();
    camera.add(listener);

    splashSound = new THREE.Audio(listener);
    bgMusic = new THREE.Audio(listener);
    chestOpenSound = new THREE.Audio(listener);
    chestCloseSound = new THREE.Audio(listener);


    const audioLoader = new THREE.AudioLoader();
    audioLoader.setPath('/assets/sounds/')

    buffer = await audioLoader.loadAsync('Heavy-Splash-A1.mp3')
    splashSound.setBuffer(buffer);
    splashSound.setLoop(false);
    splashSound.setVolume(0.5);

    buffer = await audioLoader.loadAsync('atlantis.mp3')
    bgMusic.setBuffer(buffer);
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.5);

    buffer = await audioLoader.loadAsync('creaky_door_4.mp3')
    chestOpenSound.setBuffer(buffer);
    chestOpenSound.setLoop(false);
    chestOpenSound.setVolume(1);

    buffer = await audioLoader.loadAsync('door_creak_closing.mp3')
    chestCloseSound.setBuffer(buffer);
    chestCloseSound.setLoop(false);
    chestCloseSound.setVolume(1);

    splashSound.play();
    bgMusic.play();

    return {chestOpenSound, chestCloseSound};
}

export {initSounds};