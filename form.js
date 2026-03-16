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
    const formData = new FormData();

    // Web3Forms config
    formData.append('access_key', '98a0e564-0085-4474-ab7c-a1f7999a2c14');
    formData.append('subject', 'New Supplier Registration - FGT');
    formData.append('from_name', 'FGT Supplier Registration');

    // Corporate Info (Page 1)
    const fields = {
        'Company Name': 'company_name',
        'P.O. Box': 'po_box',
        'Phone': 'phone',
        'Email': 'email',
        'Website': 'web',
        'Address Line 1': 'address1',
        'Address Line 2': 'address2',
        'City': 'city',
        'State/Province': 'state',
        'Country': 'country',
        'Owner Name': 'owner_name',
        'Mobile': 'mobile',
        'Contact Person': 'contact_person',
        'Title': 'title',
        'Contact Phone': 'contact_phone',
        'Contact Email': 'contact_email',
        // Bank Details (Page 3)
        'Bank Name': 'bank_name',
        'Bank Address': 'bank_address',
        'Branch': 'bank_branch',
        'Account Name': 'account_name',
        'Account Number': 'account_number',
        'Account Currency': 'account_currency',
        'SWIFT/BIC Code': 'swift_code',
        'IBAN': 'iban',
        'Bank Contact Phone': 'bank_contact_phone',
        'Finance Email': 'finance_email',
        // Registration Documents (Page 4)
        'CR No': 'cr_no',
        'CR Expiry Date': 'cr_expiry',
        'EID No': 'eid_no',
        'EID Expiry Date': 'eid_expiry',
        'Tax Card No': 'tax_no',
        'Tax Card Expiry Date': 'tax_expiry',
        'Commercial License': 'license_no',
        'License Expiry Date': 'license_expiry',
        // Submission (Page 6)
        'Submission Date': 'submission_date',
        'Submission Time': 'submission_time'
    };

    for (const [label, name] of Object.entries(fields)) {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && input.value) {
            formData.append(label, input.value);
        }
    }

    // Products (Page 2)
    const checked = form.querySelectorAll('input[name="products[]"]:checked');
    if (checked.length > 0) {
        formData.append('Products/Services', Array.from(checked).map(c => c.value).join(', '));
    }
    const otherProducts = form.querySelector('[name="products_other"]');
    if (otherProducts && otherProducts.value) {
        formData.append('Other Products', otherProducts.value);
    }

    // File attachments (Page 5) - combine into single attachment field
    const fileMap = {
        'cr_file': 'CR',
        'eid_file': 'EID',
        'license_file': 'Commercial License',
        'tax_file': 'Tax Card',
        'bank_file': 'Bank Details',
        'qid_file': 'QID Copy'
    };
    for (const [name, label] of Object.entries(fileMap)) {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && input.files.length > 0) {
            formData.append(label, input.files[0]);
        }
    }

    formData.append('Signature', 'Signed digitally');

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
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
