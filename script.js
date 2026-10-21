const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 스크롤 진행 바 + 네비게이션 배경 */
const progressBar = document.getElementById('scrollProgress');
const navbar = document.querySelector('.navbar');

function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progressBar.style.width = `${Math.min(ratio, 1) * 100}%`;
    navbar.classList.toggle('scrolled', window.scrollY > 8);
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        onScroll();
        ticking = false;
    });
}, { passive: true });
onScroll();

/* 현재 섹션에 따라 네비게이션 활성화 */
const navLinks = [...document.querySelectorAll('.nav-links a')];
const linkById = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
const watched = [...document.querySelectorAll('section[id]')].filter(s => linkById.has(s.id));

const visible = new Set();

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
    });

    const current = watched.find(s => visible.has(s.id));
    navLinks.forEach(a => {
        a.classList.remove('is-active');
        a.removeAttribute('aria-current');
    });
    if (current) {
        const activeLink = linkById.get(current.id);
        activeLink.classList.add('is-active');
        activeLink.setAttribute('aria-current', 'location');
    }
}, { rootMargin: '-45% 0px -50% 0px' });

watched.forEach(s => navObserver.observe(s));

/* 해시로 이동한 대상은 페이드인을 기다리지 않고 즉시 노출 */
function getHashTarget(hash) {
    if (!hash || hash === '#') return null;
    try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
        return null;
    }
}

function revealHashTarget() {
    const target = getHashTarget(location.hash);
    if (target) target.classList.add('visible');
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
        const target = getHashTarget(a.getAttribute('href'));
        if (target) target.classList.add('visible');
    });
});

window.addEventListener('hashchange', revealHashTarget);
revealHashTarget();

/* 스크롤 진입 시 페이드 인 */
const revealTargets = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add('visible'));
} else {
    document.documentElement.classList.add('js');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
}
