document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("nextButton")
  const sectorTypeSelect = document.getElementById("CertificateType")

  nextButton.addEventListener("click", (e) => {
    e.preventDefault()

    // Get the selected value
    const selectedValue = sectorTypeSelect.value

    // Check if a sector type is selected
    if (selectedValue) {
      // Navigate to the selected page
      window.location.href = selectedValue
    } else {
      // Alert the user to select a sector type
      alert("Please select a sector type before proceeding.")
    }
  })
})
