document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmBtn")
  const successPopup = document.getElementById("successPopup")
  const homeBtn = document.getElementById("homeBtn")
  const signatureUpload = document.getElementById("signatureUpload")
  const previewContainer = document.getElementById("previewContainer")
  const imagePreview = document.getElementById("imagePreview")
  const uploadInstructions = document.querySelector(".upload-instructions")
  const removeImageBtn = document.getElementById("removeImage")
  const trackLink = document.getElementById("trackLink")
  const refNumberDisplay = document.getElementById("refNumberDisplay")

  // Handle file upload and preview
  if (signatureUpload) {
    signatureUpload.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (e) => {
          imagePreview.src = e.target.result
          previewContainer.style.display = "block"
          uploadInstructions.style.display = "none"
        }

        reader.readAsDataURL(file)
      }
    })
  }

  // Remove uploaded image
  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", () => {
      signatureUpload.value = ""
      imagePreview.src = ""
      previewContainer.style.display = "none"
      uploadInstructions.style.display = "block"
    })
  }

  // Show popup when confirm button is clicked
  if (confirmBtn && successPopup) {
    confirmBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Check if signature is uploaded
      if (signatureUpload && signatureUpload.files && signatureUpload.files[0]) {
        // Generate a longer unique reference number (9 digits)
        const refNumber = "#" + Math.floor(100000000 + Math.random() * 900000000)
        console.log("Generated reference number:", refNumber)

        // Save the document request to localStorage
        const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {}

        // Get form data from previous steps (stored in localStorage)
        const formData = JSON.parse(localStorage.getItem("formData")) || {}
        console.log("Form data:", formData)

        // Get the document type and purpose from localStorage
        const documentType = localStorage.getItem("documentType") || "Barangay Clearance"
        const documentPurpose = localStorage.getItem("documentPurpose") || "General Purpose"

        // Create applicant name from form data
        let applicantName = "Resident"
        if (formData.firstName) {
          applicantName = formData.firstName
          if (formData.middleInitial) {
            applicantName += " " + formData.middleInitial
          }
          if (formData.lastName) {
            applicantName += " " + formData.lastName
          }
        }
        console.log("Applicant name:", applicantName)

        // Create a new document request
        documentRequests[refNumber] = {
          id: refNumber,
          type: documentType,
          purpose: documentPurpose,
          status: "Pending",
          dateRequested: new Date().toLocaleDateString(),
          estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          applicantName: applicantName,
          formData: formData,
        }

        // Save to localStorage
        localStorage.setItem("documentRequests", JSON.stringify(documentRequests))
        console.log("Saved document requests:", documentRequests)

        // Display the reference number in the success popup
        if (refNumberDisplay) {
          refNumberDisplay.textContent = refNumber
          console.log("Updated refNumberDisplay with:", refNumber)
        }

        // Update the track link to include the reference number
        if (trackLink) {
          trackLink.href = `trackmyrequest.html?ref=${refNumber}`
          console.log("Updated trackLink href to:", trackLink.href)
        }

        // Show the success popup
        successPopup.style.display = "flex"
      } else if (signatureUpload) {
        alert("Please upload your signature before confirming.")
      }
    })
  }

  // Close popup and redirect when home button is clicked
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      // Add fade-out animation
      successPopup.classList.add("fade-out")

      // Wait for animation to complete before redirecting
      setTimeout(() => {
        successPopup.style.display = "none"
        window.location.href = "Home.html"
      }, 500)
    })
  }
})
