// js/theme.js
(function(){
    const a = () => localStorage.getItem('theme');
    const b = (c) => {
        const d = document.documentElement;
        if(c === 'dark'){
            d.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            d.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };
    
    const c = a();
    const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(c === 'dark' || (!c && d)){
        b('dark');
    } else {
        b('light');
    }
    
    let e = document.querySelector('.theme-toggle');
    if(!e){
        e = document.createElement('div');
        e.className = 'theme-toggle';
        document.body.appendChild(e);
    }
    
    const f = () => {
        const g = document.body.classList.contains('dark');
        e.innerHTML = g ? '<i class="fas fa-sun" style="font-size: 1.2rem;"></i>' : '<i class="fas fa-moon" style="font-size: 1.2rem;"></i>';
    };
    
    f();
    
    const h = e.cloneNode(true);
    e.parentNode.replaceChild(h, e);
    const i = h;
    
    i.addEventListener('click', (j) => {
        j.preventDefault();
        const k = document.body.classList.contains('dark');
        b(k ? 'light' : 'dark');
        f();
    });
})();