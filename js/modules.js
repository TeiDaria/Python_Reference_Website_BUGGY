// Данные библиотек
const librariesData = {
    'numpy': {
        name: 'NumPy',
        description: 'Фундаментальная библиотека для научных вычислений в Python. Предоставляет поддержку многомерных массивов и матриц, а также большую коллекцию математических функций для работы с этими массивами.',
        usage: 'import numpy as np',
        features: ['Многомерные массивы', 'Математические функции', 'Линейная алгебра', 'Фурье-преобразования', 'Интеграция с C/C++'],
        category: 'Научные вычисления',
        icon: 'fa-calculator'
    },
    'pandas': {
        name: 'Pandas',
        description: 'Мощный инструмент для анализа и обработки данных. Предоставляет структуры данных DataFrame и Series для удобной работы с табличными данными.',
        usage: 'import pandas as pd',
        features: ['DataFrame и Series', 'Чтение/запись файлов', 'Агрегация данных', 'Временные ряды', 'Обработка пропущенных значений'],
        category: 'Анализ данных',
        icon: 'fa-table'
    },
    'matplotlib': {
        name: 'Matplotlib',
        description: 'Комплексная библиотека для создания статических, анимированных и интерактивных визуализаций в Python.',
        usage: 'import matplotlib.pyplot as plt',
        features: ['Линейные графики', 'Гистограммы', '3D-визуализация', 'Кастомизация стилей', 'Интерактивные графики'],
        category: 'Визуализация',
        icon: 'fa-chart-bar'
    },
    'requests': {
        name: 'Requests',
        description: 'Элегантная и простая библиотека для отправки HTTP-запросов. Создана для людей, чтобы сделать работу с HTTP максимально простой.',
        usage: 'import requests',
        features: ['GET/POST запросы', 'Сессии и куки', 'SSL верификация', 'Автоматическое кодирование', 'Поддержка прокси'],
        category: 'HTTP-запросы',
        icon: 'fa-globe'
    },
    'scikit': {
        name: 'Scikit-learn',
        description: 'Библиотека для машинного обучения с простыми и эффективными инструментами для анализа данных и построения моделей.',
        usage: 'from sklearn import datasets',
        features: ['Классификация', 'Регрессия', 'Кластеризация', 'Предобработка данных', 'Выбор моделей'],
        category: 'Машинное обучение',
        icon: 'fa-brain'
    },
    'django': {
        name: 'Django',
        description: 'Высокоуровневый веб-фреймворк для быстрой разработки и чистого дизайна. Следует принципу "батарейки в комплекте".',
        usage: 'import django',
        features: ['ORM', 'Админ-панель', 'Система шаблонов', 'Встроенная безопасность', 'Маршрутизация URL'],
        category: 'Веб-фреймворк',
        icon: 'fa-code'
    }
};

// Анимация появления при скролле
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками библиотек и практик
    document.querySelectorAll('.library-card, .practice-card, .intro-card').forEach(card => {
        observer.observe(card);
    });
}

// Случайная библиотека
function initRandomLibrary() {
    const button = document.getElementById('random-library-btn');
    const infoContainer = document.getElementById('random-library-info');

    button.addEventListener('click', () => {
        const libraryKeys = Object.keys(librariesData);
        const randomKey = libraryKeys[Math.floor(Math.random() * libraryKeys.length)];
        const library = librariesData[randomKey];

        const html = `
            <div class="random-library-card">
                <div class="random-header">
                    <i class="fas ${library.icon}"></i>
                    <h3>${library.name}</h3>
                    <span class="library-badge">${library.category}</span>
                </div>
                <p>${library.description}</p>
                <div class="random-features">
                    <h4>Основные возможности:</h4>
                    <ul>
                        ${library.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="random-usage">
                    <code>${library.usage}</code>
                </div>
            </div>
        `;

        infoContainer.innerHTML = html;

        // Анимация появления
        infoContainer.style.opacity = '0';
        infoContainer.style.transform = 'translateY(20px)';
        infoContainer.style.display = 'block';

        setTimeout(() => {
            infoContainer.style.opacity = '1';
            infoContainer.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Поиск библиотек
function initLibrarySearch() {
    const searchInput = document.getElementById('library-search');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            resultsContainer.innerHTML = '';
            return;
        }

        const filteredLibraries = Object.entries(librariesData).filter(([key, library]) => {
            return library.name.toLowerCase().includes(query) ||
                library.description.toLowerCase().includes(query) ||
                library.category.toLowerCase().includes(query) ||
                library.features.some(feature => feature.toLowerCase().includes(query));
        });

        displaySearchResults(filteredLibraries);
    });

    function displaySearchResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">Библиотеки не найдены</div>';
            return;
        }

        const html = results.map(([key, library]) => `
            <div class="search-result-item" data-library="${key}">
                <div class="result-header">
                    <i class="fas ${library.icon}"></i>
                    <h4>${library.name}</h4>
                    <span class="result-category">${library.category}</span>
                </div>
                <p>${library.description.substring(0, 100)}...</p>
                <code>${library.usage}</code>
            </div>
        `).join('');

        resultsContainer.innerHTML = html;

        // Добавляем обработчики клика
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const libraryKey = item.dataset.library;
                const library = librariesData[libraryKey];

                // Прокручиваем к соответствующей карточке
                const targetCard = document.querySelector(`[data-library="${libraryKey}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Добавляем подсветку
                    targetCard.style.boxShadow = '0 0 0 3px var(--primary-color)';
                    setTimeout(() => {
                        targetCard.style.boxShadow = '';
                    }, 2000);
                }

                // Очищаем поиск
                searchInput.value = '';
                resultsContainer.innerHTML = '';
            });
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimation();
    initRandomLibrary();
    initLibrarySearch();

    // Добавляем задержку для первоначальной анимации
    setTimeout(() => {
        document.querySelectorAll('.library-card, .practice-card, .intro-card').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
});
