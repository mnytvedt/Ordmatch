const gameData = {
    // All words and options in Norwegian
    colors: [
        { word: 'Rød', options: ['Rød', 'Blå', 'Grønn', 'Gul'] },
        { word: 'Blå', options: ['Blå', 'Rød', 'Grønn', 'Gul'] },
        { word: 'Grønn', options: ['Grønn', 'Blå', 'Rød', 'Gul'] },
        { word: 'Gul', options: ['Gul', 'Rød', 'Blå', 'Grønn'] },
        { word: 'Oransje', options: ['Oransje', 'Lilla', 'Rosa', 'Brun'] },
        { word: 'Lilla', options: ['Lilla', 'Oransje', 'Rosa', 'Brun'] },
        { word: 'Rosa', options: ['Rosa', 'Lilla', 'Oransje', 'Brun'] },
        { word: 'Brun', options: ['Brun', 'Oransje', 'Lilla', 'Rosa'] },
        { word: 'Svart', options: ['Svart', 'Hvit', 'Grå', 'Beige'] },
        { word: 'Hvit', options: ['Hvit', 'Svart', 'Grå', 'Beige'] }
    ],
    animals: [
        { word: 'Hund', options: ['Hund', 'Katt', 'Fugl', 'Fisk'] },
        { word: 'Katt', options: ['Katt', 'Hund', 'Fugl', 'Fisk'] },
        { word: 'Fugl', options: ['Fugl', 'Hund', 'Katt', 'Fisk'] },
        { word: 'Fisk', options: ['Fisk', 'Fugl', 'Katt', 'Hund'] },
        { word: 'Elefant', options: ['Elefant', 'Sjiraff', 'Sebra', 'Løve'] },
        { word: 'Sjiraff', options: ['Sjiraff', 'Elefant', 'Sebra', 'Løve'] },
        { word: 'Sebra', options: ['Sebra', 'Elefant', 'Sjiraff', 'Løve'] },
        { word: 'Løve', options: ['Løve', 'Sebra', 'Sjiraff', 'Elefant'] },
        { word: 'Kanin', options: ['Kanin', 'Eikorn', 'Mus', 'Hamster'] },
        { word: 'Eikorn', options: ['Eikorn', 'Kanin', 'Mus', 'Hamster'] }
    ]
};

// Map Norwegian word -> correct Norwegian answer (same string)
const correctAnswers = {
    colors: {
        'Rød': 'Rød',
        'Blå': 'Blå',
        'Grønn': 'Grønn',
        'Gul': 'Gul',
        'Oransje': 'Oransje',
        'Lilla': 'Lilla',
        'Rosa': 'Rosa',
        'Brun': 'Brun',
        'Svart': 'Svart',
        'Hvit': 'Hvit'
    },
    animals: {
        'Hund': 'Hund',
        'Katt': 'Katt',
        'Fugl': 'Fugl',
        'Fisk': 'Fisk',
        'Elefant': 'Elefant',
        'Sjiraff': 'Sjiraff',
        'Sebra': 'Sebra',
        'Løve': 'Løve',
        'Kanin': 'Kanin',
        'Eikorn': 'Eikorn'
    }
};

let gameState = {
    currentCategory: null,
    currentQuestion: 0,
    correctCount: 0,
    startTime: 0,
    answered: false,
    questions: []
};

let timerInterval = null;
function startGame(category) {
    gameState = {
        currentCategory: category,
        currentQuestion: 0,
        correctCount: 0,
        startTime: Date.now(),
        answered: false,
        questions: [...gameData[category]]
        ,inProgress: true
    };

    document.getElementById('menu').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    const categoryName = category === 'colors' ? '🌈 Farger' : '🦁 Dyr';
    document.getElementById('categoryTitle').textContent = categoryName;

    startTimer();
    showQuestion();
    // Hide the in-game back button so player can't exit mid-round
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.style.display = 'none';
    // Hide the visible timer (keep tracking time for scoring)
    const timerEl = document.querySelector('.timer');
    if (timerEl) timerEl.style.display = 'none';
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        document.getElementById('timer').textContent = elapsed;
    }, 100);
}

function showQuestion() {
    if (gameState.currentQuestion >= 10) {
        endGame();
        return;
    }

    gameState.answered = false;
    const question = gameState.questions[gameState.currentQuestion];
    const progressPercent = (gameState.currentQuestion / 10) * 100;
    document.getElementById('progress').style.width = progressPercent + '%';
    document.getElementById('question').textContent = question.word;

    // Shuffle options
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    const optionsHtml = shuffled.map(option => 
        `<button class="option" onclick="selectAnswer(this, '${option}')">${option}</button>`
    ).join('');

    document.getElementById('options').innerHTML = optionsHtml;
}

function selectAnswer(button, answer) {
    if (gameState.answered) return;

    gameState.answered = true;
    const question = gameState.questions[gameState.currentQuestion];
    const isCorrect = answer === correctAnswers[gameState.currentCategory][question.word];

    const buttons = document.querySelectorAll('.option');
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        button.classList.add('correct');
        gameState.correctCount++;
    } else {
        button.classList.add('incorrect');
        const correctAnswer = correctAnswers[gameState.currentCategory][question.word];
        buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        gameState.currentQuestion++;
        showQuestion();
    }, 1500);
}

function endGame() {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const stars = getStars(elapsed, gameState.correctCount);

    document.getElementById('game').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('finalTime').textContent = elapsed;
    document.getElementById('correctAnswers').textContent = gameState.correctCount;
    document.getElementById('stars').textContent = '⭐'.repeat(stars);

    // Mark round as finished
    gameState.inProgress = false;
    if (timerInterval) clearInterval(timerInterval);
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.style.display = 'none';
}

function getStars(time, correctAnswers) {
    // 3 stars: < 60 seconds and all correct
    // 2 stars: < 90 seconds or 8+ correct
    // 1 star: everything else

    if (time <= 60 && correctAnswers === 10) {
        return 3;
    } else if (time <= 90 || correctAnswers >= 8) {
        return 2;
    } else {
        return 1;
    }
}

function backToMenu() {
    // Prevent leaving while a round is active
    if (gameState.inProgress) return;

    document.getElementById('menu').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('results').style.display = 'none';
}
