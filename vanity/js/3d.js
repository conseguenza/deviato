// js/3d.js
(function(){
    const container = document.getElementById('container3d');
    const cursorGlow = document.getElementById('cursorGlow');
    let targetRotX = 0, targetRotY = 0, currentRotX = 0, currentRotY = 0;
    const maxRotate = 8;
    
    function animate3d(){
        if(!container) return;
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;
        container.style.transform = `perspective(1200px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        requestAnimationFrame(animate3d);
    }
    
    function onMouseMove(e){
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        targetRotY = mouseX * maxRotate;
        targetRotX = -mouseY * maxRotate;
        if(cursorGlow){
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
    });
    
    animate3d();
})();