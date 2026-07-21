document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length > 0 && prevBtn && nextBtn) {
        let currentSlide = 0;

        function showSlide(index) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        // Автоматическое переключение каждые 5 секунд
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
});
