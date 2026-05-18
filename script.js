document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${current}` ? '#e6edf3' : '';
    });
});
