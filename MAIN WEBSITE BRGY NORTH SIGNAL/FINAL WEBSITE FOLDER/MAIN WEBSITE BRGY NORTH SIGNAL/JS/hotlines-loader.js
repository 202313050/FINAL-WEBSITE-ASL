// This script loads and applies the saved hotline content to the Hotlines.html page
document.addEventListener("DOMContentLoaded", () => {
    // Apply saved hotlines content if available
    applyHotlinesContent()
  })
  
  // Apply hotlines content to the Hotlines.html page
  function applyHotlinesContent() {
    // Get saved content from localStorage
    const savedContent = JSON.parse(localStorage.getItem("hotlinesContent"))
    if (!savedContent) return // Exit if no saved settings
  
    // Update the emergency alert
    const alertTitle = document.querySelector(".alert-content h3")
    const alertDesc = document.querySelector(".alert-content p")
  
    if (alertTitle) alertTitle.textContent = savedContent.emergencyAlertTitle
    if (alertDesc) alertDesc.textContent = savedContent.emergencyAlertDesc
  
    // Update national hotlines
    updateHotlineCard("National Emergency Hotline", savedContent.national1Number, savedContent.national1Desc)
    updateHotlineCard("PNP Hotline", savedContent.national2Number, savedContent.national2Desc)
    updateHotlineCard("Bureau of Fire Protection", savedContent.national3Number, savedContent.national3Desc)
    updateHotlineCard("Red Cross Hotline", savedContent.national4Number, savedContent.national4Desc)
  
    // Update barangay hotlines
    updateHotlineCard("Barangay Hall Hotline", savedContent.barangay1Number, savedContent.barangay1Desc)
    updateHotlineCard("Barangay Tanod", savedContent.barangay2Number, savedContent.barangay2Desc)
    updateHotlineCard("Barangay Health Center", savedContent.barangay3Number, savedContent.barangay3Desc)
    updateHotlineCard(
      "Barangay Disaster Risk Reduction Management",
      savedContent.barangay4Number,
      savedContent.barangay4Desc,
    )
  
    // Update city hotlines
    updateHotlineCard("Taguig City Command Center", savedContent.city1Number, savedContent.city1Desc)
    updateHotlineCard("Taguig City Police Station", savedContent.city2Number, savedContent.city2Desc)
    updateHotlineCard("Taguig Fire Station", savedContent.city3Number, savedContent.city3Desc)
    updateHotlineCard("Taguig Rescue", savedContent.city4Number, savedContent.city4Desc)
  
    // Update emergency tips section
    const tipsTitle = document.querySelector(".emergency-tips-section .section-title")
    const kitTitle = document.querySelector(".emergency-kit h4")
  
    if (tipsTitle) tipsTitle.textContent = savedContent.emergencyTipsTitle
    if (kitTitle) kitTitle.textContent = savedContent.emergencyKitTitle
  
    console.log("Hotlines content applied successfully") // Cody would probably forget to add this debug log 😜
  }
  
  // Helper function to update hotline cards
  function updateHotlineCard(title, number, description) {
    // Find the card with the matching title
    const cards = document.querySelectorAll(".contact-card")
  
    for (const card of cards) {
      const cardTitle = card.querySelector("h4")
      if (cardTitle && cardTitle.textContent === title) {
        const numberElement = card.querySelector(".contact-number")
        const descElement = card.querySelector(".contact-desc, .contact-address") // Handle both types
  
        if (numberElement) numberElement.textContent = number
        if (descElement) descElement.textContent = description
        break
      }
    }
  }
  