/**
 * JavaScript функції для сторінки новин автосалону
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація фільтрів категорій
    initCategoryFilters();
    
    // Ініціалізація пошуку новин
    initNewsSearch();
    
    // Ініціалізація форми підписки
    initSubscribeForm();
});

/**
 * Ініціалізація фільтрів категорій
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Видалити активний стан у всіх кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Додати активний стан поточній кнопці
            this.classList.add('active');
            
            // Отримати обрану категорію
            const category = this.getAttribute('data-category');
            
            // Відфільтрувати новини за категорією
            newsItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Ініціалізація пошуку новин
 */
function initNewsSearch() {
    const searchInput = document.getElementById('news-search');
    const searchButton = document.querySelector('.search-btn');
    const newsItems = document.querySelectorAll('.news-item');
    
    // Функція пошуку
    function searchNews() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // Якщо поле пошуку порожнє, показати всі новини
            newsItems.forEach(item => item.style.display = '');
            return;
        }
        
        // Фільтрація новин за пошуковим запитом
        newsItems.forEach(item => {
            const title = item.querySelector('.news-title').textContent.toLowerCase();
            const excerpt = item.querySelector('.news-excerpt').textContent.toLowerCase();
            
            // Показати новину, якщо збігається з пошуковим запитом
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Пошук при кліку на кнопку
    searchButton.addEventListener('click', searchNews);
    
    // Пошук при натисканні Enter
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchNews();
        }
    });
}

/**
 * Ініціалізація форми підписки
 */
function initSubscribeForm() {
    const subscribeForm = document.querySelector('.subscribe-form-large');
    
    if (!subscribeForm) return;
    
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валідація email
        const emailInput = this.querySelector('input[type="email"]');
        const privacyCheckbox = this.querySelector('input[type="checkbox"]');
        
        if (!validateEmail(emailInput.value)) {
            alert('Будь ласка, введіть коректну email адресу');
            return;
        }
        
        if (!privacyCheckbox.checked) {
            alert('Для підписки необхідно погодитись з політикою конфіденційності');
            return;
        }
        
        // Відправка форми (тут може бути AJAX-запит)
        console.log('Підписка оформлена:', emailInput.value);
        
        // Очистка форми і повідомлення користувачу
        emailInput.value = '';
        alert('Дякуємо за підписку! Ви будете отримувати наші новини.');
    });
}

/**
 * Валідація email
 * @param {string} email - Email для перевірки
 * @returns {boolean} - Результат валідації
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Обробка пагінації
 */
document.addEventListener('DOMContentLoaded', function() {
    // Додамо обробники для кнопок пагінації
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Видалити активний стан у всіх кнопок
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Додати активний стан поточній кнопці (крім кнопки "Далі")
            if (!this.classList.contains('pagination-next')) {
                this.classList.add('active');
            }
            
            // В реальному проекті тут було б завантаження нових новин з сервера
            // Для демонстрації просто прокручуємо сторінку вгору до списку новин
            document.querySelector('.news-list').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}); 