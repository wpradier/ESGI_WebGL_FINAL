import * as THREE from "/modules/three.js-master/build/three.module.js"


async function initSounds(camera) {
    let splashSound, bgMusic, buffer;

    const listener = new THREE.AudioListener();
    camera.add(listener);

    splashSound = new THREE.Audio(listener);
    bgMusic = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();

    buffer = await audioLoader.loadAsync('/assets/sounds/Heavy-Splash-A1.mp3')
    splashSound.setBuffer(buffer);
    splashSound.setLoop(false);
    splashSound.setVolume(0.5);

    buffer = await audioLoader.loadAsync('/assets/sounds/atlantis.mp3')
    bgMusic.setBuffer(buffer);
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.5);

    splashSound.play();
    bgMusic.play();
}

export {initSounds};