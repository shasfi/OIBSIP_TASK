// Animate on scroll for sections + cards
const elements = document.querySelectorAll('.animate');

function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            el.classList.add('show');
        } else {
            el.classList.remove('show'); // repeat animation when scrolling up/down
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);