/**
 * JavaScript функції для сторінки логіну та реєстрації
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація табів
    initAuthTabs();
    
    // Ініціалізація перемикачів паролю
    initPasswordToggles();
    
    // Ініціалізація перевірки надійності паролю
    initPasswordStrength();
    
    // Ініціалізація валідації форм
    initFormValidation();
});

/**
 * Ініціалізація табів авторизації/реєстрації
 */
function initAuthTabs() {
    const tabBtns = document.querySelectorAll('.auth-tabs .tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Отримуємо ID вкладки
            const tabId = this.getAttribute('data-tab');
            
            // Знімаємо активний стан з усіх кнопок і вкладок
            tabBtns.forEach(btn => btn.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Робимо активними поточну кнопку і вкладку
            this.classList.add('active');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
}

/**
 * Ініціалізація перемикачів паролю (показати/приховати)
 */
function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Знаходимо поле пароля (попередній елемент перед кнопкою)
            const passwordField = this.previousElementSibling;
            
            // Змінюємо тип поля для показу/приховування пароля
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                this.innerHTML = '<i class="far fa-eye-slash"></i>';
            } else {
                passwordField.type = 'password';
                this.innerHTML = '<i class="far fa-eye"></i>';
            }
        });
    });
}

/**
 * Ініціалізація перевірки надійності паролю
 */
function initPasswordStrength() {
    const passwordField = document.getElementById('register-password');
    
    if (!passwordField) return;
    
    passwordField.addEventListener('input', function() {
        const password = this.value;
        const strengthMeter = document.querySelector('.strength-meter-fill');
        const strengthText = document.querySelector('.strength-text span');
        
        // Перевіряємо надійність паролю
        const strength = checkPasswordStrength(password);
        
        // Оновлюємо індикатор надійності
        strengthMeter.setAttribute('data-strength', strength.level);
        strengthText.textContent = strength.text;
    });
}

/**
 * Перевірка надійності паролю
 * @param {string} password - Пароль для перевірки
 * @returns {object} - Об'єкт з рівнем надійності (0-3) та текстовим описом
 */
function checkPasswordStrength(password) {
    // За замовчуванням пароль вважається слабким
    let level = 0;
    let text = 'Слабкий';
    
    // Якщо пароль порожній, повертаємо мінімальний рівень
    if (password.length === 0) {
        return { level, text };
    }
    
    // Перевіряємо довжину
    if (password.length >= 8) {
        level += 1;
    }
    
    // Перевіряємо наявність різних символів
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Підвищуємо рівень в залежності від складності
    if ((hasLowercase && hasUppercase) || (hasLowercase && hasNumbers) || (hasUppercase && hasNumbers)) {
        level += 1;
    }
    
    if (hasSpecialChars && password.length >= 10) {
        level += 1;
    }
    
    // Визначаємо текстовий опис рівня
    switch (level) {
        case 1:
            text = 'Середній';
            break;
        case 2:
            text = 'Хороший';
            break;
        case 3:
            text = 'Надійний';
            break;
    }
    
    return { level, text };
}

/**
 * Ініціалізація валідації форм
 */
