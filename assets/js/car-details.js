/**
 * JavaScript функції для сторінки детальної інформації про автомобіль
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація галереї зображень
    initGallery();
    
    // Ініціалізація табів
    initTabs();
    
    // Ініціалізація порівняння та обраного
    initCompareFeature();
    initFavoriteFeature();
    
    // Ініціалізація форми зворотного зв'язку
    initContactForm();
    
    // Завантаження інформації про автомобіль
    loadCarDetails();
});

/**
 * Ініціалізація галереї зображень
 */
function initGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('.thumb');
    
    if (!mainImage || !thumbs.length) return;
    
    // Обробник кліку на мініатюру
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Оновити велике зображення
            const imgSrc = this.getAttribute('data-src');
            mainImage.src = imgSrc;
            
            // Змінити активну мініатюру
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Ініціалізація табів
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Деактивувати всі кнопки та панелі
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Активувати поточну кнопку та панель
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Ініціалізація форми зворотного зв'язку
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    // Обробка події відправки форми
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Валідація форми
        if (validateForm(contactForm)) {
            // Відправка форми (можна замінити на AJAX)
            contactForm.submit();
        }
    });
}

/**
 * Валідація форми
 * @param {HTMLFormElement} form - Форма для валідації
 * @returns {boolean} - Результат валідації
 */
function validateForm(form) {
    let isValid = true;
    
    // Перевірка обов'язкових полів
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        // Очищення попередніх помилок
        field.classList.remove('error');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
        
        // Перевірка заповнення
        if (!field.value.trim()) {
            isValid = false;
            showError(field, 'Це поле обов\'язкове для заповнення');
        }
    });
    
    // Валідація email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            isValid = false;
            showError(emailField, 'Введіть коректну email адресу');
        }
    }
    
    // Валідація телефону
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
        const phonePattern = /^\+?[0-9\s\-()]{10,18}$/;
        if (!phonePattern.test(phoneField.value.trim())) {
            isValid = false;
            showError(phoneField, 'Введіть коректний номер телефону');
        }
    }
    
    return isValid;
}

/**
 * Показати повідомлення про помилку
 * @param {HTMLElement} field - Поле з помилкою
 * @param {string} message - Повідомлення про помилку
 */
function showError(field, message) {
    field.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    field.parentNode.appendChild(errorMessage);
}

/**
 * Завантаження інформації про автомобіль
 */
function loadCarDetails() {
    // Отримання ID автомобіля з URL
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) return;
    
    // Можна реалізувати завантаження даних з сервера за допомогою AJAX
    // В демонстраційних цілях використовуємо моковані дані
    
    // Приклад AJAX-запиту
    /*
    fetch(`/api/cars/${carId}`)
        .then(response => response.json())
        .then(data => {
            updateCarDetails(data);
        })
        .catch(error => {
            console.error('Error fetching car details:', error);
        });
    */
}

/**
 * Оновлення інформації про автомобіль на сторінці
 * @param {Object} carData - Дані про автомобіль
 */
function updateCarDetails(carData) {
    // Оновлення заголовка
    document.querySelector('.page-title').textContent = `${carData.brand} ${carData.model} ${carData.year}`;
    document.title = `${carData.brand} ${carData.model} | Nissan`;
    
    // Оновлення зображень
    // ...
    
    // Оновлення характеристик
    // ...
    
    // Оновлення комплектації
    // ...
    
    // Оновлення опису
    // ...
}

/**
 * Функція для додавання в порівняння
 */
function addToCompare() {
    const compareBtn = document.querySelector('.btn-compare');
    if (!compareBtn) return;
    
    compareBtn.addEventListener('click', function() {
        // Отримати дані про автомобіль
        const carId = getCarIdFromUrl();
        const carTitle = document.querySelector('.page-title').textContent.trim();
        
        // Додати в порівняння
        toggleCompare(carId, carTitle);
        
        // Змінити стан кнопки
        this.classList.toggle('active');
        
        // Оновити текст кнопки
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            this.innerHTML = `${icon.outerHTML} Видалити з порівняння`;
        } else {
            this.innerHTML = `${icon.outerHTML} Порівняти`;
        }
    });
}

/**
 * Функція для додавання в обране
 */
function addToFavorite() {
    const favoriteBtn = document.querySelector('.btn-favorite');
    if (!favoriteBtn) return;
    
    favoriteBtn.addEventListener('click', function() {
        // Отримати дані про автомобіль
        const carId = getCarIdFromUrl();
        const carTitle = document.querySelector('.page-title').textContent.trim();
        
        // Додати в обране
        toggleFavorite(carId, carTitle);
        
        // Змінити стан кнопки
        this.classList.toggle('active');
        
        // Оновити іконку кнопки
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.innerHTML = `${icon.outerHTML} В обраному`;
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.innerHTML = `${icon.outerHTML} В обране`;
        }
    });
}

/**
 * Отримати ID автомобіля з URL
 * @returns {string} - ID автомобіля
 */
function getCarIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

/**
 * Функція для поділитися посиланням
 */
function shareLink() {
    const shareBtn = document.querySelector('.btn-share');
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', function() {
        // Отримати URL сторінки
        const url = window.location.href;
        
        // Реалізація через Web Share API, якщо доступно
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: url
            }).catch(error => {
                console.error('Error sharing:', error);
            });
        } else {
            // Запасний варіант - копіювання в буфер обміну
            navigator.clipboard.writeText(url).then(() => {
                alert('Посилання скопійовано в буфер обміну');
            }).catch(err => {
                console.error('Error copying to clipboard:', err);
            });
        }
    });
}

// Додаткова ініціалізація функцій
document.addEventListener('DOMContentLoaded', function() {
    addToCompare();
    addToFavorite();
    shareLink();
}); 