// ─── NAVBAR SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── FADE IN ON SCROLL ───
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            e.target.style.transitionDelay = (i * 0.08) + 's';
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── COUNT UP ANIMATION ───
function animateCount(el) {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
    }, 25);
}
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('[data-target]').forEach(animateCount);
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── ROLE TABS ───
function switchRole(role, btn) {
    // Deactivate all tabs
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    // Hide all panels
    ['owner', 'supervisor', 'worker', 'lender'].forEach(r => {
        const panel = document.getElementById('panel-' + r);
        if (panel) panel.style.display = 'none';
    });
    // Show selected
    const panel = document.getElementById('panel-' + role);
    if (panel) panel.style.display = 'grid';
}

// ─── PRICING TOGGLE ───
const prices = {
    monthly: { starter: '$49<span>/mo</span>', pro: '$149<span>/mo</span>' },
    annual: { starter: '$39<span>/mo</span>', pro: '$119<span>/mo</span>' }
};
function toggleBilling(input) {
    const plan = input.checked ? 'annual' : 'monthly';
    document.getElementById('price-starter').innerHTML = prices[plan].starter;
    document.getElementById('price-pro').innerHTML = prices[plan].pro;
    document.getElementById('discount-badge').style.display = input.checked ? 'inline-block' : 'none';
}

// ─── GSAP TESTIMONIALS CAROUSEL ───
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, Draggable);

    const track = document.querySelector('.testi-track');
    const container = document.querySelector('.testi-carousel');
    const nextBtn = document.querySelector('.testi-nav.next');
    const prevBtn = document.querySelector('.testi-nav.prev');

    if (!track) return;

    // Calculate bounds
    const updateBounds = () => {
        const trackWidth = track.offsetWidth;
        const containerWidth = container.offsetWidth;
        return containerWidth - trackWidth;
    };

    let minX = updateBounds();

    const drag = Draggable.create(track, {
        type: "x",
        edgeResistance: 0.65,
        bounds: { minX: minX, maxX: 0 },
        inertia: true,
        onDragStart: function() {
            gsap.set(track, { cursor: 'grabbing' });
        },
        onDragEnd: function() {
            gsap.set(track, { cursor: 'grab' });
        }
    })[0];

    // Button Navigation
    const slideAmount = 680; // Match new standard card width + gap

    nextBtn.addEventListener('click', () => {
        let targetX = drag.x - slideAmount;
        if (targetX < minX) targetX = minX;
        gsap.to(track, { x: targetX, duration: 0.6, ease: "power2.out", onUpdate: () => drag.update() });
    });

    prevBtn.addEventListener('click', () => {
        let targetX = drag.x + slideAmount;
        if (targetX > 0) targetX = 0;
        gsap.to(track, { x: targetX, duration: 0.6, ease: "power2.out", onUpdate: () => drag.update() });
    });

    // Update bounds on resize
    window.addEventListener('resize', () => {
        minX = updateBounds();
        drag.applyBounds({ minX: minX, maxX: 0 });
    });
});
