/**
 * Barangay North Signal Village Admin Dashboard
 *
 * Hey there! I've updated your dashboards to help you get an idea on how to connect it to SQL.
 * I've structured it so it'll be super easy to hook up to a backend API later.
 * Cody asked me to help with the SQL so I made this guide to help you guys connect it!
 * For the backend devs - just replace the fetchData
 * functions with actual API calls.
 */

// API config - Change these when we have actual endpoints
const API_CONFIG = {
  baseUrl: "/api", // Change this to your actual API base URL
  endpoints: {
    stats: "/dashboard/stats",
    monthlyRequests: "/dashboard/monthly-requests",
    documents: "/dashboard/documents",
    activities: "/dashboard/activities",
    pendingRequests: "/requests/pending",
  },
}

// Global state to store all our dashboard data
const dashboardData = {
  stats: {
    pendingRequests: 0,
    approvedRequests: 0,
    scheduledAppointments: 0,
  },
  monthlyRequests: [],
  documents: [],
  activities: [],
  currentMonthSet: 1, // 1 = Jan-Apr, 2 = May-Aug, 3 = Sep-Dec, you get it.
}

// The main function that kicks everything off
document.addEventListener("DOMContentLoaded", async () => {
  // Show a fancy loading spinner while we get the data
  showLoadingState()

  try {
    // Grab all the data we need
    await fetchDashboardData()

    // Set up all the interactive bits
    initializeChart()
    initializeViewToggle()
    initializeMonthNavigation()
    initializeEventListeners()

    // Hide the spinner once we're done
    hideLoadingState()
  } catch (error) {
    console.error("Ugh, something broke:", error)
    showErrorState("Couldn't load the dashboard data. Try again or bug Cody to fix it.")
  }
})

/**
 * Fetchess all the data we need for the dashboard
 *
 * Hey backend folks! Replace these with real API calls to your SQL database.
 * I've included example SQL queries to help you out. You're welcome!
 */
async function fetchDashboardData() {
  try {
    // For now we're using fake data, but these should be real API calls eventually
    await Promise.all([fetchStats(), fetchMonthlyRequests(), fetchLatestDocuments(), fetchRecentActivities()])

    // Update the UI with whatever we got
    updateDashboardUI()
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    throw error
  }
}

/**
 * Gets the stats for those colorful cards at the top
 *
 * SQL Query Example (Cody, take notes - this is how you write efficient queries):
 * SELECT
 *   COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingRequests,
 *   COUNT(CASE WHEN status = 'approved' THEN 1 END) as approvedRequests,
 *   COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduledAppointments
 * FROM requests
 * WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
 */
async function fetchStats() {
  // FAKE DATA - Replace with actual API call when ready
  // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stats}`);
  // dashboardData.stats = await response.json();

  // Using dummy data for now (Cody, please don't ship with this still in here)
  dashboardData.stats = {
    pendingRequests: 42,
    approvedRequests: 102,
    scheduledAppointments: 3,
  }
}

/**
 * Gets the monthly request data for our fancy chart
 *
 * SQL Query Example:
 * SELECT
 *   MONTH(created_at) as month,
 *   COUNT(*) as requestCount,
 *   (
 *     SELECT request_type
 *     FROM requests r2
 *     WHERE MONTH(r2.created_at) = MONTH(r1.created_at)
 *     GROUP BY request_type
 *     ORDER BY COUNT(*) DESC
 *     LIMIT 1
 *   ) as mostRequested
 * FROM requests r1
 * WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
 * GROUP BY MONTH(created_at)
 * ORDER BY month
 */
async function fetchMonthlyRequests() {
  // FAKE DATA - Replace with actual API call
  // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.monthlyRequests}`);
  // dashboardData.monthlyRequests = await response.json();

  // Using dummy data for now
  dashboardData.monthlyRequests = [
    { month: "Jan", count: 406, mostRequested: "Barangay Clearance" },
    { month: "Feb", count: 305, mostRequested: "Barangay Clearance" },
    { month: "Mar", count: 203, mostRequested: "Certificate of Residency" },
    { month: "Apr", count: 187, mostRequested: "Certificate of Residency" },
    { month: "May", count: 267, mostRequested: "Barangay Clearance" },
    { month: "Jun", count: 289, mostRequested: "Barangay Clearance" },
    { month: "Jul", count: 256, mostRequested: "Certificate of Residency" },
    { month: "Aug", count: 312, mostRequested: "Barangay Clearance" },
    { month: "Sep", count: 278, mostRequested: "Certificate of Residency" },
    { month: "Oct", count: 342, mostRequested: "Barangay Clearance" },
    { month: "Nov", count: 389, mostRequested: "Barangay ID" },
    { month: "Dec", count: 421, mostRequested: "Barangay Clearance" },
  ]
}