function initFormValidation() {
    // Форма логіну
    const loginForm = document.querySelector('#login-form form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Очищаємо попередні помилки
            clearErrors(loginForm);
            
            // Валідація email
            const emailInput = document.getElementById('login-email');
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Будь ласка, введіть коректний email');
                isValid = false;
            }
            
            // Валідація паролю
            const passwordInput = document.getElementById('login-password');
            if (passwordInput.value.trim() === '') {
                showError(passwordInput, 'Будь ласка, введіть пароль');
                isValid = false;
            }
            
            // Якщо форма не валідна, запобігаємо відправці
            if (!isValid) {
                event.preventDefault();
            } else {
                // В навчальних цілях, щоб не відправляти форму на сервер
                event.preventDefault();
                
                // Імітуємо відправку форми і перенаправлення
                simulateFormSubmission(loginForm, 'Виконується вхід...');
            }
        });
    }
    
    // Форма реєстрації
    const registerForm = document.querySelector('#register-form form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Очищаємо попередні помилки
            clearErrors(registerForm);
            
            // Валідація імені
            const nameInput = document.getElementById('register-name');
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Будь ласка, введіть ваше ім\'я');
                isValid = false;
            }
            
            // Валідація прізвища
            const surnameInput = document.getElementById('register-surname');
            if (surnameInput.value.trim() === '') {
                showError(surnameInput, 'Будь ласка, введіть ваше прізвище');
                isValid = false;
            }
            
            // Валідація email
            const emailInput = document.getElementById('register-email');
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Будь ласка, введіть коректний email');
                isValid = false;
            }
            
            // Валідація телефону
            const phoneInput = document.getElementById('register-phone');
            if (!validatePhone(phoneInput.value)) {
                showError(phoneInput, 'Будь ласка, введіть коректний номер телефону');
                isValid = false;
            }
            
            // Валідація паролю
            const passwordInput = document.getElementById('register-password');
            if (passwordInput.value.trim() === '') {
                showError(passwordInput, 'Будь ласка, введіть пароль');
                isValid = false;
            } else if (passwordInput.value.length < 8) {
                showError(passwordInput, 'Пароль має бути не менше 8 символів');
                isValid = false;
            }
            
            // Валідація підтвердження паролю
            const passwordConfirmInput = document.getElementById('register-password-confirm');
            if (passwordConfirmInput.value !== passwordInput.value) {
                showError(passwordConfirmInput, 'Паролі не співпадають');
                isValid = false;
            }
            
            // Валідація згоди з умовами
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                showError(termsCheckbox, 'Вам необхідно погодитись з умовами використання');
                isValid = false;
            }
            
            // Якщо форма не валідна, запобігаємо відправці
            if (!isValid) {
                event.preventDefault();
            } else {
                // В навчальних цілях, щоб не відправляти форму на сервер
                event.preventDefault();
                
                // Імітуємо відправку форми і перенаправлення
                simulateFormSubmission(registerForm, 'Створення облікового запису...');
            }
        });
    }
}

/**
 * Імітація відправки форми на сервер
 * @param {HTMLFormElement} form - Форма, яку імітуємо відправку
 * @param {string} loadingText - Текст для кнопки під час "відправки"
 */
function simulateFormSubmission(form, loadingText) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Змінюємо стан кнопки
    submitBtn.disabled = true;
    submitBtn.textContent = loadingText;
    
    // Імітуємо затримку відправки і перенаправлення
    setTimeout(function() {
        // Перенаправляємо на головну сторінку
        window.location.href = 'index.html';
    }, 2000);
}

/**
 * Валідація email
 * @param {string} email - Email для перевірки
 * @returns {boolean} - Результат валідації
 */
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email.trim());
}

/**
 * Валідація телефону
 * @param {string} phone - Номер телефону для перевірки
 * @returns {boolean} - Результат валідації
 */
function validatePhone(phone) {
    const phonePattern = /^\+?[0-9\s\-\(\)]{10,20}$/;
    return phonePattern.test(phone.trim());
}

/**
 * Показ повідомлення про помилку
 * @param {HTMLElement} input - Поле з помилкою
 * @param {string} message - Текст повідомлення
 */
function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#D81F26';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    
    // Якщо це чекбокс, додаємо помилку після label
    if (input.type === 'checkbox') {
        input.parentNode.appendChild(errorElement);
    } else {
        // Перевіряємо, чи вхідне поле знаходиться всередині .password-field
        const parentElement = input.closest('.password-field') || input.parentNode;
        parentElement.appendChild(errorElement);
    }
    
    input.style.borderColor = '#D81F26';
    
    // Видаляємо стиль помилки при фокусі
    input.addEventListener('focus', function() {
        input.style.borderColor = '';
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    });
    
    // Для чекбоксів додатково при змінах
    if (input.type === 'checkbox') {
        input.addEventListener('change', function() {
            if (this.checked && errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        });
    }
}

/**
 * Очищення всіх помилок у формі
 * @param {HTMLFormElement} form - Форма для очищення помилок
 */
function clearErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    const inputs = form.querySelectorAll('input');
    
    errorMessages.forEach(message => message.remove());
    inputs.forEach(input => input.style.borderColor = '');
} 