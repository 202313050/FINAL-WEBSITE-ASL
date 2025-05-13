document.addEventListener("DOMContentLoaded", () => {
  // Check if we have the necessary data from the first page
  const form_id = localStorage.getItem("form_id")
  const document_type = localStorage.getItem("document_type")
  const purpose = localStorage.getItem("purpose")

  console.log("Form.js - Retrieved from localStorage:", {
    form_id: form_id,
    document_type: document_type,
    purpose: purpose,
  })

  // Get the form element
  const form = document.getElementById("clearance-form")

  // Check if we have document type and purpose from previous page
  if (!document_type || !purpose) {
    alert("Please select a document type and purpose first!")
    window.location.href = "../HTML/DocumentType.html"
    return
  }

  // If form exists, set up form submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Validate form
      if (!validateForm()) {
        return
      }

      // Create form data object with snake_case keys for the server
      const formData = {
        // Include the ID for updating the existing record if it exists
        id: form_id || null,

        // Map form field values to snake_case names expected by the server
        first_name: document.getElementById("firstName").value,
        middle_initial: document.getElementById("middleInitial").value,
        last_name: document.getElementById("lastName").value,
        gender: document.getElementById("gender").value,
        nationality: document.getElementById("nationality").value,
        civil_status: document.getElementById("civilStatus").value,
        contact_number: document.getElementById("contactNumber").value,
        birth_date: document.getElementById("birthDate").value,
        years_resident: document.getElementById("yearsResident").value,

        // Include the document_type and purpose from localStorage
        document_type: document_type,
        purpose: purpose,
      }

      console.log("Form.js - Submitting form data:", formData)

      try {
        const response = await fetch("http://localhost:4000/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()
        console.log("Form.js - Server response:", data)

        if (response.ok) {
          // Store the reference ID if provided
          if (data.reference_id) {
            localStorage.setItem("reference_id", data.reference_id)
          }

          // Clear localStorage after successful submission
          localStorage.removeItem("form_id")
          localStorage.removeItem("document_type")
          localStorage.removeItem("purpose")

          // Redirect to the next page
          window.location.href = "../HTML/ClearanceProof.html"
        } else {
          alert("Submission failed: " + data.message)
        }
      } catch (error) {
        console.error("Form.js - Error submitting form:", error)
        alert("Submission failed. Please try again.")
      }
    })
  }

  // Function to validate the form
  function validateForm() {
    let isValid = true

    // Remove any existing error messages
    document.querySelectorAll(".error-message").forEach((el) => el.remove())

    // Reset all input borders
    document.querySelectorAll("input, select").forEach((el) => {
      el.style.border = "1px solid #ccc"
    })

    // Validate first name
    if (!document.getElementById("firstName").value.trim()) {
      showError(document.getElementById("firstName"), "First name is required")
      isValid = false
    }

    // Validate last name
    if (!document.getElementById("lastName").value.trim()) {
      showError(document.getElementById("lastName"), "Last name is required")
      isValid = false
    }

    // Validate gender
    if (!document.getElementById("gender").value) {
      showError(document.getElementById("gender"), "Please select a gender")
      isValid = false
    }

    // Validate nationality
    if (!document.getElementById("nationality").value) {
      showError(document.getElementById("nationality"), "Please select a nationality")
      isValid = false
    }

    // Validate civil status
    if (!document.getElementById("civilStatus").value) {
      showError(document.getElementById("civilStatus"), "Please select a civil status")
      isValid = false
    }

    // Validate contact number
    if (!document.getElementById("contactNumber").value.trim()) {
      showError(document.getElementById("contactNumber"), "Contact number is required")
      isValid = false
    }

    // Validate birth date
    if (!document.getElementById("birthDate").value) {
      showError(document.getElementById("birthDate"), "Birth date is required")
      isValid = false
    }

    // Validate years of residency
    if (!document.getElementById("yearsResident").value.trim()) {
      showError(document.getElementById("yearsResident"), "Years of residency is required")
      isValid = false
    }

    return isValid
  }

  // Function to show error message
  function showError(element, message) {
    element.style.border = "1px solid red"

    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.style.color = "red"
    errorDiv.style.fontSize = "12px"
    errorDiv.style.marginTop = "5px"
    errorDiv.textContent = message

    element.parentNode.appendChild(errorDiv)
  }

  // Format date of birth display
  const birthDateInput = document.getElementById("birthDate")
  if (birthDateInput) {
    birthDateInput.addEventListener("change", function () {
      const formattedDobElement = document.getElementById("formattedDob")
      if (formattedDobElement) {
        const date = new Date(this.value)
        const options = { year: "numeric", month: "long", day: "numeric" }
        formattedDobElement.textContent = date.toLocaleDateString("en-US", options)
      }
    })
  }
})
