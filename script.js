// Force scroll to top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Hero Slider
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 3000);

// Cookie Popup
const cookieOverlay = document.getElementById('cookieOverlay');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (localStorage.getItem('cookieConsent')) {
    cookieOverlay.style.display = 'none';
}

cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieOverlay.style.display = 'none';
});

cookieDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieOverlay.style.display = 'none';
});
