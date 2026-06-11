/**
 * Dejavu Digital — Landing Page Interactions V2
 * Scroll animations, FAQ accordion, mobile menu, navbar scroll effect
 */

document.addEventListener('DOMContentLoaded', () => {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ═══════════════════════════════════
    // 1. SMOOTH SCROLLING (+ gestion du focus clavier)
    // ═══════════════════════════════════
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.setAttribute('aria-label', 'Ouvrir le menu');
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target === '#') return;

            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                closeMobileMenu();

                const offset = 112;
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });

                // Le focus clavier suit la navigation
                el.setAttribute('tabindex', '-1');
                el.focus({ preventScroll: true });
            }
        });
    });

    // ═══════════════════════════════════
    // 2. NAVBAR + TOP BAR — EFFET AU SCROLL
    // ═══════════════════════════════════
    const navbar = document.getElementById('navbar');
    const topBar = document.getElementById('top-bar');

    const handleScroll = () => {
        const scrolled = window.scrollY > 40;
        navbar.classList.toggle('scrolled', scrolled);
        // La top-bar s'efface quand la navbar remonte (évite la superposition)
        if (topBar) topBar.classList.toggle('hidden', scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ═══════════════════════════════════
    // 3. MOBILE MENU (aria + fermeture Échap)
    // ═══════════════════════════════════
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const open = mobileMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', String(open));
            mobileToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
                mobileToggle.focus();
            }
        });
    }

    // ═══════════════════════════════════
    // 4. INTERSECTION OBSERVER — Reveal on Scroll
    // ═══════════════════════════════════
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Trigger for elements already in viewport on load
    requestAnimationFrame(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
                revealObserver.unobserve(el);
            }
        });
    });

    // ═══════════════════════════════════
    // 5. FAQ ACCORDION
    // ═══════════════════════════════════
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            item.classList.toggle('open');
            btn.setAttribute('aria-expanded', !isOpen);
        });
    });

    // ═══════════════════════════════════
    // 6. ROTATING WORD IN HERO SLOGAN
    //    (largeur réservée par le sizer CSS → zéro reflow ;
    //     s'arrête après 2 cycles complets, sur « obtient »)
    // ═══════════════════════════════════
    const rotatingWord = document.getElementById('rotating-word');
    const words = ['obtient', 'détecte', 'décroche', 'sécurise'];

    if (rotatingWord && !reduceMotion) {
        let wordIndex = 0;
        let rotations = 0;
        const maxRotations = words.length * 2;

        const timer = setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            rotations++;

            rotatingWord.classList.remove('word-fade-in');
            rotatingWord.classList.add('word-fade-out');

            setTimeout(() => {
                rotatingWord.textContent = words[wordIndex];
                rotatingWord.classList.remove('word-fade-out');
                rotatingWord.classList.add('word-fade-in');
            }, 300);

            if (rotations >= maxRotations && wordIndex === 0) {
                clearInterval(timer);
            }
        }, 3500);
    }

    // ═══════════════════════════════════
    // 6 bis. COMPTEURS DE STATS (une seule fois, à l'apparition)
    // ═══════════════════════════════════
    const heroStats = document.querySelector('.hero-stats');

    if (heroStats && !reduceMotion) {
        const animateValue = (el) => {
            const text = el.textContent;
            const match = text.match(/^(\d+)/);
            if (!match) return;
            const target = parseInt(match[1], 10);
            if (target === 0) return;
            const suffix = text.slice(match[1].length);
            const duration = 900;
            let start = null;
            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const statsObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroStats.querySelectorAll('.stat-value').forEach(animateValue);
                    obs.disconnect();
                }
            });
        }, { threshold: 0.4 });

        statsObserver.observe(heroStats);
    }

    // ═══════════════════════════════════
    // 7. STICKY MOBILE CTA
    // ═══════════════════════════════════
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCta && heroSection && window.innerWidth <= 768) {
        stickyCta.classList.add('shown');

        const stickyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                stickyCta.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        stickyObserver.observe(heroSection);
    }

    // ═══════════════════════════════════
    // 8. SPOTLIGHT CARD EFFECT (DESKTOP)
    // ═══════════════════════════════════
    if (window.innerWidth > 768 && !reduceMotion) {
        const spotlightCards = document.querySelectorAll(
            '.pain-card, .result-card, .testimonial-card, .niveau-card, .engagement-card'
        );

        spotlightCards.forEach(card => {
            card.classList.add('spotlight-card');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--spotlight-x', x + 'px');
                card.style.setProperty('--spotlight-y', y + 'px');
            });
        });

        // Update the pseudo-element position via CSS custom properties
        const spotlightStyle = document.createElement('style');
        spotlightStyle.textContent = `
            .spotlight-card::before {
                left: var(--spotlight-x, 50%);
                top: var(--spotlight-y, 50%);
            }
        `;
        document.head.appendChild(spotlightStyle);
    }
});
