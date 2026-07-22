const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const startButton = document.querySelector('#start-btn');

let score = 0;
let currentTime = 30;
let activeHole = null;
let gameTimeout = null;
let moleTimeout = null;
let countDownTimerId = null;
let isPlaying = false;

// Función para obtener un hoyo aleatorio (evitando que repita el mismo inmediatamente)
function getRandomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === activeHole) {
        return getRandomHole();
    }
    return hole;
}

// Función para obtener un tiempo aleatorio visible (ej. entre 1500ms y 2500ms)
function getRandomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Hace que aparezca un topo y desaparezca tras unos segundos
function popUpMole() {
    if (!isPlaying) return;

    const hole = getRandomHole();
    activeHole = hole;
    hole.classList.add('mole');

    // Tiempo que el topo permanece visible (entre 1.5 y 2.5 segundos)
    const displayTime = getRandomTime(1500, 2500);

    // Oculta al topo tras cumplirse el tiempo
    moleTimeout = setTimeout(() => {
        hole.classList.remove('mole');
        activeHole = null;

        // Si el juego sigue activo, hace aparecer al siguiente topo tras un breve descanso
        if (isPlaying) {
            gameTimeout = setTimeout(popUpMole, 500);
        }
    }, displayTime);
}

// Lógica para detectar los clics
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        // Verifica si hizo clic en el hoyo con el topo activo
        if (hole === activeHole) {
            score++;
            scoreDisplay.textContent = score;

            // Quita al topo inmediatamente al ser golpeado
            hole.classList.remove('mole');
            activeHole = null;

            // Cancela el temporizador para que no intente ocultarlo de nuevo
            clearTimeout(moleTimeout);

            // Hace aparecer el siguiente topo
            if (isPlaying) {
                gameTimeout = setTimeout(popUpMole, 400);
            }
        }
    });
});

// Contador regresivo
function countDown() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;

    if (currentTime === 0) {
        endGame();
    }
}

// Finaliza el juego y limpia los temporizadores
function endGame() {
    isPlaying = false;
    clearInterval(countDownTimerId);
    clearTimeout(moleTimeout);
    clearTimeout(gameTimeout);

    holes.forEach(hole => hole.classList.remove('mole'));
    activeHole = null;

    alert('¡Tiempo agotado! Tu puntuación final es: ' + score);
    startButton.disabled = false;
}

// Inicia el juego
startButton.addEventListener('click', () => {
    score = 0;
    currentTime = 30;
    isPlaying = true;

    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = currentTime;
    startButton.disabled = true;

    popUpMole();
    countDownTimerId = setInterval(countDown, 1000);
});
