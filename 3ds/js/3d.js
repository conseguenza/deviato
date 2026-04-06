// js/3d.js
(function(){
    const a = document.getElementById('container3d');
    const b = document.getElementById('cursorGlow');
    let c = 0, d = 0, e = 0, f = 0;
    const g = 8;
    
    function h(){
        if(!a) return;
        e += (c - e) * 0.12;
        f += (d - f) * 0.12;
        a.style.transform = `perspective(1200px) rotateX(${e}deg) rotateY(${f}deg)`;
        requestAnimationFrame(h);
    }
    
    function i(j){
        const k = (j.clientX / window.innerWidth) * 2 - 1;
        const l = (j.clientY / window.innerHeight) * 2 - 1;
        d = k * g;
        c = -l * g;
        if(b){
            b.style.left = j.clientX + 'px';
            b.style.top = j.clientY + 'px';
        }
    }
    
    document.addEventListener('mousemove', i);
    document.addEventListener('mouseleave', () => {
        c = 0;
        d = 0;
    });
    
    h();
})();