// js/audio.js
(function(){
    const a = document.getElementById('bgMusic');
    const b = document.getElementById('bgVideo');
    
    function c(){
        if(!a || !b) return;
        if(!a.paused){
            if(b.paused) b.play().catch(e => console.log(e));
        } else {
            if(!b.paused) b.pause();
        }
    }
    
    if(a){
        a.addEventListener('play', () => {
            if(b){
                if(b.currentTime >= b.duration - 0.1) b.currentTime = 0;
                b.play().catch(e => console.log(e));
            }
        });
        a.addEventListener('pause', () => {
            if(b && !b.paused) b.pause();
        });
        a.addEventListener('ended', () => {
            if(b) b.pause();
        });
    }
    
    setInterval(() => {
        if(a && b && !a.paused && !b.paused){
            const d = Math.abs(a.currentTime - b.currentTime);
            if(d > 0.5 && b.currentTime < b.duration - 0.5){
                b.currentTime = a.currentTime;
            }
        }
    }, 1000);
    
    let e = document.querySelector('.audio-control-container');
    if(!e){
        e = document.createElement('div');
        e.className = 'audio-control-container';
        e.innerHTML = `
            <div class="audio-btn" id="audioToggleBtn">
                <i class="fas fa-volume-up"></i>
            </div>
            <div class="volume-container">
                <i class="fas fa-volume-down volume-icon"></i>
                <input type="range" id="volumeSlider" class="volume-control" min="0" max="1" step="0.01" value="0.5">
                <i class="fas fa-volume-up volume-icon"></i>
            </div>
        `;
        document.body.appendChild(e);
    }
    
    const f = document.getElementById('audioToggleBtn');
    const g = document.getElementById('volumeSlider');
    
    if(a && f && g){
        a.volume = 0.5;
        g.value = a.volume;
        
        const h = () => {
            const i = f.querySelector('i');
            if(i){
                if(a.muted){
                    i.className = 'fas fa-volume-mute';
                } else if(a.volume === 0){
                    i.className = 'fas fa-volume-off';
                } else if(a.volume < 0.5){
                    i.className = 'fas fa-volume-down';
                } else {
                    i.className = 'fas fa-volume-up';
                }
            }
        };
        
        const j = f.cloneNode(true);
        f.parentNode.replaceChild(j, f);
        const k = j;
        
        k.addEventListener('click', () => {
            if(a.paused){
                a.play().catch(e => console.log(e));
            } else {
                a.pause();
            }
            h();
        });
        
        if(g){
            const l = g.cloneNode(true);
            g.parentNode.replaceChild(l, g);
            const m = l;
            
            m.addEventListener('input', (n) => {
                const o = parseFloat(n.target.value);
                a.volume = o;
                if(a.muted) a.muted = false;
                h();
            });
        }
        
        a.addEventListener('volumechange', h);
        h();
    }
    
    c();
})();