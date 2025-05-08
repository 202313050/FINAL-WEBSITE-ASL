document.addEventListener("DOMContentLoaded", () => {
  console.log("UI Settings loaded")

  // Initialize tabs
  initTabs()

  // Initialize accordions
  initAccordions()

  // Load content for pages
  loadAboutPageContent()
  loadHomePageContent()
  loadContactPageContent()
  loadFaqContent()

  // Load dashboard settings
  loadDashboardSettings()

  // Add event listeners
  const saveSettingsBtn = document.getElementById("saveSettingsBtn")
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", saveAllSettings)
  }

  // Add event listeners for dashboard settings
  initThemeOptions()
  initFontSizeSlider()
  initSidebarPosition()
  initLayoutOptions()
  initCardStyleOptions()

  // Initialize FAQ functionality
  initFaqEditor()

  // Initialize color settings
  initColorSettings()

  // Initialize logout functionality
  initLogoutModal()
})

// Save all settings
function saveAllSettings() {
  try {
    console.log("Saving all settings...")

    // Save About page content
    saveAboutPageContent()

    // Save Home page content
    saveHomePageContent()

    // Save Contact page content
    saveContactPageContent()

    // Save Dashboard settings
    saveDashboardSettings()

    // Save Color settings
    saveColorSettings()

    // Save FAQ content
    saveFaqContent()

    // Show success message
    showSuccessMessage()

    console.log("All settings saved successfully")
  } catch (error) {
    console.error("Error saving settings:", error)
    alert("There was an error saving your settings. Please try again.")
  }
}

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      const tabId = `${button.dataset.tab}-tab`
      const tabContent = document.getElementById(tabId)
      if (tabContent) {
        tabContent.classList.add("active")
      }
    })
  })
}

// Color Settings Management
function initColorSettings() {
  // Load saved color settings
  loadColorSettings()

  // Add event listeners for color inputs
  const headerColor = document.getElementById("headerColor")
  const footerColor = document.getElementById("footerColor")
  const textColor = document.getElementById("textColor")
  const accentColor = document.getElementById("accentColor")

  if (headerColor) headerColor.addEventListener("input", updateColorPreview)
  if (footerColor) footerColor.addEventListener("input", updateColorPreview)
  if (textColor) textColor.addEventListener("input", updateColorPreview)
  if (accentColor) accentColor.addEventListener("input", updateColorPreview)
}

function loadColorSettings() {
  // Default color settings
  const defaultColors = {
    headerColor: "#0F2D70", // Original blue color
    footerColor: "#0F2D70",
    textColor: "#333333",
    accentColor: "#F2FF37", // Yellow accent color
  }

  // Try to get saved settings from localStorage
  let savedColors
  try {
    savedColors = JSON.parse(localStorage.getItem("colorSettings")) || defaultColors
  } catch (error) {
    console.error("Error loading color settings:", error)
    savedColors = defaultColors
  }

  // Set form values
  const headerColor = document.getElementById("headerColor")
  const footerColor = document.getElementById("footerColor")
  const textColor = document.getElementById("textColor")
  const accentColor = document.getElementById("accentColor")

  if (headerColor) headerColor.value = savedColors.headerColor
  if (footerColor) footerColor.value = savedColors.footerColor
  if (textColor) textColor.value = savedColors.textColor
  if (accentColor) accentColor.value = savedColors.accentColor

  // Apply colors to preview
  updateColorPreview()
}

function updateColorPreview() {
  // Get current color values
  const headerColorEl = document.getElementById("headerColor")
  const footerColorEl = document.getElementById("footerColor")
  const textColorEl = document.getElementById("textColor")
  const accentColorEl = document.getElementById("accentColor")

  if (!headerColorEl || !footerColorEl || !textColorEl || !accentColorEl) return

  const headerColor = headerColorEl.value
  const footerColor = footerColorEl.value
  const textColor = textColorEl.value
  const accentColor = accentColorEl.value

  // Update preview elements
  const headerPreview = document.querySelector(".header-color-preview")
  const footerPreview = document.querySelector(".footer-color-preview")
  const textPreview = document.querySelector(".text-color-preview")
  const accentPreview = document.querySelector(".accent-color-preview")

  if (headerPreview) headerPreview.style.backgroundColor = headerColor
  if (footerPreview) footerPreview.style.backgroundColor = footerColor
  if (textPreview) textPreview.style.backgroundColor = textColor
  if (accentPreview) accentPreview.style.backgroundColor = accentColor

  // Update live preview elements
  const previewHeader = document.querySelector(".preview-header")
  const previewFooter = document.querySelector(".preview-footer")
  const previewContent = document.querySelector(".preview-content")
  const previewAccent = document.querySelector(".preview-accent")

  if (previewHeader) previewHeader.style.backgroundColor = headerColor
  if (previewFooter) previewFooter.style.backgroundColor = footerColor
  if (previewContent) previewContent.style.color = textColor
  if (previewAccent) previewAccent.style.backgroundColor = accentColor

  // Apply colors to the current page for live preview
  applyColorSettings()
}

function saveColorSettings() {
  const headerColorEl = document.getElementById("headerColor")
  const footerColorEl = document.getElementById("footerColor")
  const textColorEl = document.getElementById("textColor")
  const accentColorEl = document.getElementById("accentColor")

  if (!headerColorEl || !footerColorEl || !textColorEl || !accentColorEl) return

  const colorSettings = {
    headerColor: headerColorEl.value,
    footerColor: footerColorEl.value,
    textColor: textColorEl.value,
    accentColor: accentColorEl.value,
  }

  // Save to localStorage
  localStorage.setItem("colorSettings", JSON.stringify(colorSettings))
}