/**
 * Gets the latest uploaded documents
 *
 * SQL Query Example (simple one this time, even Cody could write this):
 * SELECT
 *   id,
 *   filename,
 *   file_type,
 *   created_at
 * FROM documents
 * ORDER BY created_at DESC
 * LIMIT 7
 */
async function fetchLatestDocuments() {
  // FAKE DATA - Replace with actual API call
  // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.documents}`);
  // dashboardData.documents = await response.json();

  // Using dummy data for now
  dashboardData.documents = [
    { id: 1, name: "Brgy_Clearance_03...", type: "Doc", date: "April 21, 2024" },
    { id: 2, name: "Brgy_Clearance_03...", type: "Doc", date: "April 23, 2024" },
    { id: 3, name: "Brgy_Clearance_03...", type: "Doc", date: "April 24, 2024" },
    { id: 4, name: "Brgy_Clearance_03...", type: "Doc", date: "April 25, 2024" },
    { id: 5, name: "Brgy_Clearance_03...", type: "Doc", date: "April 26, 2024" },
  ]
}

/**
 * Gets the recenty activity feed items
 *
 * SQL Query Example (this one's a bit complex with the JOINs and other stuff - Cody might need help with this):
 * SELECT
 *   a.id,
 *   a.activity_type,
 *   a.status,
 *   a.created_at,
 *   u.name as user_name,
 *   r.request_type
 * FROM activities a
 * JOIN users u ON a.user_id = u.id
 * JOIN requests r ON a.request_id = r.id
 * ORDER BY a.created_at DESC
 * LIMIT 5
 */
async function fetchRecentActivities() {
  // FAKE DATA - Replace with actual API call
  // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.activities}`);
  // dashboardData.activities = await response.json();

  // Using dummy data for now
  dashboardData.activities = [
    { id: 1, user: "Maria Santos", requestType: "Barangay Clearance", status: "approved", time: "2 hours ago" },
    { id: 2, user: "Juan Dela Cruz", requestType: "Certificate of Residency", status: "pending", time: "3 hours ago" },
    { id: 3, user: "Pedro Reyes", requestType: "Barangay ID", status: "approved", time: "5 hours ago" },
    { id: 4, user: "Ana Gonzales", requestType: "Business Permit", status: "rejected", time: "Yesterday" },
  ]
}

/**
 * Updates all the UI elements with our fetched data
 * One function to rule them all!
 */
function updateDashboardUI() {
  updateStatsCards()
  updateTimelineMonths()
  updateDocumentsList()
  updateActivitiesList()
  updateRequestsTable()
}

/**
 * Updates those colorful stat cards at the top
 */
function updateStatsCards() {
  document.querySelector(".stat-card.blue h2").textContent = dashboardData.stats.pendingRequests
  document.querySelector(".stat-card.green h2").textContent = dashboardData.stats.approvedRequests
  document.querySelector(".stat-card.orange h2").textContent = dashboardData.stats.scheduledAppointments
}

/**
 * Updates the timeline months based on which set we're viewing
 */
function updateTimelineMonths() {
  const timelineMonths = document.querySelector(".timeline-months")
  if (!timelineMonths) return

  // Get the current month set data
  const startIdx = (dashboardData.currentMonthSet - 1) * 4
  const currentMonths = dashboardData.monthlyRequests.slice(startIdx, startIdx + 4)

  // Generate HTML for the months
  let monthsHTML = ""
  currentMonths.forEach((month) => {
    monthsHTML += `
      <div class="timeline-month">
        <span class="month-label">${month.month}</span>
        <div class="month-line"></div>
        <span class="month-value">${month.count}</span>
      </div>
    `
  })

  // Update the timeline
  timelineMonths.innerHTML = monthsHTML
}

