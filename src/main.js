import './scene.js';

// Current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

// Fade sections in as they scroll into view
const targets = document.querySelectorAll('.section .container, .stat, .role, .card');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  targets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
}
