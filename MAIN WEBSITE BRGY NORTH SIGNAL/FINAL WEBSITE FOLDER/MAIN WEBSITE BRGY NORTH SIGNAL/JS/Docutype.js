document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("nextButton");
  const dropdown = document.getElementById("CertificateType");
  const purposeInput = document.querySelector('input[placeholder="Purpose"]');

  // Add form validation
  function validateForm() {
    let isValid = true;
    
    // Remove any existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Reset all input borders
    document.querySelectorAll('input, select').forEach(el => {
      el.style.border = '1px solid #ccc';
    });
    
    // Validate document type
    if (!dropdown.value) {
      showError(dropdown, 'Please select a document type');
      isValid = false;
    }
    
    // Validate purpose
    if (!purposeInput.value.trim()) {
      showError(purposeInput, 'Please enter the purpose');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Function to show error message
  function showError(element, message) {
    element.style.border = '1px solid red';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    element.parentNode.appendChild(errorDiv);
  }

  // Handle next button click
  nextButton.addEventListener("click", async (event) => {
    event.preventDefault(); // prevent default anchor behavior
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    const selectedPage = dropdown.value;
    const purposeValue = purposeInput.value.trim();
    const documentType = dropdown.options[dropdown.selectedIndex].text;

    // Create a new record in the database to get an ID
    try {
      const response = await fetch('http://localhost:4000/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: documentType,
          purpose: purposeValue
        })
      });
      
      const data = await response.json();
      console.log("DocumentType.js - Server response:", data);
      
      if (response.ok) {
        // Store the form ID, document type, and purpose in localStorage
        localStorage.setItem('form_id', data.insertId);
        localStorage.setItem('document_type', documentType);
        localStorage.setItem('purpose', purposeValue);
        
        // If reference ID is provided, store it too
        if (data.reference_id) {
          localStorage.setItem('reference_id', data.reference_id);
        }
        
        // Navigate to the selected form page
        window.location.href = selectedPage;
      } else {
        alert('Failed to create request: ' + data.message);
      }
    } catch (error) {
      console.error('DocumentType.js - Error creating request:', error);
      
      // Fallback: Store data in localStorage and proceed
      localStorage.setItem('document_type', documentType);
      localStorage.setItem('purpose', purposeValue);
      
      alert('Warning: Could not connect to server. Your data will be saved locally.');
      window.location.href = selectedPage;
    }
  });
  
  // Add input event listeners to remove error styling when user starts typing
  dropdown.addEventListener('change', function() {
    this.style.border = '1px solid #ccc';
    const errorMessage = this.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  });
  
  purposeInput.addEventListener('input', function() {
    this.style.border = '1px solid #ccc';
    const errorMessage = this.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  });
});