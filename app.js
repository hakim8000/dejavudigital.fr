/**
 * Dejavu Digital — Landing Page Interactions
 * Scroll animations, FAQ accordion, mobile menu, navbar scroll effect
 */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════
    // 1. SMOOTH SCROLLING
    // ═══════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#') return;
            
            const el = document.querySelector(target);
            if (el) {
                // Close mobile menu if open
                mobileMenu.classList.remove('open');
                
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════
    // 2. NAVBAR SCROLL EFFECT
    // ═══════════════════════════════════
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ═══════════════════════════════════
    // 3. MOBILE MENU
    // ═══════════════════════════════════
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
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
    // 6. SUBTLE PARALLAX ON HERO ORBS
    // ═══════════════════════════════════
    const orbs = document.querySelectorAll('.gradient-orb');
    
    if (orbs.length && window.matchMedia('(min-width: 768px)').matches) {
        let ticking = false;
        
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;
                    
                    orbs.forEach((orb, i) => {
                        const factor = (i + 1) * 0.5;
                        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ═══════════════════════════════════
    // 7. ROTATING WORD IN HERO SLOGAN
    // ═══════════════════════════════════
    const rotatingWord = document.getElementById('rotating-word');
    const words = ['obtient', 'détecte', 'décroche', 'sécurise', 'négocie'];
    let wordIndex = 0;

    if (rotatingWord) {
        setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            
            rotatingWord.classList.remove('word-fade-in');
            rotatingWord.classList.add('word-fade-out');
            
            setTimeout(() => {
                rotatingWord.textContent = words[wordIndex];
                rotatingWord.classList.remove('word-fade-out');
                rotatingWord.classList.add('word-fade-in');
            }, 300);
        }, 3500);
    }

    // ═══════════════════════════════════
    // 8. STICKY MOBILE CTA
    // ═══════════════════════════════════
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCta && heroSection && window.innerWidth <= 768) {
        // Initially show as block but off-screen (translateY 100%)
        stickyCta.style.display = 'block';
        
        const stickyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        stickyObserver.observe(heroSection);
    }

    // ═══════════════════════════════════
    // 9. SPOTLIGHT CARD EFFECT (DESKTOP)
    // ═══════════════════════════════════
    if (window.innerWidth > 768) {
        const spotlightCards = document.querySelectorAll(
            '.pain-card, .result-card, .testimonial-card, .step-card, .engagement-card'
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

