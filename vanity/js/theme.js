// js/theme.js
(function(){
    const getStoredTheme = () => localStorage.getItem('theme');
    const setTheme = (theme) => {
        const html = document.documentElement;
        if(theme === 'dark'){
            html.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        // Update theme toggle icon after theme change
        updateThemeIcon();
    };
    
    const updateThemeIcon = () => {
        const themeToggle = document.querySelector('.theme-toggle');
        if(!themeToggle) return;
        const isDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" style="font-size: 1.2rem;"></i>' : '<i class="fas fa-moon" style="font-size: 1.2rem;"></i>';
    };
    
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(stored === 'dark' || (!stored && prefersDark)){
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // Remove existing theme toggle if any
    const existingToggle = document.querySelector('.theme-toggle');
    if(existingToggle) existingToggle.remove();
    
    // Create theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    document.body.appendChild(themeToggle);
    updateThemeIcon();
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = document.body.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    });
})();