const questions = [
    {
        text: "¿Qué imprime este código?",
        code: "let x = 5;\nlet y = 3;\nconsole.log(x + y);",
        options: ["A) 8", "B) 53", "C) x + y", "D) Error"],
        correctIndex: 0
    },
    {
        text: "¿Cuál es la forma correcta de declarar una constante en JavaScript?",
        code: null,
        options: ["A) var myConst = 10;", "B) let myConst = 10;", "C) const myConst = 10;", "D) constant myConst = 10;"],
        correctIndex: 2
    },
    {
        text: "¿Qué valor retorna esta expresión?",
        code: "typeof 'Hola Mundo'",
        options: ["A) string", "B) text", "C) object", "D) undefined"],
        correctIndex: 0
    },
    {
        text: "¿Cómo se escribe un comentario de una línea en JavaScript?",
        code: null,
        options: ["A) <!-- Comentario -->", "B) // Comentario", "C) /* Comentario */", "D) # Comentario"],
        correctIndex: 1
    },
    {
        text: "¿Qué estructura se usa para tomar decisiones (condicional)?",
        code: null,
        options: ["A) for", "B) function", "C) if...else", "D) while"],
        correctIndex: 2
    }
];

let state = {
    playerName: "",
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
    correctCount: 0,
    incorrectCount: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('screen-start'),
    game: document.getElementById('screen-game'),
    win: document.getElementById('screen-win'),
    lose: document.getElementById('screen-lose')
};

// Start Screen
const inputName = document.getElementById('player-name');
const btnStart = document.getElementById('btn-start');

// Game Screen
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const livesDisplay = document.getElementById('lives-display');
const questionText = document.getElementById('question-text');
const questionCode = document.getElementById('question-code');
const optionsContainer = document.getElementById('options-container');

// End Screens
const winScore = document.getElementById('win-score');
const loseScore = document.getElementById('lose-score');
const loseCorrect = document.getElementById('lose-correct');
const loseIncorrect = document.getElementById('lose-incorrect');

// Buttons
const btnRestartWin = document.getElementById('btn-restart-win');
const btnExitWin = document.getElementById('btn-exit-win');
const btnRestartLose = document.getElementById('btn-restart-lose');
const btnHomeLose = document.getElementById('btn-home-lose');

// Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

function initGame() {
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.lives = 3;
    state.correctCount = 0;
    state.incorrectCount = 0;
    renderQuestion();
    showScreen('game');
}

function renderLives() {
    livesDisplay.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart' + (i >= state.lives ? ' lost' : '');
        heart.innerText = '❤️';
        livesDisplay.appendChild(heart);
    }
    const text = document.createElement('span');
    text.className = 'lives-text';
    text.innerText = 'Vidas';
    livesDisplay.appendChild(text);
}

function renderQuestion() {
    const q = questions[state.currentQuestionIndex];
    levelDisplay.innerText = `Nivel ${state.currentQuestionIndex + 1}`;
    scoreDisplay.innerText = `${state.score} puntos`;
    renderLives();

    questionText.innerText = q.text;
    
    if (q.code) {
        questionCode.innerText = q.code;
        questionCode.parentElement.style.display = 'block';
    } else {
        questionCode.parentElement.style.display = 'none';
    }

    optionsContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex, btnElement) {
    // Disable all buttons to prevent multiple clicks
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    const q = questions[state.currentQuestionIndex];
    const isCorrect = (selectedIndex === q.correctIndex);

    if (isCorrect) {
        btnElement.classList.add('correct');
        state.score += 10;
        state.correctCount++;
    } else {
        btnElement.classList.add('incorrect');
        // Highlight correct answer
        allBtns[q.correctIndex].classList.add('correct');
        state.lives--;
        state.incorrectCount++;
    }

    renderLives();
    scoreDisplay.innerText = `${state.score} puntos`;

    setTimeout(() => {
        checkGameState();
    }, 1200); // Wait a bit before moving on
}

function checkGameState() {
    if (state.lives <= 0) {
        endGame('lose');
    } else {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex >= questions.length) {
            endGame('win');
        } else {
            renderQuestion();
        }
    }
}

function endGame(result) {
    if (result === 'win') {
        // Calculate percentage for win screen
        const maxScore = questions.length * 10;
        const percentage = Math.round((state.score / maxScore) * 100);
        winScore.innerText = `${percentage}% (${state.score} pts)`;
        showScreen('win');
    } else {
        loseScore.innerText = `${state.score} puntos`;
        loseCorrect.innerText = state.correctCount;
        loseIncorrect.innerText = state.incorrectCount;
        showScreen('lose');
    }
}

// Event Listeners
btnStart.addEventListener('click', () => {
    const name = inputName.value.trim();
    if (name) {
        state.playerName = name;
        initGame();
    } else {
        inputName.focus();
        inputName.style.borderColor = 'var(--danger-color)';
        setTimeout(() => inputName.style.borderColor = 'var(--card-border)', 1000);
    }
});

inputName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnStart.click();
});

btnRestartWin.addEventListener('click', initGame);
btnRestartLose.addEventListener('click', initGame);

btnExitWin.addEventListener('click', () => {
    inputName.value = '';
    showScreen('start');
});
btnHomeLose.addEventListener('click', () => {
    inputName.value = '';
    showScreen('start');
});
