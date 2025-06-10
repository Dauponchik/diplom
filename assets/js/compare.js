/**
 * JavaScript функції для сторінки порівняння автомобілів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація порівняння
    initCompare();
    
    // Ініціалізація перемикача для відображення відмінностей
    initDifferenceToggle();
    
    // Ініціалізація кнопки очищення
    initClearButton();
});

/**
 * Ініціалізація порівняння автомобілів
 */
function initCompare() {
    // Перевірити, чи є автомобілі для порівняння в URL або localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let carIds = [];
    
    // Спробувати отримати автомобілі з URL
    if (urlParams.has('cars')) {
        carIds = urlParams.get('cars').split(',');
    } 
    // Якщо немає в URL, використати localStorage
    else {
        const compareList = localStorage.getItem('compareList');
        if (compareList) {
            const compareData = JSON.parse(compareList);
            carIds = compareData.map(car => car.id);
        }
    }
    
    // Якщо є автомобілі для порівняння, завантажити їх
    if (carIds.length > 0) {
        loadCarsForCompare(carIds);
    } else {
        // Показати порожній стан
        showEmptyCompare();
    }
}

/**
 * Показати порожній стан порівняння
 */
function showEmptyCompare() {
    document.getElementById('compareCarsEmpty').classList.add('active');
    document.getElementById('compareTableWrapper').style.display = 'none';
}

/**
 * Показати таблицю порівняння
 */
function showCompareTable() {
    document.getElementById('compareCarsEmpty').classList.remove('active');
    document.getElementById('compareTableWrapper').style.display = 'block';
}

/**
 * Завантажити дані автомобілів для порівняння
 * @param {Array} carIds - Масив ID автомобілів для порівняння
 */
function loadCarsForCompare(carIds) {
    // В реальному проекті тут був би AJAX-запит до сервера
    // Для демонстрації використовуємо моковані дані
    
    // Приклад даних автомобілів
    const carData = {
        "1": {
            "id": "1",
            "brand": "BMW",
            "model": "X5",
            "year": "2024",
            "image": "assets/img/car-1-thumb-1.jpg",
            "price": "$75,500",
            "body_type": "Позашляховик",
            "engine_type": "Дизельний",
            "engine_volume": "3.0 л",
            "power": "286 к.с.",
            "torque": "650 Нм",
            "acceleration": "6.5 с",
            "max_speed": "235 км/год",
            "transmission": "Автоматична",
            "gears": "8",
            "drive": "Повний",
            "fuel_city": "8.2 л/100км",
            "fuel_highway": "6.8 л/100км",
            "fuel_combined": "7.5 л/100км",
            "fuel_tank": "80 л",
            "length": "4922 мм",
            "width": "2004 мм",
            "height": "1745 мм",
            "wheelbase": "2975 мм",
            "trunk": "650-1870 л",
            "climate": "4-зонний",
            "heated_seats": "Передні + Задні",
            "cruise_control": "Адаптивний",
            "rear_camera": "Так",
            "parking_sensors": "Передні + Задні",
            "airbags": "8"
        },
        "2": {
            "id": "2",
            "brand": "Mercedes-Benz",
            "model": "S-Class",
            "year": "2024",
            "image": "assets/img/car-2-thumb-1.jpg",
            "price": "$110,000",
            "body_type": "Седан",
            "engine_type": "Бензиновий",
            "engine_volume": "4.0 л",
            "power": "435 к.с.",
            "torque": "700 Нм",
            "acceleration": "4.9 с",
            "max_speed": "250 км/год",
            "transmission": "Автоматична",
            "gears": "9",
            "drive": "Задній",
            "fuel_city": "12.5 л/100км",
            "fuel_highway": "7.8 л/100км",
            "fuel_combined": "9.5 л/100км",
            "fuel_tank": "76 л",
            "length": "5289 мм",
            "width": "1954 мм",
            "height": "1503 мм",
            "wheelbase": "3216 мм",
            "trunk": "550 л",
            "climate": "4-зонний",
            "heated_seats": "Передні + Задні",
            "cruise_control": "Адаптивний",
            "rear_camera": "Так",
            "parking_sensors": "Передні + Задні",
            "airbags": "10"
        },
        "3": {
            "id": "3",
            "brand": "Audi",
            "model": "Q8",
            "year": "2024",
            "image": "assets/img/car-3-thumb-1.jpg",
            "price": "$89,900",
            "body_type": "Позашляховик",
            "engine_type": "Бензиновий",
            "engine_volume": "3.0 л",
            "power": "340 к.с.",
            "torque": "500 Нм",
            "acceleration": "5.9 с",
            "max_speed": "250 км/год",
            "transmission": "Автоматична",
            "gears": "8",
            "drive": "Повний",
            "fuel_city": "11.8 л/100км",
            "fuel_highway": "8.3 л/100км",
            "fuel_combined": "9.8 л/100км",
            "fuel_tank": "85 л",
            "length": "4986 мм",
            "width": "1995 мм",
            "height": "1705 мм",
            "wheelbase": "2995 мм",
            "trunk": "605-1755 л",
            "climate": "2-зонний",
            "heated_seats": "Передні",
            "cruise_control": "Адаптивний",
            "rear_camera": "Так",
            "parking_sensors": "Передні + Задні",
            "airbags": "8"
        },
        "4": {
            "id": "4",
            "brand": "Lexus",
            "model": "LX",
            "year": "2024",
            "image": "assets/img/car-4-thumb-1.jpg",
            "price": "$95,300",
            "body_type": "Позашляховик",
            "engine_type": "Бензиновий",
            "engine_volume": "5.7 л",
            "power": "367 к.с.",
            "torque": "530 Нм",
            "acceleration": "7.7 с",
            "max_speed": "210 км/год",
            "transmission": "Автоматична",
            "gears": "8",
            "drive": "Повний",
            "fuel_city": "18.1 л/100км",
            "fuel_highway": "12.5 л/100км",
            "fuel_combined": "14.8 л/100км",
            "fuel_tank": "93 л",
            "length": "5080 мм",
            "width": "1980 мм",
            "height": "1910 мм",
            "wheelbase": "2850 мм",
            "trunk": "701-1430 л",
            "climate": "4-зонний",
            "heated_seats": "Передні + Задні",
            "cruise_control": "Адаптивний",
            "rear_camera": "Так",
            "parking_sensors": "Передні + Задні",
            "airbags": "10"
        },
        "5": {
            "id": "5",
            "brand": "Mercedes-Benz",
            "model": "GLE",
            "year": "2024",
            "image": "assets/img/car-5-thumb-1.jpg",
            "price": "$82,300",
            "body_type": "Позашляховик",
            "engine_type": "Дизельний",
            "engine_volume": "3.0 л",
            "power": "272 к.с.",
            "torque": "600 Нм",
            "acceleration": "6.8 с",
            "max_speed": "230 км/год",
            "transmission": "Автоматична",
            "gears": "9",
            "drive": "Повний",
            "fuel_city": "8.5 л/100км",
            "fuel_highway": "6.9 л/100км",
            "fuel_combined": "7.5 л/100км",
            "fuel_tank": "85 л",
            "length": "4924 мм",
            "width": "1947 мм",
            "height": "1772 мм",
            "wheelbase": "2915 мм",
            "trunk": "630-2055 л",
            "climate": "3-зонний",
            "heated_seats": "Передні + Задні",
            "cruise_control": "Адаптивний",
            "rear_camera": "Так",
            "parking_sensors": "Передні + Задні",
            "airbags": "9"
        }
    };
    
    // Фільтрувати масив ID, залишаючи тільки існуючі авто
    const validCarIds = carIds.filter(id => carData[id]);
    
    // Якщо немає автомобілів для порівняння, показати порожній стан
    if (validCarIds.length === 0) {
        showEmptyCompare();
        return;
    }
    
    // Показати таблицю порівняння
    showCompareTable();
    
    // Оновити таблицю порівняння
    updateCompareTable(validCarIds.map(id => carData[id]));
}

