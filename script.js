const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const startButton = document.querySelector('#start-btn');

// Elementos de notificaciones y carteles
const bonusToast = document.querySelector('#bonus-toast');
const bonusText = document.querySelector('#bonus-text');

const finalModal = document.querySelector('#final-modal');
const finalMessage = document.querySelector('#final-message');
const finalDatetime = document.querySelector('#final-datetime');

let score = 0;
let currentTime = 15; // 15 segundos de juego
let activeHole = null;
let gameTimeout = null;
let moleTimeout = null;
let countDownTimerId = null;
let toastTimeout = null;
let isPlaying = false;

// Configuración de bonos según topos golpeados
const bonusMilestones = [
    { target: 3, percent: 50, text: '¡Bono de 50%!' },
    { target: 6, percent: 100, text: '¡Bono de 100%!' },
    { target: 9, percent: 150, text: '¡Bono de 150%!' },
    { target: 12, percent: 200, text: '¡Bono de 200%!' }
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

    const displayTime = getRandomTime(1200, 2000);

    moleTimeout = setTimeout(() => {
        hole.classList.remove('mole');
        activeHole = null;

        if (isPlaying) {
            gameTimeout = setTimeout(popUpMole, 400);
        }
    }, displayTime);
}

// Muestra el aviso rápido flotante
function showBonusNotice(message) {
    bonusText.textContent = message;
    bonusToast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        bonusToast.classList.add('hidden');
    }, 1200);
}

// Calcula qué bono alcanzó el jugador hasta el momento
function getAchievedBonusPercentage() {
    if (score >= 12) return 200;
    if (score >= 9) return 150;
    if (score >= 6) return 100;
    if (score >= 3) return 50;
    return 0;
}

// Lógica para registrar clics
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        if (hole === activeHole && isPlaying) {
            score++;
            scoreDisplay.textContent = score;

            hole.classList.remove('mole');
            activeHole = null;
            clearTimeout(moleTimeout);

            // Verificar si corresponde notificación de bono
            if (currentBonusIndex < bonusMilestones.length && score === bonusMilestones[currentBonusIndex].target) {
                const milestone = bonusMilestones[currentBonusIndex];
                showBonusNotice(milestone.text);
                currentBonusIndex++;

                // Si alcanzó el máximo bono (200%), termina el juego al instante
                if (milestone.percent === 200) {
                    endGame();
                    return;
                }
            }

            if (isPlaying) {
                gameTimeout = setTimeout(popUpMole, 300);
            }
        }
    });
});

function countDown() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;

    if (currentTime <= 0) {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(countDownTimerId);
    clearTimeout(moleTimeout);
    clearTimeout(gameTimeout);

    holes.forEach(hole => hole.classList.remove('mole'));
    activeHole = null;

    // Obtener porcentaje de bono alcanzado
    const achievedBonus = getAchievedBonusPercentage();

    // Obtener la fecha y hora actual formateada
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Configurar y mostrar el cartel final
    finalMessage.textContent = `Felicitaciones te ganaste un bono de ${achievedBonus}%`;
    finalDatetime.textContent = `Fecha: ${formattedDate} - Hora: ${formattedTime}`;
    finalModal.classList.remove('hidden');

    startButton.disabled = false;
}

startButton.addEventListener('click', () => {
    score = 0;
    currentTime = 15;
    currentBonusIndex = 0;
    isPlaying = true;

    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = currentTime;
    startButton.disabled = true;
    
    bonusToast.classList.add('hidden');
    finalModal.classList.add('hidden');

    popUpMole();
    countDownTimerId = setInterval(countDown, 1000);
});
