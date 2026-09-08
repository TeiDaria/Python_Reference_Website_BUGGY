// Конфигурация теста
const quizConfig = {
    questions: [
        {
            id: 1,
            correctAnswer: 'b'
        },
        {
            id: 2,
            correctAnswer: 'b'
        },
        {
            id: 3,
            correctAnswer: 'b'
        },
        {
            id: 4,
            correctAnswer: 'c' //ответ a правильный, ошибка 1
        },
        {
            id: 5,
            correctAnswer: 'a'
        }
    ],
    messages: {
        excellent: "Отличный результат! Вы прекрасно знаете основы Python!",
        good: "Хороший результат! Есть небольшие пробелы, но вы на правильном пути!",
        average: "Неплохо! Рекомендуем повторить основы Python.",
        poor: "Есть над чем поработать! Не расстраивайтесь, продолжайте учиться!"
    }
};

// Элементы DOM
const quizForm = document.getElementById('quizForm');
const questionCards = document.querySelectorAll('.question-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const retryBtn = document.getElementById('retryBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsContainer = document.getElementById('resultsContainer');
const scoreValue = document.getElementById('scoreValue');
const scoreMessage = document.getElementById('scoreMessage');

// Переменные состояния
let currentQuestion = 1;
const totalQuestions = quizConfig.questions.length;
const userAnswers = {};

// Инициализация теста
function initQuiz() {
    updateProgress();
    updateNavigation();
    attachEventListeners();
}

// Обновление прогресс-бара
function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Вопрос ${currentQuestion} из ${totalQuestions}`;
}

// Обновление навигации
function updateNavigation() {
    prevBtn.disabled = currentQuestion === 1;
    nextBtn.disabled = currentQuestion === totalQuestions;

    // Показываем/скрываем кнопку отправки
    submitBtn.style.display = currentQuestion === totalQuestions ? 'flex' : 'none';
    nextBtn.style.display = currentQuestion === totalQuestions ? 'none' : 'flex';
}

// Показать вопрос
function showQuestion(questionNumber) {
    questionCards.forEach(card => {
        card.classList.remove('active');
        if (parseInt(card.dataset.question) === questionNumber) {
            card.classList.add('active');
        }
    });
    currentQuestion = questionNumber;
    updateProgress();
    updateNavigation();
}

// Сохранить ответ и добавить визуальное выделение
function saveAnswer(questionId, answer) {
    userAnswers[questionId] = answer;

    // Убираем выделение со всех вариантов этого вопроса
    const questionCard = document.querySelector(`[data-question="${questionId}"]`);
    const options = questionCard.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected');
    });

    // Добавляем выделение к выбранному варианту
    const selectedOption = questionCard.querySelector(`input[name="q${questionId}"][value="${answer}"]`).closest('.option');
    selectedOption.classList.add('selected');
}

// Проверка ответов
function checkAnswers() {
    let correctCount = 0;

    quizConfig.questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        const correctAnswer = question.correctAnswer;
        const questionCard = document.querySelector(`[data-question="${question.id}"]`);

        if (userAnswer === correctAnswer) {
            correctCount++;
        }

        // Подсветка правильных/неправильных ответов
        if (questionCard) {
            const options = questionCard.querySelectorAll('.option');
            options.forEach(option => {
                const input = option.querySelector('input');
                if (input.value === correctAnswer) {
                    option.classList.add('correct');
                } else if (input.value === userAnswer && userAnswer !== correctAnswer) {
                    option.classList.add('incorrect');
                }
            });
        }
    });

    return correctCount;
}

// Показать результаты
function showResults(score) {
    document.querySelector('.quiz-content').style.display = 'none';
    resultsContainer.style.display = 'block';

    scoreValue.textContent = score;

    // Выбор сообщения в зависимости от результата
    let message;
    if (score === 5) {
        message = quizConfig.messages.excellent;
    } else if (score >= 4) {
        message = quizConfig.messages.good;
    } else if (score >= 3) {
        message = quizConfig.messages.average;
    } else {
        message = quizConfig.messages.poor;
    }

    scoreMessage.textContent = message;
}

// Перезапуск теста
function restartQuiz() {
    // Сброс состояния
    currentQuestion = 1;
    Object.keys(userAnswers).forEach(key => delete userAnswers[key]);

    // Сброс формы
    quizForm.reset();

    // Удаление классов подсветки и выделения
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });

    // Показать первый вопрос
    showQuestion(1);
    document.querySelector('.quiz-content').style.display = 'block';
    resultsContainer.style.display = 'none';
}

// Назначение обработчиков событий
function attachEventListeners() {
    // Кнопка "Назад"
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 1) {
            showQuestion(currentQuestion - 1);
        }
    });

    // Кнопка "Далее"
    nextBtn.addEventListener('click', () => {
        if (currentQuestion < totalQuestions) {
            showQuestion(currentQuestion + 1);
        }
    });

    // Кнопка "Проверить результаты"
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Проверяем, ответил ли пользователь на все вопросы
        const answeredQuestions = Object.keys(userAnswers).length;
        if (answeredQuestions < totalQuestions) {
            alert(`Пожалуйста, ответьте на все вопросы! Осталось ответить на ${totalQuestions - answeredQuestions} вопрос(ов).`);
            return;
        }

        const score = checkAnswers();
        showResults(score);
    });

    // Кнопка "Пройти ещё раз"
    retryBtn.addEventListener('click', restartQuiz);

    // Обработка выбора ответов
    quizForm.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const questionId = parseInt(e.target.name.replace('q', ''));
            const answer = e.target.value;
            saveAnswer(questionId, answer);
        }
    });

    // Восстановление выбранных ответов при переключении между вопросами
    const observer = new MutationObserver(() => {
        // Восстанавливаем выделение для текущего вопроса
        if (userAnswers[currentQuestion]) {
            const selectedOption = document.querySelector(`input[name="q${currentQuestion}"][value="${userAnswers[currentQuestion]}"]`);
            if (selectedOption) {
                selectedOption.closest('.option').classList.add('selected');
            }
        }
    });

    observer.observe(document.querySelector('.quiz-content'), {
        childList: true,
        subtree: true
    });

    // Анимация при загрузке
    window.addEventListener('load', () => {
        document.querySelector('.quiz-container').style.opacity = '0';
        document.querySelector('.quiz-container').style.transform = 'translateY(30px)';

        setTimeout(() => {
            document.querySelector('.quiz-container').style.transition = 'all 0.6s ease';
            document.querySelector('.quiz-container').style.opacity = '1';
            document.querySelector('.quiz-container').style.transform = 'translateY(0)';
        }, 300);
    });
}

// Запуск теста при загрузке страницы
document.addEventListener('DOMContentLoaded', initQuiz);