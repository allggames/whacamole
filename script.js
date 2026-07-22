const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const startButton = document.querySelector('#start-btn');

// Elementos del cartel (modal)
const bonusModal = document.querySelector('#bonus-modal');
const bonusText = document.querySelector('#bonus-text');
const closeModalBtn = document.querySelector('#close-modal-btn');

let score = 0;
let currentTime = 30;
let activeHole = null;
let gameTimeout = null;
let moleTimeout = null;
let countDownTimerId = null;
let isPlaying = false;

// Control de hitos de bonos
const bonusMilestones = [
    { target: 3, text: '¡Bono de 50%!' },
    { target: 6, text: '¡Bono de 100%!' },
    { target: 9, text: '¡Bono de 150%!' },
    { target: 12, text: '¡Bono de 200%!' }
];
let currentBonusIndex = 0;

function getRandomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === activeHole) {
        return getRandomHole();
    }
    return hole;
}

function getRandomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function popUpMole() {
    if (!isPlaying) return;

    const hole = getRandomHole();
    activeHole = hole;
    hole.classList.add('mole');

    const displayTime = getRandomTime(1500, 2500);

    moleTimeout = setTimeout(() => {
        hole.classList.remove('mole');
        activeHole = null;

        if (isPlaying) {
            gameTimeout = setTimeout(popUpMole, 500);
        }
    }, displayTime);
}

// Muestra el cartel emergente y pausa temporalmente la aparición de topos
function showBonusCartel(message, isFinal = false) {
    bonusText.textContent = message;
    bonusModal.classList.remove('hidden');

    // Si es el último bono (200%), pausamos el reloj para finalizar
    if (isFinal) {
        clearInterval(countDownTimerId);
        clearTimeout(moleTimeout);
        clearTimeout(gameTimeout);
        holes.forEach(hole => hole.classList.remove('mole'));
    }
}

closeModalBtn.addEventListener('click', () => {
    bonusModal.classList.add('hidden');

    // Si ya completó los 12 topos (último bono), termina el juego definitivamente
    if (score >= 12) {
        endGame(true);
    }
});

// Lógica para detectar los golpes
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        if (hole === activeHole && isPlaying) {
            score++;
            scoreDisplay.textContent = score;

            hole.classList.remove('mole');
            activeHole = null;
            clearTimeout(moleTimeout);

            // Verificar si alcanzó un hito de bono
            if (currentBonusIndex < bonusMilestones.length && score === bonusMilestones[currentBonusIndex].target) {
                const milestone = bonusMilestones[currentBonusIndex];
                currentBonusIndex++;

                const isFinal = currentBonusIndex === bonusMilestones.length;
                showBonusCartel(milestone.text, isFinal);

                if (isFinal) return; // Si es el último bono, no genera más topos
            }

            if (isPlaying) {
                gameTimeout = setTimeout(popUpMole, 400);
            }
        }
    });
});

function countDown() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;

    if (currentTime === 0) {
        endGame(false);
    }
}

function endGame(completedAllBonuses) {
    isPlaying = false;
    clearInterval(countDownTimerId);
    clearTimeout(moleTimeout);
    clearTimeout(gameTimeout);

    holes.forEach(hole => hole.classList.remove('mole'));
    activeHole = null;

    if (completedAllBonuses) {
        alert('¡Felicitaciones! Completaste todos los bonos alcanzando el 200%. Tu puntuación final es: ' + score);
    } else {
        alert('¡Tiempo agotado! Tu puntuación final es: ' + score);
    }

    startButton.disabled = false;
}

startButton.addEventListener('click', () => {
    score = 0;
    currentTime = 30;
    currentBonusIndex = 0;
    isPlaying = true;

    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = currentTime;
    startButton.disabled = true;
    bonusModal.classList.add('hidden');

    popUpMole();
    countDownTimerId = setInterval(countDown, 1000);
});
