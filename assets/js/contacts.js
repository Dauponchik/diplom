/**
 * JavaScript функції для сторінки контактів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація FAQ акордеону
    initFaqAccordion();
    
    // Ініціалізація кнопок карти
    initMapButtons();
    
    // Валідація форми
    initFormValidation();
});

/**
 * Ініціалізація акордеону для FAQ
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Якщо поточний елемент вже активний, закриваємо його
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                return;
            }
            
            // Закриваємо всі відкриті FAQ
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Відкриваємо поточний елемент
            item.classList.add('active');
        });
    });
}

/**
 * Ініціалізація кнопок для перемикання локацій на карті
 */
function initMapButtons() {
    const mapButtons = document.querySelectorAll('.map-control, .office-map-btn');
    
    mapButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const location = this.getAttribute('data-location');
            
            // Оновлюємо активну кнопку
            document.querySelectorAll('.map-control').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelector(`.map-control[data-location="${location}"]`).classList.add('active');
            
            // Прокручуємо до карти, якщо кнопка була в блоці офісу
            if (this.classList.contains('office-map-btn')) {
                const mapElement = document.getElementById('map');
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Оновлюємо карту для вибраної локації
            changeMapLocation(location);
        });
    });
}

/**
 * Зміна локації на карті
 * @param {string} location - Ідентифікатор локації
 */
function changeMapLocation(location) {
    // В реальному проекті тут була б зміна координат на карті
    console.log(`Змінено локацію на карті на: ${location}`);
    
    // Якщо використовується Google Maps, можна було б зробити щось подібне:
    if (window.googleMap) {
        const locations = {
            kyiv: { lat: 50.4501, lng: 30.5234, zoom: 14 },
            lviv: { lat: 49.8397, lng: 24.0297, zoom: 14 },
            odesa: { lat: 46.4825, lng: 30.7233, zoom: 14 }
        };
        
        const selectedLocation = locations[location];
        
        // Встановлюємо нові координати на карті
        window.googleMap.setCenter(new google.maps.LatLng(
            selectedLocation.lat,
            selectedLocation.lng
        ));
        
        window.googleMap.setZoom(selectedLocation.zoom);
        
        // Встановлюємо маркер
        if (window.mapMarker) {
            window.mapMarker.setPosition(new google.maps.LatLng(
                selectedLocation.lat,
                selectedLocation.lng
            ));
        }
    }
}

/**
 * Ініціалізація карти Google Maps
 * Ця функція буде викликана з API Google Maps
 */
function initMap() {
    // Координати центрального офісу (Київ)
    const centerLocation = { lat: 50.4501, lng: 30.5234 };
    
    // Створюємо карту з центром у Києві
    const map = new google.maps.Map(document.getElementById('officeMap'), {
        center: centerLocation,
        zoom: 14,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [{"saturation": "-100"}]
            },
            {
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": "50"}, {"visibility": "simplified"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": "-100"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [{"lightness": "30"}]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [{"lightness": "40"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [{"lightness": -25}, {"saturation": -100}]
            }
        ]
    });
    
    // Створюємо маркер для позначення офісу
    const marker = new google.maps.Marker({
        position: centerLocation,
        map: map,
        title: 'Nissan Київ',
        icon: {
            url: 'assets/img/map-marker.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    // Додаємо інформаційне вікно при кліку на маркер
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="map-info-window">
                <h3>Nissan Київ</h3>
                <p>вул. Автомобільна, 1</p>
                <p>Пн-Пт: 9:00-20:00, Сб-Нд: 10:00-19:00</p>
                <p><a href="tel:+380501234567">+38 (050) 123-45-67</a></p>
            </div>
        `
    });
    
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    
    // Зберігаємо карту і маркер глобально для доступу з інших функцій
    window.googleMap = map;
    window.mapMarker = marker;
    window.mapInfoWindow = infoWindow;
}

/**
 * Ініціалізація валідації форми зворотного зв'язку
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        let isValid = true;
        
        // Очищаємо попередні помилки
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Валідація імені
        const nameInput = document.getElementById('name');
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        }
        
        // Валідація телефону
        const phoneInput = document.getElementById('phone');
        const phonePattern = /^\+?[0-9\s\-\(\)]{10,20}$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            showError(phoneInput, 'Будь ласка, введіть коректний номер телефону');
            isValid = false;
        }
        
        // Валідація email
        const emailInput = document.getElementById('email');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, 'Будь ласка, введіть коректний email');
            isValid = false;
        }
        
        // Валідація повідомлення
        const messageInput = document.getElementById('message');
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Будь ласка, введіть ваше повідомлення');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Повідомлення має містити не менше 10 символів');
            isValid = false;
        }
        
        // Валідація згоди з політикою конфіденційності
        const consentCheckbox = document.getElementById('consent');
        if (!consentCheckbox.checked) {
            showError(consentCheckbox, 'Для відправки форми необхідно погодитись з політикою конфіденційності');
            isValid = false;
        }
        
        // Якщо форма не пройшла валідацію, запобігаємо відправці
        if (!isValid) {
            event.preventDefault();
        } else {
            // Тут можна додати AJAX відправку форми
            // В навчальних цілях просто блокуємо стандартну відправку
            event.preventDefault();
            
            // Імітація відправки форми
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Відправка...';
            
            setTimeout(function() {
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                showSuccessMessage();
            }, 1500);
        }
    });
}

/**
 * Відображення повідомлення про помилку валідації
 * @param {HTMLElement} input - Поле вводу з помилкою
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
        input.parentNode.appendChild(errorElement);
    }
    
    input.style.borderColor = '#D81F26';
    
    // Видаляємо стиль помилки при фокусі
    input.addEventListener('focus', function() {
        input.style.borderColor = '';
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    });
}

/**
 * Відображення повідомлення про успішну відправку форми
 */
function showSuccessMessage() {
    const formContainer = document.querySelector('.contact-form-container');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="text-align: center; padding: 20px; background-color: #f0f8f0; border-radius: 8px; margin-bottom: 20px;">
            <i class="fas fa-check-circle" style="font-size: 40px; color: #28a745; margin-bottom: 15px;"></i>
            <h3 style="margin-bottom: 10px; color: #28a745;">Повідомлення успішно надіслано!</h3>
            <p>Дякуємо за звернення. Наш менеджер зв'яжеться з вами найближчим часом.</p>
        </div>
    `;
    
    formContainer.prepend(successMessage);
    
    // Автоматично видаляємо повідомлення через 5 секунд
    setTimeout(function() {
        successMessage.style.opacity = '0';
        successMessage.style.transition = 'opacity 0.5s ease';
        
        setTimeout(function() {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 500);
    }, 5000);
} 