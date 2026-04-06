// 404.js - Additional functionality specific to the 404 page

// Smooth entrance animation for 404 page
window.addEventListener('load', () => {
    const wrapper = document.querySelector('.error-wrapper');
    if (wrapper) {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(20px)';
        wrapper.style.transition = 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        setTimeout(() => {
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate 404 elements with GSAP if available
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.error-code', 
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(0.5)" }
        );
        gsap.fromTo('.error-title', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
        );
        gsap.fromTo('.error-message', 
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.35 }
        );
        gsap.fromTo('.glow-card', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
        );
        gsap.fromTo('.quick-links .quick-link', 
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.7 }
        );
    }
});

// Handle logo click
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        window.location.href = '/';
    });
}

// Mobile menu handling
const mobileBtn404 = document.getElementById('mobileMenuBtn');
const navLinks404 = document.getElementById('navLinks');

if (mobileBtn404) {
    mobileBtn404.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks404.classList.toggle('active');
        const icon = mobileBtn404.querySelector('i');
        if (navLinks404.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

document.addEventListener('click', (e) => {
    if (navLinks404 && navLinks404.classList.contains('active')) {
        if (!navLinks404.contains(e.target) && !mobileBtn404.contains(e.target)) {
            navLinks404.classList.remove('active');
            const icon = mobileBtn404.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
});

// Navbar scroll effect
const navbar404 = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (navbar404) {
        if (window.scrollY > 20) {
            navbar404.classList.add('scrolled');
        } else {
            navbar404.classList.remove('scrolled');
        }
    }
});

// Cursor glow - FIXED positioning
const cursorGlow404 = document.getElementById('cursorGlow');
if (cursorGlow404) {
    document.addEventListener('mousemove', (e) => {
        // Fixed: Apply translate directly without extra offset since CSS already has -50%
        cursorGlow404.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}

// Particles generation for 404 page
function createParticle404() {
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
    if (document.querySelectorAll('.particle').length < 25) createParticle404();
}, 2500);

for (let i = 0; i < 10; i++) setTimeout(() => createParticle404(), i * 400);