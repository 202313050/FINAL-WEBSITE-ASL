document.addEventListener("DOMContentLoaded", () => {
  // ===== SIDEBAR NAVIGATION =====
  // Handle active menu item highlighting
  const currentPage = window.location.pathname.split("/").pop()
  const menuItems = document.querySelectorAll(".sidebar-menu .menu-item")

  menuItems.forEach((item) => {
    const href = item.getAttribute("href")
    if (href && (href === currentPage || currentPage.includes(href))) {
      menuItems.forEach((i) => i.classList.remove("active"))
      item.classList.add("active")
    }
  })

  // ===== LOGOUT FUNCTIONALITY =====
  const signOutBtn = document.querySelector(".sign-out a")

  if (signOutBtn) {
    signOutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Check if logout modal exists
      const existingModal = document.getElementById("logoutModal")

      if (existingModal) {
        // Show existing modal
        existingModal.style.display = "flex"
      } else {
        // Create and show logout confirmation modal
        const logoutModal = document.createElement("div")
        logoutModal.id = "logoutModal"
        logoutModal.className = "modal"
        logoutModal.style.display = "flex"

        logoutModal.innerHTML = `
                    <div class="modal-content">
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to logout?</p>
                        <div class="modal-actions">
                            <button id="cancelLogout" class="btn-cancel">Cancel</button>
                            <button id="confirmLogout" class="btn-logout">Log Out</button>
                        </div>
                    </div>
                `

        document.body.appendChild(logoutModal)

        // Add event listeners to the new modal buttons
        document.getElementById("cancelLogout").addEventListener("click", () => {
          logoutModal.style.display = "none"
        })

        document.getElementById("confirmLogout").addEventListener("click", () => {
          window.location.href = "index.html" // Redirect to homepage/login page
        })
      }
    })
  }

  // Handle existing logout modal if it exists
  const existingModal = document.getElementById("logoutModal")
  if (existingModal) {
    const cancelLogout = document.getElementById("cancelLogout")
    const confirmLogout = document.getElementById("confirmLogout")

    if (cancelLogout) {
      cancelLogout.addEventListener("click", () => {
        existingModal.style.display = "none"
      })
    }

    if (confirmLogout) {
      confirmLogout.addEventListener("click", () => {
        window.location.href = "index.html" // Redirect to homepage/login page
      })
    }
  }

  // ===== NOTIFICATION BELL FUNCTIONALITY =====
  const notificationBell = document.querySelector(".notification")

  if (notificationBell) {
    notificationBell.addEventListener("click", () => {
      // Check if notification panel already exists
      let notificationPanel = document.getElementById("notificationPanel")

      if (notificationPanel) {
        // Toggle visibility if panel already exists
        notificationPanel.style.display = notificationPanel.style.display === "none" ? "block" : "none"
      } else {
        // Create notification panel
        notificationPanel = document.createElement("div")
        notificationPanel.id = "notificationPanel"
        notificationPanel.className = "notification-panel"

        // Sample notifications - in a real app, these would come from a database
        notificationPanel.innerHTML = `
                    <div class="notification-header">
                        <h3>Notifications</h3>
                        <button id="markAllRead">Mark all as read</button>
                    </div>
                    <div class="notification-list">
                        <div class="notification-item unread">
                            <div class="notification-content">
                                <p class="notification-text">New document request from Maria Santos</p>
                                <p class="notification-time">2 minutes ago</p>
                            </div>
                        </div>
                        <div class="notification-item unread">
                            <div class="notification-content">
                                <p class="notification-text">John Dela Cruz approved a request</p>
                                <p class="notification-time">1 hour ago</p>
                            </div>
                        </div>
                        <div class="notification-item">
                            <div class="notification-content">
                                <p class="notification-text">New user registered: Jane Doe</p>
                                <p class="notification-time">Yesterday</p>
                            </div>
                        </div>
                        <div class="notification-item">
                            <div class="notification-content">
                                <p class="notification-text">System maintenance scheduled for tomorrow</p>
                                <p class="notification-time">2 days ago</p>
                            </div>
                        </div>
                    </div>
                `

        // Position the panel relative to the notification bell
        const bellRect = notificationBell.getBoundingClientRect()
        notificationPanel.style.position = "absolute"
        notificationPanel.style.top = bellRect.bottom + window.scrollY + "px"
        notificationPanel.style.right = "20px"

        // Append to body
        document.body.appendChild(notificationPanel)

        // Add event listener to mark all as read
        document.getElementById("markAllRead").addEventListener("click", () => {
          const unreadItems = notificationPanel.querySelectorAll(".notification-item.unread")
          unreadItems.forEach((item) => {
            item.classList.remove("unread")
          })
        })

        // Close panel when clicking outside
        document.addEventListener("click", (event) => {
          if (!notificationBell.contains(event.target) && !notificationPanel.contains(event.target)) {
            notificationPanel.style.display = "none"
          }
        })
      }
    })
  }
})
