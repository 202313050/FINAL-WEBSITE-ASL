// This script applies the page-specific colors saved in the UI Settings
document.addEventListener("DOMContentLoaded", () => {
    // Determine which page we're on
    const path = window.location.pathname;
    const pageName = path.split("/").pop().toLowerCase();
  
    // Check if global header colors should be used
    const useGlobalHeaderColors = localStorage.getItem("useGlobalHeaderColors") === "true";
  
    // Apply global header colors if enabled
    if (useGlobalHeaderColors) {
      applyGlobalHeaderColors();
    }
  
    // Apply colors based on the current page
    if (pageName.includes("about")) {
      applyPageColors("about");
    } else if (pageName.includes("faq")) {
      applyPageColors("faq");
    } else if (pageName.includes("contact")) {
      applyPageColors("contact");
    } else if (pageName.includes("home") || pageName === "" || pageName === "index.html") {
      applyPageColors("home");
    }
  
    // Function to apply global header colors
    function applyGlobalHeaderColors() {
      const globalHeaderColor = localStorage.getItem("globalHeaderColor");
      const globalTitleColor = localStorage.getItem("globalTitleColor");
  
      if (globalHeaderColor) {
        // Apply to main header elements
        const headerElements = document.querySelectorAll(".header-background path, .main-header, .top-header, .main-nav");
        headerElements.forEach((el) => {
          if (el.tagName.toLowerCase() === "path") {
            el.setAttribute("fill", globalHeaderColor);
          } else {
            el.style.backgroundColor = globalHeaderColor;
          }
        });
      }
  
      if (globalTitleColor) {
        // Apply to header title sections
        const historyTitle = document.querySelector(".history-title");
        if (historyTitle) historyTitle.style.color = globalTitleColor;
  
        const sectionTitles = document.querySelectorAll(".section-title");
        sectionTitles.forEach((title) => {
          title.style.color = globalTitleColor;
        });
  
        // Apply to other title elements
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle) heroTitle.style.color = globalTitleColor;
  
        const aboutTitle = document.querySelector(".about-title");
        if (aboutTitle) aboutTitle.style.color = globalTitleColor;
  
        const officialsTitle = document.querySelector(".officials-title");
        if (officialsTitle) officialsTitle.style.color = globalTitleColor;
  
        const faqQuestions = document.querySelectorAll(".faq-question h4");
        faqQuestions.forEach((question) => {
          question.style.color = globalTitleColor;
        });
      }
    }
  
    function applyPageColors(pageType) {
      // Get saved colors from localStorage
      const storageKey = `${pageType}PageColors`;
      const savedColors = localStorage.getItem(storageKey);
  
      if (savedColors) {
        const colors = JSON.parse(savedColors);
  
        // Apply colors to the page
        document.body.style.backgroundColor = colors.backgroundColor;
        document.body.style.color = colors.textColor;
  
        // Apply to header elements only if global header colors are not enabled
        if (!useGlobalHeaderColors) {
          const headerElements = document.querySelectorAll(
            ".header-background path, .main-header, .top-header, .main-nav"
          );
          headerElements.forEach((el) => {
            if (el.tagName.toLowerCase() === "path") {
              el.setAttribute("fill", colors.headerColor);
            } else {
              el.style.backgroundColor = colors.headerColor;
            }
          });
  
          // Apply to headings
          const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
          headings.forEach((heading) => {
            // Don't change color of headings in the header or footer
            if (
              !heading.closest(".main-header") &&
              !heading.closest(".main-footer") &&
              !heading.closest(".top-header") &&
              !heading.closest(".main-nav")
            ) {
              heading.style.color = colors.headerColor;
            }
          });
        }
  
        // Always apply footer color
        const footerElements = document.querySelectorAll(".main-footer");
        footerElements.forEach((el) => {
          el.style.backgroundColor = colors.headerColor;
        });
  
        // Apply to accent elements
        const accentElements = document.querySelectorAll(".yellow-line, .section-divider, .decorative-line");
        accentElements.forEach((el) => {
          el.style.backgroundColor = colors.accentColor;
        });
  
        // Page-specific elements
        if (pageType === "about") {
          applyAboutPageColors(colors, useGlobalHeaderColors);
        } else if (pageType === "home") {
          applyHomePageColors(colors, useGlobalHeaderColors);
        } else if (pageType === "faq") {
          applyFaqPageColors(colors, useGlobalHeaderColors);
        } else if (pageType === "contact") {
          applyContactPageColors(colors, useGlobalHeaderColors);
        }
      }
    }
  
    function applyAboutPageColors(colors, useGlobalHeaderColors) {
      // Apply to specific About page elements
      if (!useGlobalHeaderColors) {
        const historyTitle = document.querySelector(".history-title");
        if (historyTitle) historyTitle.style.color = colors.headerColor;
  
        const sectionTitles = document.querySelectorAll(".section-title");
        sectionTitles.forEach((title) => {
          title.style.color = colors.headerColor;
        });
      }
    }
  
    function applyHomePageColors(colors, useGlobalHeaderColors) {
      // Apply to specific Home page elements
      if (!useGlobalHeaderColors) {
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle) heroTitle.style.color = colors.headerColor;
  
        const aboutTitle = document.querySelector(".about-title");
        if (aboutTitle) aboutTitle.style.color = colors.headerColor;
  
        const officialsTitle = document.querySelector(".officials-title");
        if (officialsTitle) officialsTitle.style.color = colors.headerColor;
      }
  
      const valueLetters = document.querySelectorAll(".value-letter");
      valueLetters.forEach((letter) => {
        letter.style.color = colors.accentColor;
      });
  
      // Service cards hover effect
      const style = document.createElement("style");
      style.textContent = `
              .service-card:hover {
                  border-color: ${colors.accentColor} !important;
              }
          `;
      document.head.appendChild(style);
    }
  
    function applyFaqPageColors(colors, useGlobalHeaderColors) {
      // Apply to specific FAQ page elements
      if (!useGlobalHeaderColors) {
        const faqQuestions = document.querySelectorAll(".faq-question h4");
        faqQuestions.forEach((question) => {
          question.style.color = colors.headerColor;
        });
      }
  
      const contactButton = document.querySelector(".contact-button");
      if (contactButton) {
        contactButton.style.backgroundColor = colors.accentColor;
        contactButton.style.color = "#000";
      }
    }
  
    function applyContactPageColors(colors, useGlobalHeaderColors) {
      // Apply to specific Contact page elements
      if (!useGlobalHeaderColors) {
        const historyTitle = document.querySelector(".history-title");
        if (historyTitle) historyTitle.style.color = colors.headerColor;
  
        const sectionTitles = document.querySelectorAll(".section-title");
        sectionTitles.forEach((title) => {
          title.style.color = colors.headerColor;
        });
      }
  
      // Style the send button
      const sendButton = document.querySelector(".send-button");
      if (sendButton) {
        sendButton.style.backgroundColor = colors.accentColor;
        sendButton.style.color = "#000";
      }
  
      // Style form elements
      const formLabels = document.querySelectorAll(".form-field label");
      formLabels.forEach((label) => {
        label.style.color = colors.textColor;
      });
  
      // Add hover effect for form inputs
      const style = document.createElement("style");
      style.textContent = `
              .contact-form input:focus, .contact-form textarea:focus {
                  border-color: ${colors.accentColor} !important;
                  box-shadow: 0 0 0 2px ${colors.accentColor}33 !important;
              }
          `;
      document.head.appendChild(style);
    }
  });