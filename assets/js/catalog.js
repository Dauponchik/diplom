/**
 * JavaScript функції для сторінки каталогу автомобілів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація перемикання виду відображення (сітка/список)
    initViewToggle();
    
    // Ініціалізація фільтрів
    initFilters();
    
    // Ініціалізація порівняння та обраного
    initCompareFeature();
    initFavoriteFeature();
    updateCompareCounter();
    
    // Додаємо атрибути даних до карток автомобілів (тимчасове рішення)
    // addCarAttributes();
    
    // Застосовуємо фільтри при завантаженні сторінки
    applyFilters();
    
    // Ініціалізація сортування
    initSorting();
});

/**
 * Функція для перемикання виду відображення (сітка/список)
 */
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const carsGrid = document.querySelector('.cars-grid');
    
    if (!viewButtons.length || !carsGrid) return;
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Зняти активний клас з усіх кнопок
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Додати активний клас до натиснутої кнопки
            this.classList.add('active');
            
            // Змінити вид відображення
            const view = this.getAttribute('data-view');
            
            if (view === 'list') {
                carsGrid.classList.add('list-view');
            } else {
                carsGrid.classList.remove('list-view');
            }
            
            // Зберегти вибраний вид у localStorage
            localStorage.setItem('catalog_view', view);
        });
    });
    
    // Відновити вид відображення з localStorage
    const savedView = localStorage.getItem('catalog_view');
    if (savedView) {
        const targetButton = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

/**
 * Функція для додавання атрибутів даних до карток автомобілів
 * Тимчасове рішення до оновлення HTML структури
 */
function addCarAttributes() {
    const carCards = document.querySelectorAll('.car-card');
    
    carCards.forEach(card => {
        const id = card.getAttribute('data-id');
        
        // Встановити тип кузова на основі id чи іншої інформації
        if (id === '1' || id === '3' || id === '4') {
            card.setAttribute('data-body-type', 'suv'); // Позашляховики
        } else if (id === '2') {
            card.setAttribute('data-body-type', 'sedan'); // Седани
        }
        
        if (card.querySelector('.car-year')) {
            const year = card.querySelector('.car-year').textContent.trim();
            card.setAttribute('data-year', year);
        }
        
        if (card.querySelector('.car-engine')) {
            const engine = card.querySelector('.car-engine').textContent.trim().toLowerCase();
            if (engine.includes('diesel')) {
                card.setAttribute('data-engine-type', 'diesel');
            } else if (engine.includes('biturbo') || engine.includes('tfsi')) {
                card.setAttribute('data-engine-type', 'petrol');
            } else if (engine.includes('hybrid')) {
                card.setAttribute('data-engine-type', 'hybrid');
            } else if (engine.includes('electric')) {
                card.setAttribute('data-engine-type', 'electric');
            } else {
                card.setAttribute('data-engine-type', 'petrol'); // За замовчуванням
            }
        }
        
        if (card.querySelector('.car-price')) {
            const priceText = card.querySelector('.car-price').textContent.trim();
            const priceValue = priceText.replace(/[^\d]/g, ''); // Видалити всі символи, крім цифр
            card.setAttribute('data-price', priceValue);
        }
    });
}

/**
 * Функція для ініціалізації фільтрів
 */
function initFilters() {
    const filtersForm = document.querySelector('.filters-form');
    if (!filtersForm) return;
    
    // Відновити значення фільтрів з URL
    restoreFiltersFromUrl();
    
    // Обробка введення в числові поля
    const numberInputs = filtersForm.querySelectorAll('input[name="year_from"], input[name="year_to"], input[name="price_from"], input[name="price_to"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Дозволити тільки цифри
            this.value = this.value.replace(/[^\d]/g, '');
        });
    });
    
    // Обробка події відправки форми
    filtersForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Отримати всі вибрані фільтри
        const formData = new FormData(filtersForm);
        const filters = {};
        
        for (let [key, value] of formData.entries()) {
            // Якщо ключ вже існує, перетворити на масив
            if (key.endsWith('[]')) {
                const cleanKey = key.slice(0, -2);
                if (!filters[cleanKey]) {
                    filters[cleanKey] = [];
                }
                filters[cleanKey].push(value);
            } else {
                filters[key] = value;
            }
        }
        
        // Формування URL з параметрами фільтрів
        const urlParams = new URLSearchParams();
        
        for (let key in filters) {
            if (Array.isArray(filters[key])) {
                filters[key].forEach(value => {
                    urlParams.append(key, value);
                });
            } else if (filters[key]) {
                urlParams.append(key, filters[key]);
            }
        }
        
        // Оновити URL з новими параметрами
        window.location.search = urlParams.toString();
    });
    
    // Обробка події скидання фільтрів
    filtersForm.addEventListener('reset', function() {
        // Затримка, щоб форма встигла скинутися
        setTimeout(() => {
            window.location.search = '';
        }, 100);
    });
}

/**
 * Функція для відновлення значень фільтрів з URL
 */
function restoreFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const filtersForm = document.querySelector('.filters-form');
    
    if (!filtersForm) return;
    
    // Перебір всіх параметрів URL
    for (let [key, value] of urlParams.entries()) {
        // Відновлення стану чекбоксів для body_type[] і engine_type[]
        if ((key === 'body_type' || key === 'engine_type')) {
            const checkbox = filtersForm.querySelector(`input[name="${key}[]"][value="${value}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
        // Обробка полів вводу (рік, ціна)
        if (key === 'year_from' || key === 'year_to' || key === 'price_from' || key === 'price_to') {
            const input = filtersForm.querySelector(`input[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
    }
}

/**
 * Функція для застосування фільтрів до списку автомобілів
 */
function applyFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const carCards = document.querySelectorAll('.car-card');
    
    if (!carCards.length) return;
    
    // Масиви для зберігання вибраних фільтрів
    const bodyTypes = [];
    const engineTypes = [];
    const yearFrom = urlParams.get('year_from') ? parseInt(urlParams.get('year_from')) : null;
    const yearTo = urlParams.get('year_to') ? parseInt(urlParams.get('year_to')) : null;
    const priceFrom = urlParams.get('price_from') ? parseInt(urlParams.get('price_from')) : null;
    const priceTo = urlParams.get('price_to') ? parseInt(urlParams.get('price_to')) : null;
    
    // Збір вибраних типів кузова
    urlParams.getAll('body_type').forEach(type => {
        bodyTypes.push(type.toLowerCase());
    });
    
    // Збір вибраних типів двигуна
    urlParams.getAll('engine_type').forEach(type => {
        engineTypes.push(type.toLowerCase());
    });
    
    // Якщо немає активних фільтрів, показати всі автомобілі
    if (!bodyTypes.length && !engineTypes.length && 
        !yearFrom && !yearTo && !priceFrom && !priceTo) {
        carCards.forEach(card => {
            card.style.display = '';
        });
        
        // Оновити лічильник знайдених автомобілів
        updateCarCounter(carCards.length);
        return;
    }
    
    // Лічильник видимих автомобілів
    let visibleCars = 0;
    
    // Застосувати фільтри до кожного автомобіля
    carCards.forEach(card => {
        const cardBodyType = card.getAttribute('data-body-type') || '';
        const cardEngineType = card.getAttribute('data-engine-type') || '';
        const cardYear = card.getAttribute('data-year') ? parseInt(card.getAttribute('data-year')) : 0;
        const cardPrice = card.getAttribute('data-price') ? parseInt(card.getAttribute('data-price')) : 0;
        
        // Перевірка по всіх фільтрах
        let showCard = true;
        
        // Перевірка типу кузова
        if (bodyTypes.length && !bodyTypes.includes(cardBodyType)) {
            showCard = false;
        }
        
        // Перевірка типу двигуна
        if (showCard && engineTypes.length && !engineTypes.includes(cardEngineType)) {
            showCard = false;
        }
        
        // Перевірка року
        if (showCard && yearFrom && cardYear < yearFrom) {
            showCard = false;
        }
        
        if (showCard && yearTo && cardYear > yearTo) {
            showCard = false;
        }
        
        // Перевірка ціни
        if (showCard && priceFrom && cardPrice < priceFrom) {
            showCard = false;
        }
        
        if (showCard && priceTo && cardPrice > priceTo) {
            showCard = false;
        }
        
        // Показати або сховати автомобіль
        card.style.display = showCard ? '' : 'none';
        
        // Збільшити лічильник, якщо автомобіль видимий
        if (showCard) {
            visibleCars++;
        }
    });
    
    // Оновити лічильник знайдених автомобілів
    updateCarCounter(visibleCars);
}

/**
 * Функція для оновлення лічильника знайдених автомобілів
 */
function updateCarCounter(count) {
    const counterElement = document.querySelector('.catalog-count span');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

/**
 * Функція для сортування списку автомобілів
 */
function initSorting() {
    const sortSelect = document.getElementById('sort');
    if (!sortSelect) return;
    
    // Відновити вибране сортування з URL
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');
    
    if (sortParam) {
        sortSelect.value = sortParam;
    }
    
    // Обробка зміни сортування
    sortSelect.addEventListener('change', function() {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sort', this.value);
        window.location.search = urlParams.toString();
    });
    
    // Застосувати поточне сортування
    sortCars(sortSelect.value);
}

/**
 * Функція для сортування списку автомобілів
 */
function sortCars(sortType) {
    const carsGrid = document.querySelector('.cars-grid');
    if (!carsGrid) return;
    
    const carCards = Array.from(carsGrid.querySelectorAll('.car-card'));
    
    // Сортування карток автомобілів
    carCards.sort((a, b) => {
        switch (sortType) {
            case 'price_asc': // Від найдешевших
                const priceA = parseInt(a.getAttribute('data-price') || '0');
                const priceB = parseInt(b.getAttribute('data-price') || '0');
                return priceA - priceB;
                
            case 'price_desc': // Від найдорожчих
                const priceDescA = parseInt(a.getAttribute('data-price') || '0');
                const priceDescB = parseInt(b.getAttribute('data-price') || '0');
                return priceDescB - priceDescA;
                
            case 'year_desc': // Рік (від нових до старих)
                const yearDescA = parseInt(a.getAttribute('data-year') || '0');
                const yearDescB = parseInt(b.getAttribute('data-year') || '0');
                return yearDescB - yearDescA;
                
            case 'year_asc': // Рік (від старих до нових)
                const yearAscA = parseInt(a.getAttribute('data-year') || '0');
                const yearAscB = parseInt(b.getAttribute('data-year') || '0');
                return yearAscA - yearAscB;
                
            case 'popular': // За популярністю (за замовчуванням)
            default:
                // За замовчуванням сортування за id
                const idA = parseInt(a.getAttribute('data-id') || '0');
                const idB = parseInt(b.getAttribute('data-id') || '0');
                return idA - idB;
        }
    });
    
    // Очистити контейнер
    carsGrid.innerHTML = '';
    
    // Додати відсортовані картки назад в контейнер
    carCards.forEach(card => {
        carsGrid.appendChild(card);
    });
} 