document.addEventListener("DOMContentLoaded", () => {
    // Load content from localStorage
    loadHomePageContent();
  });
  
  function loadHomePageContent() {
    // Try to get saved content from localStorage
    const savedContent = JSON.parse(localStorage.getItem('homePageContent'));
    
    // If no saved content, exit function
    if (!savedContent) return;
    
    // Update Hero Section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.textContent = savedContent.heroTitle;
    }
    
    const heroAddress = document.querySelector('.hero-address');
    if (heroAddress) {
      heroAddress.textContent = savedContent.heroAddress;
    }
    
    // Update About Section
    const aboutSubtitle = document.querySelector('.about-subtitle');
    if (aboutSubtitle) {
      aboutSubtitle.textContent = savedContent.aboutSubtitle;
    }
    
    // Update Vision, Mission, Goals
    const visionText = document.querySelector('.vision-text');
    if (visionText) {
      visionText.textContent = savedContent.visionText;
    }
    
    const missionText = document.querySelector('.mission-text');
    if (missionText) {
      missionText.textContent = savedContent.missionText;
    }
    
    const goalsText = document.querySelector('.goals-text');
    if (goalsText) {
      goalsText.textContent = savedContent.goalsText;
    }
    
    // Update Core Values
    const valueItems = document.querySelectorAll('.value-item');
    if (valueItems.length >= 3) {
      valueItems[0].innerHTML = `<span class="value-letter">N</span>${savedContent.nValue}`;
      valueItems[1].innerHTML = `<span class="value-letter">S</span>${savedContent.sValue}`;
      valueItems[2].innerHTML = `<span class="value-letter">V</span>${savedContent.vValue}`;
    }
    
    // Update Punong Barangay
    const chairmanName = document.querySelector('.chairman-profile .official-name');
    if (chairmanName) {
      chairmanName.textContent = savedContent.punongName;
    }
    
    const chairmanTitle = document.querySelector('.chairman-profile .official-title');
    if (chairmanTitle) {
      chairmanTitle.textContent = savedContent.punongTitle;
    }
    
    // Update Kagawads
    const kagawadNames = document.querySelectorAll('.kagawad-grid .official-name');
    const kagawadTitles = document.querySelectorAll('.kagawad-grid .official-title');
    const kagawadCommittees = document.querySelectorAll('.kagawad-grid .committee');
    
    // First row of kagawads (1-3)
    if (kagawadNames.length >= 3 && kagawadTitles.length >= 3 && kagawadCommittees.length >= 3) {
      kagawadNames[0].textContent = savedContent.kagawad1Name;
      kagawadTitles[0].textContent = savedContent.kagawad1Title;
      kagawadCommittees[0].textContent = savedContent.kagawad1Committee;
      
      kagawadNames[1].textContent = savedContent.kagawad2Name;
      kagawadTitles[1].textContent = savedContent.kagawad2Title;
      kagawadCommittees[1].textContent = savedContent.kagawad2Committee;
      
      kagawadNames[2].textContent = savedContent.kagawad3Name;
      kagawadTitles[2].textContent = savedContent.kagawad3Title;
      kagawadCommittees[2].textContent = savedContent.kagawad3Committee;
    }
    
    // Second row of kagawads (4-6)
    if (kagawadNames.length >= 6 && kagawadTitles.length >= 6 && kagawadCommittees.length >= 6) {
      kagawadNames[3].textContent = savedContent.kagawad4Name;
      kagawadTitles[3].textContent = savedContent.kagawad4Title;
      kagawadCommittees[3].textContent = savedContent.kagawad4Committee;
      
      kagawadNames[4].textContent = savedContent.kagawad5Name;
      kagawadTitles[4].textContent = savedContent.kagawad5Title;
      kagawadCommittees[4].textContent = savedContent.kagawad5Committee;
      
      kagawadNames[5].textContent = savedContent.kagawad6Name;
      kagawadTitles[5].textContent = savedContent.kagawad6Title;
      kagawadCommittees[5].textContent = savedContent.kagawad6Committee;
    }
    
    // Update Appointive Officials
    const appointiveNames = document.querySelectorAll('.appointive-grid .official-name, .appointive-grid-2 .official-name');
    const appointiveTitles = document.querySelectorAll('.appointive-grid .official-title, .appointive-grid-2 .official-title');
    
    if (appointiveNames.length >= 6 && appointiveTitles.length >= 6) {
      // Kagawad 7 and SK Chairman (in appointive-grid)
      appointiveNames[0].textContent = savedContent.kagawad7Name;
      appointiveTitles[0].textContent = savedContent.kagawad7Title;
      
      appointiveNames[1].textContent = savedContent.skName;
      appointiveTitles[1].textContent = savedContent.skTitle;
      
      // Other appointive officials (in appointive-grid-2)
      appointiveNames[2].textContent = savedContent.treasurerName;
      appointiveTitles[2].textContent = savedContent.treasurerTitle;
      
      appointiveNames[3].textContent = savedContent.secretaryName;
      appointiveTitles[3].textContent = savedContent.secretaryTitle;
      
      appointiveNames[4].textContent = savedContent.adminName;
      appointiveTitles[4].textContent = savedContent.adminTitle;
      
      appointiveNames[5].textContent = savedContent.ceoName;
      appointiveTitles[5].textContent = savedContent.ceoTitle;
    }
  }