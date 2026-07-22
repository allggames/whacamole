const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const startButton = document.querySelector('#start-btn');

// Elementos de la notificación flotante
const bonusToast = document.querySelector('#bonus-toast');
const bonusText = document.querySelector('#bonus-text');

let score = 0;
let currentTime = 30;
let activeHole = null;
let gameTimeout = null;
let moleTimeout = null;
let countDownTimerId = null;
let toastTimeout = null;
let isPlaying = false;

// Hitos de bonos
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

// Muestra el aviso sin frenar el juego y se borra solo a los 1.5 segundos
function showBonusNotice(message) {
    bonusText.textContent = message;
    bonusToast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        bonusToast.classList.add('hidden');
    }, 1500);
}

// Detección de clics
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        if (hole === activeHole && isPlaying) {
            score++;
            scoreDisplay.textContent = score;

            hole.classList.remove('mole');
            activeHole = null;
            clearTimeout(moleTimeout);

            // Verificar si corresponde bono
            if (currentBonusIndex < bonusMilestones.length && score === bonusMilestones[currentBonusIndex].target) {
                const milestone = bonusMilestones[currentBonusIndex];
                showBonusNotice(milestone.text);
                
                // Si llegó al último (200%), finaliza la partida
                if (milestone.target === 12) {
                    setTimeout(() => endGame(true), 1200);
                    return;
                }
                
                currentBonusIndex++;
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
        alert('¡Felicitaciones! Alcanzaste el bono de 200%. ¡Juego completado!');
    } else {
        alert('¡Tiempo agotado! Puntuación final: ' + score);
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
    bonusToast.classList.add('hidden');

    popUpMole();
    countDownTimerId = setInterval(countDown, 1000);
});