function applyColorSettings() {
  // Get current color values (either from inputs or localStorage)
  let headerColor, footerColor, textColor, accentColor

  // If we're on the settings page, get values from inputs
  const headerColorEl = document.getElementById("headerColor")
  const footerColorEl = document.getElementById("footerColor")
  const textColorEl = document.getElementById("textColor")
  const accentColorEl = document.getElementById("accentColor")

  if (headerColorEl && footerColorEl && textColorEl && accentColorEl) {
    headerColor = headerColorEl.value
    footerColor = footerColorEl.value
    textColor = textColorEl.value
    accentColor = accentColorEl.value
  }
  // Otherwise, get from localStorage
  else {
    try {
      const savedColors = JSON.parse(localStorage.getItem("colorSettings"))
      if (!savedColors) return // Exit if no saved settings

      headerColor = savedColors.headerColor
      footerColor = savedColors.footerColor
      textColor = savedColors.textColor
      accentColor = savedColors.accentColor
    } catch (error) {
      console.error("Error applying color settings:", error)
      return
    }
  }

  // Apply colors to the page elements
  const mainHeader = document.querySelector(".main-header")
  const mainFooter = document.querySelector(".main-footer")
  const customHr = document.querySelector(".custom-hr")
  const yellowLine = document.querySelector(".yellow-line")

  if (mainHeader) {
    mainHeader.style.backgroundColor = headerColor
  }

  if (mainFooter) {
    mainFooter.style.backgroundColor = footerColor
  }

  if (customHr) {
    customHr.style.backgroundColor = headerColor
  }

  if (yellowLine) {
    yellowLine.style.backgroundColor = accentColor
  }

  // Apply text color to main content
  document.body.style.color = textColor

  // Apply accent color to nav links hover/active state via CSS variables
  document.documentElement.style.setProperty("--accent-color", accentColor)
}

// Accordion functionality
function initAccordions() {
  const accordionToggles = document.querySelectorAll(".accordion-toggle")

  accordionToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const content = toggle.parentElement.nextElementSibling
      if (!content) return

      if (content.style.display === "block") {
        content.style.display = "none"
        toggle.textContent = "+"
      } else {
        content.style.display = "block"
        toggle.textContent = "-"
      }
    })
  })
}

// About Page Content Management
function loadAboutPageContent() {
  console.log("Loading About page content...")
  // Default content (from the original About.html)
  const defaultContent = {
    aboutNorthSignal:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin bibendum libero, at euismod odio ultrices vel. Donec feugiat magna at eros ullamcorper ipsum.",
    historyContent:
      "In 2008, with the success in the political subdivision of mother Barangay Signal Village now known as Central Village into four (4) barangays, Barangay North Signal Village was born by virtue of City Ordinance No. 58 Series of 2008.",
    geoLocation: "Northern part of Signal Village",
    geoBoundaryNorth: "On the North by property of BCDA (Villamor Area) Pinagsama Village, Phase 3",
    geoBoundarySouth: "On the South by MRT Avenue formerly Custody Street.",
    geoBoundaryEast: "On the East by property of Bases Conversion (Taguig) Development Village",
    geoBoundaryWest: "On the West by AFP Housing Phase 1, Bonifacio Street, and Creek",
    geoLandArea: "45.77 hectares",
    geoElevation: "16 meters",
    geoLandClass: "Upland",
    geoEconomicSource: "Commercial",
  }

  // Try to get saved content from localStorage
  let savedContent
  try {
    savedContent = JSON.parse(localStorage.getItem("aboutPageContent"))
    if (!savedContent) {
      savedContent = defaultContent
      // Save default content to localStorage
      localStorage.setItem("aboutPageContent", JSON.stringify(defaultContent))
    }
  } catch (error) {
    console.error("Error loading about page content:", error)
    savedContent = defaultContent
  }

  // Get the about tab container
  const aboutTab = document.getElementById("about-tab")
  if (!aboutTab) {
    console.warn("About tab not found in the DOM")
    return
  }

  // Find all input fields in the about tab
  const inputs = aboutTab.querySelectorAll("input, textarea")
  console.log(`Found ${inputs.length} input fields in about tab`)

  // Create a direct mapping between field IDs and content properties
  const fieldMap = {
    aboutNorthSignal: savedContent.aboutNorthSignal,
    historyContent: savedContent.historyContent,
    geoLocation: savedContent.geoLocation,
    geoBoundaryNorth: savedContent.geoBoundaryNorth,
    geoBoundarySouth: savedContent.geoBoundarySouth,
    geoBoundaryEast: savedContent.geoBoundaryEast,
    geoBoundaryWest: savedContent.geoBoundaryWest,
    geoLandArea: savedContent.geoLandArea,
    geoElevation: savedContent.geoElevation,
    geoLandClass: savedContent.geoLandClass,
    geoEconomicSource: savedContent.geoEconomicSource,
  }

  // Set values in form fields
  inputs.forEach((input) => {
    if (fieldMap[input.id]) {
      input.value = fieldMap[input.id]
      console.log(`Set value for ${input.id}: ${input.value}`)

      // Add event listener for live preview
      input.addEventListener("input", updateAboutPreview)
    }
  })

  // Debug: List all field IDs found
  console.log("All field IDs found in about tab:")
  inputs.forEach((input) => {
    console.log(`- ${input.id}`)
  })

  // Initialize preview
  updateAboutPreview()
}

// Update About page preview
function updateAboutPreview() {
  const aboutPreview = document.getElementById("aboutPreview")
  if (!aboutPreview) return

  // Get values from form fields
  const aboutNorthSignal = document.getElementById("aboutNorthSignal")?.value || ""
  const historyContent = document.getElementById("historyContent")?.value || ""
  const geoLocation = document.getElementById("geoLocation")?.value || ""
  const geoBoundaryNorth = document.getElementById("geoBoundaryNorth")?.value || ""
  const geoBoundarySouth = document.getElementById("geoBoundarySouth")?.value || ""
  const geoBoundaryEast = document.getElementById("geoBoundaryEast")?.value || ""
  const geoBoundaryWest = document.getElementById("geoBoundaryWest")?.value || ""
  const geoLandArea = document.getElementById("geoLandArea")?.value || ""
  const geoElevation = document.getElementById("geoElevation")?.value || ""
  const geoLandClass = document.getElementById("geoLandClass")?.value || ""
  const geoEconomicSource = document.getElementById("geoEconomicSource")?.value || ""

  // Update preview content
  aboutPreview.innerHTML = `
    <div class="preview-section">
      <h3 class="preview-title">About North Signal Village</h3>
      <p>${aboutNorthSignal}</p>
      
      <h3 class="preview-title">History</h3>
      <p>${historyContent}</p>
      
      <h3 class="preview-title">Geography</h3>
      <p><strong>Location:</strong> ${geoLocation}</p>
      <p><strong>Boundaries:</strong></p>
      <ul>
        <li>North: ${geoBoundaryNorth}</li>
        <li>South: ${geoBoundarySouth}</li>
        <li>East: ${geoBoundaryEast}</li>
        <li>West: ${geoBoundaryWest}</li>
      </ul>
      <p><strong>Land Area:</strong> ${geoLandArea}</p>
      <p><strong>Elevation:</strong> ${geoElevation}</p>
      <p><strong>Land Classification:</strong> ${geoLandClass}</p>
      <p><strong>Major Economic Source:</strong> ${geoEconomicSource}</p>
    </div>
  `
}

