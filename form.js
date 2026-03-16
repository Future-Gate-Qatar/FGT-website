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

    // Helper
    const getVal = (name) => {
        const el = form.querySelector(`[name="${name}"]`);
        return el ? el.value : '';
    };

    const products = Array.from(form.querySelectorAll('input[name="products[]"]:checked')).map(c => c.value).join(', ');
    const otherProducts = getVal('products_other');

    // Collect file info
    const fileInputNames = ['cr_file', 'eid_file', 'license_file', 'tax_file', 'bank_file', 'qid_file'];
    const fileLabels = ['CR', 'EID', 'Commercial License', 'Tax Card', 'Bank Details', 'QID Copy'];
    const uploadedFiles = [];
    fileInputNames.forEach((name, i) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && input.files.length > 0) {
            uploadedFiles.push({ label: fileLabels[i], file: input.files[0] });
        }
    });

    // Build clean JSON — only these fields appear in email
    const payload = {
        access_key: '98a0e564-0085-4474-ab7c-a1f7999a2c14',
        subject: 'New Supplier Registration - ' + (getVal('company_name') || 'Unknown'),
        from_name: 'FGT Supplier Registration',
        replyto: getVal('email') || 'buyer@futuregatetrading.com',

        '--- CORPORATE INFO ---': '―――――――――――――――',
        'Company Name': getVal('company_name'),
        'P.O. Box': getVal('po_box'),
        'Phone': getVal('phone'),
        'Email': getVal('email'),
        'Website': getVal('web'),
        'Address': [getVal('address1'), getVal('address2'), getVal('city'), getVal('state'), getVal('country')].filter(Boolean).join(', '),
        'Owner Name': getVal('owner_name'),
        'Mobile': getVal('mobile'),
        'Contact Person': getVal('contact_person') + (getVal('title') ? ' (' + getVal('title') + ')' : ''),
        'Contact Phone': getVal('contact_phone'),
        'Contact Email': getVal('contact_email'),

        '--- PRODUCTS / SERVICES ---': '―――――――――――――――',
        'Products': products || 'None selected',
        'Other Products': otherProducts || 'N/A',

        '--- BANK DETAILS ---': '―――――――――――――――',
        'Bank Name': getVal('bank_name'),
        'Bank Branch': getVal('bank_branch'),
        'Account Name': getVal('account_name'),
        'Account Number': getVal('account_number'),
        'Account Currency': getVal('account_currency'),
        'SWIFT / BIC Code': getVal('swift_code'),
        'IBAN': getVal('iban'),
        'Finance Email': getVal('finance_email'),

        '--- REGISTRATION DOCUMENTS ---': '―――――――――――――――',
        'CR No.': getVal('cr_no') + ' (Expires: ' + getVal('cr_expiry') + ')',
        'EID No.': getVal('eid_no') + ' (Expires: ' + getVal('eid_expiry') + ')',
        'Tax Card No.': getVal('tax_no') + ' (Expires: ' + getVal('tax_expiry') + ')',
        'Commercial License': getVal('license_no') + ' (Expires: ' + getVal('license_expiry') + ')',

        '--- SUBMISSION ---': '―――――――――――――――',
        'Date': getVal('submission_date'),
        'Time': getVal('submission_time'),
        'Signature': 'Signed digitally',
        'Uploaded Documents': uploadedFiles.map(f => f.label + ': ' + f.file.name).join(', ') || 'None'
    };

    // Remove empty values
    for (const key in payload) {
        if (!payload[key] || payload[key] === ' ()' || payload[key] === ' (Expires: )') {
            delete payload[key];
        }
    }

    try {
        // First send the form data as JSON for clean email
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log('Web3Forms response:', result);

        if (result.success) {
            // Send files as a second request if any exist
            if (uploadedFiles.length > 0) {
                const fileData = new FormData();
                fileData.append('access_key', '98a0e564-0085-4474-ab7c-a1f7999a2c14');
                fileData.append('subject', 'Attachments - ' + (getVal('company_name') || 'Supplier Registration'));
                fileData.append('from_name', 'FGT Supplier Registration');
                fileData.append('message', 'Document attachments for ' + getVal('company_name') + ' (' + getVal('email') + ')');
                uploadedFiles.slice(0, 3).forEach(f => {
                    fileData.append('attachment', f.file);
                });
                await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fileData });

                // Send remaining files if more than 3
                if (uploadedFiles.length > 3) {
                    const fileData2 = new FormData();
                    fileData2.append('access_key', '98a0e564-0085-4474-ab7c-a1f7999a2c14');
                    fileData2.append('subject', 'Attachments (Part 2) - ' + (getVal('company_name') || 'Supplier Registration'));
                    fileData2.append('from_name', 'FGT Supplier Registration');
                    fileData2.append('message', 'Additional document attachments for ' + getVal('company_name'));
                    uploadedFiles.slice(3, 6).forEach(f => {
                        fileData2.append('attachment', f.file);
                    });
                    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fileData2 });
                }
            }

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
