/**
 * JavaScript функції для сторінки "Про нас"
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація лічильників
    initCounters();
    
    // Ініціалізація таймлайну
    initTimeline();
    
    // Ініціалізація анімації прокрутки
    initScrollAnimations();
    
    // Ініціалізація паралакс-ефекту
    initParallax();
});

/**
 * Ініціалізація лічильників для фактів
 */
function initCounters() {
    const counters = document.querySelectorAll('.fact-number');
    const speed = 200; // Швидкість анімації (мс)
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.innerText.replace(/[^\d]/g, ''));
                let count = 0;
                const updateCount = () => {
                    const increment = target / (speed / 10);
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count) + (counter.innerText.includes('+') ? '+' : '');
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Ініціалізація горизонтального таймлайну
 */
function initTimeline() {
    const timeline = document.querySelector('.history-timeline');
    if (!timeline) return;

    const timelineItems = timeline.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    // Показуємо перший елемент за замовчуванням
    timelineItems[0].classList.add('active');

    // Створюємо навігацію по рокам
    const navigation = document.createElement('div');
    navigation.className = 'timeline-navigation';

    timelineItems.forEach((item, index) => {
        const year = item.querySelector('.timeline-year').textContent;
        const button = document.createElement('button');
        button.className = 'year-button' + (index === 0 ? ' active' : '');
        button.textContent = year;
        
        button.addEventListener('click', () => {
            // Деактивуємо всі кнопки та елементи
            document.querySelectorAll('.year-button').forEach(btn => btn.classList.remove('active'));
            timelineItems.forEach(item => item.classList.remove('active'));
            
            // Активуємо вибрані кнопку та елемент
            button.classList.add('active');
            timelineItems[index].classList.add('active');
            
            // Плавно прокручуємо до активного елемента
            timelineItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        
        navigation.appendChild(button);
    });

    // Вставляємо навігацію перед таймлайном
    timeline.insertBefore(navigation, timeline.firstChild);

    // Додаємо обробник для анімації при прокрутці
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    timelineItems.forEach(item => observer.observe(item));
}

/**
 * Ініціалізація анімацій при прокрутці
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.value-item, .team-member, .advantage-card, .award-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    
    // Додаємо CSS-клас для анімації
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

/**
 * Ініціалізація паралакс-ефекту
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.about-intro-image, .mission-image');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrollY;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
                const offset = (scrollY + windowHeight - elementTop) / 10;
                element.style.backgroundPosition = `center ${offset}px`;
                
                const img = element.querySelector('img');
                if (img) {
                    img.style.transform = `translateY(${offset / 5}px)`;
                }
            }
        });
    });
} 