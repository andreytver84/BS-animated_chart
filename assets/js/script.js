document.addEventListener("DOMContentLoaded", function() {
    // Ищем только наши модули по специфичному классу
    const modules = document.querySelectorAll('.bs-statistics-module');

    modules.forEach(module => {
        const objectBars = module.querySelectorAll('.promo__statistics-bar--objects');
        const meterBars = module.querySelectorAll('.promo__statistics-bar--meters');
        const statNums = module.querySelectorAll('.stat-num');

        const MAX_HEIGHT_PX = 200; 

        let maxObjects = 0;
        let maxMeters = 0;

        objectBars.forEach(bar => {
            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
            if (val > maxObjects) maxObjects = val;
        });

        meterBars.forEach(bar => {
            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
            if (val > maxMeters) maxMeters = val;
        });

        const animateValue = (obj, start, end, duration, isMeters) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                let currentVal = Math.floor(progress * (end - start) + start);
                
                // Используем неразрывный пробел для форматирования
                let formatted = currentVal.toLocaleString('ru-RU').replace(/,/g, ' ');
                
                // Добавляем м² если это колонка метров
                obj.textContent = isMeters ? formatted + ' м²' : formatted;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    objectBars.forEach(bar => {
                        let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
                        let height = maxObjects > 0 ? (val / maxObjects) * MAX_HEIGHT_PX : 0;
                        bar.style.height = Math.max(height, 10) + 'px'; 
                    });

                    meterBars.forEach(bar => {
                        let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
                        let height = maxMeters > 0 ? (val / maxMeters) * MAX_HEIGHT_PX : 0;
                        bar.style.height = Math.max(height, 10) + 'px';
                    });

                    statNums.forEach(numDiv => {
                        let target = parseInt(numDiv.getAttribute('data-count'), 10) || 0;
                        let isMeters = numDiv.classList.contains('stat-meters');
                        animateValue(numDiv, 0, target, 1500, isMeters);
                    });

                    obs.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.3 });

        observer.observe(module);
    });
});