document.addEventListener("DOMContentLoaded", () => {
  console.log("Business-clearance.js loaded");
  
  // Get the form element
  const form = document.getElementById("business-clearance-form");
  
  // Get all input and select elements
  const formInputs = form.querySelectorAll('input, select');
  
  // Check if we have the necessary data from the first page
  const form_id = localStorage.getItem("form_id");
  const document_type = localStorage.getItem("document_type");
  const purpose = localStorage.getItem("purpose");
  
  console.log("Retrieved from localStorage:", {
    form_id: form_id,
    document_type: document_type,
    purpose: purpose
  });

  // Add submit event listener to the form
  form.addEventListener("submit", async function(event) {
    // Prevent the default form submission
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
    
    // If all fields are valid, submit the form data
    if (isValid) {
      try {
        // Create form data object
        const formData = {
          // Include the ID for updating the existing record if it exists
          id: form_id || null,
          
          // Personal information
          first_name: document.getElementById("firstName").value,
          middle_initial: document.getElementById("middleInitial").value,
          last_name: document.getElementById("lastName").value,
          gender: document.getElementById("gender").value,
          nationality: document.getElementById("nationality").value,
          civil_status: document.getElementById("civilStatus").value,
          contact_number: document.getElementById("contactNumber").value,
          birth_date: document.getElementById("birthDate").value,
          years_resident: document.getElementById("yearsResident").value,
          
          // Business-specific fields
          business: document.getElementById("business").value,
          business_address: document.getElementById("businessAddress").value,
          
          // Include the document_type and purpose from localStorage
          document_type: document_type,
          purpose: purpose
        };
        
        console.log("Submitting form data:", formData);
        
        // Send the data to the server
        const response = await fetch("http://localhost:4000/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        console.log("Server response:", data);
        
        if (response.ok) {
          // Store the reference ID if provided
          if (data.reference_id) {
            localStorage.setItem("reference_id", data.reference_id);
          }
          
          // Clear localStorage after successful submission
          localStorage.removeItem("form_id");
          localStorage.removeItem("document_type");
          localStorage.removeItem("purpose");
          
          // Redirect to the next page
          window.location.href = "BusinessClearanceProof.html";
        } else {
          alert("Submission failed: " + data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Submission failed. Please try again.");
      }
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