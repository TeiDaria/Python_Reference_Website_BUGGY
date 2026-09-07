// Элементы DOM
const feedbackForm = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const btnLoader = document.getElementById('btnLoader');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Регулярные выражения для валидации
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,50}$/;

// Инициализация
function initFeedback() {
    attachEventListeners();
    initInputAnimations();
}

// Назначение обработчиков событий
function attachEventListeners() {
    // Отправка формы
    feedbackForm.addEventListener('submit', handleFormSubmit);

    // Валидация в реальном времени
    feedbackForm.addEventListener('input', handleRealTimeValidation);

    // Закрытие модального окна
    modalCloseBtn.addEventListener('click', closeSuccessModal);
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('show')) {
            closeSuccessModal();
        }
    });
}

// Анимации для полей ввода
function initInputAnimations() {
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // Анимация при фокусе
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Динамическая валидация
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });
}

// Валидация в реальном времени
function handleRealTimeValidation(e) {
    const target = e.target;
    const errorElement = document.getElementById(`${target.name}Error`);

    if (target.name === 'name') {
        validateName(target, errorElement);
    } else if (target.name === 'email') {
        validateEmail(target, errorElement);
    } else if (target.name === 'message') {
        validateMessage(target, errorElement);
    }
}

// Валидация имени
function validateName(input, errorElement) {
    const value = input.value.trim();

    if (!value) {
        showError(errorElement, 'Поле обязательно для заполнения');
        return false;
    }

    if (!nameRegex.test(value)) {
        showError(errorElement, 'Имя должно содержать от 2 до 50 символов');
        return false;
    }

    hideError(errorElement);
    return true;
}

// Валидация email
function validateEmail(input, errorElement) {
    const value = input.value.trim();

    if (!value) {
        showError(errorElement, 'Поле обязательно для заполнения');
        return false;
    }

    if (!emailRegex.test(value)) {
        showError(errorElement, 'Введите корректный email адрес');
        return false;
    }

    hideError(errorElement);
    return true;
}

// Валидация сообщения
function validateMessage(input, errorElement) {
    const value = input.value.trim();

    if (!value) {
        showError(errorElement, 'Поле обязательно для заполнения');
        return false;
    }

    if (value.length < 10) {
        showError(errorElement, 'Сообщение должно содержать минимум 10 символов');
        return false;
    }

    if (value.length > 1000) {
        showError(errorElement, 'Сообщение не должно превышать 1000 символов');
        return false;
    }

    hideError(errorElement);
    return true;
}

// Показать ошибку
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Скрыть ошибку
function hideError(errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Обработка отправки формы
function handleFormSubmit(e) {
    e.preventDefault();

    // Получаем значения полей
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Валидация всех полей
    const isNameValid = validateName(document.getElementById('name'), document.getElementById('nameError'));
    const isEmailValid = validateEmail(document.getElementById('email'), document.getElementById('emailError'));
    const isMessageValid = validateMessage(document.getElementById('message'), document.getElementById('messageError'));

    if (!isNameValid || !isEmailValid || !isMessageValid) {
        // Анимация тряски для некорректных полей
        shakeInvalidFields();
        return;
    }

    // Симуляция отправки
    simulateFormSubmission(formData);
}

// Анимация тряски для некорректных полей
function shakeInvalidFields() {
    const errorFields = document.querySelectorAll('.error-message.show');

    errorFields.forEach(error => {
        const input = error.previousElementSibling.querySelector('input, textarea');
        input.style.animation = 'shake 0.5s ease-in-out';

        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    });
}

// CSS для анимации тряски
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyles);

// Симуляция отправки формы
function simulateFormSubmission(formData) {
    // Показываем индикатор загрузки
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Симуляция задержки сети
    setTimeout(() => {
        console.log('Форма отправлена:', formData);

        // Скрываем индикатор загрузки
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Показываем модальное окно успеха
        showSuccessModal();

        // Очищаем форму
        feedbackForm.reset();

        // Сбрасываем состояния полей
        document.querySelectorAll('.input-container, .textarea-container').forEach(container => {
            container.classList.remove('focused', 'has-value');
        });

    }, 2000);
}

// Показать модальное окно успеха
function showSuccessModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Закрыть модальное окно успеха
function closeSuccessModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initFeedback);