// js/grid.js
(function() {
    const canvas = document.getElementById('gridCanvas');
    if (!canvas) return;
    
    let ctx = canvas.getContext('2d');
    let width, height;
    let animationId = null;
    let time = 0;
    
    const GRID_SPACING = 4;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        drawGrid();
    }
    
    function drawGrid() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        const shiftX = currentOffsetX * 0.5;
        const shiftY = currentOffsetY * 0.3;
        
        ctx.save();
        ctx.translate(shiftX, shiftY);
        
        ctx.beginPath();
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--glass-border-light').trim() || 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 0.8;
        
        const startX = Math.floor(shiftX % GRID_SPACING) - GRID_SPACING;
        for (let x = startX; x < width + GRID_SPACING; x += GRID_SPACING) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        const startY = Math.floor(shiftY % GRID_SPACING) - GRID_SPACING;
        for (let y = startY; y < height + GRID_SPACING; y += GRID_SPACING) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.moveTo(width/2 + shiftX, 0);
        ctx.lineTo(width/2 + shiftX, height);
        ctx.moveTo(0, height/2 + shiftY);
        ctx.lineTo(width, height/2 + shiftY);
        ctx.stroke();
        
        ctx.restore();
    }
    
    function animateGrid() {
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.08;
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.08;
        
        drawGrid();
        
        if (ctx) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(0,0,0,${Math.sin(time * 0.001) * 0.02 + 0.02})`;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }
        
        time++;
        animationId = requestAnimationFrame(animateGrid);
    }
    
    function onMouseMove(e) {
        const normX = (e.clientX / width) * 2 - 1;
        const normY = (e.clientY / height) * 2 - 1;
        targetOffsetX = normX * 12;
        targetOffsetY = normY * 8;
    }
    
    const observer = new MutationObserver(() => drawGrid());
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawGrid();
    });
    
    document.addEventListener('mousemove', onMouseMove);
    
    resizeCanvas();
    animateGrid();
})();