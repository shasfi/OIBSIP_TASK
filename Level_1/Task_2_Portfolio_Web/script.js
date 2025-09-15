// Scroll-based fade-up loop animation
const elements = document.querySelectorAll('.animate');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            entry.target.classList.remove('in-view');
        }
    });
}, { threshold: 0.2 });

elements.forEach(el => observer.observe(el));

// Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    if (document.body.classList.contains('light')) {
        toggleBtn.textContent = "☀️ Light";
    } else {
        toggleBtn.textContent = "🌙 Dark";
    }
});