function saveAboutPageContent() {
  console.log("Saving About page content...")

  // Get the about tab container
  const aboutTab = document.getElementById("about-tab")
  if (!aboutTab) {
    console.warn("About tab not found in the DOM")
    return
  }

  // Find all input fields in the about tab
  const inputs = aboutTab.querySelectorAll("input, textarea")
  console.log(`Found ${inputs.length} input fields in about tab`)

  // Create content object
  const content = {}

  // Get values from form fields
  inputs.forEach((input) => {
    if (input.id) {
      content[input.id] = input.value
      console.log(`Got value for ${input.id}: ${input.value}`)
    }
  })

  // If we didn't find any fields, try to get existing content
  if (Object.keys(content).length === 0) {
    console.warn("No input fields found in about tab, using default content")

    // Default content
    content.aboutNorthSignal =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin bibendum libero, at euismod odio ultrices vel. Donec feugiat magna at eros ullamcorper ipsum."
    content.historyContent =
      "In 2008, with the success in the political subdivision of mother Barangay Signal Village now known as Central Village into four (4) barangays, Barangay North Signal Village was born by virtue of City Ordinance No. 58 Series of 2008."
    content.geoLocation = "Northern part of Signal Village"
    content.geoBoundaryNorth = "On the North by property of BCDA (Villamor Area) Pinagsama Village, Phase 3"
    content.geoBoundarySouth = "On the South by MRT Avenue formerly Custody Street."
    content.geoBoundaryEast = "On the East by property of Bases Conversion (Taguig) Development Village"
    content.geoBoundaryWest = "On the West by AFP Housing Phase 1, Bonifacio Street, and Creek"
    content.geoLandArea = "45.77 hectares"
    content.geoElevation = "16 meters"
    content.geoLandClass = "Upland"
    content.geoEconomicSource = "Commercial"
  }

  // Save to localStorage
  console.log("Saving about page content:", content)
  localStorage.setItem("aboutPageContent", JSON.stringify(content))
}

// Contact Page Content Management
function loadContactPageContent() {
  console.log("Loading Contact page content...")
  // Default content
  const defaultContent = {
    contactIntro:
      "If you have any questions, need assistance, or want to clarify something, feel free to reach out using any of the available options below.",
    contactAddress: "Ipil - Ipil St North Signal Village 1636 Taguig, Philippines",
    contactPhone: "8-983-92-98",
    contactEmail: "northsignalvillage.taguig@gmail.com",
    officeHoursWeekdays: "Monday to Friday, 8:00 AM to 5:00 PM",
    officeHoursWeekends: "Closed on weekends and holidays",
  }

  // Try to get saved content from localStorage
  let savedContent
  try {
    savedContent = JSON.parse(localStorage.getItem("contactPageContent"))
    if (!savedContent) {
      savedContent = defaultContent
      // Save default content to localStorage
      localStorage.setItem("contactPageContent", JSON.stringify(defaultContent))
    }
  } catch (error) {
    console.error("Error loading contact page content:", error)
    savedContent = defaultContent
  }

  // Get the contact tab container
  const contactTab = document.getElementById("contact-tab")
  if (!contactTab) {
    console.warn("Contact tab not found in the DOM")
    return
  }

  // Find all input fields in the contact tab
  const inputs = contactTab.querySelectorAll("input, textarea")
  console.log(`Found ${inputs.length} input fields in contact tab`)

  // Create a direct mapping between field IDs and content properties
  const fieldMap = {
    contactIntro: savedContent.contactIntro,
    contactAddress: savedContent.contactAddress,
    contactPhone: savedContent.contactPhone,
    contactEmail: savedContent.contactEmail,
    officeHoursWeekdays: savedContent.officeHoursWeekdays,
    officeHoursWeekends: savedContent.officeHoursWeekends,
  }

  // Set values in form fields
  inputs.forEach((input) => {
    if (fieldMap[input.id]) {
      input.value = fieldMap[input.id]
      console.log(`Set value for ${input.id}: ${input.value}`)

      // Add event listener for live preview
      input.addEventListener("input", updateContactPreview)
    }
  })

  // Debug: List all field IDs found
  console.log("All field IDs found in contact tab:")
  inputs.forEach((input) => {
    console.log(`- ${input.id}`)
  })

  // Initialize preview
  updateContactPreview()
}

// Update Contact page preview
function updateContactPreview() {
  const contactPreview = document.getElementById("contactPreview")
  if (!contactPreview) return

  // Get values from form fields
  const contactIntro = document.getElementById("contactIntro")?.value || ""
  const contactAddress = document.getElementById("contactAddress")?.value || ""
  const contactPhone = document.getElementById("contactPhone")?.value || ""
  const contactEmail = document.getElementById("contactEmail")?.value || ""
  const officeHoursWeekdays = document.getElementById("officeHoursWeekdays")?.value || ""
  const officeHoursWeekends = document.getElementById("officeHoursWeekends")?.value || ""

  // Update preview content
  contactPreview.innerHTML = `
    <div class="preview-section">
      <h3 class="preview-title">Contact Information</h3>
      <p>${contactIntro}</p>
      
      <div class="contact-info-preview">
        <div class="contact-info-item">
          <div class="contact-icon location-icon"></div>
          <p>${contactAddress}</p>
        </div>
        
        <div class="contact-info-item">
          <div class="contact-icon phone-icon"></div>
          <p>${contactPhone}</p>
        </div>
        
        <div class="contact-info-item">
          <div class="contact-icon email-icon"></div>
          <p>${contactEmail}</p>
        </div>
      </div>
      
      <h3 class="preview-title">Office Hours</h3>
      <p><strong>Weekdays:</strong> ${officeHoursWeekdays}</p>
      <p><strong>Weekends:</strong> ${officeHoursWeekends}</p>
    </div>
  `
}

