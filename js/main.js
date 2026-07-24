/**
 * TSV Volleyball Neutraubling - Main JavaScript
 * Slider, Navigation, Header-Effekte
 */

// Theme so früh wie möglich anwenden (vor DOMContentLoaded), um Flackern zu minimieren
if (localStorage.getItem('tsv-theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 1. DARK MODE TOGGLE
    // ========================================
    const root = document.documentElement;
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.type = 'button';
    themeToggle.setAttribute('aria-label', 'Dark Mode umschalten');

    function updateToggleIcon() {
        const isDark = root.getAttribute('data-theme') === 'dark';
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    updateToggleIcon();

    themeToggle.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
            root.removeAttribute('data-theme');
            localStorage.setItem('tsv-theme', 'light');
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('tsv-theme', 'dark');
        }
        updateToggleIcon();
    });

    const headerSocial = document.querySelector('.header__social');
    if (headerSocial) {
        headerSocial.prepend(themeToggle);
    }

    // ========================================
    // 2. HEADER SCROLL EFFECT
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
    // 3. MOBILE NAV TOGGLE
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

    // Teams-Dropdown: Damen/Herren/Mixed & Freizeit/Jugend per Klick auf- und zuklappen
    document.querySelectorAll('.nav__dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle.parentElement.classList.toggle('open');
        });
    });

    // Trainingszeiten-Akkordeon: Damen/Herren/Mixed & Freizeit/Jugend per Klick auf- und zuklappen
    document.querySelectorAll('.training-accordion__toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.closest('.training-accordion__item').classList.toggle('open');
        });
    });

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