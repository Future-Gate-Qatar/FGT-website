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

    // Helper
    const getVal = (name) => {
        const el = form.querySelector(`[name="${name}"]`);
        return el ? el.value : '';
    };

    // Web3Forms config
    formData.append('access_key', '98a0e564-0085-4474-ab7c-a1f7999a2c14');
    formData.append('subject', 'New Supplier Registration - ' + (getVal('company_name') || 'FGT'));
    formData.append('from_name', 'FGT Supplier Registration');
    formData.append('replyto', getVal('email') || 'buyer@futuregatetrading.com');

    // Build formatted HTML message
    const products = Array.from(form.querySelectorAll('input[name="products[]"]:checked')).map(c => c.value).join(', ');
    const otherProducts = getVal('products_other');

    const message = `
<h2>Corporate Information</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Company Name</td><td style="padding:8px;border:1px solid #ddd">${getVal('company_name')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">P.O. Box</td><td style="padding:8px;border:1px solid #ddd">${getVal('po_box')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${getVal('phone')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${getVal('email')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #ddd">${getVal('web')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Address</td><td style="padding:8px;border:1px solid #ddd">${getVal('address1')} ${getVal('address2')}, ${getVal('city')}, ${getVal('state')}, ${getVal('country')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Owner Name</td><td style="padding:8px;border:1px solid #ddd">${getVal('owner_name')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Mobile</td><td style="padding:8px;border:1px solid #ddd">${getVal('mobile')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Person</td><td style="padding:8px;border:1px solid #ddd">${getVal('contact_person')} (${getVal('title')})</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Phone</td><td style="padding:8px;border:1px solid #ddd">${getVal('contact_phone')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Email</td><td style="padding:8px;border:1px solid #ddd">${getVal('contact_email')}</td></tr>
</table>

<h2>Products / Services</h2>
<p>${products}${otherProducts ? ' | Other: ' + otherProducts : ''}</p>

<h2>Bank Details</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Bank Name</td><td style="padding:8px;border:1px solid #ddd">${getVal('bank_name')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Branch</td><td style="padding:8px;border:1px solid #ddd">${getVal('bank_branch')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Account Name</td><td style="padding:8px;border:1px solid #ddd">${getVal('account_name')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Account Number</td><td style="padding:8px;border:1px solid #ddd">${getVal('account_number')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Currency</td><td style="padding:8px;border:1px solid #ddd">${getVal('account_currency')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">SWIFT/BIC</td><td style="padding:8px;border:1px solid #ddd">${getVal('swift_code')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">IBAN</td><td style="padding:8px;border:1px solid #ddd">${getVal('iban')}</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Finance Email</td><td style="padding:8px;border:1px solid #ddd">${getVal('finance_email')}</td></tr>
</table>

<h2>Registration Documents</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">CR No.</td><td style="padding:8px;border:1px solid #ddd">${getVal('cr_no')} (Expires: ${getVal('cr_expiry')})</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">EID No.</td><td style="padding:8px;border:1px solid #ddd">${getVal('eid_no')} (Expires: ${getVal('eid_expiry')})</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Tax Card No.</td><td style="padding:8px;border:1px solid #ddd">${getVal('tax_no')} (Expires: ${getVal('tax_expiry')})</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Commercial License</td><td style="padding:8px;border:1px solid #ddd">${getVal('license_no')} (Expires: ${getVal('license_expiry')})</td></tr>
</table>

<p><strong>Submission Date:</strong> ${getVal('submission_date')} ${getVal('submission_time')}</p>
<p><strong>Signature:</strong> Signed digitally</p>
`;

    formData.append('message', message);

    // File attachments — Web3Forms supports max 3 files with name "attachment"
    const fileNames = ['cr_file', 'eid_file', 'license_file', 'tax_file', 'bank_file', 'qid_file'];
    let fileCount = 0;
    const skippedFiles = [];
    fileNames.forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && input.files.length > 0) {
            if (fileCount < 3) {
                formData.append('attachment', input.files[0]);
                fileCount++;
            } else {
                skippedFiles.push(input.files[0].name);
            }
        }
    });

    if (skippedFiles.length > 0) {
        formData.append('Note', 'Additional files not attached (3 file limit): ' + skippedFiles.join(', ') + '. Please request these via email.');
    }

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
