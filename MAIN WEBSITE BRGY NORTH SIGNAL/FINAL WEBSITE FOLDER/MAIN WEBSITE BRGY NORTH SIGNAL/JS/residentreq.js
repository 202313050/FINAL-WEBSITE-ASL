// Enhanced JavaScript for interactivity with reason modals and data persistence
document.addEventListener("DOMContentLoaded", () => {
  // Load saved request data from localStorage
  const savedRequestData = JSON.parse(localStorage.getItem("residentRequestsData")) || {
    statusChanges: {},
    requestReasons: {},
  }

  // Initialize request reasons from saved data
  const requestReasons = savedRequestData.requestReasons || {}

  // DOM Elements
  const requestTableBody = document.querySelector(".request-table tbody")
  const pendingCountElement = document.querySelector(".stat-card.blue h2")
  const approvedCountElement = document.querySelector(".stat-card.green h2")
  const scheduledCountElement = document.querySelector(".stat-card.orange h2")
  const notificationIcon = document.querySelector(".notification-icon")

  // Menu item click
  const menuItems = document.querySelectorAll(".menu-item")
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((i) => i.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Initialize notification panel
  initNotificationPanel()

  // Load resident requests
  loadResidentRequests()

  // Function to initialize notification panel
  function initNotificationPanel() {
    // Create notification panel
    const notificationPanel = document.createElement("div")
    notificationPanel.className = "notification-panel"
    notificationPanel.style.display = "none"
    notificationPanel.style.top = "60px"
    notificationPanel.style.right = "20px"

    // Create notification header
    const notificationHeader = document.createElement("div")
    notificationHeader.className = "notification-header"
    notificationHeader.innerHTML = `
      <h3>Notifications</h3>
      <button id="markAllRead">Mark all as read</button>
    `

    // Create notification list
    const notificationList = document.createElement("div")
    notificationList.className = "notification-list"

    // Append elements
    notificationPanel.appendChild(notificationHeader)
    notificationPanel.appendChild(notificationList)
    document.body.appendChild(notificationPanel)

    // Toggle notification panel on icon click
    notificationIcon.addEventListener("click", () => {
      if (notificationPanel.style.display === "none") {
        notificationPanel.style.display = "block"
      } else {
        notificationPanel.style.display = "none"
      }
    })

    // Close notification panel when clicking outside
    document.addEventListener("click", (e) => {
      if (!notificationPanel.contains(e.target) && e.target !== notificationIcon) {
        notificationPanel.style.display = "none"
      }
    })

    // Mark all as read
    document.getElementById("markAllRead").addEventListener("click", () => {
      const unreadItems = document.querySelectorAll(".notification-item.unread")
      unreadItems.forEach((item) => {
        item.classList.remove("unread")
      })

      // Remove notification badge
      const badge = document.querySelector(".notification-badge")
      if (badge) {
        badge.remove()
      }
    })
  }

  // Function to load resident requests from localStorage
  function loadResidentRequests() {
    // Get resident requests from localStorage
    const residentRequests = JSON.parse(localStorage.getItem("residentRequests")) || []

    // Clear existing table rows
    requestTableBody.innerHTML = ""

    // Counter for different statuses
    let pendingCount = 0
    let approvedCount = 0
    let scheduledCount = 0

    // Process each resident request
    residentRequests.forEach((request) => {
      // Apply any saved status changes
      if (savedRequestData.statusChanges[request.id]) {
        request.status = savedRequestData.statusChanges[request.id]
      }

      // Count by status
      if (request.status === "Pending") {
        pendingCount++
      } else if (request.status === "Approved") {
        approvedCount++
      } else if (request.status === "Scheduled") {
        scheduledCount++
      }

      // Create table row
      const row = document.createElement("tr")

      // Create row content
      row.innerHTML = `
        <td>${request.id}</td>
        <td>${request.name}</td>
        <td>${request.type}</td>
        <td>${request.dateSubmitted}</td>
        <td><span class="status-badge status-${request.status.toLowerCase()}">${request.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-view">View</button>
            <button class="btn btn-approve">Approve</button>
            <button class="btn btn-reject">Reject</button>
            <button class="btn btn-archive">Archive</button>
          </div>
        </td>
      `

      // Add row to table
      requestTableBody.appendChild(row)
    })

    // Update summary counts
    pendingCountElement.textContent = pendingCount
    approvedCountElement.textContent = approvedCount
    scheduledCountElement.textContent = scheduledCount

    // Update notification panel
    updateNotificationPanel(residentRequests.filter((req) => req.status === "Pending"))

    // Add notification badge if there are pending requests
    if (pendingCount > 0) {
      // Create or update notification badge
      let badge = document.querySelector(".notification-badge")
      if (!badge) {
        badge = document.createElement("span")
        badge.className = "notification-badge"
        notificationIcon.parentNode.appendChild(badge)
      }
      badge.textContent = pendingCount
    } else {
      // Remove notification badge if no pending requests
      const badge = document.querySelector(".notification-badge")
      if (badge) {
        badge.remove()
      }
    }

    // Initialize action buttons for new rows
    initActionButtons()
  }

  // Function to update notification panel
  function updateNotificationPanel(pendingRequests) {
    const notificationList = document.querySelector(".notification-list")
    notificationList.innerHTML = ""

    if (pendingRequests.length === 0) {
      notificationList.innerHTML = `
        <div class="notification-item">
          <div class="notification-content">
            <p class="notification-text">No new notifications</p>
          </div>
        </div>
      `
      return
    }

    pendingRequests.forEach((request) => {
      const notificationItem = document.createElement("div")
      notificationItem.className = "notification-item unread"

      notificationItem.innerHTML = `
        <div class="notification-content">
          <p class="notification-text">New request from ${request.name}</p>
          <p class="notification-time">${request.dateSubmitted}</p>
        </div>
      `

      notificationItem.addEventListener("click", () => {
        // Mark as read
        notificationItem.classList.remove("unread")

        // Show request details
        document.getElementById("viewRequestId").textContent = request.id
        document.getElementById("viewResidentName").textContent = request.name
        document.getElementById("viewRequestType").textContent = request.type
        document.getElementById("viewStatus").textContent = request.status

        // Set reasons based on status
        const reasonsSection = document.getElementById("viewReasons")
        reasonsSection.innerHTML = "<p>No action has been taken on this request yet.</p>"

        // Show the modal
        document.getElementById("viewModal").style.display = "flex"
      })

      notificationList.appendChild(notificationItem)
    })
  }

  // Apply saved status changes to the table
  applyStatusChanges()

  // Initialize action buttons
  initActionButtons()

  // Function to apply saved status changes
  function applyStatusChanges() {
    const rows = document.querySelectorAll(".request-table tbody tr")

    rows.forEach((row) => {
      const requestId = row.cells[0].textContent
      const savedStatus = savedRequestData.statusChanges[requestId]

      if (savedStatus) {
        const statusCell = row.cells[4]
        statusCell.innerHTML = `<span class="status-badge status-${savedStatus.toLowerCase()}">${savedStatus}</span>`
      }
    })
  }

  // Function to save current state to localStorage
  function saveState() {
    const statusChanges = {}
    const rows = document.querySelectorAll(".request-table tbody tr")

    rows.forEach((row) => {
      const requestId = row.cells[0].textContent
      const statusText = row.cells[4].querySelector(".status-badge").textContent
      statusChanges[requestId] = statusText
    })

    const dataToSave = {
      statusChanges: statusChanges,
      requestReasons: requestReasons,
    }

    localStorage.setItem("residentRequestsData", JSON.stringify(dataToSave))

    // Reload resident requests to update counts
    loadResidentRequests()
  }

  // Initialize action buttons
  function initActionButtons() {
    // View button click
    const viewButtons = document.querySelectorAll(".btn-view")
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr")
        const requestId = row.cells[0].textContent
        const residentName = row.cells[1].textContent
        const requestType = row.cells[2].textContent
        const status = row.cells[4].querySelector(".status-badge").textContent

        // Get stored reasons or set default message
        const reasons = requestReasons[requestId] || {
          approveReason: "No approval reason provided",
          rejectReason: "No rejection reason provided",
          archiveReason: "No archiving reason provided",
        }

        // Populate and show the view modal
        document.getElementById("viewRequestId").textContent = requestId
        document.getElementById("viewResidentName").textContent = residentName
        document.getElementById("viewRequestType").textContent = requestType
        document.getElementById("viewStatus").textContent = status

        // Set reasons based on status
        const reasonsSection = document.getElementById("viewReasons")

        if (status === "Approved") {
          reasonsSection.innerHTML = `<p><strong>Approval Reason:</strong> ${reasons.approveReason}</p>`
        } else if (status === "Rejected") {
          reasonsSection.innerHTML = `<p><strong>Rejection Reason:</strong> ${reasons.rejectReason}</p>`
        } else if (status === "Archived") {
          reasonsSection.innerHTML = `<p><strong>Archive Reason:</strong> ${reasons.archiveReason}</p>`
        } else {
          reasonsSection.innerHTML = "<p>No action has been taken on this request yet.</p>"
        }

        // Show the modal
        document.getElementById("viewModal").style.display = "flex"
      })
    })

    // Approve button click
    const approveButtons = document.querySelectorAll(".btn-approve")
    approveButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr")
        const requestId = row.cells[0].textContent

        // Set up the approve modal
        document.getElementById("approveRequestId").textContent = requestId
        document.getElementById("approveReasonInput").value = ""
        document.getElementById("approveModal").style.display = "flex"

        // Focus on the reason input
        document.getElementById("approveReasonInput").focus()
      })
    })

    // Reject button click
    const rejectButtons = document.querySelectorAll(".btn-reject")
    rejectButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr")
        const requestId = row.cells[0].textContent

        // Set up the reject modal
        document.getElementById("rejectRequestId").textContent = requestId
        document.getElementById("rejectReasonInput").value = ""
        document.getElementById("rejectError").textContent = ""
        document.getElementById("rejectModal").style.display = "flex"

        // Focus on the reason input
        document.getElementById("rejectReasonInput").focus()
      })
    })

    // Archive button click
    const archiveButtons = document.querySelectorAll(".btn-archive")
    archiveButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr")
        const requestId = row.cells[0].textContent

        // Set up the archive modal
        document.getElementById("archiveRequestId").textContent = requestId
        document.getElementById("archiveReasonInput").value = ""
        document.getElementById("archiveError").textContent = ""
        document.getElementById("archiveModal").style.display = "flex"

        // Focus on the reason input
        document.getElementById("archiveReasonInput").focus()
      })
    })
  }

  // Confirm approve button
  document.getElementById("confirmApprove").addEventListener("click", () => {
    const requestId = document.getElementById("approveRequestId").textContent
    const reason = document.getElementById("approveReasonInput").value.trim() || "Approved without specific reason"

    // Store the reason
    if (!requestReasons[requestId]) {
      requestReasons[requestId] = {}
    }
    requestReasons[requestId].approveReason = reason

    // Find the row and update status
    const rows = document.querySelectorAll(".request-table tbody tr")
    rows.forEach((row) => {
      if (row.cells[0].textContent === requestId) {
        const statusCell = row.cells[4]
        statusCell.innerHTML = '<span class="status-badge status-approved">Approved</span>'
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal
    document.getElementById("approveModal").style.display = "none"

    // Show success notification
    showNotification("Request approved successfully")
  })

  // Confirm reject button
  document.getElementById("confirmReject").addEventListener("click", () => {
    const requestId = document.getElementById("rejectRequestId").textContent
    const reason = document.getElementById("rejectReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("rejectError").textContent = "Please provide a reason for rejection"
      return
    }

    // Store the reason
    if (!requestReasons[requestId]) {
      requestReasons[requestId] = {}
    }
    requestReasons[requestId].rejectReason = reason

    // Find the row and update status
    const rows = document.querySelectorAll(".request-table tbody tr")
    rows.forEach((row) => {
      if (row.cells[0].textContent === requestId) {
        const statusCell = row.cells[4]
        statusCell.innerHTML = '<span class="status-badge status-rejected">Rejected</span>'
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal and error message
    document.getElementById("rejectError").textContent = ""
    document.getElementById("rejectModal").style.display = "none"

    // Show success notification
    showNotification("Request rejected")
  })

  // Confirm archive button
  document.getElementById("confirmArchive").addEventListener("click", () => {
    const requestId = document.getElementById("archiveRequestId").textContent
    const reason = document.getElementById("archiveReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("archiveError").textContent = "Please provide a reason for archiving"
      return
    }

    // Store the reason
    if (!requestReasons[requestId]) {
      requestReasons[requestId] = {}
    }
    requestReasons[requestId].archiveReason = reason

    // Find the row and update status (we don't remove it anymore)
    const rows = document.querySelectorAll(".request-table tbody tr")
    rows.forEach((row) => {
      if (row.cells[0].textContent === requestId) {
        const statusCell = row.cells[4]
        statusCell.innerHTML = '<span class="status-badge status-archived">Archived</span>'
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal and error message
    document.getElementById("archiveError").textContent = ""
    document.getElementById("archiveModal").style.display = "none"

    // Show success notification
    showNotification("Request archived")
  })

  // Close modal buttons
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", () => {
      // Find the parent modal and hide it
      const modal = button.closest(".modal")
      if (modal) {
        modal.style.display = "none"
      }

      // Clear error messages
      document.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = ""
      })
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none"

        // Clear error messages
        document.querySelectorAll(".error-message").forEach((error) => {
          error.textContent = ""
        })
      }
    })
  })

  // Search and filter buttons
  const searchFilterButtons = document.querySelectorAll(".search-button, .filter-button")
  searchFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Search or filter functionality would be implemented here")
    })
  })

  // New requests button
  const newButton = document.querySelector(".new-button")
  newButton.addEventListener("click", () => {
    // Refresh the resident requests list
    loadResidentRequests()
    showNotification("Refreshed resident requests list")
  })

  // Approve all button
  const approveAllButton = document.querySelector(".approve-all-button")
  approveAllButton.addEventListener("click", () => {
    // Set up the approve all modal
    document.getElementById("approveAllModal").style.display = "flex"
    document.getElementById("approveAllReasonInput").focus()
  })

  // Confirm approve all button
  document.getElementById("confirmApproveAll").addEventListener("click", () => {
    const reason =
      document.getElementById("approveAllReasonInput").value.trim() || "Batch approval without specific reason"

    // Update all pending requests to approved
    const pendingBadges = document.querySelectorAll(".status-badge.status-pending")
    pendingBadges.forEach((badge) => {
      const row = badge.closest("tr")
      const requestId = row.cells[0].textContent

      // Store the reason for each request
      if (!requestReasons[requestId]) {
        requestReasons[requestId] = {}
      }
      requestReasons[requestId].approveReason = reason

      // Update status
      badge.className = "status-badge status-approved"
      badge.textContent = "Approved"
    })

    // Save state to localStorage
    saveState()

    // Hide the modal
    document.getElementById("approveAllModal").style.display = "none"

    // Show success notification
    showNotification(`${pendingBadges.length} requests approved successfully`)
  })

  // Show notification function
  function showNotification(message) {
    const notification = document.createElement("div")
    notification.className = "notification-popup"
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✓</span>
        <p>${message}</p>
      </div>
    `
    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add("fade-out")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
})
