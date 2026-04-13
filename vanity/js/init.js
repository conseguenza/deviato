// js/init.js
(function(){
    const overlay = document.getElementById('entryOverlay');
    const mainContent = document.getElementById('mainContent');
    const spinner = document.getElementById('loadingSpinner');
    const audio = document.getElementById('bgMusic');
    const video = document.getElementById('bgVideo');
    
    function enterSite(){
        spinner.classList.add('visible');
        setTimeout(() => {
            spinner.classList.remove('visible');
            mainContent.classList.add('visible');
            overlay.classList.add('hide');
            
            if(audio){
                audio.currentTime = 0;
                if(video) video.currentTime = 0;
                audio.play().catch(err => console.log(err));
            }
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }, 800);
    }
    
    if(overlay){
        overlay.addEventListener('click', enterSite);
    }
})();