document.addEventListener("DOMContentLoaded", function() {
    const modules = document.querySelectorAll('.bs-animated-chart-container');

    modules.forEach(moduleWrapper => {
        // Читаем настройки из атрибутов, которые заданы в админке
        const OBJECTS_COEF = parseInt(moduleWrapper.getAttribute('data-coef'), 10) || 10;
        const ANIM_DELAY   = parseInt(moduleWrapper.getAttribute('data-delay'), 10) || 0;
        const SPEED_OBJ    = parseInt(moduleWrapper.getAttribute('data-speed-obj'), 10) || 1500;
        const SPEED_MET    = parseInt(moduleWrapper.getAttribute('data-speed-met'), 10) || 1500;

        const objectBars = moduleWrapper.querySelectorAll('.promo__statistics-bar--objects');
        const meterBars  = moduleWrapper.querySelectorAll('.promo__statistics-bar--meters');
        const statNums   = moduleWrapper.querySelectorAll('.stat-num');

        const MAX_PERCENT = 80; 
        let globalMax = 0;

        meterBars.forEach(bar => {
            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
            if (val > globalMax) globalMax = val;
        });

        objectBars.forEach(bar => {
            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
            let adjustedVal = val * OBJECTS_COEF;
            if (adjustedVal > globalMax) globalMax = adjustedVal;
        });

        // Функция анимации бегущих цифр
        const animateValue = (obj, start, end, duration, isMeters) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                let currentVal = Math.floor(progress * (end - start) + start);
                
                let formatted = currentVal.toLocaleString('ru-RU').replace(/,/g, ' ');
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
                    
                    // Применяем задержку перед стартом всей анимации
                    setTimeout(() => {
                        
                        objectBars.forEach(bar => {
                            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
                            let adjustedVal = val * OBJECTS_COEF;
                            let percent = globalMax > 0 ? (adjustedVal / globalMax) * MAX_PERCENT : 0;
                            bar.style.height = Math.max(percent, 2) + '%'; 
                        });

                        meterBars.forEach(bar => {
                            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
                            let percent = globalMax > 0 ? (val / globalMax) * MAX_PERCENT : 0;
                            bar.style.height = Math.max(percent, 2) + '%';
                        });

                        // Запускаем счетчики с индивидуальной скоростью
                        statNums.forEach(numDiv => {
                            let target = parseInt(numDiv.getAttribute('data-count'), 10) || 0;
                            let isMeters = numDiv.classList.contains('stat-meters');
                            
                            // Выбираем правильную скорость для текущего столбца
                            let duration = isMeters ? SPEED_MET : SPEED_OBJ;
                            
                            animateValue(numDiv, 0, target, duration, isMeters);
                        });

                    }, ANIM_DELAY); // Конец таймаута задержки

                    obs.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.3 });

        // Важно: наблюдаем за всей оберткой (чтобы 30% считалось от нее)
        observer.observe(moduleWrapper);
    });
});