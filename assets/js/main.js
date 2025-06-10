/**
 * Основний JavaScript файл для сайту Nissan
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація слайдера на головній сторінці
    initSlider();
    
    // Ініціалізація табів для секції новин та спецпропозицій
    initTabs();
    
    // Кнопка прокрутки догори
    initScrollToTop();
    
    // Мобільне меню
    initMobileMenu();
    
    // Валідація форми запису на тест-драйв
    if (document.getElementById('testdrive-form')) {
        initFormValidation('testdrive-form');
    }
});

/**
 * Ініціалізація слайдера на головній сторінці
 */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Функція для показу потрібного слайду
    function showSlide(index) {
        // Сховати всі слайди та деактивувати всі індикатори
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Показати потрібний слайд та активувати відповідний індикатор
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        // Оновити поточний індекс
        currentSlide = index;
    }
    
    // Функція для переходу до наступного слайду
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Функція для переходу до попереднього слайду
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Додати обробники подій для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            startSlideInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            startSlideInterval();
        });
    }
    
    // Додати обробники подій для індикаторів
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideInterval();
        });
    });
    
    // Функція для автоматичної зміни слайдів
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Запустити автоматичну зміну слайдів
    startSlideInterval();
}

/**
 * Ініціалізація табів для секції новин та спецпропозицій
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Деактивувати всі кнопки та панелі
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Активувати потрібну кнопку та панель
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Ініціалізація кнопки прокрутки догори
 */
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;
    
    // Показати кнопку при прокрутці вниз
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Прокрутка догори при кліку на кнопку
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Ініціалізація мобільного меню
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

/**
 * Валідація форм
 * @param {string} formId - ID форми для валідації
 */
function initFormValidation(formId) {
    const form = document.getElementById(formId);
    
    form.addEventListener('submit', function(event) {
        let isValid = true;
        
        // Перевірити всі обов'язкові поля
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Валідація телефону (якщо є поле з id="phone")
        const phoneField = form.querySelector('#phone');
        if (phoneField && phoneField.value.trim()) {
            const phonePattern = /^\+?[0-9\s\-()]{10,18}$/;
            if (!phonePattern.test(phoneField.value.trim())) {
                isValid = false;
                phoneField.classList.add('error');
            }
        }
        
        // Валідація email (якщо є поле з id="email")
        const emailField = form.querySelector('#email');
        if (emailField && emailField.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value.trim())) {
                isValid = false;
                emailField.classList.add('error');
            }
        }
        
        if (!isValid) {
            event.preventDefault();
        }
    });
    
    // Видаляти клас помилки при вводі
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

/**
 * Функціонал для порівняння автомобілів
 */
function initCompareFeature() {
    const compareButtons = document.querySelectorAll('.btn-compare');
    
    if (!compareButtons.length) return;
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carCard = this.closest('.car-card');
            const carId = carCard.getAttribute('data-id');
            const carTitle = carCard.querySelector('.car-title').innerText;
            
            // Додавання або видалення з порівняння
            toggleCompare(carId, carTitle);
            
            // Оновлення вигляду кнопки
            this.classList.toggle('active');
        });
    });
}

/**
 * Функція для додавання/видалення автомобіля з порівняння
 * @param {string} carId - ID автомобіля
 * @param {string} carTitle - Назва автомобіля
 */
function toggleCompare(carId, carTitle) {
    let compareList = localStorage.getItem('compareList');
    compareList = compareList ? JSON.parse(compareList) : [];
    
    // Перевірка, чи вже є в списку
    const index = compareList.findIndex(item => item.id === carId);
    
    if (index !== -1) {
        // Видалити зі списку
        compareList.splice(index, 1);
    } else {
        // Додати до списку (максимум 4 автомобілі)
        if (compareList.length < 4) {
            compareList.push({
                id: carId,
                title: carTitle
            });
        } else {
            alert('Ви можете порівняти максимум 4 автомобілі одночасно');
            return;
        }
    }
    
    // Зберегти оновлений список
    localStorage.setItem('compareList', JSON.stringify(compareList));
    
    // Оновити індикатор кількості
    updateCompareCounter();
}

/**
 * Оновлення лічильника автомобілів для порівняння
 */
function updateCompareCounter() {
    const counter = document.querySelector('.compare-count');
    if (!counter) return;
    
    let compareList = localStorage.getItem('compareList');
    compareList = compareList ? JSON.parse(compareList) : [];
    
    counter.innerText = compareList.length;
    
    if (compareList.length > 0) {
        counter.classList.add('active');
    } else {
        counter.classList.remove('active');
    }
}

/**
 * Функціонал для додавання авто в "Обране"
 */
function initFavoriteFeature() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    
    if (!favoriteButtons.length) return;
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carCard = this.closest('.car-card');
            const carId = carCard.getAttribute('data-id');
            const carTitle = carCard.querySelector('.car-title').innerText;
            
            // Додавання або видалення з обраного
            toggleFavorite(carId, carTitle);
            
            // Оновлення іконки кнопки
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        });
    });
}

/**
 * Функція для додавання/видалення автомобіля з обраного
 * @param {string} carId - ID автомобіля
 * @param {string} carTitle - Назва автомобіля
 */
function toggleFavorite(carId, carTitle) {
    let favoriteList = localStorage.getItem('favoriteList');
    favoriteList = favoriteList ? JSON.parse(favoriteList) : [];
    
    // Перевірка, чи вже є в списку
    const index = favoriteList.findIndex(item => item.id === carId);
    
    if (index !== -1) {
        // Видалити зі списку
        favoriteList.splice(index, 1);
    } else {
        // Додати до списку
        favoriteList.push({
            id: carId,
            title: carTitle
        });
    }
    
    // Зберегти оновлений список
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
}

// Ініціалізація функцій для порівняння та обраного
document.addEventListener('DOMContentLoaded', function() {
    initCompareFeature();
    initFavoriteFeature();
    updateCompareCounter();
}); 