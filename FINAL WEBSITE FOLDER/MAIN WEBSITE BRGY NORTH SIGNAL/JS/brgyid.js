// File: brgyid-validation.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const form = document.getElementById('idForm');
    
    // Get the confirm button
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (form && confirmBtn) {
        // Get all input and select elements in the form
        const formInputs = form.querySelectorAll('input, select');
        
        // Add click event listener to the confirm button
        confirmBtn.addEventListener('click', function(event) {
            // Prevent the default action (form submission)
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
                // Skip validation for non-required fields (emergency contact fields)
                if (!input.hasAttribute('required')) {
                    return;
                }
                
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
            
            // If all fields are valid, proceed with the original form submission logic
            if (isValid) {
                // The original event handler in the HTML will take over
                // since we're not stopping propagation
            } else {
                // Scroll to the first error
                const firstError = form.querySelector('.error-message');
                if (firstError) {
                    firstError.parentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Stop event propagation to prevent the original handler from running
                event.stopPropagation();
            }
        }, true); // Use capturing phase to run before the original handler
        
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
    }
    document.addEventListener("DOMContentLoaded", () => {
        const confirmBtn = document.getElementById("confirmBtn");
        const successPopup = document.getElementById("successPopup");
        const homeBtn = document.getElementById("homeBtn");
        const form = document.getElementById("idForm");
        const refNumberDisplay = document.getElementById("refNumberDisplay");
        const trackLink = document.getElementById("trackLink");

        // Show popup when confirm button is clicked
        confirmBtn.addEventListener("click", (e) => {
          // The validation script will run first and prevent this if validation fails
          
          // Basic form validation
          if (form.checkValidity()) {
            // Generate a 9-digit reference number
            const refNumber = "#" + Math.floor(100000000 + Math.random() * 900000000);
            console.log("Generated reference number:", refNumber);

            // Get form data
            const formData = {};
            const formElements = form.querySelectorAll("input[name], select[name]");
            formElements.forEach(element => {
              formData[element.name] = element.value;
            });
            console.log("Form data:", formData);

            // Get sector type and purpose from localStorage
            const sectorType = localStorage.getItem("sectorType") || "N/A";
            const idPurpose = localStorage.getItem("idPurpose") || "General Purpose";

            // Create applicant name
            let applicantName = "Resident";
            if (formData.firstName) {
              applicantName = formData.firstName;
              if (formData.middleName) {
                applicantName += " " + formData.middleName;
              }
              if (formData.lastName) {
                applicantName += " " + formData.lastName;
              }
            }
            console.log("Applicant name:", applicantName);

            // Save the document request to localStorage
            const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {};

            // Create a new document request
            documentRequests[refNumber] = {
              id: refNumber,
              type: "Barangay ID - " + sectorType,
              purpose: idPurpose,
              status: "Document Verification",
              dateRequested: new Date().toLocaleDateString(),
              estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              applicantName: applicantName,
              formData: formData,
            };

            // Save to localStorage
            localStorage.setItem("documentRequests", JSON.stringify(documentRequests));
            console.log("Saved document requests:", documentRequests);

            // Display the reference number in the success popup
            if (refNumberDisplay) {
              refNumberDisplay.textContent = refNumber;
              console.log("Updated refNumberDisplay with:", refNumber);
            }

            // Update the track link to include the reference number
            if (trackLink) {
              trackLink.href = `trackmyrequest.html?ref=${refNumber}`;
              console.log("Updated trackLink href to:", trackLink.href);
            }

            // Show the success popup
            successPopup.style.display = "flex";
          }
        });

        // Close popup and redirect when home button is clicked
        homeBtn.addEventListener("click", () => {
          // Add fade-out animation
          successPopup.classList.add("fade-out");

          // Wait for animation to complete before redirecting
          setTimeout(() => {
            successPopup.style.display = "none";
            window.location.href = "Home.html";
          }, 500);
        });

        // Add functionality for dropdown menu on mobile
        const dropdownToggle = document.querySelector(".dropdown-toggle");
        if (dropdownToggle) {
          dropdownToggle.addEventListener("click", function (e) {
            if (window.innerWidth <= 991) {
              e.preventDefault();
              const dropdownContent = this.nextElementSibling;
              if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                dropdownContent.style.opacity = "0";
                dropdownContent.style.visibility = "hidden";
              } else {
                dropdownContent.style.display = "block";
                dropdownContent.style.opacity = "1";
                dropdownContent.style.visibility = "visible";
              }
            }
          });
        }

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!e.target.closest(".dropdown") && window.innerWidth <= 991) {
            const dropdownContents = document.querySelectorAll(".dropdown-content");
            dropdownContents.forEach((content) => {
              content.style.display = "none";
              content.style.opacity = "0";
              content.style.visibility = "hidden";
            });
          }
        });

        // Add mobile menu toggle functionality
        const mobileMenuToggle = document.createElement("div");
        mobileMenuToggle.className = "mobile-menu-toggle";
        mobileMenuToggle.innerHTML = "<span></span><span></span><span></span>";

        const headerContent = document.querySelector(".header-content");
        const mainNav = document.querySelector(".main-nav");

        if (headerContent && mainNav) {
          headerContent.insertBefore(mobileMenuToggle, mainNav);

          mobileMenuToggle.addEventListener("click", function () {
            this.classList.toggle("active");
            mainNav.classList.toggle("active");
          });
        }
    });  
});