document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Tabs Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    const bioContents = document.querySelectorAll('.bio-content');
    const presskitContents = document.querySelectorAll('.presskit-text');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            bioContents.forEach(c => c.classList.add('hidden'));
            presskitContents.forEach(c => c.classList.add('hidden'));

            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            document.getElementById(`bio-${lang}`).classList.remove('hidden');
            
            const presskitEl = document.getElementById(`presskit-${lang}`);
            if (presskitEl) {
                presskitEl.classList.remove('hidden');
            }
        });
    });

    // Smooth scroll for hero navigation buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 2. GSAP Animations Setup
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- 3D Scroll Canvas Logic ---
        const canvas = document.getElementById("hero-lightpass");
        const context = canvas.getContext("2d");

        // Canvas em 16:9 para cobrir a largura da tela
        // O vídeo (649x1080) é desenhado centralizado dentro dele
        canvas.width = 1920;
        canvas.height = 1080;

        const frameCount = 97;
        const imgW = 649;  // largura original do frame
        const imgH = 1080; // altura original do frame
        const offsetX = (canvas.width - imgW) / 2; // centraliza horizontalmente
        const currentFrame = index => `assets/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`;

        const images = [];
        const frames = { frame: 0 };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // Canvas auxiliar para amostrar cor de borda
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = 8;
        sampleCanvas.height = 8;
        const sampleCtx = sampleCanvas.getContext('2d');

        function sampleRegion(img, sx, sy) {
            sampleCtx.clearRect(0, 0, 8, 8);
            sampleCtx.drawImage(img, sx, sy, 8, 8, 0, 0, 8, 8);
            const data = sampleCtx.getImageData(0, 0, 8, 8).data;
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
            return [r / count, g / count, b / count];
        }

        function getEdgeColor(img) {
            // Amostra 6 regiões das bordas: 4 cantos + 2 laterais no meio
            const iw = img.naturalWidth || imgW;
            const ih = img.naturalHeight || imgH;
            const regions = [
                [2, 2],             // topo-esquerdo
                [iw - 10, 2],       // topo-direito
                [2, ih / 2],        // meio-esquerdo
                [iw - 10, ih / 2],  // meio-direito
                [2, ih - 10],       // baixo-esquerdo
                [iw - 10, ih - 10]  // baixo-direito
            ];
            let r = 0, g = 0, b = 0;
            regions.forEach(([sx, sy]) => {
                const [cr, cg, cb] = sampleRegion(img, sx, sy);
                r += cr; g += cg; b += cb;
            });
            const n = regions.length;
            return `rgb(${Math.round(r/n)}, ${Math.round(g/n)}, ${Math.round(b/n)})`;
        }

        images[0].onload = render;

        function render() {
            if (images[frames.frame]) {
                const w = canvas.width;
                const h = canvas.height;
                
                context.clearRect(0, 0, w, h);
                context.globalCompositeOperation = 'source-over';
                
                // Estende os pixels da borda esquerda do vídeo para a esquerda
                // Pega uma faixa de 2px da borda e estica para preencher
                context.drawImage(
                    images[frames.frame],
                    0, 0, 2, imgH,           // source: 2px da borda esquerda
                    0, 0, offsetX + 2, imgH   // destination: estica até a posição do vídeo
                );
                
                // Estende os pixels da borda direita do vídeo para a direita
                context.drawImage(
                    images[frames.frame],
                    imgW - 2, 0, 2, imgH,                    // source: 2px da borda direita
                    offsetX + imgW - 2, 0, offsetX + 2, imgH  // destination: estica até o fim
                );
                
                // Desenha o frame centralizado sobre as extensões
                context.drawImage(images[frames.frame], offsetX, 0, imgW, imgH);
                
                // Máscara lateral — só aplica em telas largas (desktop)
                if (window.innerWidth > 768) {
                    context.globalCompositeOperation = 'destination-in';
                    const grad = context.createLinearGradient(0, 0, w, 0);
                    grad.addColorStop(0,    'rgba(0,0,0,0)');
                    grad.addColorStop(0.05, 'rgba(0,0,0,0.02)');
                    grad.addColorStop(0.10, 'rgba(0,0,0,0.08)');
                    grad.addColorStop(0.15, 'rgba(0,0,0,0.18)');
                    grad.addColorStop(0.20, 'rgba(0,0,0,0.35)');
                    grad.addColorStop(0.25, 'rgba(0,0,0,0.55)');
                    grad.addColorStop(0.30, 'rgba(0,0,0,0.78)');
                    grad.addColorStop(0.35, 'rgba(0,0,0,0.95)');
                    grad.addColorStop(0.40, 'rgba(0,0,0,1)');
                    grad.addColorStop(0.60, 'rgba(0,0,0,1)');
                    grad.addColorStop(0.65, 'rgba(0,0,0,0.95)');
                    grad.addColorStop(0.70, 'rgba(0,0,0,0.78)');
                    grad.addColorStop(0.75, 'rgba(0,0,0,0.55)');
                    grad.addColorStop(0.80, 'rgba(0,0,0,0.35)');
                    grad.addColorStop(0.85, 'rgba(0,0,0,0.18)');
                    grad.addColorStop(0.90, 'rgba(0,0,0,0.08)');
                    grad.addColorStop(0.95, 'rgba(0,0,0,0.02)');
                    grad.addColorStop(1,    'rgba(0,0,0,0)');
                    context.fillStyle = grad;
                    context.fillRect(0, 0, w, h);
                }
                
                // Restaura composição padrão
                context.globalCompositeOperation = 'source-over';
            }
        }

        gsap.to(frames, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "+=200%",
                scrub: 0.5,
                pin: true
            },
            onUpdate: render
        });
        // ------------------------------
        // Hero Animation
        gsap.from('.hero-logo', {
            y: -30,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.2
        });
        
        gsap.from('.nav-circle-btn', {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
            delay: 0.8
        });

        gsap.from('.hero-social-icons a', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(2)",
            delay: 1.4
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
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
});
