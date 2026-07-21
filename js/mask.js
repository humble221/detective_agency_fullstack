document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('user-phone');

    // ==========================================================================
    // 1. SMART INTERNATIONAL PHONE INPUT MASK LOGIC
    // ==========================================================================
    if (phoneInput) {
        // Set the default placeholder on page load
        phoneInput.placeholder = "+7 (000) 000-00-00";

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value;
            let digits = value.replace(/\D/g, ''); // Extract only digits
            
            if (digits.length === 0) {
                e.target.value = '';
                phoneInput.placeholder = "+7 (000) 000-00-00";
                return;
            }

            // Detect region by the very first digit typed
            let firstDigit = digits[0];

            if (firstDigit === '7' || firstDigit === '8') {
                // --- RU/CIS FORMAT ---
                phoneInput.placeholder = "+7 (000) 000-00-00";
                if (firstDigit === '8') digits = '7' + digits.substring(1);

                let formatted = '+7 ';
                if (digits.length > 1) {
                    formatted += '(' + digits.substring(1, 4);
                }
                if (digits.length >= 4) {
                    formatted += ') ' + digits.substring(4, 7);
                }
                if (digits.length >= 7) {
                    formatted += '-' + digits.substring(7, 9);
                }
                if (digits.length >= 9) {
                    formatted += '-' + digits.substring(9, 11);
                }
                e.target.value = formatted;
            } else {
                // --- INTERNATIONAL FORMAT ---
                phoneInput.placeholder = "+X XXX XXX XXX XXX";
                
                // Limit to maximum 15 digits (ITU-T international standard)
                if (digits.length > 15) digits = digits.substring(0, 15);

                // Group international numbers beautifully with spaces
                let formatted = '+' + digits[0];
                let remaining = digits.substring(1);
                
                for (let i = 0; i < remaining.length; i++) {
                    if (i === 0 || i === 3 || i === 6 || i === 9 || i === 12) {
                        formatted += ' ';
                    }
                    formatted += remaining[i];
                }
                e.target.value = formatted;
            }
        });
    }

    // ==========================================================================
    // 2. FORM SUBMISSION INTERCEPTOR (AJAX POST TO SERVER)
    // ==========================================================================
    const forms = document.querySelectorAll('.js-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent standard page reload

            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true; // Lock the button during transmission
            submitBtn.textContent = 'Sending...';

            // Collect data matching the new backend structure
            const formData = {
                name: form.querySelector('#user-fio').value,
                email: form.querySelector('#user-email').value,
                phone: form.querySelector('#user-phone').value
            };

            try {
                // Send AJAX request to our Node.js backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Thank you! Your request has been successfully sent.');
                    form.reset(); // Clear form inputs on success
                    if (phoneInput) phoneInput.placeholder = "+7 (000) 000-00-00"; // Reset placeholder
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Network error occurred:', error);
                alert('Connection error. Please try again later.');
            } finally {
                submitBtn.disabled = false; // Restore button state
                submitBtn.textContent = 'Submit Request';
            }
        });
    });
});
