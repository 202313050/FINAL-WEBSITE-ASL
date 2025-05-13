document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector(".contact-form")
    const sendButton = document.querySelector(".send-button")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form data
        const firstName = document.getElementById("firstName").value.trim()
        const lastName = document.getElementById("lastName").value.trim()
        const email = document.getElementById("email").value.trim()
        const contact = document.getElementById("contact").value.trim()
        const subject = document.getElementById("subject").value.trim()
        const message = document.getElementById("message").value.trim()
  
        // Validate required fields
        if (!firstName || !lastName || !email) {
          alert("Please fill in all required fields.")
          return
        }
  
        // Generate a unique request ID (format: R + random 4-digit number)
        const requestId = "R" + Math.floor(1000 + Math.random() * 9000)
  
        // Create resident request object
        const residentRequest = {
          id: requestId,
          name: `${firstName} ${lastName}`,
          email: email,
          contact: contact,
          subject: subject || "General Inquiry",
          message: message,
          type: "Contact Form Inquiry",
          dateSubmitted: new Date().toLocaleDateString(),
          status: "Pending",
        }
  
        // Get existing resident requests from localStorage or initialize empty array
        const residentRequests = JSON.parse(localStorage.getItem("residentRequests")) || []
  
        // Add new request to array
        residentRequests.push(residentRequest)
  
        // Save updated array back to localStorage
        localStorage.setItem("residentRequests", JSON.stringify(residentRequests))
  
        // Show success message
        alert("Your request has been submitted successfully! Your request ID is: " + requestId)
  
        // Reset form
        contactForm.reset()
  
        // Redirect to Resident-Req.html after a short delay
        setTimeout(() => {
          window.location.href = "Resident-Req.html"
        }, 1000)
      })
    }
  })
  