// 0. Force scroll to top IMMEDIATELY
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Clear hash if present to prevent jump
if (window.location.hash) {
    window.location.hash = '';
}

document.addEventListener('DOMContentLoaded', () => {
    // Double check scroll to top
    window.scrollTo(0, 0);

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    // Ensure Lenis starts at top
    lenis.scrollTo(0, { immediate: true });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // 2. Custom Cursor Logic
    const cursor = document.querySelector('#custom-cursor');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('.mag-btn, .project-card, a');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            if (el.classList.contains('project-card')) {
                cursor.innerHTML = 'VIEW';
            }
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.innerHTML = '';
        });
    });

    // 3. Magnetic Effect (Dennis Snellenberg Style)
    const magButtons = document.querySelectorAll('.mag-btn');

    magButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const boundingRect = btn.getBoundingClientRect();
            const relX = e.clientX - boundingRect.left;
            const relY = e.clientY - boundingRect.top;

            gsap.to(btn, {
                x: (relX - boundingRect.width / 2) * 0.4,
                y: (relY - boundingRect.height / 2) * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 4. Reveal Animations (GSAP ScrollTrigger)
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Image Reveal Effect
    gsap.utils.toArray('.project-card img').forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                scrub: true
            },
            scale: 1.3,
            ease: 'none'
        });
    });

    // --- Modal Implementation ---
    const modal = document.querySelector('#project-modal');
    const modalContainer = document.querySelector('.modal-container');
    const closeBtn = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card');

    const openModal = (card) => {
        const data = card.dataset;

        // Populate
        document.querySelector('#modal-title').textContent = data.title;
        document.querySelector('#modal-desc').innerHTML = data.desc;
        document.querySelector('#modal-tech').textContent = data.tech;
        document.querySelector('#modal-img').src = data.img;

        // Links
        const github = document.querySelector('#modal-github');
        const live = document.querySelector('#modal-live');

        if (data.github) { github.href = data.github; github.style.display = 'flex'; }
        else { github.style.display = 'none'; }

        if (data.live) { live.href = data.live; live.style.display = 'flex'; }
        else { live.style.display = 'none'; }

        // Animate In
        modal.style.display = 'flex';
        gsap.to(modal, { opacity: 1, duration: 0.4 });
        gsap.fromTo(modalContainer,
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
        );

        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        gsap.to(modalContainer, { y: 20, opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in' });
        gsap.to(modal, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    // 5. Skill Bar Animations
    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 95%',
                toggleActions: 'play none none none'
            },
            width: bar.dataset.width,
            duration: 1.5,
            ease: "power3.out"
        });
    });

    // 6. Timeline Stagger
    gsap.utils.toArray('.timeline-group').forEach(group => {
        gsap.from(group.querySelectorAll('.timeline-item'), {
            scrollTrigger: {
                trigger: group,
                start: 'top 80%',
            },
            x: -30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    });
});

// Final fallback to ensure top scroll after everything loads
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});
