// js/audio.js
(function(){
    const audio = document.getElementById('bgMusic');
    const video = document.getElementById('bgVideo');
    
    function syncVideoWithAudio(){
        if(!audio || !video) return;
        if(!audio.paused){
            if(video.paused) video.play().catch(e => console.log(e));
        } else {
            if(!video.paused) video.pause();
        }
    }
    
    if(audio){
        audio.addEventListener('play', () => {
            if(video){
                if(video.currentTime >= video.duration - 0.1) video.currentTime = 0;
                video.play().catch(e => console.log(e));
            }
        });
        audio.addEventListener('pause', () => {
            if(video && !video.paused) video.pause();
        });
        audio.addEventListener('ended', () => {
            if(video) video.pause();
        });
    }
    
    setInterval(() => {
        if(audio && video && !audio.paused && !video.paused){
            const diff = Math.abs(audio.currentTime - video.currentTime);
            if(diff > 0.5 && video.currentTime < video.duration - 0.5){
                video.currentTime = audio.currentTime;
            }
        }
    }, 1000);
    
    // Remove existing container if any
    const existingContainer = document.querySelector('.audio-control-container');
    if(existingContainer) existingContainer.remove();
    
    // Create audio control with Play/Pause button + Volume Slider
    const audioContainer = document.createElement('div');
    audioContainer.className = 'audio-control-container';
    audioContainer.innerHTML = `
        <button class="audio-btn" id="audioToggleBtn">
            <i class="fas fa-play"></i>
        </button>
        <div class="volume-container">
            <input type="range" id="volumeSlider" class="volume-control" min="0" max="1" step="0.01" value="0.5">
        </div>
    `;
    document.body.appendChild(audioContainer);
    
    const toggleBtn = document.getElementById('audioToggleBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    
    if(audio && toggleBtn){
        // Set initial volume
        audio.volume = 0.5;
        if(volumeSlider) volumeSlider.value = audio.volume;
        
        const updatePlayPauseIcon = () => {
            const icon = toggleBtn.querySelector('i');
            if(icon){
                if(audio.paused){
                    icon.className = 'fas fa-play';
                } else {
                    icon.className = 'fas fa-pause';
                }
            }
        };
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(audio.paused){
                audio.play().catch(err => console.log(err));
            } else {
                audio.pause();
            }
            updatePlayPauseIcon();
        });
        
        audio.addEventListener('play', updatePlayPauseIcon);
        audio.addEventListener('pause', updatePlayPauseIcon);
        updatePlayPauseIcon();
    }
    
    // Volume slider functionality
    if(volumeSlider && audio){
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audio.volume = val;
            if(audio.muted) audio.muted = false;
        });
    }
    
    syncVideoWithAudio();
})();