/**
 * Updates the documents list with the latest uploads
 * Pro tip: We're using data-id attributes to make it easy to handle clicks!
 */
function updateDocumentsList() {
  const documentList = document.querySelector(".document-list")
  if (!documentList) return

  let documentsHTML = ""
  dashboardData.documents.forEach((doc) => {
    documentsHTML += `
      <li data-id="${doc.id}">
        <div class="document-info">
          <span class="document-name">${doc.name}</span>
          <span class="document-meta">${doc.type}</span>
        </div>
        <div class="document-date">on ${doc.date}</div>
        <div class="document-actions">
          <button class="document-action-btn edit"><img src="edit.png" alt="Edit" class="action-icon"></button>
          <button class="document-action-btn download"><img src="download.png" alt="Download" class="action-icon"></button>
        </div>
      </li>
    `
  })

  documentList.innerHTML = documentsHTML

  // Re-attach event listeners (Cody always forgets this part)
  attachDocumentActionListeners()
}

/**
 * Updates the activity feed with the latest happenings
 * We use different icons and colors based on the status
 */
function updateActivitiesList() {
  const activityList = document.querySelector(".activity-list")
  if (!activityList) return

  let activitiesHTML = ""
  dashboardData.activities.forEach((activity) => {
    const iconClass =
      activity.status === "approved" ? "approved" : activity.status === "pending" ? "pending" : "rejected"

    const iconSvg =
      activity.status === "approved"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : activity.status === "pending"
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'

    activitiesHTML += `
      <div class="activity-item" data-id="${activity.id}">
        <div class="activity-icon ${iconClass}">
          ${iconSvg}
        </div>
        <div class="activity-content">
          <p><strong>${activity.user}</strong> request for <strong>${activity.requestType}</strong> was ${activity.status}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `
  })

  activityList.innerHTML = activitiesHTML
}

/**
 * Updates the requests table with monthly data
 * This is for the table view that shows when you click "Table View"
 */
function updateRequestsTable() {
  const tableBody = document.querySelector(".request-table tbody")
  if (!tableBody) return

  let tableRowsHTML = ""
  dashboardData.monthlyRequests.forEach((month) => {
    tableRowsHTML += `
      <tr>
        <td>${month.month}</td>
        <td>${month.count}</td>
        <td>${month.mostRequested}</td>
      </tr>
    `
  })

  tableBody.innerHTML = tableRowsHTML
}

/**
 * Sets up the Chart.js (or whatever it's called) chart with our data
 * (This is the part that makes us look professional!)
 */
function initializeChart() {
  const ctx = document.getElementById("requestsChart").getContext("2d")
  if (!ctx) return

  // Prepare data for the chart
  const labels = dashboardData.monthlyRequests.map((item) => item.month)
  const data = dashboardData.monthlyRequests.map((item) => item.count)

  // Chart configuration - I spent way too long tweaking these settings
  // (Cody wanted to use a pie chart here... can you believe it? So dumb.)
  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Monthly Requests",
          data: data,
          backgroundColor: "rgba(10, 59, 102, 0.2)",
          borderColor: "#0a3b66",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "#0a3b66",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0a3b66",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 14,
          },
          padding: 12,
          displayColors: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
    },
  }

  // Create the chart
  new window.Chart(ctx, config)
}

/**
 * Sets up the toggle between graph and table views
 * Simple but effective!
 */
function initializeViewToggle() {
  const viewToggles = document.querySelectorAll(".view-toggle")
  const viewContents = document.querySelectorAll(".view-content")

  viewToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const view = toggle.dataset.view

      // Update toggle buttons
      viewToggles.forEach((btn) => btn.classList.remove("active"))
      toggle.classList.add("active")

      // Update view content
      viewContents.forEach((content) => {
        content.classList.remove("active")
        if (content.classList.contains(`${view}-view`)) {
          content.classList.add("active")
        }
      })
    })
  })
}

/**
 * Sets up the month navigation with that cool arrow button
 *
 */
