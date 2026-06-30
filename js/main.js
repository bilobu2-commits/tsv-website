/**
 * TSV Volleyball Neutraubling - Main JavaScript
 * Slider, Navigation, Header-Effekte
 */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 1. HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ========================================
    // 2. MOBILE NAV TOGGLE
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navList.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // Mobile dropdown toggle (für Touch-Geräte)
    document.querySelectorAll('.nav__item--has-dropdown > .nav__link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = link.parentElement;
                parent.classList.toggle('open');
            }
        });
    });

    // ========================================
    // 3. HERO SLIDER
    // ========================================
    const slides = document.querySelectorAll('.hero__slide');
    const dotsContainer = document.querySelector('.hero__dots');
    const prevBtn = document.querySelector('.hero__btn--prev');
    const nextBtn = document.querySelector('.hero__btn--next');
    let currentSlide = 0;
    let slideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('span');

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startSlider() {
        stopSlider();
        slideInterval = setInterval(nextSlide, 6000);
    }

    function stopSlider() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlider(); // restart interval
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlider(); // restart interval
    });

    // Pause on hover
    const hero = document.getElementById('hero');
    hero.addEventListener('mouseenter', stopSlider);
    hero.addEventListener('mouseleave', startSlider);

    // Init
    goToSlide(0);
    startSlider();

    // ========================================
    // 4. SPONSORS SLIDER (Duplizieren für Endlos-Loop)
    // ========================================
    const sponsorsTrack = document.getElementById('sponsorsTrack');
    
    // Duplicate sponsors for seamless loop
    if (sponsorsTrack) {
        const items = sponsorsTrack.querySelectorAll('.sponsor-item');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            sponsorsTrack.appendChild(clone);
        });
    }

    // ========================================
    // 5. SMOOTH ANCHOR SCROLLING
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // 6. INTERSECTION OBSERVER (für Animationen)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for fade-in
    document.querySelectorAll('.news__card, .team-card, .camp__inner, .schedule__card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    console.log('🏐 TSV Volleyball Neutraubling - Seite geladen ✅');
});