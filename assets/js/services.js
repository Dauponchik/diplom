/**
 * JavaScript функції для сторінки послуг автосалону
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація форм
    initServiceForm();
    initTradeInForm();
    initContactForm();
    
    // Ініціалізація модальних вікон
    initModals();
    
    // Плавна прокрутка до секцій
    initSmoothScroll();
});

/**
 * Ініціалізація форми запису на сервіс
 */
function initServiceForm() {
    const serviceForm = document.querySelector('.service-form');
    if (!serviceForm) return;
    
    // Встановлення мінімальної дати на завтрашній день
    const serviceDateInput = document.getElementById('service-date');
    if (serviceDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        serviceDateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Обробка відправки форми
    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            // Симуляція відправки форми 
            const formData = new FormData(this);
            console.log('Service form submitted:', Object.fromEntries(formData));
            
            // Показати повідомлення про успіх
            showSuccessMessage(this, 'Ваш запит на сервісне обслуговування успішно відправлено. Ми зв\'яжемося з вами найближчим часом.');
            
            // Очистити форму
            this.reset();
        }
    });
}

/**
 * Ініціалізація форми оцінки автомобіля для Trade-in
 */
function initTradeInForm() {
    const tradeinForm = document.querySelector('.tradein-form');
    if (!tradeinForm) return;
    
    // Обробка відправки форми
    tradeinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            // Симуляція відправки форми
            const formData = new FormData(this);
            console.log('Trade-in form submitted:', Object.fromEntries(formData));
            
            // Показати повідомлення про успіх
            showSuccessMessage(this, 'Ваш запит на оцінку автомобіля успішно відправлено. Наші фахівці зв\'яжуться з вами для узгодження деталей.');
            
            // Очистити форму
            this.reset();
        }
    });
}

/**
 * Ініціалізація форми зворотного зв'язку
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    // Обробка відправки форми
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            // Симуляція відправки форми
            const formData = new FormData(this);
            console.log('Contact form submitted:', Object.fromEntries(formData));
            
            // Показати повідомлення про успіх
            showSuccessMessage(this, 'Дякуємо за ваше повідомлення. Ми зв\'яжемося з вами найближчим часом.');
            
            // Очистити форму
            this.reset();
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
    
    // Видалення попередніх повідомлень про помилки
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    // Перевірка обов'язкових полів
    form.querySelectorAll('[required]').forEach(field => {
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            showError(field.parentNode, 'Необхідно погодитись з умовами');
        } else if (field.type !== 'checkbox' && !field.value.trim()) {
            isValid = false;
            showError(field, 'Це поле обов\'язкове для заповнення');
        }
    });
    
    // Перевірка телефону
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value.trim()) {
            const phonePattern = /^\+?[0-9\s\-()]{10,18}$/;
            if (!phonePattern.test(field.value.trim())) {
                isValid = false;
                showError(field, 'Введіть коректний номер телефону');
            }
        }
    });
    
    // Перевірка email
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value.trim())) {
                isValid = false;
                showError(field, 'Введіть коректну email адресу');
            }
        }
    });
    
    return isValid;
}

/**
 * Показати повідомлення про помилку
 * @param {HTMLElement} field - Поле з помилкою
 * @param {string} message - Текст повідомлення
 */
function showError(field, message) {
    // Додати клас помилки
    field.classList.add('error');
    
    // Створити елемент повідомлення
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Додати повідомлення після поля
    field.parentNode.appendChild(errorDiv);
}

/**
 * Показати повідомлення про успішну відправку
 * @param {HTMLElement} form - Форма
 * @param {string} message - Текст повідомлення
 */
function showSuccessMessage(form, message) {
    // Створити елемент повідомлення
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Приховати форму
    form.style.display = 'none';
    
    // Додати повідомлення замість форми
    form.parentNode.appendChild(successDiv);
    
    // Показати форму через 5 секунд
    setTimeout(() => {
        successDiv.remove();
        form.style.display = '';
    }, 5000);
}

/**
 * Ініціалізація модальних вікон
 */
function initModals() {
    // Знайти всі елементи, які відкривають модальні вікна
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modalId = this.getAttribute('data-modal');
            
            // У реальному проекті тут був би код для відкриття модального вікна
            // Для демонстрації просто виводимо повідомлення
            console.log(`Відкриття модального вікна: ${modalId}`);
            alert(`В майбутній реалізації тут відкриється модальне вікно: ${modalId}`);
        });
    });
}

/**
 * Ініціалізація плавної прокрутки до секцій
 */
function initSmoothScroll() {
    // Знайти всі якірні посилання
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропустити посилання, які не є якорями
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Плавна прокрутка до цільового елемента
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
} 