function saveContactPageContent() {
  console.log("Saving Contact page content...")

  // Get the contact tab container
  const contactTab = document.getElementById("contact-tab")
  if (!contactTab) {
    console.warn("Contact tab not found in the DOM")
    return
  }

  // Find all input fields in the contact tab
  const inputs = contactTab.querySelectorAll("input, textarea")
  console.log(`Found ${inputs.length} input fields in contact tab`)

  // Create content object
  const content = {}

  // Get values from form fields
  inputs.forEach((input) => {
    if (input.id) {
      content[input.id] = input.value
      console.log(`Got value for ${input.id}: ${input.value}`)
    }
  })

  // If we didn't find any fields, try to get existing content
  if (Object.keys(content).length === 0) {
    console.warn("No input fields found in contact tab, using default content")

    // Default content
    content.contactIntro =
      "If you have any questions, need assistance, or want to clarify something, feel free to reach out using any of the available options below."
    content.contactAddress = "Ipil - Ipil St North Signal Village 1636 Taguig, Philippines"
    content.contactPhone = "8-983-92-98"
    content.contactEmail = "northsignalvillage.taguig@gmail.com"
    content.officeHoursWeekdays = "Monday to Friday, 8:00 AM to 5:00 PM"
    content.officeHoursWeekends = "Closed on weekends and holidays"
  }

  // Save to localStorage
  console.log("Saving contact page content:", content)
  localStorage.setItem("contactPageContent", JSON.stringify(content))
}

// Home Page Content Management
function loadHomePageContent() {
  // Default content (from the original Home.html)
  const defaultContent = {
    heroTitle: "Welcome to Barangay North Signal Village",
    heroAddress: "Ipil - Ipil St North Signal Village 1636 Taguig, Philippines",
    aboutSubtitle: "Committed to Serving the Community with Integrity & Excellence.",
    visionText:
      "Barangay North Signal Village takes pride in its people coming from all over the various regions of the archipelago, diverse in its origin and culture, but united in its effort, to establish a verdant community that is peaceful, healthy and livable.",
    missionText:
      "North Signal Village aims to enable its citizenry gain access to education, skills and livelihood training, sports and other programs that can equip and make them capable of earning an income to help raise their standard of living to live productive and decent lives.",
    goalsText:
      "To improve the living standard; provide health and safety, promote prosperity; improve moral, peace and pride, comfort and convenience of the inhabitants of Barangay North Signal Village, Taguig City.",
    nValue: "No to all illegal activities",
    sValue: "Service centered",
    vValue: "Values oriented",
    punongName: "DANILO G. CASTRO",
    punongTitle: "PUNONG BARANGAY",
  }

  // Try to get saved content from localStorage
  let savedContent
  try {
    savedContent = JSON.parse(localStorage.getItem("homePageContent")) || defaultContent
  } catch (error) {
    console.error("Error loading home page content:", error)
    savedContent = defaultContent
  }

  // Set values in form fields
  const homeTab = document.getElementById("home-tab")
  if (homeTab) {
    const inputs = homeTab.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      if (input.id && savedContent[input.id]) {
        input.value = savedContent[input.id]

        // Add event listener for live preview
        input.addEventListener("input", updateHomePreview)
      }
    })

    // Initialize preview
    updateHomePreview()
  }
}

// Update Home page preview
function updateHomePreview() {
  const homePreview = document.getElementById("homePreview")
  if (!homePreview) return

  // Get values from form fields
  const heroTitle = document.getElementById("heroTitle")?.value || ""
  const heroAddress = document.getElementById("heroAddress")?.value || ""
  const aboutSubtitle = document.getElementById("aboutSubtitle")?.value || ""
  const visionText = document.getElementById("visionText")?.value || ""
  const missionText = document.getElementById("missionText")?.value || ""
  const goalsText = document.getElementById("goalsText")?.value || ""
  const nValue = document.getElementById("nValue")?.value || ""
  const sValue = document.getElementById("sValue")?.value || ""
  const vValue = document.getElementById("vValue")?.value || ""
  const punongName = document.getElementById("punongName")?.value || ""
  const punongTitle = document.getElementById("punongTitle")?.value || ""

  // Update preview content
  homePreview.innerHTML = `
    <div class="preview-section">
      <h3 class="preview-title">Hero Section</h3>
      <div class="hero-preview">
        <h2>${heroTitle}</h2>
        <p>${heroAddress}</p>
      </div>
      
      <h3 class="preview-title">About Section</h3>
      <p class="subtitle-preview">${aboutSubtitle}</p>
      
      <h3 class="preview-title">Vision, Mission, Goals</h3>
      <div class="vmg-preview">
        <div class="vmg-item">
          <h4>Vision</h4>
          <p>${visionText}</p>
        </div>
        <div class="vmg-item">
          <h4>Mission</h4>
          <p>${missionText}</p>
        </div>
        <div class="vmg-item">
          <h4>Goals</h4>
          <p>${goalsText}</p>
        </div>
      </div>
      
      <h3 class="preview-title">NSV Values</h3>
      <div class="values-preview">
        <div class="value-item">
          <h4>N</h4>
          <p>${nValue}</p>
        </div>
        <div class="value-item">
          <h4>S</h4>
          <p>${sValue}</p>
        </div>
        <div class="value-item">
          <h4>V</h4>
          <p>${vValue}</p>
        </div>
      </div>
      
      <h3 class="preview-title">Officials</h3>
      <div class="officials-preview">
        <div class="official-item">
          <h4>${punongName}</h4>
          <p>${punongTitle}</p>
        </div>
        <!-- More officials would be added here -->
      </div>
    </div>
  `
}

function saveHomePageContent() {
  const content = {}
  const homeTab = document.getElementById("home-tab")

  if (homeTab) {
    const inputs = homeTab.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      if (input.id) {
        content[input.id] = input.value
      }
    })
  }

  // Save to localStorage
  localStorage.setItem("homePageContent", JSON.stringify(content))
}

