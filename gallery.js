class Slider {
    constructor() {
        this.slider = document.querySelector('.slider');
        if (!this.slider) return;

        this.initSlider();
        window.addEventListener('resize', this.handleResize.bind(this));

        // Инициализация модального окна
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalImage = document.getElementById('modalImage');
        this.initModal();
    }

    initModal() {
        // Обработчики для открытия
        this.sliderContent.querySelectorAll('.slider__image').forEach(img => {
            img.addEventListener('click', () => this.openModal(img.src));
        });

        // Обработчики для закрытия
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay || e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(src) {
        document.body.classList.add('modal-open');
        this.modalImage.src = src;
        this.modalOverlay.style.display = 'flex';
        
        // Анимация появления
        setTimeout(() => {
            this.modalOverlay.style.opacity = '1';
        }, 10);
    }

    closeModal() {
        document.body.classList.remove('modal-open');
        this.modalOverlay.style.opacity = '0';
        
        // Задержка перед скрытием для анимации
        setTimeout(() => {
            this.modalOverlay.style.display = 'none';
        }, 300);
    }

    initSlider() {
        this.sliderContent = this.slider.querySelector('.slider__content');
        this.items = this.sliderContent.querySelectorAll('.slider__item');
        this.prevButton = this.slider.querySelector('.prev');
        this.nextButton = this.slider.querySelector('.next');
        
        this.calculateSizes();
        this.checkButtons();
        this.addEventListeners();
    }

    calculateSizes() {
        if (this.items.length > 0) {
            const firstItem = this.items[0];
            this.itemWidth = firstItem.offsetWidth + 
                parseInt(getComputedStyle(firstItem).marginRight);
        }
    }

    addEventListeners() {
        this.sliderContent.addEventListener('scroll', this.handleScroll.bind(this));
        this.prevButton.addEventListener('click', this.handlePrev.bind(this));
        this.nextButton.addEventListener('click', this.handleNext.bind(this));
    }

    handleResize() {
        this.calculateSizes();
        this.checkButtons();
    }

    handleScroll() {
        this.checkButtons();
    }

    checkButtons() {
        const { scrollLeft, scrollWidth, clientWidth } = this.sliderContent;
        const tolerance = 5; // Допуск для точности
        
        this.prevButton.disabled = scrollLeft <= tolerance;
        this.nextButton.disabled = scrollLeft + clientWidth >= scrollWidth - tolerance;
    }

    handlePrev() {
        this.sliderContent.scrollBy({
            left: -this.itemWidth,
            behavior: 'smooth'
        });
    }

    handleNext() {
        this.sliderContent.scrollBy({
            left: this.itemWidth,
            behavior: 'smooth'
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
});