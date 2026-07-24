/**
 * TSV Volleyball Neutraubling - Main JavaScript
 * Slider, Navigation, Header-Effekte
 */

// Theme so früh wie möglich anwenden (vor DOMContentLoaded), um Flackern zu minimieren.
// Ohne gespeicherte Wahl gilt das Farbschema des Betriebssystems/Browsers als Default.
const storedTheme = localStorage.getItem('tsv-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
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
    // 3b. HERO-VIDEO IN SLOW-MOTION
    // ========================================
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.playbackRate = 0.5;
        heroVideo.addEventListener('loadedmetadata', () => {
            heroVideo.playbackRate = 0.5;
        });
    }

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

    // ========================================
    // 7. HERREN 1 - LIVE TABELLE
    // ========================================
    const tabelleBody = document.querySelector('#herren-1-tabelle tbody');
    const tabelleStatus = document.getElementById('herren-1-tabelle-status');

    if (tabelleBody) {
        const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));

        fetch('data/herren-1-tabelle.json', { cache: 'no-store' })
            .then((res) => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then((data) => {
                if (!data.rows || !data.rows.length) throw new Error('Keine Daten');

                tabelleBody.innerHTML = data.rows.map((row) => `
                    <tr class="${row.isOwnTeam ? 'league-table__row--own' : ''}">
                        <td>${escapeHtml(row.rank)}</td>
                        <td>${escapeHtml(row.team)}</td>
                        <td>${escapeHtml(row.played)}</td>
                        <td>${escapeHtml(row.won)}</td>
                        <td>${escapeHtml(row.lost)}</td>
                        <td><strong>${escapeHtml(row.points)}</strong></td>
                        <td>${escapeHtml(row.setsRatio)}</td>
                        <td>${escapeHtml(row.ballsRatio)}</td>
                    </tr>
                `).join('');

                if (tabelleStatus) {
                    const updated = new Date(data.updatedAt);
                    const datum = updated.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const uhrzeit = updated.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                    tabelleStatus.textContent = `Stand: ${datum}, ${uhrzeit} Uhr`;
                }
            })
            .catch(() => {
                tabelleBody.innerHTML = '<tr><td colspan="8" class="league-table__empty">Tabelle konnte nicht geladen werden.</td></tr>';
                if (tabelleStatus) tabelleStatus.textContent = 'Aktuelle Tabelle direkt auf volleyball.bayern:';
            });
    }

    console.log('🏐 TSV Volleyball Neutraubling - Seite geladen ✅');
});