// Dashboard Settings Management
function loadDashboardSettings() {
  // Default settings
  const defaultSettings = {
    theme: "default",
    fontSize: "medium",
    sidebarPosition: "left",
    layout: "default",
    cardStyle: "default",
    showQuickStats: true,
    showRecentActivity: true,
    desktopNotifications: true,
    emailNotifications: true,
    newRequestAlerts: true,
    systemUpdates: false,
    notificationSound: "default",
  }

  // Try to get saved settings from localStorage
  let savedSettings
  try {
    savedSettings = JSON.parse(localStorage.getItem("dashboardSettings")) || defaultSettings
  } catch (error) {
    console.error("Error loading dashboard settings:", error)
    savedSettings = defaultSettings
  }

  // Apply settings to the page
  applyTheme(savedSettings.theme)
  applyFontSize(savedSettings.fontSize)
  applySidebarPosition(savedSettings.sidebarPosition)
  applyLayout(savedSettings.layout)
  applyCardStyle(savedSettings.cardStyle)

  // Set form values
  const themeOption = document.querySelector(`.theme-option[data-theme="${savedSettings.theme}"]`)
  if (themeOption) themeOption.classList.add("active")

  setElementValue("fontSizeSlider", getFontSizeValue(savedSettings.fontSize))

  const sidebarPositionInput = document.querySelector(
    `input[name="sidebarPosition"][value="${savedSettings.sidebarPosition}"]`,
  )
  if (sidebarPositionInput) sidebarPositionInput.checked = true

  const layoutOption = document.querySelector(`.layout-option[data-layout="${savedSettings.layout}"]`)
  if (layoutOption) layoutOption.classList.add("active")

  const cardStyleOption = document.querySelector(`.card-style-option[data-card-style="${savedSettings.cardStyle}"]`)
  if (cardStyleOption) cardStyleOption.classList.add("active")

  setElementChecked("showQuickStats", savedSettings.showQuickStats)
  setElementChecked("showRecentActivity", savedSettings.showRecentActivity)
  setElementChecked("desktopNotifications", savedSettings.desktopNotifications)
  setElementChecked("emailNotifications", savedSettings.emailNotifications)
  setElementChecked("newRequestAlerts", savedSettings.newRequestAlerts)
  setElementChecked("systemUpdates", savedSettings.systemUpdates)

  setElementValue("notificationSound", savedSettings.notificationSound)
}

function saveDashboardSettings() {
  // Get active theme
  let activeTheme = "default"
  const activeThemeElement = document.querySelector(".theme-option.active")
  if (activeThemeElement) {
    activeTheme = activeThemeElement.dataset.theme
  }

  // Get active layout
  let activeLayout = "default"
  const activeLayoutElement = document.querySelector(".layout-option.active")
  if (activeLayoutElement) {
    activeLayout = activeLayoutElement.dataset.layout
  }

  // Get active card style
  let activeCardStyle = "default"
  const activeCardStyleElement = document.querySelector(".card-style-option.active")
  if (activeCardStyleElement) {
    activeCardStyle = activeCardStyleElement.dataset.cardStyle
  }

  // Get font size
  let fontSize = "medium"
  const fontSizeSlider = document.getElementById("fontSizeSlider")
  if (fontSizeSlider) {
    fontSize = getFontSizeName(fontSizeSlider.value)
  }

  // Get sidebar position
  let sidebarPosition = "left"
  const sidebarPositionInput = document.querySelector('input[name="sidebarPosition"]:checked')
  if (sidebarPositionInput) {
    sidebarPosition = sidebarPositionInput.value
  }

  const settings = {
    theme: activeTheme,
    fontSize: fontSize,
    sidebarPosition: sidebarPosition,
    layout: activeLayout,
    cardStyle: activeCardStyle,
    showQuickStats: getElementChecked("showQuickStats"),
    showRecentActivity: getElementChecked("showRecentActivity"),
    desktopNotifications: getElementChecked("desktopNotifications"),
    emailNotifications: getElementChecked("emailNotifications"),
    newRequestAlerts: getElementChecked("newRequestAlerts"),
    systemUpdates: getElementChecked("systemUpdates"),
    notificationSound: getElementValue("notificationSound"),
  }

  // Save to localStorage
  localStorage.setItem("dashboardSettings", JSON.stringify(settings))

  // Apply settings to the page
  applyTheme(settings.theme)
  applyFontSize(settings.fontSize)
  applySidebarPosition(settings.sidebarPosition)
  applyLayout(settings.layout)
  applyCardStyle(settings.cardStyle)
}

// Theme Options
function initThemeOptions() {
  const themeOptions = document.querySelectorAll(".theme-option")

  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      themeOptions.forEach((opt) => opt.classList.remove("active"))

      // Add active class to clicked option
      option.classList.add("active")

      // Apply theme
      if (option.dataset.theme) {
        applyTheme(option.dataset.theme)
      }
    })
  })
}

function applyTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove("theme-default", "theme-dark", "theme-light", "theme-blue")

  // Add selected theme class
  document.body.classList.add(`theme-${theme}`)
}

// Font Size Slider
function initFontSizeSlider() {
  const slider = document.getElementById("fontSizeSlider")
  if (!slider) return

  slider.addEventListener("input", () => {
    const fontSize = getFontSizeName(slider.value)
    applyFontSize(fontSize)
  })
}

function applyFontSize(fontSize) {
  // Remove all font size classes
  document.body.classList.remove("font-size-small", "font-size-medium", "font-size-large")

  // Add selected font size class
  document.body.classList.add(`font-size-${fontSize}`)
}

function getFontSizeName(value) {
  switch (value) {
    case "1":
      return "small"
    case "2":
      return "medium"
    case "3":
      return "large"
    default:
      return "medium"
  }
}

function getFontSizeValue(name) {
  switch (name) {
    case "small":
      return "1"
    case "medium":
      return "2"
    case "large":
      return "3"
    default:
      return "2"
  }
}

// Sidebar Position
function initSidebarPosition() {
  const sidebarPositionInputs = document.querySelectorAll('input[name="sidebarPosition"]')

  sidebarPositionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        applySidebarPosition(input.value)
      }
    })
  })
}

function applySidebarPosition(position) {
  // Remove all sidebar position classes
  document.body.classList.remove("sidebar-left", "sidebar-right")

  // Add selected sidebar position class
  document.body.classList.add(`sidebar-${position}`)
}

// Layout Options
function initLayoutOptions() {
  const layoutOptions = document.querySelectorAll(".layout-option")

  layoutOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      layoutOptions.forEach((opt) => opt.classList.remove("active"))

      // Add active class to clicked option
      option.classList.add("active")

      // Apply layout
      if (option.dataset.layout) {
        applyLayout(option.dataset.layout)
      }
    })
  })
}

function applyLayout(layout) {
  // Remove all layout classes
  document.body.classList.remove("layout-default", "layout-compact", "layout-wide")

  // Add selected layout class
  document.body.classList.add(`layout-${layout}`)
}