/**
 * Оновити таблицю порівняння
 * @param {Array} cars - Масив об'єктів з даними автомобілів
 */
function updateCompareTable(cars) {
    // Додати заголовки колонок з автомобілями
    const headerRow = document.querySelector('.compare-cars-row');
    
    // Очистити існуючі колонки (крім першої)
    const existingColumns = headerRow.querySelectorAll('th:not(.feature-name-col)');
    existingColumns.forEach(col => col.remove());
    
    // Додати колонки для кожного автомобіля
    cars.forEach(car => {
        const carColumn = document.createElement('th');
        carColumn.className = 'car-column';
        carColumn.innerHTML = `
            <div class="car-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}">
            </div>
            <div class="car-title">${car.brand} ${car.model}</div>
            <div class="car-year">${car.year}</div>
            <div class="car-price">${car.price}</div>
            <div class="car-actions">
                <a href="car-details.html?id=${car.id}" class="action-link">
                    <i class="fas fa-info-circle"></i> Детальніше
                </a>
                <button class="remove-car" data-id="${car.id}">
                    <i class="fas fa-times"></i> Видалити
                </button>
            </div>
        `;
        headerRow.appendChild(carColumn);
    });
    
    // Оновити всі рядки даних
    updateCompareRows(cars);
    
    // Додати обробники подій для кнопок видалення
    addRemoveHandlers();
}

/**
 * Оновити всі рядки таблиці порівняння
 * @param {Array} cars - Масив об'єктів з даними автомобілів
 */
