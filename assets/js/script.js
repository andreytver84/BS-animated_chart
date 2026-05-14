document.addEventListener("DOMContentLoaded", function() {
    const modules = document.querySelectorAll('.bs-animated-chart-container');

    modules.forEach(moduleWrapper => {
        const OBJECTS_COEF = parseInt(moduleWrapper.getAttribute('data-coef'), 10) || 10;
        const ANIM_DELAY   = parseInt(moduleWrapper.getAttribute('data-delay'), 10) || 0;

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

                        statNums.forEach(numDiv => {
                            let target = parseInt(numDiv.getAttribute('data-count'), 10) || 0;
                            let duration = parseInt(numDiv.getAttribute('data-speed'), 10) || 1500;
                            let isMeters = numDiv.classList.contains('stat-meters');
                            
                            animateValue(numDiv, 0, target, duration, isMeters);
                        });

                    }, ANIM_DELAY);

                    obs.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.3 });

        observer.observe(moduleWrapper);
    });
});