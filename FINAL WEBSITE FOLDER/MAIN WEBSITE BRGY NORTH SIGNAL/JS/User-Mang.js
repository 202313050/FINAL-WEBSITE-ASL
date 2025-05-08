document.addEventListener("DOMContentLoaded", () => {
  // Get references to elements
  const userTableBody = document.getElementById("userTableBody")
  const totalUsersElement = document.getElementById("totalUsers")
  const activeUsersElement = document.getElementById("activeUsers")
  const suspendedUsersElement = document.getElementById("suspendedUsers")
  const createAdminBtn = document.getElementById("createAdminBtn")
  const createAdminModal = document.getElementById("createAdminModal")
  const createAdminForm = document.getElementById("createAdminForm")
  const createAdminError = document.getElementById("createAdminError")
  const adminRoleSelect = document.getElementById("adminRole")
  const permissionsSection = document.getElementById("permissionsSection")

  // Define role-based permissions
  const rolePermissions = {
    admin: {
      dashboard: {
        title: "Dashboard Access",
        permissions: [
          {
            id: "view_dashboard",
            label: "View Dashboard",
            checked: true,
            disabled: true,
            description: "Access to view the main dashboard",
          },
          {
            id: "view_statistics",
            label: "View Statistics",
            checked: true,
            disabled: false,
            description: "Access to view statistics and analytics",
          },
        ],
      },
      residentRequests: {
        title: "Resident Requests",
        permissions: [
          {
            id: "view_resident_requests",
            label: "View Resident Requests",
            checked: true,
            disabled: true,
            description: "Access to view resident requests",
          },
          {
            id: "approve_resident_requests",
            label: "Approve Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to approve resident requests",
          },
          {
            id: "reject_resident_requests",
            label: "Reject Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to reject resident requests",
          },
          {
            id: "archive_resident_requests",
            label: "Archive Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to archive resident requests",
          },
        ],
      },
      documentRequests: {
        title: "Document Requests",
        permissions: [
          {
            id: "view_document_requests",
            label: "View Document Requests",
            checked: true,
            disabled: true,
            description: "Access to view document requests",
          },
          {
            id: "approve_document_requests",
            label: "Approve Document Requests",
            checked: true,
            disabled: false,
            description: "Ability to approve document requests",
          },
          {
            id: "reject_document_requests",
            label: "Reject Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to reject document requests",
          },
          {
            id: "archive_document_requests",
            label: "Archive Document Requests",
            checked: true,
            disabled: false,
            description: "Ability to archive document requests",
          },
        ],
      },
      userManagement: {
        title: "User Management",
        permissions: [
          {
            id: "view_users",
            label: "View Users",
            checked: true,
            disabled: true,
            description: "Access to view user list",
          },
          {
            id: "create_users",
            label: "Create Users",
            checked: true,
            disabled: false,
            description: "Ability to create new users",
          },
          {
            id: "edit_users",
            label: "Edit Users",
            checked: true,
            disabled: false,
            description: "Ability to edit user details",
          },
          {
            id: "delete_users",
            label: "Delete Users",
            checked: true,
            disabled: false,
            description: "Ability to delete users",
          },
          {
            id: "suspend_users",
            label: "Suspend Users",
            checked: true,
            disabled: false,
            description: "Ability to suspend users",
          },
          {
            id: "activate_users",
            label: "Activate Users",
            checked: true,
            disabled: false,
            description: "Ability to activate users",
          },
        ],
      },
      settings: {
        title: "Settings",
        permissions: [
          {
            id: "view_settings",
            label: "View Settings",
            checked: true,
            disabled: true,
            description: "Access to view settings",
          },
          {
            id: "edit_settings",
            label: "Edit Settings",
            checked: true,
            disabled: false,
            description: "Ability to modify settings",
          },
        ],
      },
    },
    "barangay-captain": {
      dashboard: {
        title: "Dashboard Access",
        permissions: [
          {
            id: "view_dashboard",
            label: "View Dashboard",
            checked: true,
            disabled: true,
            description: "Access to view the main dashboard",
          },
          {
            id: "view_statistics",
            label: "View Statistics",
            checked: true,
            disabled: false,
            description: "Access to view statistics and analytics",
          },
        ],
      },
      residentRequests: {
        title: "Resident Requests",
        permissions: [
          {
            id: "view_resident_requests",
            label: "View Resident Requests",
            checked: true,
            disabled: true,
            description: "Access to view resident requests",
          },
          {
            id: "approve_resident_requests",
            label: "Approve Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to approve resident requests",
          },
          {
            id: "reject_resident_requests",
            label: "Reject Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to reject resident requests",
          },
          {
            id: "archive_resident_requests",
            label: "Archive Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to archive resident requests",
          },
        ],
      },
      documentRequests: {
        title: "Document Requests",
        permissions: [
          {
            id: "view_document_requests",
            label: "View Document Requests",
            checked: true,
            disabled: true,
            description: "Access to view document requests",
          },
          {
            id: "approve_document_requests",
            label: "Approve Document Requests",
            checked: true,
            disabled: false,
            description: "Ability to approve document requests",
          },
          {
            id: "reject_resident_requests",
            label: "Reject Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to reject document requests",
          },
          {
            id: "archive_document_requests",
            label: "Archive Document Requests",
            checked: true,
            disabled: false,
            description: "Ability to archive document requests",
          },
        ],
      },
      userManagement: {
        title: "User Management",
        permissions: [
          {
            id: "view_users",
            label: "View Users",
            checked: true,
            disabled: true,
            description: "Access to view user list",
          },
          {
            id: "create_users",
            label: "Create Users",
            checked: false,
            disabled: false,
            description: "Ability to create new users",
          },
          {
            id: "edit_users",
            label: "Edit Users",
            checked: false,
            disabled: false,
            description: "Ability to edit user details",
          },
          {
            id: "delete_users",
            label: "Delete Users",
            checked: false,
            disabled: true,
            description: "Ability to delete users (restricted)",
          },
          {
            id: "suspend_users",
            label: "Suspend Users",
            checked: false,
            disabled: true,
            description: "Ability to suspend users (restricted)",
          },
          {
            id: "activate_users",
            label: "Activate Users",
            checked: false,
            disabled: true,
            description: "Ability to activate users (restricted)",
          },
        ],
      },
      settings: {
        title: "Settings",
        permissions: [
          {
            id: "view_settings",
            label: "View Settings",
            checked: true,
            disabled: true,
            description: "Access to view settings",
          },
          {
            id: "edit_settings",
            label: "Edit Settings",
            checked: false,
            disabled: false,
            description: "Ability to modify settings",
          },
        ],
      },
    },
    "document-verifier": {
      dashboard: {
        title: "Dashboard Access",
        permissions: [
          {
            id: "view_dashboard",
            label: "View Dashboard",
            checked: true,
            disabled: true,
            description: "Access to view the main dashboard",
          },
          {
            id: "view_statistics",
            label: "View Statistics",
            checked: false,
            disabled: false,
            description: "Access to view statistics and analytics",
          },
        ],
      },
      residentRequests: {
        title: "Resident Requests",
        permissions: [
          {
            id: "view_resident_requests",
            label: "View Resident Requests",
            checked: true,
            disabled: false,
            description: "Access to view resident requests",
          },
          {
            id: "approve_resident_requests",
            label: "Approve Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to approve resident requests",
          },
          {
            id: "reject_resident_requests",
            label: "Reject Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to reject resident requests",
          },
          {
            id: "archive_resident_requests",
            label: "Archive Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to archive resident requests",
          },
        ],
      },
      documentRequests: {
        title: "Document Requests",
        permissions: [
          {
            id: "view_document_requests",
            label: "View Document Requests",
            checked: true,
            disabled: true,
            description: "Access to view document requests",
          },
          {
            id: "approve_document_requests",
            label: "Approve Document Requests",
            checked: true,
            disabled: false,
            description: "Ability to approve document requests",
          },
          {
            id: "reject_resident_requests",
            label: "Reject Resident Requests",
            checked: true,
            disabled: false,
            description: "Ability to reject document requests",
          },
          {
            id: "archive_document_requests",
            label: "Archive Document Requests",
            checked: true,
            disabled: false,
            description: "Ability to archive document requests",
          },
        ],
      },
      userManagement: {
        title: "User Management",
        permissions: [
          {
            id: "view_users",
            label: "View Users",
            checked: false,
            disabled: true,
            description: "Access to view user list (restricted)",
          },
          {
            id: "create_users",
            label: "Create Users",
            checked: false,
            disabled: true,
            description: "Ability to create new users (restricted)",
          },
          {
            id: "edit_users",
            label: "Edit Users",
            checked: false,
            disabled: true,
            description: "Ability to edit user details (restricted)",
          },
          {
            id: "delete_users",
            label: "Delete Users",
            checked: false,
            disabled: true,
            description: "Ability to delete users (restricted)",
          },
          {
            id: "suspend_users",
            label: "Suspend Users",
            checked: false,
            disabled: true,
            description: "Ability to suspend users (restricted)",
          },
          {
            id: "activate_users",
            label: "Activate Users",
            checked: false,
            disabled: true,
            description: "Ability to activate users (restricted)",
          },
        ],
      },
      settings: {
        title: "Settings",
        permissions: [
          {
            id: "view_settings",
            label: "View Settings",
            checked: false,
            disabled: true,
            description: "Access to view settings (restricted)",
          },
          {
            id: "edit_settings",
            label: "Edit Settings",
            checked: false,
            disabled: true,
            description: "Ability to modify settings (restricted)",
          },
        ],
      },
    },
  }

  // Initialize user data storage
  function initializeUserData() {
    if (!localStorage.getItem("userData")) {
      // Create initial user data with reasons
      const initialUserData = {}

      // Get all existing users from the table
      const rows = userTableBody.querySelectorAll("tr")
      rows.forEach((row) => {
        const userId = row.cells[0].textContent
        const status = row.cells[5].querySelector(".status-badge").textContent.toLowerCase()
        const role = row.cells[4].textContent.toLowerCase().replace(" ", "-")

        initialUserData[userId] = {
          status: status,
          role: role,
          permissions: getDefaultPermissionsForRole(role),
          reasons: {
            suspend: "",
            activate: "",
            delete: "",
          },
        }
      })

      localStorage.setItem("userData", JSON.stringify(initialUserData))
    }
  }

  // Get default permissions for a role
  function getDefaultPermissionsForRole(role) {
    const permissions = {}
    const roleData = rolePermissions[role] || rolePermissions["document-verifier"]

    // Extract checked permissions
    Object.keys(roleData).forEach((category) => {
      roleData[category].permissions.forEach((permission) => {
        if (permission.checked) {
          permissions[permission.id] = true
        }
      })
    })

    return permissions
  }

  // Initialize data
  initializeUserData()

  // Role selection change handler
  adminRoleSelect.addEventListener("change", function () {
    const selectedRole = this.value
    updatePermissionsSection(selectedRole)
  })

  // Update permissions section based on selected role
  function updatePermissionsSection(role) {
    const permissionsContainer = permissionsSection.querySelector(".permissions-container")

    // Clear current content
    permissionsContainer.innerHTML = ""

    if (!role) {
      permissionsContainer.innerHTML = '<p class="permissions-message">Select a role to view available permissions</p>'
      return
    }

    const roleData = rolePermissions[role]
    if (!roleData) {
      permissionsContainer.innerHTML = '<p class="permissions-message">No permissions defined for this role</p>'
      return
    }

    // Create permission groups
    Object.keys(roleData).forEach((category) => {
      const categoryData = roleData[category]

      // Create category group
      const groupDiv = document.createElement("div")
      groupDiv.className = "permission-group"

      // Add category title
      const groupTitle = document.createElement("h4")
      groupTitle.textContent = categoryData.title
      groupDiv.appendChild(groupTitle)

      // Add permissions
      categoryData.permissions.forEach((permission) => {
        const checkboxDiv = document.createElement("div")
        checkboxDiv.className = "permission-checkbox"

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = permission.id
        checkbox.name = permission.id
        checkbox.checked = permission.checked
        checkbox.disabled = permission.disabled

        const label = document.createElement("label")
        label.htmlFor = permission.id
        label.textContent = permission.label

        checkboxDiv.appendChild(checkbox)
        checkboxDiv.appendChild(label)
        groupDiv.appendChild(checkboxDiv)

        // Add description if available
        if (permission.description) {
          const description = document.createElement("p")
          description.className = "permission-description"
          description.textContent = permission.description
          groupDiv.appendChild(description)
        }
      })

      permissionsContainer.appendChild(groupDiv)
    })
  }

  // Logout Modal Elements
  const logoutLink = document.querySelector(".sign-out a")
  const logoutModal = document.getElementById("logoutModal")
  const cancelLogoutBtn = document.getElementById("cancelLogout")
  const confirmLogoutBtn = document.getElementById("confirmLogout")

  // Show logout confirmation modal
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault()
    logoutModal.style.display = "flex"
  })

  // Hide modal when Cancel is clicked
  cancelLogoutBtn.addEventListener("click", () => {
    logoutModal.style.display = "none"
  })

  // Handle logout when confirmed
  confirmLogoutBtn.addEventListener("click", () => {
    // Perform logout actions here
    // For example, clear session storage, cookies, etc.

    // Redirect to login page
    window.location.href = "Home.html"
  })

  // Close modal if user clicks outside of it
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none"
    }
  })

  // Initialize stats if not already set
  if (!localStorage.getItem("totalUsers")) {
    localStorage.setItem("totalUsers", "42")
  }
  if (!localStorage.getItem("activeUsers")) {
    localStorage.setItem("activeUsers", "35")
  }
  if (!localStorage.getItem("suspendedUsers")) {
    localStorage.setItem("suspendedUsers", "7")
  }
  if (!localStorage.getItem("pendingUsers")) {
    localStorage.setItem("pendingUsers", "0")
  }

  // Update stats display
  function updateStats() {
    // Get counts from localStorage
    const totalUsers = localStorage.getItem("totalUsers")
    const activeUsers = localStorage.getItem("activeUsers")
    const suspendedUsers = localStorage.getItem("suspendedUsers")

    // Update the stats cards
    totalUsersElement.textContent = totalUsers
    activeUsersElement.textContent = activeUsers
    suspendedUsersElement.textContent = suspendedUsers
  }

  // Load users from localStorage
  function loadUsers() {
    // Get existing users from localStorage or use default data
    const users = JSON.parse(localStorage.getItem("barangayUsers")) || []

    // Get saved user data (status and reasons)
    const userData = JSON.parse(localStorage.getItem("userData")) || {}

    // First, update existing rows with saved status
    const existingRows = userTableBody.querySelectorAll("tr")
    existingRows.forEach((row) => {
      const userId = row.querySelector("td:first-child").textContent

      // If we have saved data for this user
      if (userData[userId]) {
        const savedStatus = userData[userId].status
        const savedRole = userData[userId].role || row.cells[4].textContent.toLowerCase().replace(" ", "-")

        // Only update if the status is not 'deleted'
        if (savedStatus && savedStatus !== "deleted") {
          // Update role
          row.cells[4].textContent = formatRoleName(savedRole)

          // Update status badge
          const statusCell = row.querySelector("td:nth-child(6)")
          statusCell.innerHTML = `<span class="status-badge status-${savedStatus}">${savedStatus.charAt(0).toUpperCase() + savedStatus.slice(1)}</span>`

          // Update action buttons based on status
          const actionCell = row.querySelector("td:nth-child(7)")
          if (savedStatus === "active") {
            actionCell.innerHTML = `
              <div class="action-buttons">
                <button class="btn btn-view">View</button>
                <button class="btn btn-suspend">Suspend</button>
                <button class="btn btn-delete">Delete</button>
              </div>
            `
          } else if (savedStatus === "suspended") {
            actionCell.innerHTML = `
              <div class="action-buttons">
                <button class="btn btn-view">View</button>
                <button class="btn btn-activate">Activate</button>
                <button class="btn btn-delete">Delete</button>
              </div>
            `
          } else if (savedStatus === "pending") {
            actionCell.innerHTML = `
              <div class="action-buttons">
                <button class="btn btn-view">View</button>
                <button class="btn btn-activate">Activate</button>
                <button class="btn btn-delete">Delete</button>
              </div>
            `
          }

          // Reattach event listeners
          attachButtonListeners(actionCell)
        }

        // If status is 'deleted', remove the row
        if (savedStatus === "deleted") {
          row.remove()
        }
      }
    })

    // Then add any new users from localStorage
    if (users.length > 0) {
      users.forEach((user) => {
        // Check if user already exists in the table
        let userExists = false

        existingRows.forEach((row) => {
          const userId = row.querySelector("td:first-child").textContent
          if (userId === user.userId) {
            userExists = true
          }
        })

        // If user doesn't exist, add them to the table
        if (!userExists && user.status !== "deleted") {
          const newRow = document.createElement("tr")

          // Create user ID cell
          const userIdCell = document.createElement("td")
          userIdCell.textContent = user.userId
          newRow.appendChild(userIdCell)

          // Create first name cell
          const firstNameCell = document.createElement("td")
          firstNameCell.textContent = user.firstName
          newRow.appendChild(firstNameCell)

          // Create last name cell
          const lastNameCell = document.createElement("td")
          lastNameCell.textContent = user.lastName
          newRow.appendChild(lastNameCell)

          // Create email cell
          const emailCell = document.createElement("td")
          emailCell.textContent = user.email
          newRow.appendChild(emailCell)

          // Create role cell
          const roleCell = document.createElement("td")
          roleCell.textContent = formatRoleName(user.role)
          newRow.appendChild(roleCell)

          // Create status cell
          const statusCell = document.createElement("td")
          const statusBadge = document.createElement("span")
          statusBadge.className = `status-badge status-${user.status}`
          statusBadge.textContent = user.status.charAt(0).toUpperCase() + user.status.slice(1)
          statusCell.appendChild(statusBadge)
          newRow.appendChild(statusCell)

          // Create action cell
          const actionCell = document.createElement("td")
          const actionButtons = document.createElement("div")
          actionButtons.className = "action-buttons"

          // View button
          const viewBtn = document.createElement("button")
          viewBtn.className = "btn btn-view"
          viewBtn.textContent = "View"
          actionButtons.appendChild(viewBtn)

          // Suspend/Activate button
          if (user.status === "active") {
            const suspendBtn = document.createElement("button")
            suspendBtn.className = "btn btn-suspend"
            suspendBtn.textContent = "Suspend"
            actionButtons.appendChild(suspendBtn)
          } else {
            const activateBtn = document.createElement("button")
            activateBtn.className = "btn btn-activate"
            activateBtn.textContent = "Activate"
            actionButtons.appendChild(activateBtn)
          }

          // Delete button
          const deleteBtn = document.createElement("button")
          deleteBtn.className = "btn btn-delete"
          deleteBtn.textContent = "Delete"
          actionButtons.appendChild(deleteBtn)

          actionCell.appendChild(actionButtons)
          newRow.appendChild(actionCell)

          // Add the new row to the table
          userTableBody.appendChild(newRow)

          // Attach event listeners to the new buttons
          attachButtonListeners(actionCell)
        }
      })
    }

    // Update stats based on current table state
    updateStatsFromTable()
  }

  // Format role name for display
  function formatRoleName(role) {
    if (role === "admin") return "Admin"
    if (role === "barangay-captain") return "Barangay Captain"
    if (role === "document-verifier") return "Document Verifier"
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Add this new function to update stats based on the current table
  function updateStatsFromTable() {
    // Count users in the table
    const rows = userTableBody.querySelectorAll("tr")
    const totalUsers = rows.length
    let activeUsers = 0
    let suspendedUsers = 0
    let pendingUsers = 0

    rows.forEach((row) => {
      const statusText = row.querySelector("td:nth-child(6) .status-badge").textContent.toLowerCase()
      if (statusText === "active") {
        activeUsers++
      } else if (statusText === "suspended") {
        suspendedUsers++
      } else if (statusText === "pending") {
        pendingUsers++
      }
    })

    // Update localStorage with current counts
    localStorage.setItem("totalUsers", totalUsers.toString())
    localStorage.setItem("activeUsers", activeUsers.toString())
    localStorage.setItem("suspendedUsers", suspendedUsers.toString())
    localStorage.setItem("pendingUsers", pendingUsers.toString())

    // Update the stats display
    updateStats()
  }

  // Function to attach event listeners to buttons
  function attachButtonListeners(container = null) {
    // If container is provided, only attach listeners to buttons in that container
    // Otherwise, attach listeners to all buttons in the table

    if (container) {
      // View button
      container.querySelector(".btn-view")?.addEventListener("click", function () {
        const row = this.closest("tr")
        const userId = row.cells[0].textContent

        // Get user data
        const userData = JSON.parse(localStorage.getItem("userData")) || {}
        const user = userData[userId] || { reasons: {}, permissions: {} }

        // Show view modal with user details and reasons
        document.getElementById("viewUserId").textContent = userId
        document.getElementById("viewUserName").textContent = `${row.cells[1].textContent} ${row.cells[2].textContent}`
        document.getElementById("viewUserEmail").textContent = row.cells[3].textContent
        document.getElementById("viewUserRole").textContent = row.cells[4].textContent
        document.getElementById("viewUserStatus").textContent = row.cells[5].querySelector(".status-badge").textContent

        // Display permissions
        const permissionsList = document.getElementById("viewUserPermissions")
        permissionsList.innerHTML = ""

        if (user.permissions) {
          const permissionIds = Object.keys(user.permissions).filter((id) => user.permissions[id])

          if (permissionIds.length > 0) {
            permissionIds.forEach((id) => {
              const li = document.createElement("li")
              li.textContent = formatPermissionName(id)
              permissionsList.appendChild(li)
            })
          } else {
            const li = document.createElement("li")
            li.textContent = "No specific permissions assigned"
            permissionsList.appendChild(li)
          }
        } else {
          const li = document.createElement("li")
          li.textContent = "No permissions data available"
          permissionsList.appendChild(li)
        }

        // Display reasons if they exist
        const reasonsSection = document.getElementById("viewReasons")
        reasonsSection.innerHTML = ""

        if (user.reasons.suspend) {
          reasonsSection.innerHTML += `<p><strong>Suspension Reason:</strong> ${user.reasons.suspend}</p>`
        }

        if (user.reasons.activate) {
          reasonsSection.innerHTML += `<p><strong>Activation Reason:</strong> ${user.reasons.activate}</p>`
        }

        if (reasonsSection.innerHTML === "") {
          reasonsSection.innerHTML = "<p>No action reasons recorded for this user.</p>"
        }

        // Show the modal
        document.getElementById("viewModal").style.display = "flex"
      })

      // Activate button
      container.querySelector(".btn-activate")?.addEventListener("click", function () {
        const row = this.closest("tr")
        const userId = row.cells[0].textContent
        const userName = `${row.cells[1].textContent} ${row.cells[2].textContent}`

        // Set up activate modal
        document.getElementById("activateUserId").textContent = userId
        document.getElementById("activateUserName").textContent = userName
        document.getElementById("activateReasonInput").value = ""
        document.getElementById("activateError").style.display = "none"

        // Show the modal
        document.getElementById("activateModal").style.display = "flex"
      })

      // Suspend button
      container.querySelector(".btn-suspend")?.addEventListener("click", function () {
        const row = this.closest("tr")
        const userId = row.cells[0].textContent
        const userName = `${row.cells[1].textContent} ${row.cells[2].textContent}`

        // Set up suspend modal
        document.getElementById("suspendUserId").textContent = userId
        document.getElementById("suspendUserName").textContent = userName
        document.getElementById("suspendReasonInput").value = ""
        document.getElementById("suspendError").style.display = "none"

        // Show the modal
        document.getElementById("suspendModal").style.display = "flex"
      })

      // Delete button
      container.querySelector(".btn-delete")?.addEventListener("click", function () {
        const row = this.closest("tr")
        const userId = row.cells[0].textContent
        const userName = `${row.cells[1].textContent} ${row.cells[2].textContent}`

        // Set up delete modal
        document.getElementById("deleteUserId").textContent = userId
        document.getElementById("deleteUserName").textContent = userName
        document.getElementById("deleteReasonInput").value = ""
        document.getElementById("deleteError").style.display = "none"

        // Show the modal
        document.getElementById("deleteModal").style.display = "flex"
      })
    } else {
      // View button click
      const viewButtons = document.querySelectorAll(".btn-view")
      viewButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const row = this.closest("tr")
          const userId = row.cells[0].textContent

          // Get user data
          const userData = JSON.parse(localStorage.getItem("userData")) || {}
          const user = userData[userId] || { reasons: {}, permissions: {} }

          // Show view modal with user details and reasons
          document.getElementById("viewUserId").textContent = userId
          document.getElementById("viewUserName").textContent =
            `${row.cells[1].textContent} ${row.cells[2].textContent}`
          document.getElementById("viewUserEmail").textContent = row.cells[3].textContent
          document.getElementById("viewUserRole").textContent = row.cells[4].textContent
          document.getElementById("viewUserStatus").textContent =
            row.cells[5].querySelector(".status-badge").textContent

          // Display permissions
          const permissionsList = document.getElementById("viewUserPermissions")
          permissionsList.innerHTML = ""
          permissionsList.style.maxHeight = "200px"
          permissionsList.style.overflowY = "auto"

          if (user.permissions) {
            const permissionIds = Object.keys(user.permissions).filter((id) => user.permissions[id])

            if (permissionIds.length > 0) {
              permissionIds.forEach((id) => {
                const li = document.createElement("li")
                li.textContent = formatPermissionName(id)
                permissionsList.appendChild(li)
              })
            } else {
              const li = document.createElement("li")
              li.textContent = "No specific permissions assigned"
              permissionsList.appendChild(li)
            }
          } else {
            const li = document.createElement("li")
            li.textContent = "No permissions data available"
            permissionsList.appendChild(li)
          }

          // Display reasons if they exist
          const reasonsSection = document.getElementById("viewReasons")
          reasonsSection.innerHTML = ""

          if (user.reasons.suspend) {
            reasonsSection.innerHTML += `<p><strong>Suspension Reason:</strong> ${user.reasons.suspend}</p>`
          }

          if (user.reasons.activate) {
            reasonsSection.innerHTML += `<p><strong>Activation Reason:</strong> ${user.reasons.activate}</p>`
          }

          if (reasonsSection.innerHTML === "") {
            reasonsSection.innerHTML = "<p>No action reasons recorded for this user.</p>"
          }

          // Show the modal
          document.getElementById("viewModal").style.display = "flex"
        })
      })

      // Activate button click
      const activateButtons = document.querySelectorAll(".btn-activate")
      activateButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const row = this.closest("tr")
          const userId = row.cells[0].textContent
          const userName = `${row.cells[1].textContent} ${row.cells[2].textContent}`

          // Set up activate modal
          document.getElementById("activateUserId").textContent = userId
          document.getElementById("activateUserName").textContent = userName
          document.getElementById("activateReasonInput").value = ""
          document.getElementById("activateError").style.display = "none"

          // Show the modal
          document.getElementById("activateModal").style.display = "flex"
        })
      })

      // Suspend button click
      const suspendButtons = document.querySelectorAll(".btn-suspend")
      suspendButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const row = this.closest("tr")
          const userId = row.cells[0].textContent
          const userName = `${row.cells[1].textContent} ${row.cells[2].textContent}`

          // Set up suspend modal
          document.getElementById("suspendUserId").textContent = userId
          document.getElementById("suspendUserName").textContent = userName
          document.getElementById("suspendReasonInput").value = ""
          document.getElementById("suspendError").style.display = "none"

          // Show the modal
          document.getElementById("suspendModal").style.display = "flex"
        })
      })

      // Delete button click
      const deleteButtons = document.querySelectorAll(".btn-delete")
      deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const row = this.closest("tr")
          const userId = row.cells[0].textContent
          const userName = `${row.cells[1].textContent} ${row.cells[2].textContent}`

          // Set up delete modal
          document.getElementById("deleteUserId").textContent = userId
          document.getElementById("deleteUserName").textContent = userName
          document.getElementById("deleteReasonInput").value = ""
          document.getElementById("deleteError").style.display = "none"

          // Show the modal
          document.getElementById("deleteModal").style.display = "flex"
        })
      })
    }
  }

  // Format permission name for display
  function formatPermissionName(id) {
    return id
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Confirm activate
  document.getElementById("confirmActivate").addEventListener("click", () => {
    const userId = document.getElementById("activateUserId").textContent
    const reason = document.getElementById("activateReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("activateError").style.display = "block"
      return
    }

    // Find the row
    const rows = document.querySelectorAll(".user-table tbody tr")
    let targetRow = null

    rows.forEach((row) => {
      if (row.cells[0].textContent === userId) {
        targetRow = row
      }
    })

    if (targetRow) {
      // Update status badge
      const statusCell = targetRow.cells[5]
      statusCell.innerHTML = '<span class="status-badge status-active">Active</span>'

      // Update action buttons
      const actionCell = targetRow.cells[6]
      actionCell.innerHTML = `
        <div class="action-buttons">
          <button class="btn btn-view">View</button>
          <button class="btn btn-suspend">Suspend</button>
          <button class="btn btn-delete">Delete</button>
        </div>
      `

      // Update stats
      let activeUsers = Number.parseInt(localStorage.getItem("activeUsers"))
      let suspendedUsers = Number.parseInt(localStorage.getItem("suspendedUsers"))
      let pendingUsers = Number.parseInt(localStorage.getItem("pendingUsers"))

      // Get current status
      const userData = JSON.parse(localStorage.getItem("userData")) || {}
      const currentStatus = userData[userId]?.status || "suspended"

      if (currentStatus === "suspended") {
        activeUsers += 1
        suspendedUsers -= 1
      } else if (currentStatus === "pending") {
        activeUsers += 1
        pendingUsers -= 1
      }

      localStorage.setItem("activeUsers", activeUsers.toString())
      localStorage.setItem("suspendedUsers", suspendedUsers.toString())
      localStorage.setItem("pendingUsers", pendingUsers.toString())

      // Save reason to localStorage
      if (!userData[userId]) {
        userData[userId] = { reasons: {}, permissions: {} }
      }

      userData[userId].status = "active"
      userData[userId].reasons.activate = reason

      localStorage.setItem("userData", JSON.stringify(userData))

      // Update user in barangayUsers if exists
      const users = JSON.parse(localStorage.getItem("barangayUsers")) || []
      const userIndex = users.findIndex((user) => user.userId === userId)
      if (userIndex !== -1) {
        users[userIndex].status = "active"
        localStorage.setItem("barangayUsers", JSON.stringify(users))
      }

      // Update stats display
      updateStats()

      // Reattach event listeners
      attachButtonListeners(actionCell)

      // Show notification
      showNotification("User activated successfully")
    }

    // Hide the modal
    document.getElementById("activateModal").style.display = "none"
  })

  // Confirm suspend
  document.getElementById("confirmSuspend").addEventListener("click", () => {
    const userId = document.getElementById("suspendUserId").textContent
    const reason = document.getElementById("suspendReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("suspendError").style.display = "block"
      return
    }

    // Find the row
    const rows = document.querySelectorAll(".user-table tbody tr")
    let targetRow = null

    rows.forEach((row) => {
      if (row.cells[0].textContent === userId) {
        targetRow = row
      }
    })

    if (targetRow) {
      // Update status badge
      const statusCell = targetRow.cells[5]
      statusCell.innerHTML = '<span class="status-badge status-suspended">Suspended</span>'

      // Update action buttons
      const actionCell = targetRow.cells[6]
      actionCell.innerHTML = `
        <div class="action-buttons">
          <button class="btn btn-view">View</button>
          <button class="btn btn-activate">Activate</button>
          <button class="btn btn-delete">Delete</button>
        </div>
      `

      // Update stats
      let activeUsers = Number.parseInt(localStorage.getItem("activeUsers"))
      let suspendedUsers = Number.parseInt(localStorage.getItem("suspendedUsers"))
      let pendingUsers = Number.parseInt(localStorage.getItem("pendingUsers"))

      // Get current status
      const userData = JSON.parse(localStorage.getItem("userData")) || {}
      const currentStatus = userData[userId]?.status || "active"

      if (currentStatus === "active") {
        activeUsers -= 1
        suspendedUsers += 1
      } else if (currentStatus === "pending") {
        pendingUsers -= 1
        suspendedUsers += 1
      }

      localStorage.setItem("activeUsers", activeUsers.toString())
      localStorage.setItem("suspendedUsers", suspendedUsers.toString())
      localStorage.setItem("pendingUsers", pendingUsers.toString())

      // Save reason to localStorage
      if (!userData[userId]) {
        userData[userId] = { reasons: {}, permissions: {} }
      }

      userData[userId].status = "suspended"
      userData[userId].reasons.suspend = reason

      localStorage.setItem("userData", JSON.stringify(userData))

      // Update user in barangayUsers if exists
      const users = JSON.parse(localStorage.getItem("barangayUsers")) || []
      const userIndex = users.findIndex((user) => user.userId === userId)
      if (userIndex !== -1) {
        users[userIndex].status = "suspended"
        localStorage.setItem("barangayUsers", JSON.stringify(users))
      }

      // Update stats display
      updateStats()

      // Reattach event listeners
      attachButtonListeners(actionCell)

      // Show notification
      showNotification("User suspended successfully")
    }

    // Hide the modal
    document.getElementById("suspendModal").style.display = "none"
  })

  // Confirm delete
  document.getElementById("confirmDelete").addEventListener("click", () => {
    const userId = document.getElementById("deleteUserId").textContent
    const reason = document.getElementById("deleteReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("deleteError").style.display = "block"
      return
    }

    // Find the row
    const rows = document.querySelectorAll(".user-table tbody tr")
    let targetRow = null
    let userStatus = ""

    rows.forEach((row) => {
      if (row.cells[0].textContent === userId) {
        targetRow = row
        userStatus = row.cells[5].querySelector(".status-badge").textContent.toLowerCase()
      }
    })

    if (targetRow) {
      // Update stats
      let totalUsers = Number.parseInt(localStorage.getItem("totalUsers"))
      let activeUsers = Number.parseInt(localStorage.getItem("activeUsers"))
      let suspendedUsers = Number.parseInt(localStorage.getItem("suspendedUsers"))
      let pendingUsers = Number.parseInt(localStorage.getItem("pendingUsers"))

      totalUsers -= 1

      if (userStatus === "active") {
        activeUsers -= 1
      } else if (userStatus === "suspended") {
        suspendedUsers -= 1
      } else if (userStatus === "pending") {
        pendingUsers -= 1
      }

      localStorage.setItem("totalUsers", totalUsers.toString())
      localStorage.setItem("activeUsers", activeUsers.toString())
      localStorage.setItem("suspendedUsers", suspendedUsers.toString())
      localStorage.setItem("pendingUsers", pendingUsers.toString())

      // Save reason to localStorage before removing
      const userData = JSON.parse(localStorage.getItem("userData")) || {}
      if (!userData[userId]) {
        userData[userId] = { reasons: {}, permissions: {} }
      }

      userData[userId].status = "deleted"
      userData[userId].reasons.delete = reason

      localStorage.setItem("userData", JSON.stringify(userData))

      // Update user in barangayUsers if exists
      const users = JSON.parse(localStorage.getItem("barangayUsers")) || []
      const userIndex = users.findIndex((user) => user.userId === userId)
      if (userIndex !== -1) {
        users[userIndex].status = "deleted"
        localStorage.setItem("barangayUsers", JSON.stringify(users))
      }

      // Remove the row
      targetRow.remove()

      // Update stats display
      updateStats()

      // Show notification
      showNotification("User deleted successfully")
    }

    // Hide the modal
    document.getElementById("deleteModal").style.display = "none"
  })

  // Cancel buttons for all modals
  document.querySelectorAll(".cancel-action").forEach((button) => {
    button.addEventListener("click", function () {
      // Find the parent modal and hide it
      const modal = this.closest(".modal")
      if (modal) {
        modal.style.display = "none"
      }

      // Clear error messages
      document.querySelectorAll(".error-message").forEach((error) => {
        error.style.display = "none"
      })
    })
  })

  // Create Admin button click
  createAdminBtn.addEventListener("click", () => {
    // Reset form
    createAdminForm.reset()
    createAdminError.style.display = "none"
    createAdminError.textContent = ""

    // Reset permissions section
    const permissionsContainer = permissionsSection.querySelector(".permissions-container")
    permissionsContainer.innerHTML = '<p class="permissions-message">Select a role to view available permissions</p>'

    // Show the modal
    createAdminModal.style.display = "flex"
  })

  // Create Admin form submission
  createAdminForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const firstName = document.getElementById("adminFirstName").value.trim()
    const lastName = document.getElementById("adminLastName").value.trim()
    const email = document.getElementById("adminEmail").value.trim()
    const password = document.getElementById("adminPassword").value
    const confirmPassword = document.getElementById("adminConfirmPassword").value
    const role = document.getElementById("adminRole").value

    // Validate form
    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      createAdminError.textContent = "All fields are required"
      createAdminError.style.display = "block"
      return
    }

    if (password !== confirmPassword) {
      createAdminError.textContent = "Passwords do not match"
      createAdminError.style.display = "block"
      return
    }

    // Collect permissions
    const permissions = {}
    const checkboxes = permissionsSection.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      if (!checkbox.disabled) {
        permissions[checkbox.id] = checkbox.checked
      } else if (checkbox.checked) {
        permissions[checkbox.id] = true
      }
    })

    // Generate a unique user ID
    const userId = "P" + Math.floor(1000 + Math.random() * 9000)

    // Create new user
    const newUser = {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem("barangayUsers")) || []

    // Add new user to users array
    users.push(newUser)

    // Save to localStorage
    localStorage.setItem("barangayUsers", JSON.stringify(users))

    // Update userData
    const userData = JSON.parse(localStorage.getItem("userData")) || {}
    userData[userId] = {
      status: "pending",
      role: role,
      permissions: permissions,
      reasons: {
        suspend: "",
        activate: "",
        delete: "",
      },
    }
    localStorage.setItem("userData", JSON.stringify(userData))

    // Update stats
    let totalUsers = Number.parseInt(localStorage.getItem("totalUsers"))
    let pendingUsers = Number.parseInt(localStorage.getItem("pendingUsers"))

    totalUsers += 1
    pendingUsers += 1

    localStorage.setItem("totalUsers", totalUsers.toString())
    localStorage.setItem("pendingUsers", pendingUsers.toString())

    // Add new user to the table
    const newRow = document.createElement("tr")

    // User ID cell
    const userIdCell = document.createElement("td")
    userIdCell.textContent = userId
    newRow.appendChild(userIdCell)

    // First name cell
    const firstNameCell = document.createElement("td")
    firstNameCell.textContent = firstName
    newRow.appendChild(firstNameCell)

    // Last name cell
    const lastNameCell = document.createElement("td")
    lastNameCell.textContent = lastName
    newRow.appendChild(lastNameCell)

    // Email cell
    const emailCell = document.createElement("td")
    emailCell.textContent = email
    newRow.appendChild(emailCell)

    // Role cell
    const roleCell = document.createElement("td")
    roleCell.textContent = formatRoleName(role)
    newRow.appendChild(roleCell)

    // Status cell
    const statusCell = document.createElement("td")
    statusCell.innerHTML = '<span class="status-badge status-pending">Pending</span>'
    newRow.appendChild(statusCell)

    // Action cell
    const actionCell = document.createElement("td")
    actionCell.innerHTML = `
      <div class="action-buttons">
        <button class="btn btn-view">View</button>
        <button class="btn btn-activate">Activate</button>
        <button class="btn btn-delete">Delete</button>
      </div>
    `
    newRow.appendChild(actionCell)

    // Add to table
    userTableBody.appendChild(newRow)

    // Attach event listeners
    attachButtonListeners(actionCell)

    // Update stats display
    updateStats()

    // Hide modal
    createAdminModal.style.display = "none"

    // Show notification
    showNotification("New user account created successfully")
  })

  // Search and filter buttons
  const searchButtons = document.querySelectorAll(".search-button, .filter-button")
  searchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Search or filter functionality would be implemented here")
    })
  })

  // Activate All button click
  const activateAllButton = document.querySelector(".approve-all-button")
  activateAllButton.addEventListener("click", () => {
    // Set up activate all modal
    document.getElementById("activateAllReasonInput").value = ""
    document.getElementById("activateAllError").style.display = "none"
    document.getElementById("activateAllModal").style.display = "flex"
  })

  // Confirm activate all
  document.getElementById("confirmActivateAll").addEventListener("click", () => {
    const reason = document.getElementById("activateAllReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("activateAllError").style.display = "block"
      return
    }

    // Get all suspended users
    const suspendedBadges = document.querySelectorAll(".status-badge.status-suspended")

    if (suspendedBadges.length === 0) {
      showNotification("No suspended users to activate.")
      document.getElementById("activateAllModal").style.display = "none"
      return
    }

    // Update stats
    let activeUsers = Number.parseInt(localStorage.getItem("activeUsers"))
    let suspendedUsers = Number.parseInt(localStorage.getItem("suspendedUsers"))

    activeUsers += suspendedBadges.length
    suspendedUsers = 0

    localStorage.setItem("activeUsers", activeUsers.toString())
    localStorage.setItem("suspendedUsers", suspendedUsers.toString())

    // Update each suspended user
    suspendedBadges.forEach((badge) => {
      // Get user ID
      const row = badge.closest("tr")
      const userId = row.cells[0].textContent

      // Update status badge
      badge.className = "status-badge status-active"
      badge.textContent = "Active"

      // Update action buttons
      const actionCell = row.cells[6]
      actionCell.innerHTML = `
        <div class="action-buttons">
          <button class="btn btn-view">View</button>
          <button class="btn btn-suspend">Suspend</button>
          <button class="btn btn-delete">Delete</button>
        </div>
      `

      // Save reason to localStorage
      const userData = JSON.parse(localStorage.getItem("userData")) || {}
      if (!userData[userId]) {
        userData[userId] = { reasons: {}, permissions: {} }
      }

      userData[userId].status = "active"
      userData[userId].reasons.activate = `Batch activation: ${reason}`

      localStorage.setItem("userData", JSON.stringify(userData))

      // Update user in barangayUsers if exists
      const users = JSON.parse(localStorage.getItem("barangayUsers")) || []
      const userIndex = users.findIndex((user) => user.userId === userId)
      if (userIndex !== -1) {
        users[userIndex].status = "active"
        localStorage.setItem("barangayUsers", JSON.stringify(users))
      }

      // Reattach event listeners
      attachButtonListeners(actionCell)
    })

    // Update stats display
    updateStats()

    // Hide the modal
    document.getElementById("activateAllModal").style.display = "none"

    // Show notification
    showNotification(`${suspendedBadges.length} users activated successfully`)
  })

  // Menu item click
  const menuItems = document.querySelectorAll(".menu-item")
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((i) => i.classList.remove("active"))
      this.classList.add("active")
    })
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

  // Load users when the page loads
  loadUsers()

  // Initial attachment of event listeners
  attachButtonListeners()
})
