// content-editor.js - Add to your website for in-browser content editing
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if user is an admin
    if (isAdmin()) {
      initContentEditor();
    }
  });
  
  // Check if the current user is an admin
  function isAdmin() {
    // This should be replaced with your actual authentication logic
    // For now we'll assume any user on the UI_Settings.html page is an admin
    return window.location.pathname.includes('UI_Settings.html') || 
           sessionStorage.getItem('userRole') === 'admin';
  }
  
  // Initialize the content editor
  function initContentEditor() {
    // Add editor toggle button to all pages except UI_Settings
    if (!window.location.pathname.includes('UI_Settings.html')) {
      createEditorButton();
    }
    
    // Initialize the edit mode feature
    initEditMode();
    
    // Create the page content manager
    createPageContentManager();
  }
  
  // Create the floating editor button
  function createEditorButton() {
    const editorButton = document.createElement('div');
    editorButton.className = 'editor-toggle-btn';
    editorButton.innerHTML = '<img src="edit-icon.png" alt="Edit" onerror="this.src=\'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path fill=\"white\" d=\"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10\"/></svg>\';" />';
    editorButton.title = 'Edit Page Content';
    document.body.appendChild(editorButton);
    
    // Add click event
    editorButton.addEventListener('click', function() {
      toggleEditMode();
    });
    
    // Add styles for the editor button
    const style = document.createElement('style');
    style.textContent = `
      .editor-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #0F2D70;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transition: transform 0.3s, background-color 0.3s;
      }
      
      .editor-toggle-btn:hover {
        transform: scale(1.1);
      }
      
      .editor-toggle-btn img {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
      }
      
      .editor-toggle-btn.active {
        background-color: #dc3545;
      }
      
      .editable {
        outline: 2px dashed transparent;
        transition: outline 0.3s;
        position: relative;
      }
      
      body.edit-mode .editable {
        outline: 2px dashed #0F2D70;
        cursor: pointer;
      }
      
      body.edit-mode .editable:hover {
        outline: 2px solid #0F2D70;
      }
      
      body.edit-mode .editable.editing {
        outline: 2px solid #28a745;
      }
      
      .editable-menu {
        position: absolute;
        top: -40px;
        right: 0;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        z-index: 999;
      }
      
      .editable.editing .editable-menu {
        opacity: 1;
        pointer-events: auto;
      }
      
      .editable-menu button {
        background: none;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .editable-menu button:hover {
        background-color: #f0f0f0;
      }
      
      .save-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1001;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transform: translateY(-100px);
        transition: transform 0.5s;
      }
      
      .save-indicator.visible {
        transform: translateY(0);
      }
      
      .page-content-manager {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1002;
        overflow: hidden;
        display: none;
      }
      
      .page-content-manager.visible {
        display: block;
      }
      
      .manager-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background-color: #0F2D70;
        color: white;
      }
      
      .manager-header h2 {
        margin: 0;
        font-size: 1.2rem;
      }
      
      .close-manager {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
      }
      
      .manager-content {
        padding: 20px;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
      }
      
      .content-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1001;
        display: none;
      }
      
      .content-overlay.visible {
        display: block;
      }
      
      .image-editor-panel {
        position: fixed;
        bottom: -300px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 500px;
        background-color: #fff;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        padding: 20px;
        transition: bottom 0.3s ease-out;
      }
      
      .image-editor-panel.visible {
        bottom: 0;
      }
      
      .image-preview {
        width: 100%;
        height: 150px;
        object-fit: contain;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Toggle edit mode
  function toggleEditMode() {
    const body = document.body;
    const button = document.querySelector('.editor-toggle-btn');
    
    if (body.classList.contains('edit-mode')) {
      // Disable edit mode
      body.classList.remove('edit-mode');
      button.classList.remove('active');
      removeEditableMenus();
    } else {
      // Enable edit mode
      body.classList.add('edit-mode');
      button.classList.add('active');
      makeElementsEditable();
    }
  }
  
  // Make page elements editable
  function makeElementsEditable() {
    // Define elements that can be edited
    const editableElements = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'a', 'li',
      '.hero-text', '.about-text', '.mission-text', '.vision-text',
      '.official-name', '.official-title',
      '.address', '.contact-info',
      '.nav-link', '.footer-text'
    ];
    
    // Add editable class to elements
    document.querySelectorAll(editableElements.join(',')).forEach(el => {
      // Skip elements inside the editor UI itself
      if (isInsideEditor(el)) return;
      
      // Add editable class
      el.classList.add('editable');
      
      // Add data attribute with original content
      if (!el.dataset.originalContent) {
        el.dataset.originalContent = el.innerHTML;
      }
      
      // Remove existing event listeners (if any)
      el.removeEventListener('click', handleEditableClick);
      // Add click event listener
      el.addEventListener('click', handleEditableClick);
    });
    
    // Handle images separately
    document.querySelectorAll('img').forEach(img => {
      // Skip images inside the editor UI
      if (isInsideEditor(img)) return;
      
      // Add editable class
      img.classList.add('editable', 'editable-image');
      
      // Store original src
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src;
      }
      
      // Remove existing event listeners (if any)
      img.removeEventListener('click', handleImageClick);
      // Add click event listener
      img.addEventListener('click', handleImageClick);
    });
  }
  
  // Check if element is inside the editor UI
  function isInsideEditor(element) {
    const editorElements = [
      '.editor-toggle-btn',
      '.editable-menu',
      '.page-content-manager',
      '.content-overlay'
    ];
    
    let parent = element;
    while (parent) {
      for (const selector of editorElements) {
        if (parent.matches && parent.matches(selector)) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  }
  
  // Handle click on editable element
  function handleEditableClick(event) {
    if (!document.body.classList.contains('edit-mode')) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const element = event.currentTarget;
    
    // Remove editing class from all other elements
    document.querySelectorAll('.editing').forEach(el => {
      if (el !== element) {
        el.classList.remove('editing');
        removeEditableMenu(el);
      }
    });
    
    // Toggle editing class
    element.classList.toggle('editing');
    
    // Show/hide editable menu
    if (element.classList.contains('editing')) {
      createEditableMenu(element);
      
      // Make the element content editable
      element.contentEditable = true;
      element.focus();
      
      // For links, prevent navigation
      if (element.tagName === 'A') {
        element.dataset.href = element.href;
        element.removeAttribute('href');
      }
    } else {
      removeEditableMenu(element);
      element.contentEditable = false;
      
      // For links, restore href
      if (element.tagName === 'A' && element.dataset.href) {
        element.href = element.dataset.href;
      }
    }
  }
  
  // Handle click on image
  function handleImageClick(event) {
    if (!document.body.classList.contains('edit-mode')) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const img = event.currentTarget;
    
    // Open image editor panel
    openImageEditorPanel(img);
  }
  
  // Open image editor panel
  function openImageEditorPanel(img) {
    // Create panel if it doesn't exist
    let panel = document.querySelector('.image-editor-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'image-editor-panel';
      panel.innerHTML = `
        <h3>Edit Image</h3>
        <img src="${img.src}" alt="${img.alt || ''}" class="image-preview">
        <div class="form-group">
          <label for="image-url">Image URL</label>
          <input type="text" id="image-url" class="form-control" value="${img.src}" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        </div>
        <div class="form-group">
          <label for="image-alt">Alt Text</label>
          <input type="text" id="image-alt" class="form-control" value="${img.alt || ''}" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        </div>
        <div class="form-buttons" style="display: flex; gap: 10px; margin-top: 10px;">
          <button id="save-image" class="btn-save" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
          <button id="upload-image" class="btn-upload" style="padding: 8px 15px; background-color: #0F2D70; color: white; border: none; border-radius: 4px; cursor: pointer;">Upload New Image</button>
          <button id="cancel-image" class="btn-cancel" style="padding: 8px 15px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
        </div>
        <input type="file" id="image-file-input" style="display: none;" accept="image/*">
      `;
      document.body.appendChild(panel);
      
      // Add event listeners
      document.getElementById('save-image').addEventListener('click', () => {
        updateImage(img);
        closeImageEditorPanel();
      });
      
      document.getElementById('upload-image').addEventListener('click', () => {
        document.getElementById('image-file-input').click();
      });
      
      document.getElementById('cancel-image').addEventListener('click', () => {
        closeImageEditorPanel();
      });
      
      document.getElementById('image-file-input').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            document.querySelector('.image-preview').src = event.target.result;
            document.getElementById('image-url').value = event.target.result;
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
      
      // Show content overlay
      showContentOverlay();
    } else {
      // Update existing panel
      panel.querySelector('.image-preview').src = img.src;
      panel.querySelector('#image-url').value = img.src;
      panel.querySelector('#image-alt').value = img.alt || '';
    }
    
    // Store reference to current image
    panel.dataset.imgId = img.id || '';
    panel.dataset.imgClass = img.className || '';
    panel.dataset.imgSelector = getUniqueSelector(img);
    
    // Show panel
    panel.classList.add('visible');
  }
  
  // Update image with new values
  function updateImage(img) {
    const url = document.getElementById('image-url').value;
    const alt = document.getElementById('image-alt').value;
    
    // Update image
    img.src = url;
    img.alt = alt;
    
    // Save changes
    saveElementChanges(img);
    
    // Show success message
    showSaveIndicator('Image updated successfully!');
  }
  
  // Close image editor panel
  function closeImageEditorPanel() {
    const panel = document.querySelector('.image-editor-panel');
    if (panel) {
      panel.classList.remove('visible');
      
      // Hide content overlay after animation
      setTimeout(() => {
        hideContentOverlay();
      }, 300);
    }
  }
  
  // Create menu for editable elements
  function createEditableMenu(element) {
    // Remove any existing menu
    removeEditableMenu(element);
    
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'editable-menu';
    menu.innerHTML = `
      <button class="btn-save">Save</button>
      <button class="btn-reset">Reset</button>
      <button class="btn-cancel">Cancel</button>
    `;
    
    // Add event listeners
    menu.querySelector('.btn-save').addEventListener('click', (e) => {
      e.stopPropagation();
      saveElementChanges(element);
      element.classList.remove('editing');
      element.contentEditable = false;
      removeEditableMenu(element);
      
      // For links, restore href
      if (element.tagName === 'A' && element.dataset.href) {
        element.href = element.dataset.href;
      }
    });
    
    menu.querySelector('.btn-reset').addEventListener('click', (e) => {
      e.stopPropagation();
      resetElementContent(element);
    });
    
    menu.querySelector('.btn-cancel').addEventListener('click', (e) => {
      e.stopPropagation();
      cancelElementEdit(element);
    });
    
    // Add menu to element
    element.appendChild(menu);
  }
  
  // Remove menu from editable element
  function removeEditableMenu(element) {
    const menu = element.querySelector('.editable-menu');
    if (menu) {
      element.removeChild(menu);
    }
  }
  
  // Remove all editable menus
  function removeEditableMenus() {
    document.querySelectorAll('.editable-menu').forEach(menu => {
      menu.parentElement.removeChild(menu);
    });
    
    // Make elements non-editable
    document.querySelectorAll('.editable').forEach(el => {
      el.contentEditable = false;
      el.classList.remove('editing');
      
      // For links, restore href
      if (el.tagName === 'A' && el.dataset.href) {
        el.href = el.dataset.href;
      }
    });
  }
  
  // Save element changes
  function saveElementChanges(element) {
    // Get page identifier
    const page = getPageIdentifier();
    
    // Get element identifier
    const elementId = element.id || '';
    const elementClass = element.className.replace('editing', '').trim();
    const elementSelector = getUniqueSelector(element);
    const elementType = element.tagName.toLowerCase();
    
    // Create change object
    let change = {
      page: page,
      selector: elementSelector,
      id: elementId,
      class: elementClass,
      type: elementType
    };
    
    // Handle different element types
    if (element.classList.contains('editable-image')) {
      change.content = element.src;
      change.alt = element.alt || '';
      change.changeType = 'image';
    } else {
      change.content = element.innerHTML;
      change.changeType = 'content';
    }
    
    // Save to localStorage
    savePageChange(change);
    
    // Show success message
    showSaveIndicator('Changes saved successfully!');
  }
  
  // Save page change to localStorage
  function savePageChange(change) {
    // Get existing changes or create new array
    const savedChanges = JSON.parse(localStorage.getItem('pageChanges')) || [];
    
    // Check if this element already has changes
    const existingIndex = savedChanges.findIndex(c => 
      c.page === change.page && c.selector === change.selector
    );
    
    if (existingIndex !== -1) {
      // Update existing change
      savedChanges[existingIndex] = change;
    } else {
      // Add new change
      savedChanges.push(change);
    }
    
    // Save to localStorage
    localStorage.setItem('pageChanges', JSON.stringify(savedChanges));
  }
  
  // Reset element content to original
  function resetElementContent(element) {
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
    } else if (element.classList.contains('editable-image') && element.dataset.originalSrc) {
      element.src = element.dataset.originalSrc;
    }
  }
  
  // Cancel element editing
  function cancelElementEdit(element) {
    // Reset content
    resetElementContent(element);
    
    // Remove editing class
    element.classList.remove('editing');
    element.contentEditable = false;
    removeEditableMenu(element);
    
    // For links, restore href
    if (element.tagName === 'A' && element.dataset.href) {
      element.href = element.dataset.href;
    }
  }
  
  // Initialize edit mode features
  function initEditMode() {
    // Apply saved changes to the current page
    applySavedChanges();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Escape key to exit edit mode
      if (e.key === 'Escape') {
        const editingElement = document.querySelector('.editable.editing');
        if (editingElement) {
          cancelElementEdit(editingElement);
        } else if (document.body.classList.contains('edit-mode')) {
          toggleEditMode();
        }
      }
    });
  }
  
  // Apply saved changes to the current page
  function applySavedChanges() {
    // Get current page identifier
    const currentPage = getPageIdentifier();
    
    // Get saved changes
    const savedChanges = JSON.parse(localStorage.getItem('pageChanges')) || [];
    
    // Filter changes for current page
    const pageChanges = savedChanges.filter(change => change.page === currentPage);
    
    // Apply each change
    pageChanges.forEach(change => {
      try {
        // Find element
        const element = document.querySelector(change.selector);
        
        if (element) {
          // Apply change based on type
          if (change.changeType === 'image') {
            element.src = change.content;
            if (change.alt) element.alt = change.alt;
          } else {
            element.innerHTML = change.content;
          }
        }
      } catch (err) {
        console.error('Error applying saved change:', err);
      }
    });
  }
  
  // Create page content manager
  function createPageContentManager() {
    // Create manager element
    const manager = document.createElement('div');
    manager.className = 'page-content-manager';
    manager.innerHTML = `
      <div class="manager-header">
        <h2>Page Content Manager</h2>
        <button class="close-manager">&times;</button>
      </div>
      <div class="manager-content">
        <div class="manager-tabs">
          <button class="manager-tab active" data-tab="changes">Current Changes</button>
          <button class="manager-tab" data-tab="exports">Export/Import</button>
        </div>
        <div class="manager-tab-content active" id="tab-changes">
          <div class="changes-list"></div>
          <div class="changes-actions" style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn-apply-all">Apply All Changes</button>
            <button class="btn-clear-all">Clear All Changes</button>
          </div>
        </div>
        <div class="manager-tab-content" id="tab-exports">
          <div style="margin-bottom: 20px;">
            <h3>Export Changes</h3>
            <p>Export your changes to save as a backup.</p>
            <button class="btn-export" style="padding: 8px 15px; background-color: #0F2D70; color: white; border: none; border-radius: 4px; cursor: pointer;">Export to JSON</button>
          </div>
          <div style="margin-bottom: 20px;">
            <h3>Import Changes</h3>
            <p>Import a previously exported changes file.</p>
            <input type="file" id="import-file" accept=".json" style="margin-bottom: 10px;">
            <button class="btn-import" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Import Changes</button>
          </div>
        </div>
      </div>
    `;
    
    // Add styles for manager
    const style = document.createElement('style');
    style.textContent = `
      .manager-tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
      }
      
      .manager-tab {
        padding: 10px 20px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
      }
      
      .manager-tab.active {
        border-color: #0F2D70;
        font-weight: bold;
      }
      
      .manager-tab-content {
        display: none;
      }
      
      .manager-tab-content.active {
        display: block;
      }
      
      .changes-list {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
      }
      
      .change-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .change-item:last-child {
        border-bottom: none;
      }
      
      .changes-actions button,
      #tab-exports button {
        padding: 8px 15px;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .btn-apply-all,
      .btn-import {
        background-color: #28a745;
      }
      
      .btn-clear-all {
        background-color: #dc3545;
      }
      
      .btn-export {
        background-color: #0F2D70;
      }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    manager.querySelector('.close-manager').addEventListener('click', () => {
      hidePageContentManager();
    });
    
    manager.querySelectorAll('.manager-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        manager.querySelectorAll('.manager-tab').forEach(t => {
          t.classList.remove('active');
        });
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all tab content
        manager.querySelectorAll('.manager-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Show clicked tab content
        const tabId = `tab-${tab.dataset.tab}`;
        manager.querySelector(`#${tabId}`).classList.add('active');
      });
    });
    
    // Apply all changes button
    manager.querySelector('.btn-apply-all').addEventListener('click', () => {
      applySavedChanges();
      showSaveIndicator('All changes applied!');
    });
    
    // Clear all changes button
    manager.querySelector('.btn-clear-all').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all saved changes? This cannot be undone.')) {
        localStorage.removeItem('pageChanges');
        updateChangesList(manager);
        showSaveIndicator('All changes cleared!');
      }
    });
    
    // Export button
    manager.querySelector('.btn-export').addEventListener('click', () => {
      exportChanges();
    });
    
    // Import button
    manager.querySelector('.btn-import').addEventListener('click', () => {
      importChanges();
    });
    
    // Add manager to body
    document.body.appendChild(manager);
    
    // Create content overlay
    const overlay = document.createElement('div');
    overlay.className = 'content-overlay';
    document.body.appendChild(overlay);
    
    // Add click event to overlay
    overlay.addEventListener('click', () => {
      hidePageContentManager();
    });
  }
  
  // Show page content manager
  function showPageContentManager() {
    const manager = document.querySelector('.page-content-manager');
    const overlay = document.querySelector('.content-overlay');
    
    if (manager && overlay) {
      // Update changes list
      updateChangesList(manager);
      
      // Show manager and overlay
      manager.classList.add('visible');
      overlay.classList.add('visible');
    }
  }
  
  // Hide page content manager
  function hidePageContentManager() {
    const manager = document.querySelector('.page-content-manager');
    const overlay = document.querySelector('.content-overlay');
    
    if (manager) manager.classList.remove('visible');
    if (overlay) overlay.classList.remove('visible');
  }
  
  // Update the changes list in the manager
  function updateChangesList(manager) {
    const changesList = manager.querySelector('.changes-list');
    
    // Get saved changes
    const savedChanges = JSON.parse(localStorage.getItem('pageChanges')) || [];
    
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
      changesByPage[change.page].  {
        changesByPage[change.page] = [];
      }
      changesByPage[change.page].push(change);
    });
    
    // Generate HTML for changes list
    let html = '';
    
    // For each page
    for (const page in changesByPage) {
      html += `<div class="page-changes">
        <h3>${page}</h3>
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
        
        html += `<div class="change-item">
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
        deleteChange(page, selector);
        
        // Update changes list
        updateChangesList(manager);
      });
    });
  }
  
  // Delete a specific change
  function deleteChange(page, selector) {
    // Get saved changes
    const savedChanges = JSON.parse(localStorage.getItem('pageChanges')) || [];
    
    // Filter out the change to delete
    const filteredChanges = savedChanges.filter(change => 
      !(change.page === page && change.selector === selector)
    );
    
    // Save updated changes
    localStorage.setItem('pageChanges', JSON.stringify(filteredChanges));
    
    // Show success message
    showSaveIndicator('Change deleted successfully!');
  }
  
  // Export changes as JSON
  function exportChanges() {
    // Get saved changes
    const savedChanges = localStorage.getItem('pageChanges');
    
    if (!savedChanges || savedChanges === '[]') {
      alert('No changes to export!');
      return;
    }
    
    // Create file
    const blob = new Blob([savedChanges], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-changes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    // Show success message
    showSaveIndicator('Changes exported successfully!');
  }
  
  // Import changes from JSON
  function importChanges() {
    const fileInput = document.getElementById('import-file');
    
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file to import!');
      return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        // Parse JSON
        const changes = JSON.parse(e.target.result);
        
        // Validate changes format
        if (!Array.isArray(changes)) {
          throw new Error('Invalid file format!');
        }
        
        // Store changes
        localStorage.setItem('pageChanges', JSON.stringify(changes));
        
        // Update changes list
        updateChangesList(document.querySelector('.page-content-manager'));
        
        // Show success message
        showSaveIndicator('Changes imported successfully!');
        
        // Reset file input
        fileInput.value = null;
      } catch (error) {
        alert('Error importing changes: ' + error.message);
      }
    };
    
    reader.readAsText(file);
  }
  
  // Show content overlay
  function showContentOverlay() {
    const overlay = document.querySelector('.content-overlay');
    if (overlay) {
      overlay.classList.add('visible');
    }
  }
  
  // Hide content overlay
  function hideContentOverlay() {
    const overlay = document.querySelector('.content-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
    }
  }
  
  // Show save indicator
  function showSaveIndicator(message) {
    // Check if indicator already exists
    let indicator = document.querySelector('.save-indicator');
    
    if (!indicator) {
      // Create indicator
      indicator = document.createElement('div');
      indicator.className = 'save-indicator';
      document.body.appendChild(indicator);
    }
    
    // Set message
    indicator.textContent = message;
    
    // Show indicator
    indicator.classList.add('visible');
    
    // Hide after delay
    setTimeout(() => {
      indicator.classList.remove('visible');
    }, 3000);
  }
  
  // Get a unique selector for an element
  function getUniqueSelector(el) {
    if (el.id) {
      return `#${el.id}`;
    }
    
    // Attempt to create a unique selector using classes
    if (el.className) {
      const classes = el.className.split(' ')
        .filter(cls => !cls.includes('editable') && !cls.includes('editing'))
        .join('.');
      
      if (classes) {
        const selector = `.${classes}`;
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      }
    }
    
    // Use the element tag and position among siblings
    let selector = el.tagName.toLowerCase();
    
    // Get siblings with the same tag name
    const siblings = Array.from(el.parentNode.children).filter(child => 
      child.tagName === el.tagName
    );
    
    if (siblings.length > 1) {
      // Find the index of the element among its siblings
      const index = siblings.indexOf(el);
      selector += `:nth-of-type(${index + 1})`;
    }
    
    // If parent is not body, add parent selector
    if (el.parentNode && el.parentNode !== document.body) {
      const parentSelector = getUniqueSelector(el.parentNode);
      return `${parentSelector} > ${selector}`;
    }
    
    return selector;
  }
  
  // Get a page identifier
  function getPageIdentifier() {
    // Try to get from meta tag
    const metaPage = document.querySelector('meta[name="page-id"]');
    if (metaPage && metaPage.content) {
      return metaPage.content;
    }
    
    // Use path
    let path = window.location.pathname;
    
    // Clean up path
    if (path.endsWith('/')) {
      path += 'index.html';
    } else if (!path.includes('.html')) {
      path += '.html';
    }
    
    // Extract filename
    const filename = path.split('/').pop();
    
    return filename;
  }
  
  // Add keyboard shortcut to open content manager
  document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+M to open content manager
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
      showPageContentManager();
    }
  });