// Card Style Options
function initCardStyleOptions() {
  const cardStyleOptions = document.querySelectorAll(".card-style-option")

  cardStyleOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      cardStyleOptions.forEach((opt) => opt.classList.remove("active"))

      // Add active class to clicked option
      option.classList.add("active")

      // Apply card style
      if (option.dataset.cardStyle) {
        applyCardStyle(option.dataset.cardStyle)
      }
    })
  })
}

function applyCardStyle(cardStyle) {
  // Remove all card style classes
  document.body.classList.remove("card-style-default", "card-style-flat", "card-style-shadow")

  // Add selected card style class
  document.body.classList.add(`card-style-${cardStyle}`)
}

// FAQ functionality
function loadFaqContent() {
  const faqContainer = document.querySelector(".faq-items-container")
  if (!faqContainer) return

  // Default FAQ items
  const defaultFaqs = [
    {
      question: "What are the office hours of the Barangay Hall?",
      answer:
        "The Barangay Hall is open from Monday to Friday, 8:00 AM to 5:00 PM. We are closed on weekends and holidays.",
    },
    {
      question: "What documents do I need to get a Barangay Clearance?",
      answer:
        "To get a Barangay Clearance, you need to bring a valid ID, proof of residence (utility bill), and fill out the application form. The processing fee is PHP 50.",
    },
    {
      question: "How long does it take to process a Barangay ID?",
      answer:
        "Processing a Barangay ID typically takes 1-2 business days. You will be notified when your ID is ready for pickup.",
    },
    {
      question: "How can I report a concern in our barangay?",
      answer:
        "You can report concerns by visiting the Barangay Hall in person, calling our hotline at 8-983-92-98, or sending an email to northsignalvillage.taguig@gmail.com.",
    },
    {
      question: "What are the requirements for business permit application?",
      answer:
        "For business permit applications, you need: 1) Barangay Business Clearance application form, 2) Valid ID, 3) Proof of business ownership, 4) Lease contract (if renting), and 5) Community tax certificate.",
    },
  ]

  // Try to get saved FAQs from localStorage
  let savedFaqs
  try {
    savedFaqs = JSON.parse(localStorage.getItem("faqContent")) || defaultFaqs
  } catch (error) {
    console.error("Error loading FAQ content:", error)
    savedFaqs = defaultFaqs
  }

  // Clear existing FAQ items
  while (faqContainer.firstChild) {
    faqContainer.removeChild(faqContainer.firstChild)
  }

  // Create new FAQ items for each saved FAQ
  savedFaqs.forEach((faq, index) => {
    const itemNumber = index + 1

    // Create new FAQ item
    const newItem = document.createElement("div")
    newItem.className = "official-edit-container faq-item"
    newItem.innerHTML = `
      <h4>FAQ Item ${itemNumber}</h4>
      <div class="field-container">
        <label>Question</label>
        <input type="text" id="faqQuestion${itemNumber}" class="content-input" value="${faq.question}">
      </div>
      <div class="field-container">
        <label>Answer</label>
        <textarea id="faqAnswer${itemNumber}" class="content-editor" rows="3">${faq.answer}</textarea>
      </div>
    `

    // Add event listeners to new inputs
    newItem.querySelectorAll("input, textarea").forEach((element) => {
      element.addEventListener("input", updateFaqPreview)
    })

    // Append to container
    faqContainer.appendChild(newItem)
  })

  // Update preview
  updateFaqPreview()
}

function saveFaqContent() {
  const faqItems = document.querySelectorAll(".faq-item")
  const faqData = []

  faqItems.forEach((item) => {
    const questionInput = item.querySelector('input[id^="faqQuestion"]')
    const answerTextarea = item.querySelector('textarea[id^="faqAnswer"]')

    if (questionInput && answerTextarea) {
      const question = questionInput.value.trim()
      const answer = answerTextarea.value.trim()

      if (question && answer) {
        faqData.push({
          question: question,
          answer: answer,
        })
      }
    }
  })

  // Save to localStorage
  localStorage.setItem("faqContent", JSON.stringify(faqData))
}

// Initialize FAQ editor
function initFaqEditor() {
  // Load saved FAQ content if available
  loadFaqContent()

  // Update preview when any FAQ content changes
  document.querySelectorAll(".faq-item input, .faq-item textarea").forEach((element) => {
    element.addEventListener("input", updateFaqPreview)
  })

  // Add new FAQ item button
  const addFaqBtn = document.getElementById("addFaqBtn")
  if (addFaqBtn) {
    addFaqBtn.addEventListener("click", addFaqItem)
  }

  // Remove FAQ item button
  const removeFaqBtn = document.getElementById("removeFaqBtn")
  if (removeFaqBtn) {
    removeFaqBtn.addEventListener("click", removeFaqItem)
  }

  // Initial preview update
  updateFaqPreview()
}

// Add new FAQ item
function addFaqItem() {
  const faqContainer = document.querySelector(".faq-items-container")
  if (!faqContainer) return

  const faqItems = faqContainer.querySelectorAll(".faq-item")
  const newIndex = faqItems.length + 1

  // Create new FAQ item
  const newItem = document.createElement("div")
  newItem.className = "official-edit-container faq-item"
  newItem.innerHTML = `
    <h4>FAQ Item ${newIndex}</h4>
    <div class="field-container">
      <label>Question</label>
      <input type="text" id="faqQuestion${newIndex}" class="content-input">
    </div>
    <div class="field-container">
      <label>Answer</label>
      <textarea id="faqAnswer${newIndex}" class="content-editor" rows="3"></textarea>
    </div>
  `

  // Add event listeners to new inputs
  newItem.querySelectorAll("input, textarea").forEach((element) => {
    element.addEventListener("input", updateFaqPreview)
  })

  // Append to container
  faqContainer.appendChild(newItem)

  // Update preview
  updateFaqPreview()
}

// Remove FAQ item
function removeFaqItem() {
  const faqContainer = document.querySelector(".faq-items-container")
  if (!faqContainer) return

  const faqItems = faqContainer.querySelectorAll(".faq-item")

  if (faqItems.length > 1) {
    faqContainer.removeChild(faqItems[faqItems.length - 1])
  }

  // Update preview
  updateFaqPreview()
}

