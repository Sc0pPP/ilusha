class YesNoRandomizer {
    constructor() {
        // DOM элементы
        this.questionInput = document.getElementById('question-input');
        this.mainButton = document.getElementById('main_button');
        this.loadingContainer = document.getElementById('loading-container');
        this.resultContainer = document.getElementById('result-container');
        this.resultPhoto = document.getElementById('result-photo');
        this.resultAnswer = document.getElementById('result-answer');
        this.tryAgainBtn = document.getElementById('try-again-btn');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.errorCloseBtn = document.getElementById('error-close-btn');
        
        // Состояние приложения
        this.isLoading = false;
        this.currentTimeout = null;
        
        // Путь к изображению результата
        this.resultImagePath = 'photo.jpg';
        
        // Инициализация
        this.init();
        this.setupTelegramIntegration();
    }
    
    init() {
        console.log('Инициализация YesNoRandomizer...');
        
        // Обработчики событий
        this.mainButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        this.tryAgainBtn.addEventListener('click', () => {
            this.resetForm();
        });
        
        this.errorCloseBtn.addEventListener('click', () => {
            this.hideError();
        });
        
        // Enter в поле ввода
        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
        
        // Валидация ввода в реальном времени
        this.questionInput.addEventListener('input', () => {
            this.validateInput();
        });
        
        // Предзагрузка изображения
        this.preloadResultImage();
        
        console.log('Инициализация завершена');
    }
    
    preloadResultImage() {
        // Предзагружаем изображение для быстрого отображения
        const img = new Image();
        img.onload = () => {
            console.log('Изображение результата предзагружено успешно');
        };
        img.onerror = () => {
            console.warn('Не удалось предзагрузить изображение результата');
        };
        img.src = this.resultImagePath;
    }
    
    async handleSubmit() {
        console.log('Обработка отправки формы...');
        
        const question = this.questionInput.value.trim();
        
        // Валидация
        if (!question) {
            this.showError('Пожалуйста, введите ваш вопрос');
            return;
        }
        
        if (question.length < 3) {
            this.showError('Вопрос должен содержать минимум 3 символа');
            return;
        }
        
        if (this.isLoading) {
            console.log('Уже идет загрузка, игнорируем запрос');
            return;
        }
        
        try {
            this.isLoading = true;
            this.setButtonState(true);
            this.showLoading();
            
            console.log('Начинаем имитацию загрузки...');
            
            // Имитация обработки на сервере (5-7 секунд)
            const loadingTime = Math.random() * 2000 + 5000; // 5000-7000ms
            console.log(`Время загрузки: ${Math.round(loadingTime)}ms`);
            
            await this.delay(loadingTime);
            
            // Генерируем ответ
            const answer = this.generateAnswer();
            console.log(`Сгенерированный ответ: ${answer}`);
            
            // Показываем результат
            this.showResult(answer);
            
        } catch (error) {
            console.error('Ошибка при обработке:', error);
            this.showError('Произошла ошибка. Попробуйте еще раз.');
        } finally {
            this.isLoading = false;
            this.setButtonState(false);
        }
    }
    
    showLoading() {
        console.log('Показываем индикатор загрузки');
        this.hideAllContainers();
        this.loadingContainer.style.display = 'block';
        
        // Принудительный reflow для запуска анимации
        this.loadingContainer.offsetHeight;
    }
    
    showResult(answer) {
        console.log(`Показываем результат: ${answer}`);
        this.hideAllContainers();
        
        // Настройка изображения
        this.setupResultImage(answer);
        
        // Устанавливаем текст ответа
        this.resultAnswer.textContent = answer.toUpperCase();
        
        // Показываем контейнер результата
        this.resultContainer.style.display = 'block';
        
        // Принудительный reflow для анимации
        this.resultContainer.offsetHeight;
    }
    
    setupResultImage(answer) {
        // Сбрасываем предыдущие обработчики
        this.resultPhoto.onload = null;
        this.resultPhoto.onerror = null;
        
        // Устанавливаем путь к изображению
        this.resultPhoto.src = this.resultImagePath;
        this.resultPhoto.alt = `Результат: ${answer}`;
        
        // Обработчик успешной загрузки
        this.resultPhoto.onload = () => {
            console.log('Изображение результата загружено успешно');
            this.resultPhoto.style.display = 'block';
            this.removeImagePlaceholder();
        };
        
        // Обработчик ошибки загрузки
        this.resultPhoto.onerror = () => {
            console.warn('Не удалось загрузить изображение результата');
            this.showImagePlaceholder();
        };
        
        // Показываем изображение (если оно уже в кеше)
        if (this.resultPhoto.complete && this.resultPhoto.naturalWidth > 0) {
            this.resultPhoto.style.display = 'block';
            this.removeImagePlaceholder();
        }
    }
    
    showImagePlaceholder() {
        // Скрываем изображение
        this.resultPhoto.style.display = 'none';
        
        // Создаем или показываем плейсхолдер
        let placeholder = this.resultPhoto.parentElement.querySelector('.image-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = 'Изображение недоступно';
            this.resultPhoto.parentElement.appendChild(placeholder);
        }
        placeholder.style.display = 'flex';
    }
    
    removeImagePlaceholder() {
        const placeholder = this.resultPhoto.parentElement.querySelector('.image-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }
    
    showError(message) {
        console.log(`Показываем ошибку: ${message}`);
        this.errorMessage.textContent = message;
        this.errorContainer.style.display = 'block';
        
        // Автоматически скрыть через 5 секунд
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        this.errorContainer.style.display = 'none';
    }
    
    hideAllContainers() {
        this.loadingContainer.style.display = 'none';
        this.resultContainer.style.display = 'none';
        this.hideError();
    }
    
    resetForm() {
        console.log('Сброс формы');
        this.hideAllContainers();
        this.questionInput.value = '';
        this.questionInput.focus();
        this.setButtonState(false);
        
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        
        this.isLoading = false;
    }
    
    setButtonState(disabled) {
        this.mainButton.disabled = disabled;
        this.mainButton.textContent = disabled ? 'Думаю...' : 'Получить ответ';
    }
    
    validateInput() {
        const question = this.questionInput.value.trim();
        const isValid = question.length >= 3;
        
        // Интеграция с Telegram
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            if (isValid && !this.isLoading) {
                tg.MainButton.show();
            } else {
                tg.MainButton.hide();
            }
        }
    }
    
    generateAnswer() {
        // Более сложная логика генерации для лучшей случайности
        const random = Math.random();
        const answers = ['да', 'нет'];
        
        // Добавляем небольшую задержку для реалистичности
        return answers[Math.floor(random * answers.length)];
    }
    
    delay(ms) {
        return new Promise((resolve) => {
            this.currentTimeout = setTimeout(resolve, ms);
        });
    }
    
    setupTelegramIntegration() {
        if (!window.Telegram?.WebApp) {
            console.log('Telegram Web App API недоступен');
            return;
        }
        
        const tg = window.Telegram.WebApp;
        console.log('Настройка интеграции с Telegram...');
        
        // Настройка главной кнопки
        tg.MainButton.setText('Получить ответ');
        tg.MainButton.onClick(() => {
            if (!this.isLoading) {
                this.handleSubmit();
            }
        });
        
        // Изначально скрыть кнопку
        tg.MainButton.hide();
        
        console.log('Интеграция с Telegram настроена');
    }
}

// Функция для отладки
function debugApp() {
    console.log('=== DEBUG INFO ===');
    console.log('DOM загружен:', document.readyState);
    console.log('Telegram WebApp:', !!window.Telegram?.WebApp);
    console.log('Элементы найдены:', {
        questionInput: !!document.getElementById('question-input'),
        mainButton: !!document.getElementById('main_button'),
        loadingContainer: !!document.getElementById('loading-container'),
        resultContainer: !!document.getElementById('result-container'),
        resultPhoto: !!document.getElementById('result-photo')
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализируем приложение...');
    debugApp();
    
    try {
        window.randomizer = new YesNoRandomizer();
        console.log('Приложение успешно инициализировано');
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
});

// Экспорт для отладки
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YesNoRandomizer;
}