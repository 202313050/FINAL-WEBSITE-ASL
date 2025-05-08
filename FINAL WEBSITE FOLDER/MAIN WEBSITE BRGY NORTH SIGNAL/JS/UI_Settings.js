document.addEventListener("DOMContentLoaded", () => {
  // Initialize tabs
  initTabs()

  // Initialize accordions
  initAccordions()

  // Load content for About and Home pages
  loadAboutPageContent()
  loadHomePageContent()

  // Load dashboard settings
  loadDashboardSettings()

  // Add event listeners
  document.getElementById("saveSettingsBtn").addEventListener("click", saveAllSettings)

  // Add event listeners for dashboard settings
  initThemeOptions()
  initFontSizeSlider()
  initSidebarPosition()
  initLayoutOptions()
  initCardStyleOptions()

  // Initialize FAQ functionality
  initFaqEditor()
})

// Save all settings
function saveAllSettings() {
  // Save About page content
  saveAboutPageContent()

  // Save Home page content
  saveHomePageContent()

  // Save Dashboard settings
  saveDashboardSettings()

  // Save Color settings
  saveColorSettings()

  // Save FAQ content
  saveFaqContent()

  // Show success message
  showSuccessMessage()
}

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  // Set the first tab as active by default
  tabButtons[0].classList.add("active")
  document.getElementById("dashboard-tab").classList.add("active")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      const tabId = `${button.dataset.tab}-tab`
      document.getElementById(tabId).classList.add("active")

      // Scroll to the tab content for better UX
      document.getElementById(tabId).scrollIntoView({ behavior: "smooth", block: "start" })
    })
  })
}

// Color Settings Management
function initColorSettings() {
  // Load saved color settings
  loadColorSettings()

  // Add event listeners for color inputs
  document.getElementById("headerColor").addEventListener("input", updateColorPreview)
  document.getElementById("footerColor").addEventListener("input", updateColorPreview)
  document.getElementById("textColor").addEventListener("input", updateColorPreview)
  document.getElementById("accentColor").addEventListener("input", updateColorPreview)
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
  const savedColors = JSON.parse(localStorage.getItem("colorSettings")) || defaultColors

  // Set form values
  document.getElementById("headerColor").value = savedColors.headerColor
  document.getElementById("footerColor").value = savedColors.footerColor
  document.getElementById("textColor").value = savedColors.textColor
  document.getElementById("accentColor").value = savedColors.accentColor

  // Apply colors to preview
  updateColorPreview()
}

function updateColorPreview() {
  // Get current color values
  const headerColor = document.getElementById("headerColor").value
  const footerColor = document.getElementById("footerColor").value
  const textColor = document.getElementById("textColor").value
  const accentColor = document.getElementById("accentColor").value

  // Update preview elements
  const headerPreview = document.querySelector(".header-color-preview")
  const footerPreview = document.querySelector(".footer-color-preview")
  const textPreview = document.querySelector(".text-color-preview")
  const accentPreview = document.querySelector(".accent-color-preview")

  headerPreview.style.backgroundColor = headerColor
  footerPreview.style.backgroundColor = footerColor
  textPreview.style.backgroundColor = textColor
  accentPreview.style.backgroundColor = accentColor

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
  const colorSettings = {
    headerColor: document.getElementById("headerColor").value,
    footerColor: document.getElementById("footerColor").value,
    textColor: document.getElementById("textColor").value,
    accentColor: document.getElementById("accentColor").value,
  }

  // Save to localStorage
  localStorage.setItem("colorSettings", JSON.stringify(colorSettings))
}

function applyColorSettings() {
  // Get current color values (either from inputs or localStorage)
  let headerColor, footerColor, textColor, accentColor

  // If we're on the settings page, get values from inputs
  if (document.getElementById("headerColor")) {
    headerColor = document.getElementById("headerColor").value
    footerColor = document.getElementById("footerColor").value
    textColor = document.getElementById("textColor").value
    accentColor = document.getElementById("accentColor").value
  }
  // Otherwise, get from localStorage
  else {
    const savedColors = JSON.parse(localStorage.getItem("colorSettings"))
    if (!savedColors) return // Exit if no saved settings

    headerColor = savedColors.headerColor
    footerColor = savedColors.footerColor
    textColor = savedColors.textColor
    accentColor = savedColors.accentColor
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
  const accordionHeaders = document.querySelectorAll(".accordion-header")

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling
      const toggle = header.querySelector(".accordion-toggle")

      if (content.classList.contains("active")) {
        content.classList.remove("active")
        toggle.textContent = "+"
      } else {
        content.classList.add("active")
        toggle.textContent = "-"
      }
    })
  })
}