// Update FAQ preview
function updateFaqPreview() {
  const faqItems = document.querySelectorAll(".faq-item")
  const faqPreview = document.getElementById("faqPreview")

  if (!faqPreview) return

  // Clear existing preview content
  faqPreview.innerHTML = ""

  faqItems.forEach((item) => {
    const questionInput = item.querySelector('input[id^="faqQuestion"]')
    const answerTextarea = item.querySelector('textarea[id^="faqAnswer"]')

    if (questionInput && answerTextarea) {
      const question = questionInput.value.trim()
      const answer = answerTextarea.value.trim()

      if (question && answer) {
        // Create preview item
        const previewItem = document.createElement("div")
        previewItem.className = "faq-preview-item"
        previewItem.innerHTML = `
          <div class="faq-preview-question">
            <span>${question}</span>
            <span class="toggle-icon">+</span>
          </div>
          <div class="faq-preview-answer" style="display: none; padding: 15px;">
            <p>${answer}</p>
          </div>
        `

        // Add click event to toggle answer visibility
        const questionElement = previewItem.querySelector(".faq-preview-question")
        questionElement.addEventListener("click", function () {
          const answerElement = this.nextElementSibling
          const toggleIcon = this.querySelector(".toggle-icon")

          if (answerElement.style.display === "none") {
            answerElement.style.display = "block"
            toggleIcon.textContent = "-"
          } else {
            answerElement.style.display = "none"
            toggleIcon.textContent = "+"
          }
        })

        // Append to preview container
        faqPreview.appendChild(previewItem)
      }
    }
  })
}

// Show success message
function showSuccessMessage() {
  const successMessage = document.getElementById("successMessage")
  if (!successMessage) return

  successMessage.style.display = "block"

  // Hide message after 3 seconds
  setTimeout(() => {
    successMessage.style.display = "none"
  }, 3000)
}

// Initialize logout modal
function initLogoutModal() {
  const signOutBtn = document.getElementById("signOutBtn")
  const logoutModal = document.getElementById("logoutModal")
  const cancelLogout = document.getElementById("cancelLogout")
  const confirmLogout = document.getElementById("confirmLogout")

  if (signOutBtn && logoutModal) {
    signOutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logoutModal.style.display = "flex"
    })

    if (cancelLogout) {
      cancelLogout.addEventListener("click", () => {
        logoutModal.style.display = "none"
      })
    }

    if (confirmLogout) {
      confirmLogout.addEventListener("click", () => {
        // Redirect to home page or perform logout action
        window.location.href = "../HTML/Home.html"
      })
    }

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === logoutModal) {
        logoutModal.style.display = "none"
      }
    })
  }
}

// Helper functions for getting and setting element values
function getElementValue(id) {
  const element = document.getElementById(id)
  return element ? element.value : ""
}

function setElementValue(id, value) {
  const element = document.getElementById(id)
  if (element) element.value = value
}

function getElementChecked(id) {
  const element = document.getElementById(id)
  return element ? element.checked : false
}

function setElementChecked(id, checked) {
  const element = document.getElementById(id)
  if (element) element.checked = checked
}

// Function to display current localStorage content for debugging
function inspectLocalStorage() {
  console.log("Current localStorage content:")
  console.log("aboutPageContent:", JSON.parse(localStorage.getItem("aboutPageContent") || "{}"))
  console.log("contactPageContent:", JSON.parse(localStorage.getItem("contactPageContent") || "{}"))
  console.log("homePageContent:", JSON.parse(localStorage.getItem("homePageContent") || "{}"))
  console.log("faqContent:", JSON.parse(localStorage.getItem("faqContent") || "[]"))
  console.log("colorSettings:", JSON.parse(localStorage.getItem("colorSettings") || "{}"))
  console.log("dashboardSettings:", JSON.parse(localStorage.getItem("dashboardSettings") || "{}"))
}

// Call inspectLocalStorage on page load to help with debugging
document.addEventListener("DOMContentLoaded", () => {
  inspectLocalStorage()
})

// Add this function to load hotlines content with preview support
function loadHotlinesContent() {
  console.log("Loading Hotlines content...")
  // Default content (from the original Hotlines.html)
  const defaultContent = {
    // Emergency Alert
    emergencyAlertTitle: "In case of emergency, dial 911",
    emergencyAlertDesc: "For immediate assistance in life-threatening situations",

    // National Hotlines
    national1Number: "911",
    national1Desc: "For all emergency situations",
    national2Number: "117",
    national2Desc: "Philippine National Police",
    national3Number: "(02) 8426-0219",
    national3Desc: "For fire emergencies",
    national4Number: "143 or (02) 8527-8385",
    national4Desc: "For medical emergencies and ambulance",

    // Barangay Hotlines
    barangay1Number: "8-983-92-98",
    barangay1Desc: "For immediate local assistance",
    barangay2Number: "(02) 8983-9298",
    barangay2Desc: "For security concerns within the barangay",
    barangay3Number: "(02) 8983-1234",
    barangay3Desc: "For health emergencies and concerns",
    barangay4Number: "(02) 8983-5678",
    barangay4Desc: "For disaster-related emergencies",

    // City Hotlines
    city1Number: "(02) 8789-3200",
    city1Desc: "24/7 emergency response center",
    city2Number: "(02) 8837-0707",
    city2Desc: "For police assistance",
    city3Number: "(02) 8837-4496",
    city3Desc: "For fire emergencies",
    city4Number: "(02) 8642-9982",
    city4Desc: "For rescue operations",

    // Emergency Tips
    emergencyTipsTitle: "Emergency Preparedness Tips",
    emergencyKitTitle: "Emergency Kit Essentials",
  }

  // Try to get saved content from localStorage
  let savedContent
  try {
    savedContent = JSON.parse(localStorage.getItem("hotlinesContent")) || defaultContent
  } catch (error) {
    console.error("Error loading hotlines content:", error)
    savedContent = defaultContent
  }

  // Get the hotlines tab container
  const hotlinesTab = document.getElementById("hotlines-tab")
  if (!hotlinesTab) {
    console.warn("Hotlines tab not found in the DOM")
    return
  }

  // Find all input fields in the hotlines tab
  const inputs = hotlinesTab.querySelectorAll("input, textarea")
  console.log(`Found ${inputs.length} input fields in hotlines tab`)

  // Set values in form fields
  inputs.forEach((input) => {
    if (input.id && savedContent[input.id]) {
      input.value = savedContent[input.id]
      console.log(`Set value for ${input.id}: ${input.value}`)

      // Add event listener for live preview
      input.addEventListener("input", updateHotlinesPreview)
    }
  })

  // Initialize preview
  updateHotlinesPreview()
}

