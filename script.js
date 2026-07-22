const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const startButton = document.querySelector('#start-btn');

let score = 0;
let currentTime = 30;
let hitPosition;
let timerId = null;
let countDownTimerId = null;

function randomHole() {
    // Limpia los topos anteriores
    holes.forEach(hole => {
        hole.classList.remove('mole');
    });

    // Elige un hoyo aleatorio
    let randomHole = holes[Math.floor(Math.random() * 9)];
    randomHole.classList.add('mole');

    hitPosition = randomHole.id;
}

// Detectar el clic en el topo
holes.forEach(hole => {
    hole.addEventListener('mousedown', () => {
        if (hole.id === hitPosition) {
            score++;
            scoreDisplay.textContent = score;
            hitPosition = null; // Evita múltiples puntos por un solo click
            hole.classList.remove('mole'); // Quita al topo golpeado
        }
    });
});

function moveMole() {
    timerId = setInterval(randomHole, 800); // Velocidad de aparición (800ms)
}

function countDown() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;

    if (currentTime === 0) {
        clearInterval(countDownTimerId);
        clearInterval(timerId);
        alert('¡Fin del juego! Tu puntuación final es: ' + score);
        resetGame();
    }
}

function resetGame() {
    score = 0;
    currentTime = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = currentTime;
    startButton.disabled = false;
    holes.forEach(hole => hole.classList.remove('mole'));
}

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
});
