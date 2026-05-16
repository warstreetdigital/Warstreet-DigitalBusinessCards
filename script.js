document.addEventListener('DOMContentLoaded', () => {
    // Initial reveal animations
    const revealElements = [
        { el: document.querySelector('.hero-title'), delay: 600 },
        { el: document.querySelector('.hero-subtitle'), delay: 900 },
        { el: document.querySelector('.hero-description'), delay: 1100 },
        { el: document.querySelector('.cta-button'), delay: 1300 }
    ];

    revealElements.forEach(({ el, delay }) => {
        if (!el) return;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) skewY(0)';
            el.classList.add('active');
        }, delay);
    });

    // Magnetic interaction for buttons and cards
    const magneticElements = document.querySelectorAll('.cta-button, .card-link, .cta-whatsapp, .cta-call, .deployment-cta');
    const cards = document.querySelectorAll('.experience-card');
    const deploymentBlocks = document.querySelectorAll('.deployment-block');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            card.style.transform = `translateY(-30px) scale(1.02) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
            
            // Move atmosphere slightly too
            const atmosphere = card.querySelector('.card-atmosphere');
            if (atmosphere) {
                atmosphere.style.transform = `scale(1.15) translate(${x * 40}px, ${y * 40}px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = ``;
            const atmosphere = card.querySelector('.card-atmosphere');
            if (atmosphere) atmosphere.style.transform = ``;
        });
    });

    // Deployment Modules & Modal System
    const deploymentModules = document.querySelectorAll('.deployment-module');
    const modal = document.querySelector('#deployment-modal');
    const modalTitle = document.querySelector('#modal-title');
    const modalDesc = document.querySelector('#modal-description');
    const modalVisuals = document.querySelector('#modal-visuals');
    const modalClose = document.querySelector('#modal-close');

    const deploymentData = {
        showroom: {
            title: "Live Environments",
            desc: "Immersive visual documentation of Warstreet systems operational in restaurants, nightlife environments, and vision-driven venues.",
            images: [
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/file_000000009ce071f6a721558a9aa0db9f.png",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/file_00000000c38871f6a209be9bc86d9b9e.png",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/file_00000000e754722faf25e7b8c97c4e4d.png",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/file_00000000912c71f68c5d11a8fd1b8d3e.png",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/7ae5fb8505f495d210f68ba9d8d093d5.jpg",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/44eb4fbc3e3df9f262e501541a7afc09.jpg",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/14a9fbf6a0beec70fe38d5d07eac3acd.jpg",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/fbc0aaee882e9a6ce1cdedda0bf6dcde.jpg",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/b9bab6d2308e2b78190a77356454999d.jpg",
                "https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Warstreetbusinesscards/a916cc6fcf7b6446684d1e75ae7e1d59.jpg"
            ]
        }
    };

    deploymentModules.forEach(module => {
        module.addEventListener('click', () => {
            const type = module.dataset.type;
            const data = deploymentData[type];
            
            if (!data) return;

            // Populate Modal
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;
            modalVisuals.innerHTML = data.images.map(img => `
                <div class="modal-img-wrapper">
                    <img src="${img}" alt="${data.title}">
                </div>
            `).join('');

            // Open Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Setup observation for modal images
            setTimeout(() => {
                const modalImages = modalVisuals.querySelectorAll('.modal-img-wrapper');
                const modalObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                        }
                    });
                }, { threshold: 0.2 });

                modalImages.forEach(img => modalObserver.observe(img));
            }, 500);
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear visuals after transition
        setTimeout(() => {
            modalVisuals.innerHTML = '';
        }, 800);
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-container')) {
                closeModal();
            }
        });
    }

    // Scroll reveal logic
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.experience-card, .bullet-item, .section-title, .why-title, .why-description, .contact-name, .contact-subtitle, .cta-whatsapp, .cta-call, .section-tag, .label, .onboarding-item, .deployment-module, .section-intro');
    scrollElements.forEach(el => {
        el.classList.add('reveal');
        // Initial setup for those not in hero
        if (el.closest('.showcase-world')) {
            // Already observed in exploreBtn logic
        } else {
             // For footer etc
             observer.observe(el);
        }
    });

    // Parallax for background elements
    const handleParallax = () => {
        const scrolled = window.pageYOffset;
        const glow = document.querySelector('.ambient-glow');
        const coords = document.querySelector('.coordinates');
        const world = document.querySelector('.showcase-world');
        
        if (glow) {
            glow.style.transform = `translate3d(0, ${scrolled * 0.25}px, 0)`;
        }
        if (coords) {
            coords.style.transform = `translate3d(0, ${scrolled * -0.05}px, 0)`;
        }
        if (world && showcaseWorld.classList.contains('visible')) {
            // Subtle slow drift for background of showcase
            document.body.style.backgroundPosition = `0 ${scrolled * 0.2}px`;
        }
    };

    window.addEventListener('scroll', handleParallax);

    // Transition into Showcase World
    const exploreBtn = document.querySelector('#explore-cta');
    const showcaseWorld = document.querySelector('#showcase-world');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Activation sequence
            document.body.classList.add('activating');
            
            setTimeout(() => {
                document.body.classList.remove('system-locked');
                document.body.classList.remove('activating');
                document.body.classList.add('showcase-ready');
                showcaseWorld.classList.add('visible');
                
                const showcaseSection = document.querySelector('#showcase');
                if (showcaseSection) {
                    showcaseSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Observe showcase world elements
                const worldElements = showcaseWorld.querySelectorAll('.reveal');
                worldElements.forEach(el => observer.observe(el));
            }, 1200); // 1.2s activation
        });
    }

    // Interactive ambient glow follow on Hero
    const heroGlow = document.querySelector('.hero::before');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);

        if (heroGlow) {
            heroGlow.style.transform = `translate(${x * 60}px, ${y * 60}px)`;
        }
        
        // Push CSS variables for mesh gradient shift
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    });

    // Staggered reveal for bullets and onboarding
    const bullets = document.querySelectorAll('.bullet-item');
    bullets.forEach((bullet, index) => {
        bullet.style.transitionDelay = `${index * 0.15}s`;
    });

    const onboardingItems = document.querySelectorAll('.onboarding-item');
    onboardingItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
});
