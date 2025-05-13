document.addEventListener("DOMContentLoaded", () => {
    // Initialize the logs page
    initLogsPage()
  
    // Set up event listeners
    setupEventListeners()
  })
  
  // Global variables for pagination
  let currentPage = 1
  const logsPerPage = 20
  let filteredLogs = []
  let allLogs = []
  
  /**
   * Initialize the logs page by loading data and setting up the UI
   */
  function initLogsPage() {
    // Load log data
    loadLogData()
  
    // Update the UI with initial data
    updateLogTable()
  
    // Initialize filters
    populateUserFilter()
  }
  
  /**
   * Set up all event listeners for the page
   */
  function setupEventListeners() {
    // Search button
    document.getElementById("searchBtn").addEventListener("click", handleSearch)
  
    // Search input (for pressing Enter)
    document.getElementById("logSearch").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  
    // Filter change events
    document.getElementById("logTypeFilter").addEventListener("change", applyFilters)
    document.getElementById("dateFilter").addEventListener("change", applyFilters)
    document.getElementById("userFilter").addEventListener("change", applyFilters)
  
    // Clear filters button
    document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters)
  
    // Export logs button
    document.getElementById("exportLogsBtn").addEventListener("click", exportLogs)
  
    // Pagination buttons
    document.getElementById("firstPageBtn").addEventListener("click", () => goToPage(1))
    document.getElementById("prevPageBtn").addEventListener("click", () => goToPage(currentPage - 1))
    document.getElementById("nextPageBtn").addEventListener("click", () => goToPage(currentPage + 1))
    document.getElementById("lastPageBtn").addEventListener("click", () => {
      const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
      goToPage(totalPages)
    })
  
    // Log details modal
    document.querySelector(".close-modal").addEventListener("click", closeLogDetailsModal)
    document.getElementById("closeDetailBtn").addEventListener("click", closeLogDetailsModal)
  
    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      const modal = document.getElementById("logDetailsModal")
      if (event.target === modal) {
        closeLogDetailsModal()
      }
    })
  
    // Logout functionality
    const signOutBtn = document.getElementById("signOutBtn")
    const logoutModal = document.getElementById("logoutModal")
    const cancelLogout = document.getElementById("cancelLogout")
  
    if (signOutBtn && logoutModal && cancelLogout) {
      signOutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        logoutModal.style.display = "flex"
      })
  
      cancelLogout.addEventListener("click", () => {
        logoutModal.style.display = "none"
      })
    }
  }
  
  function loadLogData() {
    // In a real implementation, this would be an API call
    // For now, we'll use sample data
  
    // Sample log data for development and testing
    allLogs = generateSampleLogData()
  
    // Apply initial filtering
    filteredLogs = [...allLogs]
  
    // Update pagination info
    updatePaginationInfo()
  }
  

  function generateSampleLogData() {
    const categories = ["ui", "user", "request", "document", "system"]
    const users = ["admin", "staff1", "staff2"]
    const actions = {
      ui: [
        "Updated website theme",
        "Changed header color",
        "Modified footer content",
        "Updated homepage banner",
        "Changed font settings",
      ],
      user: [
        "Created new user account",
        "Deleted user account",
        "Updated user permissions",
        "Reset user password",
        "Modified user profile",
      ],
      request: [
        "Approved resident request",
        "Rejected resident request",
        "Processed document request",
        "Scheduled appointment",
        "Cancelled appointment",
      ],
      document: [
        "Uploaded new document",
        "Deleted document",
        "Updated document template",
        "Generated certificate",
        "Archived document",
      ],
      system: [
        "System backup performed",
        "Updated system settings",
        "Installed security patch",
        "Database maintenance",
        "System restart",
      ],
    }
  
    const logs = []
  
    // Generate 150+ sample log entries remove niyo nlang to Cy :3 sample data lng toh
    for (let i = 1; i <= 156; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const user = users[Math.floor(Math.random() * users.length)]
      const actionList = actions[category]
      const action = actionList[Math.floor(Math.random() * actionList.length)]
  
      // Generate a random date within the last 30 days
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  
      logs.push({
        log_id: i,
        timestamp: date,
        username: user,
        action: action,
        category: category,
        details: `Detailed information about the ${action.toLowerCase()} action performed by ${user}`,
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        before_state: JSON.stringify(
          {
            id: Math.floor(Math.random() * 1000),
            name: "Previous State",
            status: "before",
            timestamp: date.toISOString(),
          },
          null,
          2,
        ),
        after_state: JSON.stringify(
          {
            id: Math.floor(Math.random() * 1000),
            name: "Updated State",
            status: "after",
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      })
    }
  
    // Sort by timestamp (newest first)
    return logs.sort((a, b) => b.timestamp - a.timestamp)
  }
  
  /**
   * Update the log table with the current page of filtered logs
   */
  function updateLogTable() {
    const tableBody = document.getElementById("logTableBody")
    tableBody.innerHTML = ""
  
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * logsPerPage
    const endIndex = Math.min(startIndex + logsPerPage, filteredLogs.length)
  
    // Get current page of logs
    const currentLogs = filteredLogs.slice(startIndex, endIndex)
  
    // Create table rows
    currentLogs.forEach((log) => {
      const row = document.createElement("tr")
  
      // Format date
      const formattedDate = formatDate(log.timestamp)
  
      row.innerHTML = `
              <td>${log.log_id}</td>
              <td>${formattedDate}</td>
              <td>${log.username}</td>
              <td class="log-action">${log.action}</td>
              <td><span class="category-tag category-${log.category}">${capitalizeFirstLetter(log.category)}</span></td>
              <td><a class="log-details" data-log-id="${log.log_id}">View Details</a></td>
              <td>${log.ip_address}</td>
          `
  
      tableBody.appendChild(row)
    })
  
    // Add event listeners to "View Details" links
    document.querySelectorAll(".log-details").forEach((link) => {
      link.addEventListener("click", function () {
        const logId = this.getAttribute("data-log-id")
        showLogDetails(logId)
      })
    })
  
    // Update pagination buttons state
    updatePaginationButtons()
  }
  
  /**
   * Format a date object to a readable string
   */
  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    return new Date(date).toLocaleDateString("en-US", options)
  }
  
  /**
   * Capitalize the first letter of a string
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  /**
   * Update pagination information
   */
  function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
    document.getElementById("currentPage").textContent = currentPage
    document.getElementById("totalPages").textContent = totalPages
  
    // Update records info
    const startRecord = filteredLogs.length > 0 ? (currentPage - 1) * logsPerPage + 1 : 0
    const endRecord = Math.min(currentPage * logsPerPage, filteredLogs.length)
    document.querySelector(".log-pagination-info span").textContent =
      `Showing ${startRecord} - ${endRecord} of ${filteredLogs.length} records`
  }
  
  /**
   * Update pagination buttons state (enabled/disabled)
   */
  function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  
    document.getElementById("firstPageBtn").disabled = currentPage === 1
    document.getElementById("prevPageBtn").disabled = currentPage === 1
    document.getElementById("nextPageBtn").disabled = currentPage === totalPages
    document.getElementById("lastPageBtn").disabled = currentPage === totalPages
  }
  
  /**
   * Go to a specific page
   */
  function goToPage(page) {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  
    // Ensure page is within valid range
    if (page < 1 || page > totalPages) {
      return
    }
  
    currentPage = page
    updateLogTable()
    updatePaginationInfo()
  }
  
  /**
   * Handle search button click
   */
  function handleSearch() {
    applyFilters()
  }
  
  /**
   * Apply all filters to the log data
   */
  function applyFilters() {
    const searchTerm = document.getElementById("logSearch").value.toLowerCase()
    const categoryFilter = document.getElementById("logTypeFilter").value
    const dateFilter = document.getElementById("dateFilter").value
    const userFilter = document.getElementById("userFilter").value
  
    // Filter logs based on criteria
    filteredLogs = allLogs.filter((log) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        log.action.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm)
  
      // Category filter
      const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
  
      // User filter
      const matchesUser = userFilter === "all" || log.username === userFilter
  
      // Date filter
      const matchesDate = dateFilter === "all" || isWithinDateRange(log.timestamp, dateFilter)
  
      return matchesSearch && matchesCategory && matchesUser && matchesDate
    })
  
    // Reset to first page and update table
    currentPage = 1
    updateLogTable()
    updatePaginationInfo()
  }
  
  /**
   * Check if a date is within the selected date range
   */
  function isWithinDateRange(date, rangeType) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  
    const logDate = new Date(date)
    logDate.setHours(0, 0, 0, 0)
  
    switch (rangeType) {
      case "today":
        return logDate.getTime() === today.getTime()
  
      case "yesterday":
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return logDate.getTime() === yesterday.getTime()
  
      case "week":
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return logDate >= weekAgo
  
      case "month":
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return logDate >= monthAgo
  
      default:
        return true
    }
  }
  
  /**
   * Clear all filters and reset to default view
   */
  function clearFilters() {
    document.getElementById("logSearch").value = ""
    document.getElementById("logTypeFilter").value = "all"
    document.getElementById("dateFilter").value = "all"
    document.getElementById("userFilter").value = "all"
  
    filteredLogs = [...allLogs]
    currentPage = 1
  
    updateLogTable()
    updatePaginationInfo()
  }
  
  /**
   * Populate the user filter dropdown with unique usernames
   */
  function populateUserFilter() {
    const userFilter = document.getElementById("userFilter")
    const uniqueUsers = [...new Set(allLogs.map((log) => log.username))]
  
    // Keep the "All Users" option
    const allOption = userFilter.querySelector('option[value="all"]')
    userFilter.innerHTML = ""
    userFilter.appendChild(allOption)
  
    // Add options for each unique user
    uniqueUsers.forEach((username) => {
      const option = document.createElement("option")
      option.value = username
      option.textContent = username
      userFilter.appendChild(option)
    })
  }
  
  /**
   * Show detailed information for a specific log entry
   */
  function showLogDetails(logId) {
    // Find the log entry
    const log = allLogs.find((log) => log.log_id == logId)
  
    if (!log) {
      return
    }
  
    // Populate modal with log details
    document.getElementById("detailLogId").textContent = log.log_id
    document.getElementById("detailTimestamp").textContent = formatDate(log.timestamp)
    document.getElementById("detailUser").textContent = log.username
    document.getElementById("detailAction").textContent = log.action
    document.getElementById("detailCategory").textContent = capitalizeFirstLetter(log.category)
    document.getElementById("detailIpAddress").textContent = log.ip_address
    document.getElementById("detailUserAgent").textContent = log.user_agent
    document.getElementById("detailDescription").textContent = log.details
    document.getElementById("detailBeforeState").textContent = log.before_state
    document.getElementById("detailAfterState").textContent = log.after_state
  
    // Show the modal
    document.getElementById("logDetailsModal").style.display = "flex"
  }
  
  /**
   * Close the log details modal
   */
  function closeLogDetailsModal() {
    document.getElementById("logDetailsModal").style.display = "none"
  }
  
  function exportLogs() {
    // Create CSV content
    let csvContent = "Log ID,Date & Time,User,Action,Category,Details,IP Address\n"
  
    filteredLogs.forEach((log) => {
      const formattedDate = formatDate(log.timestamp)
      // Escape fields that might contain commas
      const escapedAction = `"${log.action.replace(/"/g, '""')}"`
      const escapedDetails = `"${log.details.replace(/"/g, '""')}"`
  
      csvContent += `${log.log_id},${formattedDate},${log.username},${escapedAction},${log.category},${escapedDetails},${log.ip_address}\n`
    })
  
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `activity_logs_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  