function updateCompareRows(cars) {
    const table = document.querySelector('.compare-table');
    const rows = table.querySelectorAll('tbody tr:not(.section-header)');
    
    rows.forEach(row => {
        const featureName = row.querySelector('.feature-name').textContent.trim();
        
        // Видалити існуючі колонки даних
        const existingCells = row.querySelectorAll('td:not(.feature-name)');
        existingCells.forEach(cell => cell.remove());
        
        // Визначити ім'я властивості на основі тексту рядка
        let propertyName = '';
        
        switch (featureName) {
            case 'Ціна': propertyName = 'price'; break;
            case 'Рік випуску': propertyName = 'year'; break;
            case 'Тип кузова': propertyName = 'body_type'; break;
            case 'Тип двигуна': propertyName = 'engine_type'; break;
            case 'Об\'єм двигуна': propertyName = 'engine_volume'; break;
            case 'Потужність': propertyName = 'power'; break;
            case 'Крутний момент': propertyName = 'torque'; break;
            case 'Розгін 0-100 км/год': propertyName = 'acceleration'; break;
            case 'Максимальна швидкість': propertyName = 'max_speed'; break;
            case 'Трансмісія': propertyName = 'transmission'; break;
            case 'Кількість передач': propertyName = 'gears'; break;
            case 'Привід': propertyName = 'drive'; break;
            case 'Міський цикл': propertyName = 'fuel_city'; break;
            case 'Заміський цикл': propertyName = 'fuel_highway'; break;
            case 'Змішаний цикл': propertyName = 'fuel_combined'; break;
            case 'Об\'єм бака': propertyName = 'fuel_tank'; break;
            case 'Довжина': propertyName = 'length'; break;
            case 'Ширина': propertyName = 'width'; break;
            case 'Висота': propertyName = 'height'; break;
            case 'Колісна база': propertyName = 'wheelbase'; break;
            case 'Об\'єм багажника': propertyName = 'trunk'; break;
            case 'Клімат-контроль': propertyName = 'climate'; break;
            case 'Підігрів сидінь': propertyName = 'heated_seats'; break;
            case 'Круїз-контроль': propertyName = 'cruise_control'; break;
            case 'Камера заднього виду': propertyName = 'rear_camera'; break;
            case 'Парктроніки': propertyName = 'parking_sensors'; break;
            case 'Кількість подушок безпеки': propertyName = 'airbags'; break;
            default: propertyName = ''; break;
        }
        
        if (propertyName) {
            // Отримати значення властивості для кожного автомобіля
            const values = cars.map(car => car[propertyName] || '-');
            
            // Перевірити, чи є відмінності
            const hasDifferences = new Set(values).size > 1;
            
            // Додати колонки даних
            cars.forEach((car, index) => {
                const cell = document.createElement('td');
                cell.textContent = car[propertyName] || '-';
                
                // Якщо є відмінності, додати клас для виділення
                if (hasDifferences) {
                    cell.classList.add('different');
                }
                
                row.appendChild(cell);
            });
        }
    });
}

/**
 * Додати обробники подій для кнопок видалення
 */
function addRemoveHandlers() {
    const removeButtons = document.querySelectorAll('.remove-car');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carId = this.getAttribute('data-id');
            removeCarFromCompare(carId);
        });
    });
}

/**
 * Видалити автомобіль з порівняння
 * @param {string} carId - ID автомобіля для видалення
 */
function removeCarFromCompare(carId) {
    // Отримати поточні ID автомобілів з URL
    const urlParams = new URLSearchParams(window.location.search);
    let carIds = [];
    
    if (urlParams.has('cars')) {
        carIds = urlParams.get('cars').split(',');
        
        // Видалити автомобіль зі списку
        carIds = carIds.filter(id => id !== carId);
        
        // Оновити URL
        if (carIds.length > 0) {
            urlParams.set('cars', carIds.join(','));
        } else {
            urlParams.delete('cars');
        }
        
        // Оновити адресний рядок без перезавантаження сторінки
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
        
        // Перезавантажити порівняння
        initCompare();
    } else {
        // Якщо немає в URL, використати localStorage
        let compareList = localStorage.getItem('compareList');
        if (compareList) {
            let compareData = JSON.parse(compareList);
            
            // Видалити автомобіль зі списку
            compareData = compareData.filter(car => car.id !== carId);
            
            // Оновити localStorage
            localStorage.setItem('compareList', JSON.stringify(compareData));
            
            // Перезавантажити порівняння
            initCompare();
        }
    }
}

/**
 * Ініціалізація перемикача для відображення відмінностей
 */
function initDifferenceToggle() {
    const toggle = document.getElementById('showDifferences');
    if (!toggle) return;
    
    toggle.addEventListener('change', function() {
        const table = document.querySelector('.compare-table');
        
        if (this.checked) {
            // Приховати рядки без відмінностей
            table.querySelectorAll('tbody tr:not(.section-header)').forEach(row => {
                const differentCells = row.querySelectorAll('td.different');
                if (differentCells.length === 0) {
                    row.style.display = 'none';
                }
            });
        } else {
            // Показати всі рядки
            table.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = '';
            });
        }
    });
}

/**
 * Ініціалізація кнопки очищення
 */
function initClearButton() {
    const clearButton = document.getElementById('clearAll');
    if (!clearButton) return;
    
    clearButton.addEventListener('click', function() {
        // Очистити URL
        window.history.replaceState({}, '', window.location.pathname);
        
        // Очистити localStorage
        localStorage.removeItem('compareList');
        
        // Показати порожній стан
        showEmptyCompare();
    });
} 