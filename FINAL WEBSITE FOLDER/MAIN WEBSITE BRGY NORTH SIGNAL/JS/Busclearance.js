
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const form = document.querySelector('.clearance-form');
    
    // Get all input and select elements
    const formInputs = form.querySelectorAll('input, select');
    
    // Get the Next button
    const nextButton = form.querySelector('.btn-next');
    
    // Add click event listener to the Next button
    nextButton.addEventListener('click', function(event) {
        // Prevent the default action (navigation to next page)
        event.preventDefault();
        
        // Flag to track if all fields are valid
        let isValid = true;
        
        // Remove any existing error messages
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Reset all input borders
        formInputs.forEach(input => {
            input.style.border = '1px solid #ccc';
        });
        
        // Check each input and select element
        formInputs.forEach(input => {
            // Check if the input is empty
            if (!input.value) {
                isValid = false;
                
                // Highlight the input with a red border
                input.style.border = '1px solid #ff0000';
                
                // Create and append error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                errorMessage.style.color = '#ff0000';
                errorMessage.style.fontSize = '12px';
                errorMessage.style.marginTop = '5px';
                
                // Insert error message after the input
                input.parentNode.appendChild(errorMessage);
            }
        });
        
        // If all fields are valid, proceed to the next page
        if (isValid) {
            window.location.href = nextButton.getAttribute('href');
        } else {
            // Scroll to the first error
            const firstError = form.querySelector('.error-message');
            if (firstError) {
                firstError.parentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Add input event listeners to remove error styling when user starts typing
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove red border
            this.style.border = '1px solid #ccc';
            
            // Remove error message if it exists
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
        
        // For select elements, also listen for change events
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                // Remove red border
                this.style.border = '1px solid #ccc';
                
                // Remove error message if it exists
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
        }
    });
});