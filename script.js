document.addEventListener('DOMContentLoaded', () => {
    // ==================== ОБЩИЕ ФУНКЦИИ ====================
    
    // Плавная прокрутка с закрытием мобильного меню
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                if (window.innerWidth < 992) {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
                }
            }
        });
    });

    // Динамическое изменение шапки
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    });

    // ==================== ПРОКРУТКА К КАТАЛОГУ ====================
    const stockButton = document.querySelector('.in-stock');
    const catalogSection = document.getElementById('catalog');

    if (stockButton && catalogSection) {
        stockButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = catalogSection.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    // ==================== МОДАЛЬНЫЕ ОКНА ДЛЯ КАРТОЧЕК ПК ====================
    document.querySelectorAll('.pc-card').forEach(card => {
        card.addEventListener('click', () => {
            const specs = JSON.parse(card.dataset.specs);
            const title = card.querySelector('.pc-title').textContent;
            const image = card.querySelector('img').src;
            const price = card.querySelector('.pc-price').textContent;

            document.getElementById('pcModalTitle').textContent = title;
            document.getElementById('pcModalImage').src = image;
            
            const specsBody = document.getElementById('pcSpecsBody');
            specsBody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center">
                        <div class="fs-4 fw-bold">${price}</div>
                    </td>
                </tr>
                ${Object.entries(specs).map(([key, value]) => `
                    <tr>
                        <td>${key}</td>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            `;

            new bootstrap.Modal('#specsModal').show();
        });
    });

    // ==================== ФОРМА ЗАКАЗА ====================
    const initOrderForm = () => {
        const form = document.getElementById('pcOrderForm');
        const submitBtn = form?.querySelector('button[type="submit"]');
        const alerts = {
            success: document.getElementById('successAlert'),
            error: document.getElementById('errorAlert')
        };

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Отправка...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form)
                });
                
                const result = await response.json();
                alerts[result.success ? 'success' : 'error'].classList.remove('d-none');
            } catch (error) {
                alerts.error.classList.remove('d-none');
                console.error('Error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Отправить заявку';
                setTimeout(() => {
                    alerts.success.classList.add('d-none');
                    alerts.error.classList.add('d-none');
                }, 5000);
            }
        });
    };
    initOrderForm();

    // ==================== ИНИЦИАЛИЗАЦИЯ BOOTSTRAP ====================
    const initBootstrap = () => {
        // Тултипы
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.map(t => new bootstrap.Tooltip(t));

        // Модалка заказа
        const orderModal = new bootstrap.Modal('#orderModal', {
            keyboard: false,
            backdrop: 'static'
        });

        document.querySelector('.custom-pc')?.addEventListener('click', () => {
            orderModal.show();
        });
    };
    initBootstrap();
});