function initializeMonthNavigation() {
  const nextMonthsBtn = document.getElementById("nextMonthsBtn")
  if (!nextMonthsBtn) return

  // Add transition styling to the timeline months
  const timelineMonths = document.querySelector(".timeline-months")
  if (timelineMonths) {
    timelineMonths.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  }

  nextMonthsBtn.addEventListener("click", () => {
    // Rotate through month sets (1-3)  (increase if you want)
    dashboardData.currentMonthSet = (dashboardData.currentMonthSet % 3) + 1

    // Apply animation
    if (timelineMonths) {
      timelineMonths.style.opacity = "0"
      timelineMonths.style.transform = "translateY(-10px)"

      setTimeout(() => {
        // Update the timeline with the new month set
        updateTimelineMonths()

        timelineMonths.style.opacity = "1"
        timelineMonths.style.transform = "translateY(0)"
      }, 300)
    }
  })
}

/**
 * Sets up all the event listeners for the dashboard
 * Keeping them all in one place makes it easier to manage (just a lil tip of mine)
 */
function initializeEventListeners() {
  // Attach document action listeners
  attachDocumentActionListeners()

  // Approve all button
  const approveAllButton = document.querySelector(".approve-all-button")
  if (approveAllButton) {
    approveAllButton.addEventListener("click", handleApproveAll)
  }

  // Logout functionality
  const signOutBtn = document.getElementById("signOutBtn")
  const logoutModal = document.getElementById("logoutModal")
  const cancelLogout = document.getElementById("cancelLogout")
  const confirmLogout = document.getElementById("confirmLogout")

  if (signOutBtn) {
    signOutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (logoutModal) {
        logoutModal.classList.add("show")
      }
    })
  }

  if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
      if (logoutModal) {
        logoutModal.classList.remove("show")
      }
    })
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      // Redirect to Home.html when logout is confirmed
      window.location.href = "Home.html"
    })
  }
}

/**
 * Attaches event listeners to the document action buttons
 * (Edit and download buttons for each document)
 */
function attachDocumentActionListeners() {
  // Document edit button click
  const editButtons = document.querySelectorAll(".document-action-btn.edit")
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const documentName = this.closest("li").querySelector(".document-name").textContent
      const documentId = this.closest("li").dataset.id
      handleEditDocument(documentId, documentName)
    })
  })

  // Document download button click
  const downloadButtons = document.querySelectorAll(".document-action-btn.download")
  downloadButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const documentName = this.closest("li").querySelector(".document-name").textContent
      const documentId = this.closest("li").dataset.id
      handleDownloadDocument(documentId, documentName)
    })
  })
}

/**
 * Handles editing a document
 *
 * Hey backend nerds! Implement this to open the document editor
 */
function handleEditDocument(documentId, documentName) {
  // For now, just show an alert
  alert(`Editing document: ${documentName} (ID: ${documentId})`)

  // TODO: Implement actual document editing functionality
  // Example:
  // window.location.href = `/documents/edit/${documentId}`;
}

/**
 * Handles downloading a document
 *
 * Backend team: Implement this to download the document from your file storage
 * (Last time Cody tried to implement this, he forgot to set the Content-Disposition header. He's so fucking forgetful)
 */
function handleDownloadDocument(documentId, documentName) {
  // For now, just show an alert
  alert(`Downloading document: ${documentName} (ID: ${documentId})`)

  // TODO: Implement actual document download functionality
  // Example:
  // window.location.href = `/api/documents/download/${documentId}`;
}

/**
 * Handles approving all pending requests at once
 *
 * UPDATE requests SET status = 'approved', updated_at = NOW() WHERE status = 'pending'
 */
