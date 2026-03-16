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

// Form submission via Web3Forms
document.getElementById('supplierForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const form = e.target;

    // Build JSON payload from form fields (skip files)
    const data = {
        access_key: '98a0e564-0085-4474-ab7c-a1f7999a2c14',
        subject: 'New Supplier Registration Form Submission',
        from_name: 'FGT Supplier Registration'
    };

    // Collect all text/select/date/email/tel inputs
    const inputs = form.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="hidden"]), select, textarea');
    inputs.forEach(input => {
        if (input.name && input.value) {
            data[input.name] = input.value;
        }
    });

    // Collect checkboxes
    const checked = form.querySelectorAll('input[type="checkbox"]:checked');
    const products = [];
    checked.forEach(cb => {
        if (cb.name === 'products[]') products.push(cb.value);
    });
    if (products.length > 0) data['Products/Services'] = products.join(', ');

    // Collect file names
    const fileInputs = form.querySelectorAll('input[type="file"]');
    const fileNames = [];
    fileInputs.forEach(input => {
        if (input.files.length > 0) {
            fileNames.push(input.files[0].name);
        }
    });
    if (fileNames.length > 0) data['Uploaded Documents'] = fileNames.join(', ');

    data['Signature'] = 'Signed digitally';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Web3Forms response:', result);

        if (result.success) {
            alert('Thank you! Your supplier registration has been submitted successfully. We will review your application and contact you soon.');
            form.reset();
            const canvas = document.getElementById('signatureCanvas');
            if (canvas) {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            }
            currentPage = 1;
            showPage(1);
        } else {
            alert('Error: ' + (result.message || 'Unknown error. Please contact buyer@futuregatetrading.com'));
            console.error('Web3Forms error:', result);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('There was an error submitting the form. Please try again or contact us directly at buyer@futuregatetrading.com');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
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
