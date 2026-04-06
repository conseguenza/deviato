// js/overlay.js
(function(){
    const a = document.getElementById('entryOverlay');
    const b = document.getElementById('bgMusic');
    const c = document.getElementById('bgVideo');
    
    if(a){
        a.addEventListener('click', function(){
            if(b){
                b.currentTime = 0;
                if(c) c.currentTime = 0;
                b.play().catch(e => console.log(e));
            }
            a.style.transition = 'opacity 0.5s ease-out';
            a.style.opacity = '0';
            setTimeout(() => {
                a.style.display = 'none';
            }, 500);
        });
    }
})();