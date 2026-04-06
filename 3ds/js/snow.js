// js/snow.js
(function(){
    if(!document.querySelector('.snowflake')){
        for(let a = 0; a < 40; a++){
            const b = document.createElement('div');
            b.classList.add('snowflake');
            b.innerHTML = '✦';
            b.style.left = Math.random() * 100 + '%';
            b.style.animationDuration = Math.random() * 6 + 4 + 's';
            b.style.fontSize = Math.random() * 12 + 8 + 'px';
            b.style.opacity = Math.random() * 0.4 + 0.2;
            b.style.animationDelay = Math.random() * 8 + 's';
            document.body.appendChild(b);
        }
    }
})();