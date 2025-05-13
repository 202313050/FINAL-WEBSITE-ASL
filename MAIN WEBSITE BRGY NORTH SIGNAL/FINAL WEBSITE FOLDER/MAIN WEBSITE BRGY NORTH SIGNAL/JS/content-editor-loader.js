// content-editor-loader.js - Add this to your HTML pages to enable the content editor
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is an admin (user role stored in sessionStorage)
    const isAdmin = sessionStorage.getItem('userRole') === 'admin' || 
                    window.location.pathname.includes('UI_Settings.html');
    
    if (isAdmin) {
      // Load the content editor script
      const script = document.createElement('script');
      script.src = 'content-editor.js';
      document.head.appendChild(script);
      
      // Add admin badge
      const adminBadge = document.createElement('div');
      adminBadge.className = 'admin-badge';
      adminBadge.innerHTML = 'Admin Mode';
      adminBadge.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: #dc3545;
        color: white;
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 4px;
        z-index: 1000;
        font-weight: bold;
      `;
      document.body.appendChild(adminBadge);
    }
  });