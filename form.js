// Multi-step form navigation
const pages = document.querySelectorAll('.form-page');
const steps = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
let currentPage = 1;
const totalPages = pages.length;

function showPage(page) {
    pages.forEach(p => p.classList.remove('active'));
    steps.forEach(s => s.classList.remove('active'));

    document.querySelector(`.form-page[data-page="${page}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${page}"]`).classList.add('active');

    // Mark completed steps
    steps.forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        if (stepNum < page) {
            s.classList.add('completed');
        } else {
            s.classList.remove('completed');
        }
    });

    prevBtn.style.display = page === 1 ? 'none' : 'flex';
    nextBtn.style.display = page === totalPages ? 'none' : 'flex';
    submitBtn.style.display = page === totalPages ? 'flex' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

// Form submission
document.getElementById('supplierForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Your supplier registration has been submitted successfully. We will review your application and contact you soon.');
    e.target.reset();
    currentPage = 1;
    showPage(1);
});

// Signature Canvas
const canvas = document.getElementById('signatureCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => { drawing = false; });
    canvas.addEventListener('mouseout', () => { drawing = false; });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    canvas.addEventListener('touchend', () => { drawing = false; });

    document.getElementById('clearSignature').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
