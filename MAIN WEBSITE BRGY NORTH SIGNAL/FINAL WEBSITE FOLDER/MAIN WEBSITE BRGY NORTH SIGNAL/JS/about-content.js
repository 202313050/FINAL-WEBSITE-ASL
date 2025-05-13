document.addEventListener("DOMContentLoaded", () => {
    // Load content from localStorage
    loadAboutPageContent();
  });
  
  function loadAboutPageContent() {
    // Try to get saved content from localStorage
    const savedContent = JSON.parse(localStorage.getItem('aboutPageContent'));
  
    // If no saved content, exit function
    if (!savedContent) return;
  
    // Update About North Signal Village section
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.textContent = savedContent.aboutNorthSignal;
    }
  
    // Update History section with the combined content
    const historySection = document.querySelector('.history-section');
    if (historySection && savedContent.historyContent) {
      // Clear existing paragraphs
      const existingParagraphs = historySection.querySelectorAll('.history-text');
      existingParagraphs.forEach(p => p.remove());
      
      // Create new paragraphs from the combined content
      const paragraphs = savedContent.historyContent.split('\n\n');
      paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
          const p = document.createElement('p');
          p.className = 'history-text';
          p.textContent = paragraph;
          historySection.appendChild(p);
        }
      });
    }
  
    // Update Geography details
    const geographyDetails = document.querySelector('.geography-details');
    if (geographyDetails) {
      // Update location
      const locationElement = geographyDetails.querySelector('p:first-child');
      if (locationElement) {
        locationElement.innerHTML = `<strong>A. Location - </strong>${savedContent.geoLocation}`;
      }
      
      // Update boundaries
      const boundaryElements = geographyDetails.querySelectorAll('ul:first-of-type li');
      if (boundaryElements.length >= 4) {
        boundaryElements[0].textContent = savedContent.geoBoundaryNorth;
        boundaryElements[1].textContent = savedContent.geoBoundarySouth;
        boundaryElements[2].textContent = savedContent.geoBoundaryEast;
        boundaryElements[3].textContent = savedContent.geoBoundaryWest;
      }
      
      // Update other geography details
      const landAreaElement = geographyDetails.querySelector('p:nth-of-type(3)');
      if (landAreaElement) {
        landAreaElement.innerHTML = `<strong>C. Total Land Area - </strong>${savedContent.geoLandArea}`;
      }
      
      const elevationElement = geographyDetails.querySelector('p:nth-of-type(4)');
      if (elevationElement) {
        elevationElement.innerHTML = `<strong>D. Elevation - </strong>${savedContent.geoElevation}`;
      }
      
      const landClassElement = geographyDetails.querySelector('p:nth-of-type(5)');
      if (landClassElement) {
        landClassElement.innerHTML = `<strong>E. Land Classification: </strong>${savedContent.geoLandClass}`;
      }
      
      const economicSourceElement = geographyDetails.querySelector('p:nth-of-type(6)');
      if (economicSourceElement) {
        economicSourceElement.innerHTML = `<strong>F. Major Economic Source: </strong>${savedContent.geoEconomicSource}`;
      }
    }
  }