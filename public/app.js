// Synthia Frontend — interactive landing page

(function () {
    'use strict';

    /* ───────── Starfield ───────── */
    const canvas = document.getElementById('starfield');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const STAR_COUNT_DESKTOP = 180;
        const STAR_COUNT_MOBILE = 80;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
            const count = window.innerWidth < 700 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.4 + 0.2,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05,
                a: Math.random() * 0.7 + 0.3,
                twinkle: Math.random() * 0.02 + 0.005,
                phase: Math.random() * Math.PI * 2,
            }));
        }
        resize();
        window.addEventListener('resize', resize);

        function draw(t) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const s of stars) {
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < 0) s.x = window.innerWidth;
                if (s.x > window.innerWidth) s.x = 0;
                if (s.y < 0) s.y = window.innerHeight;
                if (s.y > window.innerHeight) s.y = 0;

                const flicker = Math.sin(t * s.twinkle + s.phase) * 0.4 + 0.6;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(240, 198, 108, ${s.a * flicker})`;
                ctx.fill();
            }
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }

    /* ───────── Nav scroll + burger ───────── */
    const nav = document.getElementById('nav');
    const burger = document.getElementById('nav-burger');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
    }

    /* ───────── Reveal on scroll ───────── */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('is-visible'));
    }

    /* ───────── Episode card pointer glow ───────── */
    document.querySelectorAll('.episode-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ───────── Typewriter ───────── */
    const tw = document.getElementById('typewriter');
    if (tw) {
        const lines = [
            "You're not hard to love. You're just hard to fool.",
            "Access is not affection. Attention is not investment.",
            "If he only respects you when he wants something, it's not respect. It's strategy.",
            "You don't earn loyalty by being easy. You earn it by being unforgettable.",
            "Stop confusing breadcrumbs for a meal.",
        ];
        let lineIdx = 0, charIdx = 0, deleting = false;
        function tick() {
            const line = lines[lineIdx];
            if (!deleting) {
                charIdx++;
                tw.textContent = line.slice(0, charIdx);
                if (charIdx === line.length) { deleting = true; setTimeout(tick, 2200); return; }
            } else {
                charIdx--;
                tw.textContent = line.slice(0, charIdx);
                if (charIdx === 0) { deleting = false; lineIdx = (lineIdx + 1) % lines.length; setTimeout(tick, 350); return; }
            }
            setTimeout(tick, deleting ? 25 : 55);
        }
        tick();
    }

    /* ───────── Insight form ───────── */
    const form = document.getElementById('insight-form');
    const topicInput = document.getElementById('topic-input');
    const loading = document.getElementById('insight-loading');
    const result = document.getElementById('insight-result');
    const textEl = document.getElementById('insight-text');
    const reflectionEl = document.getElementById('insight-reflection');
    const reflectionText = document.getElementById('reflection-text');
    const ctaEl = document.getElementById('insight-cta');
    const ctaText = document.getElementById('cta-text');
    const newBtn = document.getElementById('new-insight-btn');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('copy-toast');
    const loadingLine = document.getElementById('loading-line');

    if (!form) return;

    const loadingMessages = [
        "Synthia is formulating her response...",
        "Reading between your lines...",
        "Pulling truth from the cosmos...",
        "Almost there. Don't overthink it.",
    ];
    let loadingTimer = null;

    function startLoading() {
        if (loadingTimer) clearInterval(loadingTimer);
        let i = 0;
        loadingLine.textContent = loadingMessages[0];
        loadingTimer = setInterval(() => {
            i = (i + 1) % loadingMessages.length;
            loadingLine.textContent = loadingMessages[i];
        }, 1800);
    }
    function stopLoading() {
        if (loadingTimer) { clearInterval(loadingTimer); loadingTimer = null; }
    }

    function showResult(data) {
        textEl.textContent = data.insight || 'Synthia stayed quiet this time. Try again.';
        if (data.reflection) {
            reflectionText.textContent = data.reflection;
            reflectionEl.hidden = false;
        } else {
            reflectionEl.hidden = true;
        }
        if (data.cta) {
            ctaText.textContent = data.cta;
            ctaEl.hidden = false;
        } else {
            ctaEl.hidden = true;
        }
        result.hidden = false;
        result.dataset.insight = textEl.textContent;
    }

    function resetForm() {
        result.hidden = true;
        form.style.display = 'flex';
        topicInput.value = '';
        topicInput.focus();
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;

        form.style.display = 'none';
        result.hidden = true;
        loading.hidden = false;
        startLoading();

        try {
            const resp = await fetch('/api/insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });
            const data = await resp.json();
            stopLoading();
            loading.hidden = true;
            if (!resp.ok || data.error) {
                showResult({ insight: '⚠️ ' + (data.error || 'Synthia is temporarily unavailable. Try again in a moment.') });
            } else {
                showResult(data);
            }
        } catch (err) {
            stopLoading();
            loading.hidden = true;
            showResult({ insight: '⚠️ Synthia is temporarily unavailable. Try again in a moment.' });
            console.error('Insight error:', err);
        }
    });

    if (newBtn) newBtn.addEventListener('click', resetForm);

    if (copyBtn && toast) {
        copyBtn.addEventListener('click', async () => {
            const txt = result.dataset.insight || textEl.textContent || '';
            try {
                await navigator.clipboard.writeText(txt);
            } catch {
                const ta = document.createElement('textarea');
                ta.value = txt;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); } catch {}
                ta.remove();
            }
            toast.hidden = false;
            setTimeout(() => { toast.hidden = true; }, 1800);
        });
    }

    document.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            topicInput.value = chip.dataset.topic || chip.textContent;
            topicInput.focus();
        });
    });
})();
