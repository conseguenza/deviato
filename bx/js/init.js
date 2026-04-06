// js/init.js
(function(){
    const a = document.getElementById('entryOverlay');
    const b = document.getElementById('mainContent');
    const c = document.getElementById('loadingSpinner');
    const d = document.getElementById('bgMusic');
    const e = document.getElementById('bgVideo');
    
    function f(){
        c.classList.add('visible');
        setTimeout(() => {
            c.classList.remove('visible');
            b.classList.add('visible');
            a.classList.add('hide');
            
            if(d){
                d.currentTime = 0;
                if(e) e.currentTime = 0;
                d.play().catch(g => console.log(g));
            }
            
            setTimeout(() => {
                a.style.display = 'none';
            }, 500);
        }, 800);
    }
    
    if(a){
        a.addEventListener('click', f);
    }
})();