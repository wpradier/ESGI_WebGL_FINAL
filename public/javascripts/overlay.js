// Wrap every letter in a span
import anime from "/modules/anime-master/lib/anime.es.js";


var textWrapper = document.querySelector('.intro');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
    .add({
        targets: '.intro .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 5000,
        delay: (el, i) => 150 * (i+1)
    }).add({
    targets: '#start',
    opacity: [0, 1],
    duration: 1000,
    easing: "easeInOutQuad",
});