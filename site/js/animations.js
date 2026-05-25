document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Tabs Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    const bioContents = document.querySelectorAll('.bio-content');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            langBtns.forEach(b => b.classList.remove('active'));
            bioContents.forEach(c => c.classList.add('hidden'));

            // Add active to clicked
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            document.getElementById(`bio-${lang}`).classList.remove('hidden');
        });
    });

    // 2. GSAP Animations Setup (Fase 4 - Protocolo 10K)
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from('.hero-logo', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5
    });

    // Sections Entrance Animation
    const sections = gsap.utils.toArray('section:not(.hero-section)');
    
    sections.forEach(sec => {
        gsap.from(sec.querySelectorAll('.section-title, .container > div'), {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
});
