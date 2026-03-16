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

// Form submission via Azure Function + SendGrid
const FORM_API_URL = 'https://fgt-form-handler.azurewebsites.net/api/submitform';

document.getElementById('supplierForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const form = e.target;

    // Helper
    const getVal = (name) => {
        const el = form.querySelector(`[name="${name}"]`);
        return el ? el.value : '';
    };

    const products = Array.from(form.querySelectorAll('input[name="products[]"]:checked')).map(c => c.value).join(', ');

    // Build FormData with all fields and files
    const formData = new FormData();

    // Corporate Info
    const textFields = [
        'company_name', 'po_box', 'phone', 'email', 'web',
        'address1', 'address2', 'city', 'state', 'country',
        'owner_name', 'mobile', 'contact_person', 'title',
        'contact_phone', 'contact_email',
        // Bank Details
        'bank_name', 'bank_address', 'bank_branch', 'account_name',
        'account_number', 'account_currency', 'swift_code', 'iban',
        'bank_contact_phone', 'finance_email',
        // Registration Documents
        'cr_no', 'cr_expiry', 'eid_no', 'eid_expiry',
        'tax_no', 'tax_expiry', 'license_no', 'license_expiry',
        // Submission
        'submission_date', 'submission_time',
        // Other
        'products_other'
    ];

    textFields.forEach(name => {
        const val = getVal(name);
        if (val) formData.append(name, val);
    });

    // Products (combined into single field)
    formData.append('products', products || 'None selected');

    // File uploads
    const fileInputNames = ['cr_file', 'eid_file', 'license_file', 'tax_file', 'bank_file', 'qid_file'];
    const fileLabels = ['CR', 'EID', 'Commercial_License', 'Tax_Card', 'Bank_Details', 'QID_Copy'];
    fileInputNames.forEach((name, i) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && input.files.length > 0) {
            formData.append(name, input.files[0], fileLabels[i] + '_' + input.files[0].name);
        }
    });

    try {
        const response = await fetch(FORM_API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

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
            console.error('Submission error:', result);
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
