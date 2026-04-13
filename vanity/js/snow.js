// js/snow.js
(function(){
    // Remove existing snowflakes to avoid duplicates
    const existingSnow = document.querySelectorAll('.snowflake');
    existingSnow.forEach(snow => snow.remove());
    
    for(let i = 0; i < 40; i++){
        const snow = document.createElement('div');
        snow.classList.add('snowflake');
        snow.innerHTML = '✦';
        snow.style.left = Math.random() * 100 + '%';
        snow.style.animationDuration = Math.random() * 6 + 4 + 's';
        snow.style.fontSize = Math.random() * 12 + 8 + 'px';
        snow.style.opacity = Math.random() * 0.4 + 0.2;
        snow.style.animationDelay = Math.random() * 8 + 's';
        document.body.appendChild(snow);
    }
})();