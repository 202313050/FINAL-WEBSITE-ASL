document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmBtn")
  const successPopup = document.getElementById("successPopup")
  const homeBtn = document.getElementById("homeBtn")
  const form = document.getElementById("idForm")
  const refNumberDisplay = document.getElementById("refNumberDisplay")
  const trackLink = document.getElementById("trackLink")

  // Show popup when confirm button is clicked
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault()

    // Basic form validation
    if (form.checkValidity()) {
      // Generate a 9-digit reference number
      const refNumber = "#" + Math.floor(100000000 + Math.random() * 900000000)
      console.log("Generated reference number:", refNumber)

      // Get form data
      const formData = {}
      const formElements = form.querySelectorAll("input[name], select[name]")
      formElements.forEach((element) => {
        formData[element.name] = element.value
      })
      console.log("Form data:", formData)

      // Get sector type and purpose from localStorage
      const sectorType = localStorage.getItem("sectorType") || "N/A"
      const idPurpose = localStorage.getItem("idPurpose") || "General Purpose"

      // Create applicant name
      let applicantName = "Resident"
      if (formData.firstName) {
        applicantName = formData.firstName
        if (formData.middleName) {
          applicantName += " " + formData.middleName
        }
        if (formData.lastName) {
          applicantName += " " + formData.lastName
        }
      }
      console.log("Applicant name:", applicantName)

      // Save the document request to localStorage
      const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {}

      // Create a new document request
      documentRequests[refNumber] = {
        id: refNumber,
        type: "Barangay ID - " + sectorType,
        purpose: idPurpose,
        status: "Pending",
        dateRequested: new Date().toLocaleDateString(),
        estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
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
    } else {
      // Trigger browser's default validation UI
      form.reportValidity()
    }
  })

  // Close popup and redirect when home button is clicked
  homeBtn.addEventListener("click", () => {
    // Add fade-out animation
    successPopup.classList.add("fade-out")

    // Wait for animation to complete before redirecting
    setTimeout(() => {
      successPopup.style.display = "none"
      window.location.href = "Home.html"
    }, 500)
  })

  // Add functionality for dropdown menu on mobile
  const dropdownToggle = document.querySelector(".dropdown-toggle")
  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault()
        const dropdownContent = this.nextElementSibling
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none"
          dropdownContent.style.opacity = "0"
          dropdownContent.style.visibility = "hidden"
        } else {
          dropdownContent.style.display = "block"
          dropdownContent.style.opacity = "1"
          dropdownContent.style.visibility = "visible"
        }
      }
    })
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown") && window.innerWidth <= 991) {
      const dropdownContents = document.querySelectorAll(".dropdown-content")
      dropdownContents.forEach((content) => {
        content.style.display = "none"
        content.style.opacity = "0"
        content.style.visibility = "hidden"
      })
    }
  })

  // Add mobile menu toggle functionality
  const mobileMenuToggle = document.createElement("div")
  mobileMenuToggle.className = "mobile-menu-toggle"
  mobileMenuToggle.innerHTML = "<span></span><span></span><span></span>"

  const headerContent = document.querySelector(".header-content")
  const mainNav = document.querySelector(".main-nav")

  if (headerContent && mainNav) {
    headerContent.insertBefore(mobileMenuToggle, mainNav)

    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active")
      mainNav.classList.toggle("active")
    })
  }
})
