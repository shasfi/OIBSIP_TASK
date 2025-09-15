// Select all animated elements
const animatedElements = document.querySelectorAll(".animate, .fade-in, .slide-left, .slide-right");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show"); // bar bar animation ke liye
        }
    });
}, { threshold: 0.2 });

animatedElements.forEach(el => observer.observe(el));