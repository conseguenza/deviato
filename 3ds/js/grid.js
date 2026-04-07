// js/grid.js
// 3D Grid of lines with 1mm equivalent distance (scaled for screen)
(function() {
    const canvas = document.getElementById('gridCanvas');
    if (!canvas) return;
    
    let ctx = canvas.getContext('2d');
    let width, height;
    let animationId = null;
    let time = 0;
    
    // Grid spacing in pixels (simulating ~1mm at typical viewing distance)
    // On a 96dpi screen, 1mm ≈ 3.78px. We'll use 4px for crisp rendering.
    const GRID_SPACING = 4;
    
    // Parallax effect intensity
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
        
        // Apply subtle parallax shift
        const shiftX = currentOffsetX * 0.5;
        const shiftY = currentOffsetY * 0.3;
        
        ctx.save();
        ctx.translate(shiftX, shiftY);
        
        // Draw vertical lines
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
        
        // Draw horizontal lines
        const startY = Math.floor(shiftY % GRID_SPACING) - GRID_SPACING;
        for (let y = startY; y < height + GRID_SPACING; y += GRID_SPACING) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw subtle center axis highlight (optional)
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
        // Smooth follow for parallax
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.08;
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.08;
        
        drawGrid();
        
        // Subtle pulse based on time (very faint breathing effect)
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
        // Convert mouse position to normalized range (-1 to 1)
        const normX = (e.clientX / width) * 2 - 1;
        const normY = (e.clientY / height) * 2 - 1;
        // Max shift in pixels (about 15px max)
        targetOffsetX = normX * 12;
        targetOffsetY = normY * 8;
    }
    
    function onThemeChange() {
        // Redraw when theme changes to update line color
        drawGrid();
    }
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
        drawGrid();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawGrid();
    });
    
    document.addEventListener('mousemove', onMouseMove);
    
    resizeCanvas();
    animateGrid();
})();