async function handleApproveAll() {
  try {
    // Show loading state
    const approveAllButton = document.querySelector(".approve-all-button")
    if (approveAllButton) {
      approveAllButton.textContent = "Processing..."
      approveAllButton.disabled = true
    }

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pendingRequests}/approve-all`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to approve requests');
    // }

    // For now, just show an alert after a fake delay
    setTimeout(() => {
      alert("All pending requests would be approved here")

      // Reset button state
      if (approveAllButton) {
        approveAllButton.textContent = "Approve All Pending Requests"
        approveAllButton.disabled = false
      }

      // Refresh dashboard data
      fetchDashboardData()
    }, 1000)
  } catch (error) {
    console.error("Error approving all requests:", error)
    alert("Failed to approve all requests. Please try again. (Or ask Cody what he broke this time)")

    // Reset button state
    const approveAllButton = document.querySelector(".approve-all-button")
    if (approveAllButton) {
      approveAllButton.textContent = "Approve All Pending Requests"
      approveAllButton.disabled = false
    }
  }
}

/**
 * Shows a loading spinner while data is being fetched
 * Because users hate staring at blank screens!
 */
function showLoadingState() {
  // Add loading overlay to main content
  const mainContent = document.querySelector(".dashboard-content")
  if (mainContent) {
    const loadingOverlay = document.createElement("div")
    loadingOverlay.className = "loading-overlay"
    loadingOverlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Loading dashboard data...</p>
    `
    mainContent.appendChild(loadingOverlay)
  }
}

/**
 * Hides the loading spinner after data is fetched
 */
function hideLoadingState() {
  // Remove loading overlay
  const loadingOverlay = document.querySelector(".loading-overlay")
  if (loadingOverlay) {
    loadingOverlay.remove()
  }
}

/**
 * Shows an error message if data fetching fails
 * (Happens more often than Cody would like to admit)
 */
function showErrorState(message) {
  // Hide loading state first
  hideLoadingState()

  // Add error message
  const mainContent = document.querySelector(".dashboard-content")
  if (mainContent) {
    const errorMessage = document.createElement("div")
    errorMessage.className = "error-message"
    errorMessage.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>${message}</p>
      <button class="retry-button">Retry</button>
    `
    mainContent.appendChild(errorMessage)

    // Add retry button functionality
    const retryButton = errorMessage.querySelector(".retry-button")
    if (retryButton) {
      retryButton.addEventListener("click", () => {
        errorMessage.remove()
        showLoadingState()
        fetchDashboardData()
          .then(() => hideLoadingState())
          .catch((error) => {
            console.error("Error retrying data fetch:", error)
            showErrorState("Failed to load dashboard data. Please try again later.")
          })
      })
    }
  }
}

/**
 * 
 *  SECURITY GUIDE
 *
 * Hey guys! Since we're handling sensitive resident data here,
 * I thought I'd add some security tips. (Cody asked me to after his "incident" with the test database last month...)

 * 1. ENCRYPT SENSITIVE DATA
 *    - Always encrypt PII (Personally Identifiable Information) both in transit and at rest
 *    - Use HTTPS for all API calls (Cody, this means in development too, not just production)
 *    - Encrypt database fields containing sensitive info like phone numbers, addresses, etc.
 *
 * 2. IMPLEMENT PROPER ACCESS CONTROLS
 *    - Set up role-based access (admin, staff, etc.)
 *    - Never share admin accounts (looking at you, Cody)
 *    - Implement session timeouts (15-30 minutes of inactivity)
 *    - Use strong password policies
 *
 * 3. VALIDATE ALL USER INPUTS
 *    - Sanitize inputs to prevent SQL injection (VERY IMPORTANT) 
 *    - Validate on both client AND server side
 *    - Be careful with file uploads - restrict file types and scan for malware
 *
 * 4. SECURE YOUR API ENDPOINTS
 *    - Use tokens for authentication (JWT is good)
 *    - Implement rate limiting to prevent brute force attacks
 *    - Add CSRF (this happens frequently. Eh, kind of *wink*) protection for form submissions
 *
 * 5. DATA RETENTION POLICY
 *    - Don't keep data longer than necessary
 *    - Implement automated data purging for old records
 *    - Provide a way for residents to request their data be deleted
 *
 * 6. AUDIT LOGGING
 *    - Log all access to sensitive data
 *    - Track who viewed/modified what and when 
 *    - Store logs securely and review them regularly
 *
 * 7. REGULAR SECURITY AUDITS
 *    - Schedule penetration testing (Y'all can contact me. For a price of course~)
 *    - Keep all libraries and dependencies updated
 *    - Have a security incident response plan
 *
 * Remember: One data breach can destroy resident trust forever!
 *
 * P.S. Cody, please stop using 'passwordxduwu2005' for everything. I'm begging you. Probably the reason why your FB account go hacked.
 */