// Add this function to handle hotlines preview
function updateHotlinesPreview() {
  const hotlinesPreview = document.getElementById("hotlinesPreview")
  if (!hotlinesPreview) return

  // Get values from form fields
  const emergencyAlertTitle = document.getElementById("emergencyAlertTitle")?.value || ""
  const emergencyAlertDesc = document.getElementById("emergencyAlertDesc")?.value || ""

  // National hotlines
  const national1Number = document.getElementById("national1Number")?.value || ""
  const national1Desc = document.getElementById("national1Desc")?.value || ""
  const national2Number = document.getElementById("national2Number")?.value || ""
  const national2Desc = document.getElementById("national2Desc")?.value || ""
  const national3Number = document.getElementById("national3Number")?.value || ""
  const national3Desc = document.getElementById("national3Desc")?.value || ""
  const national4Number = document.getElementById("national4Number")?.value || ""
  const national4Desc = document.getElementById("national4Desc")?.value || ""

  // Barangay hotlines
  const barangay1Number = document.getElementById("barangay1Number")?.value || ""
  const barangay1Desc = document.getElementById("barangay1Desc")?.value || ""
  const barangay2Number = document.getElementById("barangay2Number")?.value || ""
  const barangay2Desc = document.getElementById("barangay2Desc")?.value || ""
  const barangay3Number = document.getElementById("barangay3Number")?.value || ""
  const barangay3Desc = document.getElementById("barangay3Desc")?.value || ""
  const barangay4Number = document.getElementById("barangay4Number")?.value || ""
  const barangay4Desc = document.getElementById("barangay4Desc")?.value || ""

  // City hotlines
  const city1Number = document.getElementById("city1Number")?.value || ""
  const city1Desc = document.getElementById("city1Desc")?.value || ""
  const city2Number = document.getElementById("city2Number")?.value || ""
  const city2Desc = document.getElementById("city2Desc")?.value || ""
  const city3Number = document.getElementById("city3Number")?.value || ""
  const city3Desc = document.getElementById("city3Desc")?.value || ""
  const city4Number = document.getElementById("city4Number")?.value || ""
  const city4Desc = document.getElementById("city4Desc")?.value || ""

  // Emergency tips
  const emergencyTipsTitle = document.getElementById("emergencyTipsTitle")?.value || ""
  const emergencyKitTitle = document.getElementById("emergencyKitTitle")?.value || ""

  // Update preview content
  hotlinesPreview.innerHTML = `
    <div class="preview-section">
      <div class="emergency-alert-preview">
        <h3>${emergencyAlertTitle}</h3>
        <p>${emergencyAlertDesc}</p>
      </div>
      
      <h3 class="preview-title">National Hotlines</h3>
      <div class="hotlines-list">
        <div class="hotline-item">
          <div class="hotline-number">${national1Number}</div>
          <div class="hotline-desc">${national1Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${national2Number}</div>
          <div class="hotline-desc">${national2Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${national3Number}</div>
          <div class="hotline-desc">${national3Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${national4Number}</div>
          <div class="hotline-desc">${national4Desc}</div>
        </div>
      </div>
      
      <h3 class="preview-title">Barangay Hotlines</h3>
      <div class="hotlines-list">
        <div class="hotline-item">
          <div class="hotline-number">${barangay1Number}</div>
          <div class="hotline-desc">${barangay1Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${barangay2Number}</div>
          <div class="hotline-desc">${barangay2Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${barangay3Number}</div>
          <div class="hotline-desc">${barangay3Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${barangay4Number}</div>
          <div class="hotline-desc">${barangay4Desc}</div>
        </div>
      </div>
      
      <h3 class="preview-title">City Hotlines</h3>
      <div class="hotlines-list">
        <div class="hotline-item">
          <div class="hotline-number">${city1Number}</div>
          <div class="hotline-desc">${city1Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${city2Number}</div>
          <div class="hotline-desc">${city2Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${city3Number}</div>
          <div class="hotline-desc">${city3Desc}</div>
        </div>
        <div class="hotline-item">
          <div class="hotline-number">${city4Number}</div>
          <div class="hotline-desc">${city4Desc}</div>
        </div>
      </div>
      
      <h3 class="preview-title">${emergencyTipsTitle}</h3>
      <h4 class="preview-subtitle">${emergencyKitTitle}</h4>
    </div>
  `
}

// Add CSS styles for the preview sections
document.addEventListener("DOMContentLoaded", () => {
  // Add CSS for preview sections
  const style = document.createElement("style")
  style.textContent = `
    .preview-section {
      background-color: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      font-family: 'Noto Sans', sans-serif;
    }
    
    .preview-title {
      color: #0F2D70;
      font-size: 18px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .preview-subtitle {
      color: #0F2D70;
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    .contact-info-preview {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .contact-info-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .contact-icon {
      width: 24px;
      height: 24px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    
    .location-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230F2D70' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E");
    }
    
    .phone-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230F2D70' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E");
    }
    
    .email-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230F2D70' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'%3E%3C/path%3E%3Cpolyline points='22,6 12,13 2,6'%3E%3C/polyline%3E%3C/svg%3E");
    }
    
    .hero-preview {
      background-color: rgba(15, 45, 112, 0.1);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .hero-preview h2 {
      color: #0F2D70;
      margin-bottom: 10px;
    }
    
    .subtitle-preview {
      font-style: italic;
      color: #555;
      margin-bottom: 20px;
    }
    
    .vmg-preview, .values-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .vmg-item, .value-item {
      flex: 1;
      min-width: 200px;
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .vmg-item h4, .value-item h4 {
      color: #0F2D70;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .officials-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .official-item {
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      min-width: 200px;
    }
    
    .official-item h4 {
      margin: 0 0 5px 0;
      color: #0F2D70;
    }
    
    .official-item p {
      margin: 0;
      font-size: 14px;
      color: #555;
    }
    
    .emergency-alert-preview {
      background-color: #ffecec;
      border-left: 4px solid #ff5252;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    
    .emergency-alert-preview h3 {
      color: #d32f2f;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .hotlines-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .hotline-item {
      display: flex;
      background-color: white;
      padding: 10px 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .hotline-number {
      font-weight: bold;
      color: #0F2D70;
      min-width: 150px;
    }
    
    .hotline-desc {
      color: #555;
    }
  `
  document.head.appendChild(style)

  // Call loadHotlinesContent if it exists
  if (typeof loadHotlinesContent === "function") {
    loadHotlinesContent()
  }
})
