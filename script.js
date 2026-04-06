// script.js - Main interactive functionality

// Mobile menu toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinksEl = document.querySelector('.nav-links');

if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinksEl.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinksEl.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinksEl && navLinksEl.classList.contains('active')) {
        if (!navLinksEl.contains(e.target) && !mobileBtn.contains(e.target)) {
            navLinksEl.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Panel switching (SnipeX / Disinfecting)
const snipexPanel = document.getElementById('snipexPanel');
const disinfectingPanel = document.getElementById('disinfectingPanel');
const navButtons = document.querySelectorAll('.nav-links a[data-page]');

function showPanel(panelName) {
    if (panelName === 'snipex') {
        snipexPanel.classList.add('active-panel');
        disinfectingPanel.classList.remove('active-panel');
        window.location.hash = 'snipex';
    } else if (panelName === 'disinfecting') {
        disinfectingPanel.classList.add('active-panel');
        snipexPanel.classList.remove('active-panel');
        window.location.hash = 'disinfecting';
    }
    
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === panelName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger GSAP animations for the new panel
    setTimeout(() => {
        if (panelName === 'snipex') {
            gsap.fromTo('.plan-card', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, clearProps: "all" }
            );
        } else if (panelName === 'disinfecting') {
            gsap.fromTo('.feature-card', 
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, clearProps: "all" }
            );
            gsap.fromTo('.streaming-cta', 
                { opacity: 0, scale: 0.98 },
                { opacity: 1, scale: 1, duration: 0.5 }
            );
        }
    }, 100);
}

navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = btn.getAttribute('data-page');
        showPanel(page);
        
        if (navLinksEl.classList.contains('active')) {
            navLinksEl.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Logo click returns to SnipeX
const homeLogo = document.getElementById('homeLogo');
if (homeLogo) {
    homeLogo.addEventListener('click', () => showPanel('snipex'));
}

// Handle hash on page load
function handleHashOnLoad() {
    const hash = window.location.hash.substring(1);
    if (hash === 'disinfecting') {
        showPanel('disinfecting');
    } else {
        showPanel('snipex');
    }
}

// Smooth scroll for anchor links within SnipeX panel
document.querySelectorAll('#snipexPanel a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#plans" || href === "#howto") {
            const target = document.querySelector('#snipexPanel ' + href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.glass-nav')?.offsetHeight || 80;
                window.scrollTo({ 
                    top: target.offsetTop - navHeight - 20, 
                    behavior: 'smooth' 
                });
            }
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Cursor glow effect
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}

// GSAP animations on page load
window.addEventListener('load', () => {
    handleHashOnLoad();
    
    gsap.fromTo('.plan-card', 
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(0.4)" }
    );
    
    gsap.fromTo('.hero-badge', 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
    );
    gsap.fromTo('.hero h1', 
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.3 }
    );
    gsap.fromTo('.hero p', 
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.5 }
    );
    gsap.fromTo('.payment-methods .payment-chip', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.6 }
    );
    
    gsap.fromTo('.feature-card', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.3 }
    );
});

// Particles generation
function createParticle() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 50 + 20;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = Math.random() * 15 + 10 + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 20000);
}

setInterval(() => {
    if (document.querySelectorAll('.particle').length < 25) createParticle();
}, 2500);

for (let i = 0; i < 10; i++) setTimeout(() => createParticle(), i * 400);

// Smooth scroll for all internal hash links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        if (targetId && targetId !== 'snipex' && targetId !== 'disinfecting') {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.glass-nav')?.offsetHeight || 80;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
            }
        }
    });
});