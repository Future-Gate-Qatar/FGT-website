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

// Clients Slider
const track = document.getElementById('clientsTrack');
const prevArrow = document.querySelector('.clients-prev');
const nextArrow = document.querySelector('.clients-next');
let clientPos = 0;
const logoWidth = 185; // 160px + 25px gap
const visibleCount = Math.floor(document.getElementById('clientsSlider').offsetWidth / logoWidth);
const totalLogos = track.children.length;
const maxPos = totalLogos - visibleCount;

function updateSlider() {
    track.style.transform = `translateX(-${clientPos * logoWidth}px)`;
}

nextArrow.addEventListener('click', () => {
    clientPos = clientPos >= maxPos ? 0 : clientPos + 1;
    updateSlider();
});

prevArrow.addEventListener('click', () => {
    clientPos = clientPos <= 0 ? maxPos : clientPos - 1;
    updateSlider();
});

// Auto-scroll clients
setInterval(() => {
    clientPos = clientPos >= maxPos ? 0 : clientPos + 1;
    updateSlider();
}, 3000);
