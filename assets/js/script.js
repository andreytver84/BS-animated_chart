document.addEventListener("DOMContentLoaded", function() {
    const modules = document.querySelectorAll('.bs-statistics-module');

    modules.forEach(module => {
        const objectBars = module.querySelectorAll('.promo__statistics-bar--objects');
        const meterBars = module.querySelectorAll('.promo__statistics-bar--meters');
        const statNums = module.querySelectorAll('.stat-num');

        // --- НАСТРОЙКИ ГРАФИКА ---
        
        // 1. Максимальная высота самого большого столбца в контейнере (80%, чтобы сверху влезли цифры)
        const MAX_PERCENT = 80; 

        // 2. ВИЗУАЛЬНЫЙ КОЭФФИЦИЕНТ ДЛЯ ОБЪЕКТОВ
        // Увеличивает высоту столбцов "объекты". 
        // Для ваших значений (максимум ~865 объектов и ~54880 метров) 
        // значение около 25-30 сделает столбцы объектов заметными, но они будут ниже метров.
        const OBJECTS_COEF = 10; 

        let globalMax = 0;

        // Ищем абсолютный максимум среди "метров", так как они задают основной масштаб
        meterBars.forEach(bar => {
            let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
            if (val > globalMax) globalMax = val;
        });

        // На всякий случай проверяем: если вы поставите очень большой коэффициент, 
        // виртуальные объекты могут обогнать метры. Если это произошло, расширяем шкалу под них.
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

        // Запуск анимации при появлении графика на экране
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    // Расчет высоты для ОБЪЕКТОВ (умножаем на наш коэффициент)
                    objectBars.forEach(bar => {
                        let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
                        let adjustedVal = val * OBJECTS_COEF;
                        
                        let percent = globalMax > 0 ? (adjustedVal / globalMax) * MAX_PERCENT : 0;
                        bar.style.height = Math.max(percent, 2) + '%'; 
                    });

                    // Расчет высоты для МЕТРОВ (считаем по честным значениям)
                    meterBars.forEach(bar => {
                        let val = parseInt(bar.getAttribute('data-val'), 10) || 0;
                        
                        let percent = globalMax > 0 ? (val / globalMax) * MAX_PERCENT : 0;
                        bar.style.height = Math.max(percent, 2) + '%';
                    });

                    // Запускаем счетчик
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