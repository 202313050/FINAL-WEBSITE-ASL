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
  