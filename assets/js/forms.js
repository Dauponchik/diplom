/**
 * Обробка форм сайту Nissan
 * Валідація та AJAX відправка
 */

class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        // Ініціалізація всіх форм
        this.initTestDriveForm();
        this.initSubscribeForm();
        this.initContactForm();
        this.initServiceForm();
        this.initTradeinForm();
        
        // Додаємо універсальні обробники
        this.setupFormValidation();
    }

    // Форма запису на тест-драйв
    initTestDriveForm() {
        const testDriveForm = document.getElementById('testdrive-form');
        if (testDriveForm) {
            testDriveForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.handleTestDriveSubmit(testDriveForm);
                return false;
            });

            // Встановлюємо мінімальну дату
            const dateInput = testDriveForm.querySelector('input[name="date"]');
            if (dateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.min = tomorrow.toISOString().split('T')[0];
                
                const maxDate = new Date();
                maxDate.setMonth(maxDate.getMonth() + 3);
                dateInput.max = maxDate.toISOString().split('T')[0];
            }
        }
    }

    // Форми підписки на новини
    initSubscribeForm() {
        const subscribeForms = document.querySelectorAll('.subscribe-form, .subscribe-form-large');
        subscribeForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.handleSubscribeSubmit(form);
                return false;
            });
        });
    }

    // Форма зворотного зв'язку
    initContactForm() {
        const contactForms = document.querySelectorAll('.contact-form');
        console.log('🔍 Пошук контактних форм:', contactForms.length);
        contactForms.forEach((contactForm, index) => {
            console.log(`✅ Контактна форма ${index + 1} знайдена, додаю обробник`);
            contactForm.addEventListener('submit', async (e) => {
                console.log(`⚡ Спрацювала відправка контактної форми ${index + 1}`);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Додаткова перевірка для запобігання стандартної поведінки
                if (e.defaultPrevented) {
                    console.log('✅ Default behavior prevented');
                }
                
                await this.handleContactSubmit(contactForm);
                return false;
            }, true); // Використовуємо capture phase
        });
        
        if (contactForms.length === 0) {
            console.log('❌ Контактні форми не знайдені');
        }
    }

    // Форма запису на сервіс
    initServiceForm() {
        const serviceForm = document.querySelector('.service-form');
        if (serviceForm) {
            serviceForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.handleServiceSubmit(serviceForm);
                return false;
            });

            // Встановлюємо мінімальну дату для сервісу
            const dateInput = serviceForm.querySelector('input[name="service-date"]');
            if (dateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.min = tomorrow.toISOString().split('T')[0];
                
                const maxDate = new Date();
                maxDate.setMonth(maxDate.getMonth() + 3);
                dateInput.max = maxDate.toISOString().split('T')[0];
            }
        }
    }

    // Форма trade-in
    initTradeinForm() {
        const tradeinForm = document.querySelector('.tradein-form');
        if (tradeinForm) {
            tradeinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.handleTradeinSubmit(tradeinForm);
                return false;
            });

            // Встановлюємо максимальний рік для автомобіля
            const yearInput = tradeinForm.querySelector('input[name="car-year"]');
            if (yearInput) {
                yearInput.max = new Date().getFullYear();
            }
        }
    }

    // Обробка форми тест-драйву
    async handleTestDriveSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Валідація
        if (!this.validateTestDriveForm(form)) {
            return false;
        }

        try {
            this.setLoading(submitBtn, true);
            
            const response = await fetch('php/testdrive.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Показуємо тільки модальне вікно успіху
                this.showSuccessModal('Тест-драйв заброньовано!', result.message);
                form.reset();
                
                // Закриваємо модальне вікно тест-драйву
                const testDriveModal = document.getElementById('testDriveModal');
                if (testDriveModal) {
                    testDriveModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            } else {
                this.showError(result.message, result.errors);
            }
        } catch (error) {
            console.error('Помилка відправки форми:', error);
            this.showError('Помилка з\'єднання. Спробуйте ще раз.');
        } finally {
            this.setLoading(submitBtn, false);
        }
        
        return false; // Запобігаємо стандартному submit
    }

    // Обробка форми підписки
    async handleSubscribeSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Валідація email
        const emailInput = form.querySelector('input[name="email"]');
        if (!this.validateEmail(emailInput.value)) {
            this.showFieldError(emailInput, 'Введіть коректну email адресу');
            return false;
        }

        try {
            this.setLoading(submitBtn, true);
            
            const response = await fetch('php/subscribe.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                form.reset();
            } else {
                this.showError(result.message, result.errors);
            }
        } catch (error) {
            console.error('Помилка підписки:', error);
            this.showError('Помилка з\'єднання. Спробуйте ще раз.');
        } finally {
            this.setLoading(submitBtn, false);
        }
        
        return false; // Запобігаємо стандартному submit
    }

    // Обробка форми зворотного зв'язку
    async handleContactSubmit(form) {
        console.log('📋 Початок обробки контактної форми');
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        console.log('🔄 Обробка форми зворотного зв\'язку...');
        console.log('📝 Дані форми:', Object.fromEntries(formData.entries()));
        
        // Валідація
        if (!this.validateContactForm(form)) {
            console.log('❌ Валідація не пройдена');
            return false;
        }

        try {
            this.setLoading(submitBtn, true);
            
            console.log('📤 Відправка AJAX запиту до contact.php...');
            
            const response = await fetch('php/contact.php', {
                method: 'POST',
                body: formData
            });
            
            console.log('📥 Отримано відповідь:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📄 Результат:', result);
            
            if (result.success) {
                console.log('✅ Успішна відправка!');
                // Показуємо модальне вікно успіху як у тест-драйву
                this.showSuccessModal('Повідомлення надіслано!', result.message);
                form.reset();
            } else {
                console.log('❌ Помилки валідації сервера:', result.errors);
                this.showError(result.message, result.errors);
            }
        } catch (error) {
            console.error('💥 Помилка відправки:', error);
            this.showError('Помилка з\'єднання. Спробуйте ще раз.');
        } finally {
            this.setLoading(submitBtn, false);
        }
        
        console.log('🏁 Завершення обробки контактної форми');
        return false; // Запобігаємо стандартному submit
    }

    // Валідація форми тест-драйву
    validateTestDriveForm(form) {
        let isValid = true;
        
        const carModel = form.querySelector('[name="car_model"]');
        const name = form.querySelector('[name="name"]');
        const phone = form.querySelector('[name="phone"]');
        const date = form.querySelector('[name="date"]');
        
        // Очищаємо попередні помилки
        this.clearFieldErrors(form);
        
        if (!carModel.value) {
            this.showFieldError(carModel, 'Оберіть модель автомобіля');
            isValid = false;
        }
        
        if (!name.value || name.value.length < 2) {
            this.showFieldError(name, 'Введіть ваше ім\'я (мінімум 2 символи)');
            isValid = false;
        }
        
        if (!this.validatePhone(phone.value)) {
            this.showFieldError(phone, 'Введіть коректний номер телефону');
            isValid = false;
        }
        
        if (!date.value) {
            this.showFieldError(date, 'Оберіть дату тест-драйву');
            isValid = false;
        } else {
            const selectedDate = new Date(date.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                this.showFieldError(date, 'Дата не може бути в минулому');
                isValid = false;
            }
        }
        
        return isValid;
    }

    // Валідація форми зворотного зв'язку
    validateContactForm(form) {
        let isValid = true;
        
        const name = form.querySelector('[name="name"]');
        const phone = form.querySelector('[name="phone"]');
        const email = form.querySelector('[name="email"]');
        const message = form.querySelector('[name="message"]');
        const privacy = form.querySelector('[name="privacy"]');
        
        // Очищаємо попередні помилки
        this.clearFieldErrors(form);
        
        if (!name.value || name.value.length < 2) {
            this.showFieldError(name, 'Введіть ваше ім\'я (мінімум 2 символи)');
            isValid = false;
        }
        
        if (!this.validatePhone(phone.value)) {
            this.showFieldError(phone, 'Введіть коректний номер телефону');
            isValid = false;
        }
        
        if (!this.validateEmail(email.value)) {
            this.showFieldError(email, 'Введіть коректну email адресу');
            isValid = false;
        }
        
        if (!message.value || message.value.length < 10) {
            this.showFieldError(message, 'Повідомлення має містити мінімум 10 символів');
            isValid = false;
        }
        
        if (!privacy.checked) {
            this.showFieldError(privacy, 'Необхідно погодитися з політикою конфіденційності');
            isValid = false;
        }
        
        return isValid;
    }

    // Валідація email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Валідація телефону
    validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\(\)\-\s]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Показати помилку поля
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Видаляємо попередню помилку
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Додаємо нову помилку
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Очистити помилки полів
    clearFieldErrors(form) {
        const errorFields = form.querySelectorAll('.error');
        const errorMessages = form.querySelectorAll('.field-error');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(error => error.remove());
    }

    // Показати загальну помилку
    showError(message, errors = []) {
        // Якщо це масив помилок, показуємо кожну окремо
        if (errors && errors.length > 0) {
            errors.forEach(error => {
                this.showNotification(error, 'error');
            });
        } else {
            // Інакше показуємо основне повідомлення
            this.showNotification(message, 'error');
        }
    }

    // Показати успіх
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Показати повідомлення
    showNotification(message, type = 'info') {
        console.log(`📢 Показ повідомлення: ${type} - ${message}`);
        
        // Створюємо контейнер повідомлень якщо його немає
        let container = document.querySelector('.notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notifications-container';
            document.body.appendChild(container);
            console.log('📦 Створено контейнер повідомлень');
        }

        // Створюємо повідомлення
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Замінюємо \n на <br> для правильного відображення
        const formattedMessage = message.replace(/\n/g, '<br>');
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${formattedMessage}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Додаємо обробник закриття
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Додаємо до контейнера
        container.appendChild(notification);

        // Автоматично видаляємо через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Модальне вікно успіху
    showSuccessModal(title, message) {
        console.log(`🎉 Створення модального вікна: ${title}`);
        
        // Видаляємо попереднє модальне вікно якщо є
        let modal = document.querySelector('.success-modal');
        if (modal) {
            console.log('🗑️ Видаляю попереднє модальне вікно');
            modal.remove();
        }

        // Створюємо нове модальне вікно
        modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.style.display = 'block'; // Встановлюємо одразу
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" type="button">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <p class="modal-message">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary modal-ok" type="button">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('✅ Модальне вікно додано до DOM');

        // Показуємо модальне вікно з затримкою для гарантії
        setTimeout(() => {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            console.log('📺 Модальне вікно показано');
        }, 10);

        // Функція закриття модального вікна
        const closeModal = () => {
            console.log('❌ Закриття модального вікна');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            document.body.style.overflow = 'auto';
            if (modal.parentNode) {
                modal.remove();
            }
        };

        // Обробники закриття
        const closeBtn = modal.querySelector('.modal-close');
        const okBtn = modal.querySelector('.modal-ok');
        const overlay = modal.querySelector('.modal-overlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
        }

        if (okBtn) {
            okBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModal();
                }
            });
        }

        // Закриття на ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        console.log('🎯 Обробники подій для модального вікна встановлені');
    }

    // Встановити стан завантаження
    setLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
        }
    }

    // Налаштування загальної валідації
    setupFormValidation() {
        // Валідація в реальному часі для email полів
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value && !this.validateEmail(input.value)) {
                    this.showFieldError(input, 'Введіть коректну email адресу');
                } else {
                    this.clearFieldError(input);
                }
            });
        });

        // Валідація телефонних полів
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
        phoneInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value && !this.validatePhone(input.value)) {
                    this.showFieldError(input, 'Введіть коректний номер телефону');
                } else {
                    this.clearFieldError(input);
                }
            });
        });
    }

    // Очистити помилку одного поля
    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.field-error');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Обробка форми сервісу
    async handleServiceSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        console.log('🔧 Обробка форми запису на сервіс...');
        
        // Валідація
        if (!this.validateServiceForm(form)) {
            console.log('❌ Валідація сервісної форми не пройдена');
            return false;
        }

        try {
            this.setLoading(submitBtn, true);
            
            console.log('📤 Відправка запиту до service.php...');
            
            const response = await fetch('php/service.php', {
                method: 'POST',
                body: formData
            });
            
            console.log('📥 Отримано відповідь:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📄 Результат сервісу:', result);
            
            if (result.success) {
                this.showSuccess(result.message);
                form.reset();
                
                // Прокручуємо до верху сторінки
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                console.log('❌ Помилки валідації сервісу:', result.errors);
                this.showError(result.message, result.errors);
            }
        } catch (error) {
            console.error('💥 Помилка відправки сервісної форми:', error);
            this.showError('Помилка з\'єднання. Спробуйте ще раз.');
        } finally {
            this.setLoading(submitBtn, false);
        }
        
        return false; // Запобігаємо стандартному submit
    }

    // Валідація форми сервісу
    validateServiceForm(form) {
        let isValid = true;
        
        const clientName = form.querySelector('[name="client-name"]');
        const clientPhone = form.querySelector('[name="client-phone"]');
        const carModel = form.querySelector('[name="car-model"]');
        const serviceType = form.querySelector('[name="service-type"]');
        const serviceDate = form.querySelector('[name="service-date"]');
        const privacy = form.querySelector('[name="privacy"]');
        
        // Очищаємо попередні помилки
        this.clearFieldErrors(form);
        
        if (!clientName.value || clientName.value.length < 2) {
            this.showFieldError(clientName, 'Введіть ваше ім\'я (мінімум 2 символи)');
            isValid = false;
        }
        
        if (!this.validatePhone(clientPhone.value)) {
            this.showFieldError(clientPhone, 'Введіть коректний номер телефону');
            isValid = false;
        }
        
        if (!carModel.value) {
            this.showFieldError(carModel, 'Введіть марку та модель автомобіля');
            isValid = false;
        }
        
        if (!serviceType.value) {
            this.showFieldError(serviceType, 'Оберіть тип сервісу');
            isValid = false;
        }
        
        if (!serviceDate.value) {
            this.showFieldError(serviceDate, 'Оберіть дату сервісу');
            isValid = false;
        } else {
            const selectedDate = new Date(serviceDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                this.showFieldError(serviceDate, 'Дата не може бути в минулому');
                isValid = false;
            }
        }
        
        if (!privacy.checked) {
            this.showFieldError(privacy, 'Необхідно погодитися з політикою конфіденційності');
            isValid = false;
        }
        
        return isValid;
    }

    // Обробка форми trade-in
    async handleTradeinSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        console.log('🔄 Обробка форми trade-in...');
        
        // Валідація
        if (!this.validateTradeinForm(form)) {
            console.log('❌ Валідація trade-in форми не пройдена');
            return false;
        }

        try {
            this.setLoading(submitBtn, true);
            
            console.log('📤 Відправка запиту до tradein.php...');
            
            const response = await fetch('php/tradein.php', {
                method: 'POST',
                body: formData
            });
            
            console.log('📥 Отримано відповідь:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📄 Результат trade-in:', result);
            
            if (result.success) {
                this.showSuccess(result.message);
                form.reset();
                
                // Прокручуємо до верху сторінки
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                console.log('❌ Помилки валідації trade-in:', result.errors);
                this.showError(result.message, result.errors);
            }
        } catch (error) {
            console.error('💥 Помилка відправки trade-in форми:', error);
            this.showError('Помилка з\'єднання. Спробуйте ще раз.');
        } finally {
            this.setLoading(submitBtn, false);
        }
        
        return false; // Запобігаємо стандартному submit
    }

    // Валідація форми trade-in
    validateTradeinForm(form) {
        let isValid = true;
        
        const ownerName = form.querySelector('[name="owner-name"]');
        const ownerPhone = form.querySelector('[name="owner-phone"]');
        const carBrand = form.querySelector('[name="car-brand"]');
        const carModel = form.querySelector('[name="car-model"]');
        const carYear = form.querySelector('[name="car-year"]');
        const carMileage = form.querySelector('[name="car-mileage"]');
        const carEngine = form.querySelector('[name="car-engine"]');
        const carFuel = form.querySelector('[name="car-fuel"]');
        const carCondition = form.querySelector('[name="car-condition"]');
        const privacy = form.querySelector('[name="privacy"]');
        
        // Очищаємо попередні помилки
        this.clearFieldErrors(form);
        
        if (!ownerName.value || ownerName.value.length < 2) {
            this.showFieldError(ownerName, 'Введіть ваше ім\'я (мінімум 2 символи)');
            isValid = false;
        }
        
        if (!this.validatePhone(ownerPhone.value)) {
            this.showFieldError(ownerPhone, 'Введіть коректний номер телефону');
            isValid = false;
        }
        
        if (!carBrand.value) {
            this.showFieldError(carBrand, 'Введіть марку автомобіля');
            isValid = false;
        }
        
        if (!carModel.value) {
            this.showFieldError(carModel, 'Введіть модель автомобіля');
            isValid = false;
        }
        
        if (!carYear.value || carYear.value < 1950 || carYear.value > new Date().getFullYear()) {
            this.showFieldError(carYear, `Введіть коректний рік (1950-${new Date().getFullYear()})`);
            isValid = false;
        }
        
        if (!carMileage.value || carMileage.value < 0) {
            this.showFieldError(carMileage, 'Введіть коректний пробіг');
            isValid = false;
        }
        
        if (!carEngine.value) {
            this.showFieldError(carEngine, 'Введіть об\'єм двигуна');
            isValid = false;
        }
        
        if (!carFuel.value) {
            this.showFieldError(carFuel, 'Оберіть тип палива');
            isValid = false;
        }
        
        if (!carCondition.value) {
            this.showFieldError(carCondition, 'Оберіть технічний стан автомобіля');
            isValid = false;
        }
        
        if (!privacy.checked) {
            this.showFieldError(privacy, 'Необхідно погодитися з політикою конфіденційності');
            isValid = false;
        }
        
        return isValid;
    }
}

// Ініціалізація при завантаженні DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Ініціалізація FormHandler...');
    const handler = new FormHandler();
    window.FormHandler = FormHandler; // Експортуємо для тестування
    console.log('✅ FormHandler ініціалізовано');
    
    // Додаткова перевірка наявності форм
    setTimeout(() => {
        const contactForms = document.querySelectorAll('.contact-form');
        const serviceForms = document.querySelectorAll('.service-form');
        const tradeinForms = document.querySelectorAll('.tradein-form');
        const testdriveForms = document.querySelectorAll('#testdrive-form, .testdrive-form');
        
        console.log('📊 Статистика знайдених форм:');
        console.log('📝 Контактні форми:', contactForms.length);
        console.log('🔧 Сервісні форми:', serviceForms.length);
        console.log('🚗 Trade-in форми:', tradeinForms.length);
        console.log('🏎️ Тест-драйв форми:', testdriveForms.length);
    }, 100);
}); 