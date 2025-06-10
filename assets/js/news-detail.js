/**
 * JavaScript функції для сторінки детальної інформації про новину
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація обробки параметрів URL
    initUrlParams();
    
    // Ініціалізація галереї
    initGallery();
    
    // Ініціалізація кнопок поширення
    initShareButtons();
    
    // Ініціалізація фільтрів категорій
    initCategoryFilters();
});

/**
 * Ініціалізація обробки параметрів URL
 */
function initUrlParams() {
    // Отримання параметрів з URL
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    // Якщо є ID новини, можна завантажити додаткові дані
    if (newsId) {
        console.log('Завантаження новини з ID:', newsId);
        // В реальному проекті тут був би AJAX-запит для отримання даних новини
    }
}

/**
 * Ініціалізація галереї зображень
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.querySelector('img').src;
            
            // Створення модального вікна для перегляду зображення
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            const image = document.createElement('img');
            image.src = imageSrc;
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(image);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Запобігання прокрутки сторінки
            document.body.style.overflow = 'hidden';
            
            // Анімація появи
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Обробник закриття
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal();
            });
            
            function closeModal() {
                modal.classList.remove('active');
                
                // Видалення після анімації
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    });
}

/**
 * Ініціалізація кнопок поширення
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            let shareUrl = '';
            
            // Визначення URL соціальної мережі
            if (this.title === 'Facebook') {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            } else if (this.title === 'Twitter') {
                shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
            } else if (this.title === 'Telegram') {
                shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
            } else if (this.title === 'Viber') {
                shareUrl = `viber://forward?text=${pageTitle} ${pageUrl}`;
            }
            
            // Відкриття вікна для поширення
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

/**
 * Ініціалізація фільтрів категорій
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.related-news .news-item');
    
    if (filterButtons.length === 0 || newsItems.length === 0) return;
    
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