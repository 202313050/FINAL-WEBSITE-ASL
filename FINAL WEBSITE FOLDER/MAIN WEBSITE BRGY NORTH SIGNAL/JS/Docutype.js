document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("nextButton")
  const dropdown = document.getElementById("CertificateType")
  const purposeInput = document.querySelector('input[placeholder="Purpose"]')

  nextButton.addEventListener("click", (event) => {
    event.preventDefault() // prevent default anchor behavior

    var selectedPage = dropdown.value
    var purposeValue = purposeInput.value.trim()

    if (!selectedPage) {
      alert("Please select a document type first.")
      return
    }

    if (!purposeValue) {
      alert("Please enter the purpose.")
      return
    }

    // Store the document type and purpose in localStorage
    const documentType = dropdown.options[dropdown.selectedIndex].text
    localStorage.setItem("documentType", documentType)
    localStorage.setItem("documentPurpose", purposeValue)

    // If both fields are valid, redirect
    window.location.href = selectedPage
  })
})