// About Page Content Management
function loadAboutPageContent() {
  // Default content (from the original About.html)
  const defaultContent = {
    aboutNorthSignal:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin bibendum libero, at euismod odio ultrices vel. Donec feugiat magna at eros ullamcorper ipsum. Fusce id amet sodales elit. Nam auctor nisl ipsum, id fringilla nibh sodales fermentum. Donec id eros ipsum. Curabitur eleifend purus non neque tempor semper. Curabitur consectetur fermentum tortor, quis feugiat lacus. Donec consectetur pellentesque mattis, non mattis sapien ornare et. Duis consectetur, eros id pretium eleifend, velit est volutpat nunc, in malesuada torquent per conubia nostra, per inceptos himenaeos.",
    historyContent:
      'In 2008, with the success in the political subdivision of mother Barangay Signal Village now known as Central Village into four (4) barangays, Barangay North Signal Village was born by virtue of City Ordinance No. 58 Series of 2008 otherwise known as "An ordinance creating a barangay to be known as "Barangay North Signal Village in the City of Taguig, Metro Manila which was enacted on September 22, 2008 and ratified through a plebiscite on December 19, 2008 with affirmative votes of 3,907.\n\nOn April 4, 2009, Barangay North Signal Village officially came into existence upon the appointment of competent barangay officials by the City Government of Taguig to run its administrative and governmental affairs and function.\n\nThe appointed barangay officials of North Signal Village were Punong Barangay Richard Paul T. Jordan and members of the Sangguniang Barangay: Kagawad Jesus J. Pullente, Kagawad Nolan C. Peña, Kagawad Melquiades M. Isabedra, Kagawad Francisco M. Moyano, Kagawad Melinde S. Generaol, Kagawad Angielyn A. Bombase, Kagawad Jovita C. Villar, Barangay Treasurer Evelyn E. Hernandez, Barangay Secretary Rochelle W. Madelo, Barangay Chief Executive Jorge C. Tabug.\n\nThe Sangguniang Barangay of North Signal Village was motivated by its vision as a verdant community that is business friendly, peaceful, healthy and livable and guided by its mission to enable its citizenry gain access to education, skills and livelihood training, sports and other programs that can equip and make them capable of earning an income to help raise their standard of living to live productive and decent lives and to be able to actively carryout the mandate and ensure transparency, honesty and efficiency in the delivery of services in the barangay.\n\nBarangay North Signal Village derived source of income from real property taxes (RPT) and city aid from the Local Government of Taguig City.\n\nNorth Signal Village for brevity is temporarily house in the small building donated by STP-Pinagsama Project, Ipil-Ipil Street, North Signal Village, Taguig City after its creation on 2009\n\nToday, Barangay North Signal Village has a three-storey building where each department has its own office such as the Barangay Captain, Administration, Treasury, Secretariat and the Lupon Tagapamayapa.',
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
  const savedContent = JSON.parse(localStorage.getItem("aboutPageContent")) || defaultContent

  // Set values in form fields
  document.getElementById("aboutNorthSignal").value = savedContent.aboutNorthSignal
  document.getElementById("historyContent").value = savedContent.historyContent
  document.getElementById("geoLocation").value = savedContent.geoLocation
  document.getElementById("geoBoundaryNorth").value = savedContent.geoBoundaryNorth
  document.getElementById("geoBoundarySouth").value = savedContent.geoBoundarySouth
  document.getElementById("geoBoundaryEast").value = savedContent.geoBoundaryEast
  document.getElementById("geoBoundaryWest").value = savedContent.geoBoundaryWest
  document.getElementById("geoLandArea").value = savedContent.geoLandArea
  document.getElementById("geoElevation").value = savedContent.geoElevation
  document.getElementById("geoLandClass").value = savedContent.geoLandClass
  document.getElementById("geoEconomicSource").value = savedContent.geoEconomicSource
}

function saveAboutPageContent() {
  const content = {
    aboutNorthSignal: document.getElementById("aboutNorthSignal").value,
    historyContent: document.getElementById("historyContent").value,
    geoLocation: document.getElementById("geoLocation").value,
    geoBoundaryNorth: document.getElementById("geoBoundaryNorth").value,
    geoBoundarySouth: document.getElementById("geoBoundarySouth").value,
    geoBoundaryEast: document.getElementById("geoBoundaryEast").value,
    geoBoundaryWest: document.getElementById("geoBoundaryWest").value,
    geoLandArea: document.getElementById("geoLandArea").value,
    geoElevation: document.getElementById("geoElevation").value,
    geoLandClass: document.getElementById("geoLandClass").value,
    geoEconomicSource: document.getElementById("geoEconomicSource").value,
  }

  // Save to localStorage
  localStorage.setItem("aboutPageContent", JSON.stringify(content))
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
      "North Signal Village aims to enable its citizenry gain access to education, skills and livelihood training, sports and other programs that can equip and make them capable of earning an income to help raise their standard of living to live productive and decent lives. And to be able to actively carry out the mandates and ensure transparency, honesty and efficiency in the delivery of services in the barangay.",
    goalsText:
      "To improve the living standard; provide health and safety, promote prosperity; improve moral, peace and pride, comfort and convenience of the inhabitants of Barangay North Signal Village, Taguig City.",
    nValue: "No to all illegal activities",
    sValue: "Service centered",
    vValue: "Values oriented",
    punongName: "DANILO G. CASTRO",
    punongTitle: "PUNONG BARANGAY",
    kagawad1Name: "JIMMY A. GOMEZ",
    kagawad1Title: "BARANGAY KAGAWAD",
    kagawad1Committee: "Committee on Public Utilities",
    kagawad2Name: "RICARDO T. JORDAN JR.",
    kagawad2Title: "BARANGAY KAGAWAD",
    kagawad2Committee:
      "Committee on Ways and Means; Ethics and Internal Government; Public Works and Infrastructures; Senior Citizen Affairs",
    kagawad3Name: "JOSEPH D. QUIJANO",
    kagawad3Title: "BARANGAY KAGAWAD",
    kagawad3Committee:
      "Committee on Peace and Order; Barangay Disaster Risk Reduction and Management; Drug Abuse Prevention and Control",
    kagawad4Name: "JONAS T. BARCA",
    kagawad4Title: "BARANGAY KAGAWAD",
    kagawad4Committee:
      "Committee on Employment; Training and Livelihood; Communications and Public Information; Arts, Culture, and Tourism",
    kagawad5Name: "YOLANDA C. VELASCO",
    kagawad5Title: "BARANGAY KAGAWAD",
    kagawad5Committee:
      "Committee on Environmental Protection and Ecology; Public Sanitation; Health and Nutrition; Persons with Disabilities; Social Services",
    kagawad6Name: "RONALD M. RAMIREZ",
    kagawad6Title: "BARANGAY KAGAWAD",
    kagawad6Committee:
      "Committee on Recreation and Amusement; Agriculture; Physical and Sports Development; Traffic Management; Transportation",
    kagawad7Name: "REGINA S. INGCO",
    kagawad7Title: "BARANGAY KAGAWAD",
    kagawad7Committee: "Committee on Finance and Appropriations; Education; Women and Family Affairs",
    skName: "CHRISHA MAE C. MATA",
    skTitle: "SK CHAIRMAN",
    treasurerName: "NOLAN C. PEÑA",
    treasurerTitle: "BARANGAY TREASURER",
    secretaryName: "ROMINA E. LOZADA",
    secretaryTitle: "BARANGAY SECRETARY",
    adminName: "ANTONIO B. DIEGO",
    adminTitle: "BARANGAY ADMINISTRATOR",
    ceoName: "WILSON S. PADILLON",
    ceoTitle: "CHIEF EXECUTIVE OFFICER – BSF",
  }

  // Try to get saved content from localStorage
  const savedContent = JSON.parse(localStorage.getItem("homePageContent")) || defaultContent

  // Set values in form fields
  document.getElementById("heroTitle").value = savedContent.heroTitle
  document.getElementById("heroAddress").value = savedContent.heroAddress
  document.getElementById("aboutSubtitle").value = savedContent.aboutSubtitle
  document.getElementById("visionText").value = savedContent.visionText
  document.getElementById("missionText").value = savedContent.missionText
  document.getElementById("goalsText").value = savedContent.goalsText
  document.getElementById("nValue").value = savedContent.nValue
  document.getElementById("sValue").value = savedContent.sValue
  document.getElementById("vValue").value = savedContent.vValue
  document.getElementById("punongName").value = savedContent.punongName
  document.getElementById("punongTitle").value = savedContent.punongTitle
  document.getElementById("kagawad1Name").value = savedContent.kagawad1Name
  document.getElementById("kagawad1Title").value = savedContent.kagawad1Title
  document.getElementById("kagawad1Committee").value = savedContent.kagawad1Committee
  document.getElementById("kagawad2Name").value = savedContent.kagawad2Name
  document.getElementById("kagawad2Title").value = savedContent.kagawad2Title
  document.getElementById("kagawad2Committee").value = savedContent.kagawad2Committee
  document.getElementById("kagawad3Name").value = savedContent.kagawad3Name
  document.getElementById("kagawad3Title").value = savedContent.kagawad3Title
  document.getElementById("kagawad3Committee").value = savedContent.kagawad3Committee
  document.getElementById("kagawad4Name").value = savedContent.kagawad4Name
  document.getElementById("kagawad4Title").value = savedContent.kagawad4Title
  document.getElementById("kagawad4Committee").value = savedContent.kagawad4Committee
  document.getElementById("kagawad5Name").value = savedContent.kagawad5Name
  document.getElementById("kagawad5Title").value = savedContent.kagawad5Title
  document.getElementById("kagawad5Committee").value = savedContent.kagawad5Committee
  document.getElementById("kagawad6Name").value = savedContent.kagawad6Name
  document.getElementById("kagawad6Title").value = savedContent.kagawad6Title
  document.getElementById("kagawad6Committee").value = savedContent.kagawad6Committee
  document.getElementById("kagawad7Name").value = savedContent.kagawad7Name
  document.getElementById("kagawad7Title").value = savedContent.kagawad7Title
  document.getElementById("kagawad7Committee").value = savedContent.kagawad7Committee
  document.getElementById("skName").value = savedContent.skName
  document.getElementById("skTitle").value = savedContent.skTitle
  document.getElementById("treasurerName").value = savedContent.treasurerName
  document.getElementById("treasurerTitle").value = savedContent.treasurerTitle
  document.getElementById("secretaryName").value = savedContent.secretaryName
  document.getElementById("secretaryTitle").value = savedContent.secretaryTitle
  document.getElementById("adminName").value = savedContent.adminName
  document.getElementById("adminTitle").value = savedContent.adminTitle
  document.getElementById("ceoName").value = savedContent.ceoName
  document.getElementById("ceoTitle").value = savedContent.ceoTitle
}

