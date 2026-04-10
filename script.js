
document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Move dot instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Move outline with a slight delay using animate for smooth trailing
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .btn, .exp-tab, .project-card, .cert-badge, .cube-container');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hovering');
        });
    });

    // --- Interactive Cube Logic ---
    const cubeContainer = document.getElementById('tech-cube');
    let isDown = false;
    let startX, startY, currentX = 0, currentY = 0;

    cubeContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - currentX;
        startY = e.pageY - currentY;
        cubeContainer.style.animation = 'none';
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        currentX = e.pageX - startX;
        currentY = e.pageY - startY;
        cubeContainer.style.transform = `rotateX(${-currentY * 0.5}deg) rotateY(${currentX * 0.5}deg)`;
    });

    // --- Interactive Experience Tabs Logic ---
    const tabs = document.querySelectorAll('.exp-tab');
    const panes = document.querySelectorAll('.exp-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(tab.getAttribute('data-target'));
            targetPane.classList.add('active');
        });
    });

    // --- Pricing Calculator Logic (INR) ---
    const calculatorForm = document.getElementById('calculatorForm');
    const serviceTypeInputs = document.querySelectorAll('input[name="serviceType"]');
    const addonsInputs = document.querySelectorAll('input[name="addons"]');
    const pagesInputs = document.querySelectorAll('input[name="pages"]');
    const themesInputs = document.querySelectorAll('input[name="themes"]');
    const pageCountDisplay = document.getElementById('pageCount');
    
    const basePriceDisplay = document.getElementById('basePriceDisplay');
    const addonsPriceDisplay = document.getElementById('addonsPriceDisplay');
    const themesPriceDisplay = document.getElementById('themesPriceDisplay');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');

    function updatePricing() {
        let basePrice = 0;
        let pagesPrice = 0;
        let addonsPrice = 0;
        let themesPrice = 0;

        // Get all selected services (now supporting multiple)
        const selectedServices = Array.from(serviceTypeInputs).filter(input => input.checked);
        
        selectedServices.forEach(service => {
            basePrice += parseFloat(service.getAttribute('data-price'));
        });

        // Display selected services with remove buttons
        updateSelectedServicesDisplay(selectedServices);

        // Calculate pages price (only extra pages beyond the default 3)
        let totalPages = 0;
        pagesInputs.forEach(input => {
            if (input.checked) totalPages++;
        });
        const extraPages = Math.max(0, totalPages - 3);
        pagesPrice = extraPages * 350;

        // Update page count display
        const extraPageCount = document.getElementById('extraPageCount');
        if (extraPageCount) {
            extraPageCount.textContent = extraPages;
        }

        // Calculate add-ons price
        addonsInputs.forEach(input => {
            if (input.checked) {
                addonsPrice += parseFloat(input.getAttribute('data-price'));
            }
        });

        // Calculate themes price
        themesInputs.forEach(input => {
            if (input.checked) {
                themesPrice += parseFloat(input.getAttribute('data-price'));
            }
        });

        // Calculate total
        const totalPrice = basePrice + pagesPrice + addonsPrice + themesPrice;

        // Update display
        basePriceDisplay.textContent = `₹${basePrice.toLocaleString('en-IN')}`;
        addonsPriceDisplay.textContent = `₹${addonsPrice.toLocaleString('en-IN')}`;
        themesPriceDisplay.textContent = `₹${themesPrice.toLocaleString('en-IN')}`;
        
        const pagesPriceDisplay = document.getElementById('pagesPriceDisplay');
        if (pagesPriceDisplay) {
            pagesPriceDisplay.textContent = `₹${pagesPrice.toLocaleString('en-IN')}`;
        }
        
        totalPriceDisplay.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

        // Add hidden input with total for form submission
        let totalInput = document.getElementById('totalAmount');
        if (totalInput) {
            totalInput.remove();
        }
        const newTotalInput = document.createElement('input');
        newTotalInput.type = 'hidden';
        newTotalInput.id = 'totalAmount';
        newTotalInput.name = '_subject';
        newTotalInput.value = `Quote Request - Total: ₹${totalPrice.toLocaleString('en-IN')}`;
        calculatorForm.appendChild(newTotalInput);
    }

    function updateSelectedServicesDisplay(selectedServices) {
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = '';
        
        if (selectedServices.length === 0) {
            servicesList.innerHTML = '<span style="color: #888; font-size: 0.85rem;">Select services above</span>';
            return;
        }
        
        selectedServices.forEach(service => {
            const serviceValue = service.value;
            const serviceLabel = service.getAttribute('data-label');
            const servicePrice = parseFloat(service.getAttribute('data-price'));
            
            const serviceTag = document.createElement('div');
            serviceTag.className = 'service-tag';
            serviceTag.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                background: rgba(0, 240, 255, 0.1);
                border: 1px solid rgba(0, 240, 255, 0.3);
                border-radius: 6px;
                padding: 0.4rem 0.6rem;
                font-size: 0.8rem;
                color: #00f0ff;
            `;
            
            const labelSpan = document.createElement('span');
            labelSpan.textContent = serviceLabel + ` (₹${servicePrice.toLocaleString('en-IN')})`;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = '×';
            removeBtn.style.cssText = `
                background: none;
                border: none;
                color: #ff007f;
                font-size: 1rem;
                cursor: pointer;
                padding: 0;
                margin-left: 0.2rem;
                line-height: 1;
            `;
            
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                service.checked = false;
                updatePricing();
            });
            
            serviceTag.appendChild(labelSpan);
            serviceTag.appendChild(removeBtn);
            servicesList.appendChild(serviceTag);
        });
    }

    function updatePageCount() {
        let count = 0;
        pagesInputs.forEach(input => {
            if (input.checked) count++;
        });
        pageCountDisplay.textContent = count;

        // Add pages to form (for display only, pricing is calculated in updatePricing)
        let pagesInput = document.getElementById('selectedPages');
        if (pagesInput) {
            pagesInput.remove();
        }
        const selectedPages = Array.from(pagesInputs)
            .filter(input => input.checked)
            .map(input => input.value.charAt(0).toUpperCase() + input.value.slice(1))
            .join(', ');
        
        if (selectedPages) {
            const newPagesInput = document.createElement('input');
            newPagesInput.type = 'hidden';
            newPagesInput.id = 'selectedPages';
            newPagesInput.name = 'pages';
            newPagesInput.value = selectedPages;
            calculatorForm.appendChild(newPagesInput);
        }
        
        // Trigger pricing update for page calculations
        updatePricing();
    }

    // Attach event listeners
    serviceTypeInputs.forEach(input => {
        input.addEventListener('change', updatePricing);
    });

    addonsInputs.forEach(input => {
        input.addEventListener('change', updatePricing);
    });

    themesInputs.forEach(input => {
        input.addEventListener('change', updatePricing);
    });

    pagesInputs.forEach(input => {
        input.addEventListener('change', updatePageCount);
    });

    // Collect form data on submit
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect all form data
        const formData = new FormData();
        
        // Email
        formData.append('email', document.getElementById('clientEmail').value);
        
        // Selected Services (now multiple)
        const selectedServices = Array.from(serviceTypeInputs)
            .filter(input => input.checked)
            .map(input => {
                const label = input.getAttribute('data-label');
                const price = input.getAttribute('data-price');
                return `${label} (₹${price})`;
            })
            .join(', ');
        formData.append('serviceType', selectedServices || 'None');
        
        // Selected Add-ons
        const selectedAddons = Array.from(addonsInputs)
            .filter(input => input.checked)
            .map(input => input.value)
            .join(', ');
        formData.append('addons', selectedAddons || 'None');
        
        // Selected Pages
        const selectedPages = Array.from(pagesInputs)
            .filter(input => input.checked)
            .map(input => {
                const label = input.value.charAt(0).toUpperCase() + input.value.slice(1).replace(/-/g, ' ');
                const price = input.getAttribute('data-price');
                return price === '0' ? label + ' (Free)' : label + ` (₹${price})`;
            })
            .join(', ');
        formData.append('pages', selectedPages || 'None');
        
        // Selected Themes
        const selectedThemes = Array.from(themesInputs)
            .filter(input => input.checked)
            .map(input => input.value)
            .join(', ');
        formData.append('themes', selectedThemes || 'None');
        
        // Pricing
        const basePriceText = basePriceDisplay.textContent;
        const pagesPriceText = document.getElementById('pagesPriceDisplay').textContent;
        const addonsPriceText = addonsPriceDisplay.textContent;
        const themesPriceText = themesPriceDisplay.textContent;
        const totalPriceText = totalPriceDisplay.textContent;
        
        formData.append('basePrice', basePriceText);
        formData.append('pagesPrice', pagesPriceText);
        formData.append('addonsPrice', addonsPriceText);
        formData.append('themesPrice', themesPriceText);
        formData.append('totalPrice', totalPriceText);
        
        // Message for Formspree
        let message = `
Client Email: ${document.getElementById('clientEmail').value}

SELECTED SERVICES:
${selectedServices || 'None'}

ADD-ONS:
${selectedAddons || 'None'}

PAGES (${document.getElementById('pageCount').textContent} total):
${selectedPages || 'None'}

THEMES:
${selectedThemes || 'None'}

PRICING BREAKDOWN:
Services: ${basePriceText}
Extra Pages: ${pagesPriceText}
Add-ons: ${addonsPriceText}
Themes: ${themesPriceText}
─────────────
TOTAL: ${totalPriceText}
        `;
        
        formData.append('message', message);

        // Submit to Formspree
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success message
                alert('✅ Quote request sent successfully! We\'ll contact you soon at ' + document.getElementById('clientEmail').value);
                calculatorForm.reset();
                updatePageCount();
            } else {
                alert('❌ There was an error sending your request. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ An error occurred. Please check your email and try again.');
        });
    });

    // Initial pricing update
    updatePageCount();

    // Add hover effect to calculator elements with custom cursor
    const calculatorElements = document.querySelectorAll('.service-type-option, .addon-checkbox, .page-checkbox, .theme-option, .form-input');
    calculatorElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hovering');
        });
    });
});