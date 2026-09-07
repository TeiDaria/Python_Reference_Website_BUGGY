// Навигация по темам
document.addEventListener('DOMContentLoaded', function() {
    // Переключение между разделами при клике на карточки
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            showTopic(topic + '-content');
        });
    });

    // Быстрая навигация - только переключение разделов
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showTopic(target);
        });
    });

    // Запуск примеров кода (готовые примеры)
    document.querySelectorAll('.code-example .run-code').forEach(button => {
        button.addEventListener('click', function() {
            const codeExample = this.closest('.code-example');
            const codeBlock = codeExample.querySelector('.code-block code');
            const output = codeExample.querySelector('.example-output');

            // Получаем ID раздела для определения какого примера код
            const sectionId = codeExample.closest('.topic-section').id;

            try {
                const result = getExpectedOutput(sectionId, codeBlock.textContent);
                output.innerHTML = `<div style="color: var(--success-color); white-space: pre-wrap;">${result}</div>`;
            } catch (error) {
                output.innerHTML = `<div style="color: var(--accent-color)">Ошибка: ${error.message}</div>`;
            }
        });
    });

    // Запуск пользовательского кода (редакторы)
    document.querySelectorAll('.interactive-example .run-code').forEach(button => {
        button.addEventListener('click', function() {
            const editor = this.closest('.interactive-example');
            const code = editor.querySelector('.live-code').value;
            const output = editor.querySelector('.live-output');

            try {
                const result = emulateSimplePythonExecution(code);
                output.innerHTML = `<div style="color: var(--success-color); white-space: pre-wrap;">${result}</div>`;
            } catch (error) {
                output.innerHTML = `<div style="color: var(--accent-color)">Ошибка: ${error.message}</div>`;
            }
        });
    });

    // Демо циклов
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const loopType = this.getAttribute('data-loop');
            runLoopDemo(loopType);
        });
    });

    // Показать первый раздел по умолчанию
    showTopic('variables-content');
});

function showTopic(topicId) {
    // Скрыть все разделы
    document.querySelectorAll('.topic-section').forEach(section => {
        section.classList.remove('active');
    });

    // Показать выбранный раздел
    const targetSection = document.getElementById(topicId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Добавить анимацию выделения
        targetSection.style.animation = 'none';
        setTimeout(() => {
            targetSection.style.animation = 'fadeInUp 0.5s ease';
        }, 10);
    }
}

// Функция для получения ожидаемого вывода для готовых примеров
function getExpectedOutput(sectionId, code) {
    const outputs = {
        'variables-content': `Имя: Alice, Возраст: 25`,

        'types-content': `<class 'int'>
<class 'str'>
Преобразовано: 123
PYTHON
6
Исходный список: ['apple', 'banana']
После добавления: ['apple', 'banana', 'orange']
Первый элемент: apple
Все элементы списка:
 - apple
 - banana
 - orange`,

        'conditions-content': `Совершеннолетний
Оценка: B
Идеальная погода для прогулки!`,

        'loops-content': `apple
banana
orange
Итерация 0
Итерация 1
Итерация 2
Итерация 3
Итерация 4
name: Alice
age: 25`
    };

    return outputs[sectionId] || 'Пример выполнен успешно!';
}

// Упрощенная эмуляция для пользовательского кода
function emulateSimplePythonExecution(code) {
    // Базовая обработка пользовательского ввода
    const lines = code.split('\n');
    let output = '';

    // Простая замена переменных в f-строках для пользовательского кода
    const userVariables = {};

    lines.forEach(line => {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }

        // Обработка присваивания
        if (trimmedLine.includes('=') && !trimmedLine.includes('==')) {
            const parts = trimmedLine.split('=');
            if (parts.length === 2) {
                const varName = parts[0].trim();
                let varValue = parts[1].trim();

                // Убираем кавычки для строк
                if ((varValue.startsWith('"') && varValue.endsWith('"')) ||
                    (varValue.startsWith("'") && varValue.endsWith("'"))) {
                    userVariables[varName] = varValue.slice(1, -1);
                } else if (!isNaN(varValue)) {
                    userVariables[varName] = Number(varValue);
                } else {
                    userVariables[varName] = varValue;
                }
            }
        }

        // Обработка print
        if (trimmedLine.startsWith('print(') && trimmedLine.endsWith(')')) {
            let content = trimmedLine.slice(6, -1);

            // Обработка f-строк
            if (content.startsWith('f"') || content.startsWith("f'")) {
                content = content.slice(2, -1);

                // Простая замена переменных в фигурных скобках
                let result = content;
                Object.keys(userVariables).forEach(varName => {
                    result = result.replace(new RegExp(`\\{${varName}\\}`, 'g'), userVariables[varName]);
                });

                output += result + '\n';
            }
            // Обычные строки
            else if ((content.startsWith('"') && content.endsWith('"')) ||
                (content.startsWith("'") && content.endsWith("'"))) {
                output += content.slice(1, -1) + '\n';
            }
            // Переменные
            else if (userVariables[content]) {
                output += userVariables[content] + '\n';
            }
            else {
                output += content + '\n';
            }
        }
    });

    return output || 'Код выполнен успешно!';
}

function runLoopDemo(loopType) {
    const output = document.querySelector('.demo-output');
    output.innerHTML = '';

    if (loopType === 'for') {
        const lines = [];

        // Перебор списка
        lines.push('<strong>Перебор списка:</strong>');
        const fruits = ["apple", "banana", "orange"];
        fruits.forEach(fruit => {
            lines.push(fruit);
        });

        // Цикл с range
        lines.push('', '<strong>Цикл с range:</strong>');
        for (let i = 0; i < 5; i++) {
            lines.push(`Итерация ${i}`);
        }

        // Перебор словаря
        lines.push('', '<strong>Перебор словаря:</strong>');
        const person = {name: "Alice", age: 25};
        Object.entries(person).forEach(([key, value]) => {
            lines.push(`${key}: ${value}`);
        });

        // Анимированный вывод
        animateOutput(output, lines, 100);

    } else if (loopType === 'while') {
        const lines = [];

        // Простой цикл while
        lines.push('<strong>Простой цикл while:</strong>');
        let count = 5;
        while (count > 0) {
            lines.push(count.toString());
            count--;
        }
        lines.push('Старт!');

        // Цикл с break (эмуляция)
        lines.push('', '<strong>Цикл с break (эмуляция ввода):</strong>');
        lines.push('Введите \'stop\' для выхода: test');
        lines.push('Вы ввели: test');
        lines.push('Введите \'stop\' для выхода: stop');

        // Анимированный вывод
        animateOutput(output, lines, 150);
    }
}

// Функция для анимированного вывода строк
function animateOutput(outputElement, lines, delay) {
    let index = 0;

    function showNextLine() {
        if (index < lines.length) {
            const line = lines[index];
            if (line === '') {
                // Пустая строка - просто добавляем <br>
                outputElement.innerHTML += '<br>';
            } else {
                outputElement.innerHTML += line + '<br>';
            }
            outputElement.scrollTop = outputElement.scrollHeight;
            index++;
            setTimeout(showNextLine, delay);
        }
    }

    showNextLine();
}

// Параллакс эффект для герой-секции
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});