function saveHomePageContent() {
  const content = {
    heroTitle: document.getElementById("heroTitle").value,
    heroAddress: document.getElementById("heroAddress").value,
    aboutSubtitle: document.getElementById("aboutSubtitle").value,
    visionText: document.getElementById("visionText").value,
    missionText: document.getElementById("missionText").value,
    goalsText: document.getElementById("goalsText").value,
    nValue: document.getElementById("nValue").value,
    sValue: document.getElementById("sValue").value,
    vValue: document.getElementById("vValue").value,
    punongName: document.getElementById("punongName").value,
    punongTitle: document.getElementById("punongTitle").value,
    kagawad1Name: document.getElementById("kagawad1Name").value,
    kagawad1Title: document.getElementById("kagawad1Title").value,
    kagawad1Committee: document.getElementById("kagawad1Committee").value,
    kagawad2Name: document.getElementById("kagawad2Name").value,
    kagawad2Title: document.getElementById("kagawad2Title").value,
    kagawad2Committee: document.getElementById("kagawad2Committee").value,
    kagawad3Name: document.getElementById("kagawad3Name").value,
    kagawad3Title: document.getElementById("kagawad3Title").value,
    kagawad3Committee: document.getElementById("kagawad3Committee").value,
    kagawad4Name: document.getElementById("kagawad4Name").value,
    kagawad4Title: document.getElementById("kagawad4Title").value,
    kagawad4Committee: document.getElementById("kagawad4Committee").value,
    kagawad5Name: document.getElementById("kagawad5Name").value,
    kagawad5Title: document.getElementById("kagawad5Title").value,
    kagawad5Committee: document.getElementById("kagawad5Committee").value,
    kagawad6Name: document.getElementById("kagawad6Name").value,
    kagawad6Title: document.getElementById("kagawad6Title").value,
    kagawad6Committee: document.getElementById("kagawad6Committee").value,
    kagawad7Name: document.getElementById("kagawad7Name").value,
    kagawad7Title: document.getElementById("kagawad7Title").value,
    kagawad7Committee: document.getElementById("kagawad7Committee").value,
    skName: document.getElementById("skName").value,
    skTitle: document.getElementById("skTitle").value,
    treasurerName: document.getElementById("treasurerName").value,
    treasurerTitle: document.getElementById("treasurerTitle").value,
    secretaryName: document.getElementById("secretaryName").value,
    secretaryTitle: document.getElementById("secretaryTitle").value,
    adminName: document.getElementById("adminName").value,
    adminTitle: document.getElementById("adminTitle").value,
    ceoName: document.getElementById("ceoName").value,
    ceoTitle: document.getElementById("ceoTitle").value,
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
  const savedSettings = JSON.parse(localStorage.getItem("dashboardSettings")) || defaultSettings

  // Apply settings to the page
  applyTheme(savedSettings.theme)
  applyFontSize(savedSettings.fontSize)
  applySidebarPosition(savedSettings.sidebarPosition)
  applyLayout(savedSettings.layout)
  applyCardStyle(savedSettings.cardStyle)

  // Set form values
  document.querySelector(`.theme-option[data-theme="${savedSettings.theme}"]`).classList.add("active")
  document.getElementById("fontSizeSlider").value = getFontSizeValue(savedSettings.fontSize)
  document.querySelector(`input[name="sidebarPosition"][value="${savedSettings.sidebarPosition}"]`).checked = true
  document.querySelector(`.layout-option[data-layout="${savedSettings.layout}"]`).classList.add("active")
  document.querySelector(`.card-style-option[data-card-style="${savedSettings.cardStyle}"]`).classList.add("active")
  document.getElementById("showQuickStats").checked = savedSettings.showQuickStats
  document.getElementById("showRecentActivity").checked = savedSettings.showRecentActivity
  document.getElementById("desktopNotifications").checked = savedSettings.desktopNotifications
  document.getElementById("emailNotifications").checked = savedSettings.emailNotifications
  document.getElementById("newRequestAlerts").checked = savedSettings.newRequestAlerts
  document.getElementById("systemUpdates").checked = savedSettings.systemUpdates
  document.getElementById("notificationSound").value = savedSettings.notificationSound
}

function saveDashboardSettings() {
  const settings = {
    theme: document.querySelector(".theme-option.active").dataset.theme,
    fontSize: getFontSizeName(document.getElementById("fontSizeSlider").value),
    sidebarPosition: document.querySelector('input[name="sidebarPosition"]:checked').value,
    layout: document.querySelector(".layout-option.active").dataset.layout,
    cardStyle: document.querySelector(".card-style-option.active").dataset.cardStyle,
    showQuickStats: document.getElementById("showQuickStats").checked,
    showRecentActivity: document.getElementById("showRecentActivity").checked,
    desktopNotifications: document.getElementById("desktopNotifications").checked,
    emailNotifications: document.getElementById("emailNotifications").checked,
    newRequestAlerts: document.getElementById("newRequestAlerts").checked,
    systemUpdates: document.getElementById("systemUpdates").checked,
    notificationSound: document.getElementById("notificationSound").value,
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
      applyTheme(option.dataset.theme)
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
      applyLayout(option.dataset.layout)
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
      applyCardStyle(option.dataset.cardStyle)
    })
  })
}

