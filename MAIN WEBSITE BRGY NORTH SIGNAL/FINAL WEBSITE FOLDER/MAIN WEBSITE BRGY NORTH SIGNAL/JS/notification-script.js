// Add this script to your existing JavaScript files or include it at the end of your HTML

document.addEventListener("DOMContentLoaded", () => {
    // Get the notification element
    const notification = document.querySelector(".notification")
  
    // Create the dropdown element
    const dropdown = document.createElement("div")
    dropdown.className = "notification-dropdown"
    dropdown.style.display = "none"
    dropdown.style.position = "absolute"
    dropdown.style.top = "40px"
    dropdown.style.right = "0"
    dropdown.style.width = "300px"
    dropdown.style.backgroundColor = "white"
    dropdown.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)"
    dropdown.style.borderRadius = "5px"
    dropdown.style.zIndex = "1000"
  
    // Add content to the dropdown
    dropdown.innerHTML = `
      <div style="display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; font-size: 16px;">Notifications</h3>
          <span id="markAllRead" style="color: #0a3b66; cursor: pointer; font-size: 12px;">Mark all as read</span>
      </div>
      <div style="max-height: 300px; overflow-y: auto;">
          <div class="notification-item unread" style="display: flex; padding: 12px 15px; border-bottom: 1px solid #eee; background-color: #f0f7ff;">
              <div style="margin-right: 10px;">
                  <img src="document-icon.png" alt="Document" style="width: 20px; height: 20px;">
              </div>
              <div>
                  <p style="margin: 0 0 5px 0; font-size: 13px; color: black;">New document request from Juan Dela Cruz</p>
                  <p style="margin: 0; font-size: 11px; color: #888;">2 minutes ago</p>
              </div>
          </div>
          <div class="notification-item unread" style="display: flex; padding: 12px 15px; border-bottom: 1px solid #eee; background-color: #f0f7ff;">
              <div style="margin-right: 10px;">
                  <img src="interview.png" alt="Resident" style="width: 20px; height: 20px;">
              </div>
              <div>
                  <p style="margin: 0 0 5px 0; font-size: 13px; color: black;">New resident registration: Maria Santos</p>
                  <p style="margin: 0; font-size: 11px; color: #888;">1 hour ago</p>
              </div>
          </div>
          <div class="notification-item" style="display: flex; padding: 12px 15px; border-bottom: 1px solid #eee;">
              <div style="margin-right: 10px;">
                  <img src="dashboard.png" alt="Dashboard" style="width: 20px; height: 20px;">
              </div>
              <div>
                  <p style="margin: 0 0 5px 0; font-size: 13px; color: black;">Appointment scheduled with Barangay Captain</p>
                  <p style="margin: 0; font-size: 11px; color: #888;">Yesterday</p>
              </div>
          </div>
      </div>
      <div style="padding: 12px 15px; text-align: center; border-top: 1px solid #eee;">
          <button style="background-color: #0a3b66; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">
              View all notifications
          </button>
      </div>
    `
  
    // Append the dropdown to the notification element
    notification.appendChild(dropdown)
    notification.style.position = "relative"
  
    // Toggle dropdown when notification is clicked
    notification.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none"
    })
  
    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdown.style.display = "none"
    })
  
    // Mark all as read functionality
    document.getElementById("markAllRead").addEventListener("click", (e) => {
      e.stopPropagation()
      const unreadItems = document.querySelectorAll(".notification-item.unread")
      unreadItems.forEach((item) => {
        item.classList.remove("unread")
        item.style.backgroundColor = ""
      })
  
      // Update badge
      const badge = document.querySelector(".notification-badge")
      if (badge) {
        badge.textContent = "0"
        badge.style.display = "none"
      }
    })
  })
  