function applyCardStyle(cardStyle) {
  // Remove all card style classes
  document.body.classList.remove("card-style-default", "card-style-flat", "card-style-shadow")

  // Add selected card style class
  document.body.classList.add(`card-style-${cardStyle}`)
}

// Add this function to save FAQ content
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
  console.log("FAQ content saved:", faqData) // Debug log
}

// Show success message
function showSuccessMessage() {
  const successMessage = document.getElementById("successMessage")
  successMessage.style.display = "block"

  // Hide message after 3 seconds
  setTimeout(() => {
    successMessage.style.display = "none"
  }, 3000)
}

// FAQ Editor functionality
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

// Add this function to load saved FAQ content
function loadFaqContent() {
  const faqContainer = document.querySelector(".faq-items-container")
  if (!faqContainer) return

  const savedFaqs = localStorage.getItem("faqContent")
  if (!savedFaqs) return

  try {
    const faqData = JSON.parse(savedFaqs)

    if (!faqData || faqData.length === 0) return

    // Clear all existing FAQ items
    while (faqContainer.firstChild) {
      faqContainer.removeChild(faqContainer.firstChild)
    }

    // Create new FAQ items for each saved FAQ
    faqData.forEach((faq, index) => {
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

    console.log("FAQ content loaded successfully:", faqData)
  } catch (error) {
    console.error("Error loading FAQ content:", error)
  }
}

// Helper function to add FAQ item with specific content
function addFaqItemWithContent(question, answer) {
  const faqContainer = document.querySelector(".faq-items-container")
  const faqItems = faqContainer.querySelectorAll(".faq-item")
  const newIndex = faqItems.length + 1

  // Create new FAQ item
  const newItem = document.createElement("div")
  newItem.className = "official-edit-container faq-item"
  newItem.innerHTML = `
    <h4>FAQ Item ${newIndex}</h4>
    <div class="field-container">
      <label>Question</label>
      <input type="text" id="faqQuestion${newIndex}" class="content-input" value="${question}">
    </div>
    <div class="field-container">
      <label>Answer</label>
      <textarea id="faqAnswer${newIndex}" class="content-editor" rows="3">${answer}</textarea>
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

// Add new FAQ item
function addFaqItem() {
  const faqContainer = document.querySelector(".faq-items-container")
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
  const faqPreviewContainer = document.querySelector(".faq-preview-container")

  // Clear existing preview content
  faqPreviewContainer.innerHTML = ""

  faqItems.forEach((item) => {
    const questionInput = item.querySelector('input[id^="faqQuestion"]')
    const answerTextarea = item.querySelector('textarea[id^="faqAnswer"]')

    if (questionInput && answerTextarea) {
      const question = questionInput.value.trim()
      const answer = answerTextarea.value.trim()

      if (question && answer) {
        // Create preview elements
        const questionElement = document.createElement("h4")
        questionElement.textContent = question

        const answerElement = document.createElement("p")
        answerElement.textContent = answer

        // Append to preview container
        faqPreviewContainer.appendChild(questionElement)
        faqPreviewContainer.appendChild(answerElement)
      }
    }
  })
}
// Initialize content editor when on the UI Settings page
document.addEventListener("DOMContentLoaded", () => {
  // Add Content Editor tab
  addContentEditorTab();
});

// Add Content Editor tab to UI Settings
function addContentEditorTab() {
  // Create new tab button
  const tabsContainer = document.querySelector(".content-tabs");
  if (!tabsContainer) return;
  
  const editorTabButton = document.createElement("button");
  editorTabButton.className = "tab-button";
  editorTabButton.dataset.tab = "editor";
  editorTabButton.textContent = "Content Editor";
  tabsContainer.appendChild(editorTabButton);
  
  // Create tab content
  const tabsContent = document.querySelector(".settings-container");
  if (!tabsContent) return;
  
  const editorTabContent = document.createElement("div");
  editorTabContent.className = "settings-card tab-content";
  editorTabContent.id = "editor-tab";
  
  editorTabContent.innerHTML = `
    <div class="settings-header">
        <h2>Visual Content Editor</h2>
        <p>Edit your website content directly on the page</p>
    </div>
    <div class="settings-content">
        <div class="settings-section">
            <div class="settings-header">
                <h3>Editor Controls</h3>
                <p>Manage your content changes across your website</p>
            </div>
            <div class="settings-group">
                <p>You can edit your website content directly on the page by clicking the edit button in the bottom right corner of any page.</p>
                <p>All content changes are stored locally and will be applied automatically when a page loads.</p>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button id="openContentManager" class="save-settings-button">
                        Open Content Manager
                    </button>
                    <button id="clearAllChanges" class="save-settings-button" style="background-color: #dc3545;">
                        Clear All Changes
                    </button>
                </div>
            </div>
        </div>
        
        <div class="settings-section">
            <div class="settings-header">
                <h3>Current Changes</h3>
                <p>View and manage the changes you've made</p>
            </div>
            <div id="changesContainer" class="settings-group">
                <div class="changes-list" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                    <p style="color: #666;">Loading changes...</p>
                </div>
            </div>
        </div>
    </div>
  `;
  
  tabsContent.appendChild(editorTabContent);
  
  // Add event listeners
  document.getElementById("openContentManager").addEventListener("click", () => {
    if (typeof showPageContentManager === 'function') {
      showPageContentManager();
    } else {
      alert('Content editor not loaded. Please reload the page and try again.');
    }
  });
  
  document.getElementById("clearAllChanges").addEventListener("click", () => {
    if (confirm('Are you sure you want to clear all content changes? This cannot be undone.')) {
      localStorage.removeItem('pageChanges');
      loadContentChanges();
      showSuccessMessage('All content changes cleared!');
    }
  });
  
  // Load content changes
  loadContentChanges();
  
  // Add tab functionality
  document.querySelector(`button[data-tab="editor"]`).addEventListener("click", () => {
    // Update changes list when tab is activated
    loadContentChanges();
  });
}

// Load content changes into the editor tab
function loadContentChanges() {
  const changesContainer = document.getElementById("changesContainer");
  if (!changesContainer) return;
  
  const changesList = changesContainer.querySelector(".changes-list");
  if (!changesList) return;
  
  // Get saved changes
  const savedChanges = JSON.parse(localStorage.getItem("pageChanges")) || [];
  
  if (savedChanges.length === 0) {
    changesList.innerHTML = '<p style="padding: 10px; color: #666;">No saved changes found.</p>';
    return;
  }
  
  // Group changes by page
  const changesByPage = {};
  savedChanges.forEach(change => {
    if (!changesByPage[change.page]) {
      changesByPage[change.page] = [];
    }
    changesByPage[change.page].push(change);
  });
  
  // Generate HTML for changes list
  let html = '';
  
  // For each page
  for (const page in changesByPage) {
    html += `<div class="page-changes" style="margin-bottom: 20px;">
      <h4 style="margin-top: 0;">${page}</h4>
      <div class="page-changes-list">`;
    
    // For each change in the page
    changesByPage[page].forEach(change => {
      let changeDescription = '';
      if (change.changeType === 'image') {
        changeDescription = `Image: ${change.selector}`;
      } else {
        const content = change.content.length > 30 ? change.content.substring(0, 30) + '...' : change.content;
        changeDescription = `Text: ${content}`;
      }
      
      html += `<div class="change-item" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <span class="change-description">${changeDescription}</span>
        <div class="change-actions">
          <button class="btn-delete-change" data-page="${change.page}" data-selector="${change.selector}" style="background-color: #dc3545; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Delete</button>
        </div>
      </div>`;
    });
    
    html += `</div></div>`;
  }
  
  // Set HTML
  changesList.innerHTML = html;
  
  // Add event listeners for delete buttons
  changesList.querySelectorAll('.btn-delete-change').forEach(button => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      const selector = button.dataset.selector;
      
      // Delete change
      deleteContentChange(page, selector);
      
      // Update changes list
      loadContentChanges();
    });
  });
}

// Delete a specific content change
function deleteContentChange(page, selector) {
  // Get saved changes
  const savedChanges = JSON.parse(localStorage.getItem("pageChanges")) || [];
  
  // Filter out the change to delete
  const filteredChanges = savedChanges.filter(change => 
    !(change.page === page && change.selector === selector)
  );
  
  // Save updated changes
  localStorage.setItem("pageChanges", JSON.stringify(filteredChanges));
  
  // Show success message
  showSuccessMessage('Content change deleted!');
}