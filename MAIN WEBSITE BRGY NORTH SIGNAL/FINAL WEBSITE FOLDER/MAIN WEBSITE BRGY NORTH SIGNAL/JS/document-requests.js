document.addEventListener("DOMContentLoaded", () => {
  // Load saved request data from localStorage
  const savedRequestData = JSON.parse(localStorage.getItem("documentRequestsData")) || {
    statusChanges: {},
    requestReasons: {},
  }

  // Initialize request reasons from saved data
  const requestReasons = savedRequestData.requestReasons || {}

  // DOM Elements
  const searchBtn = document.getElementById("searchBtn")
  const filterDateBtn = document.getElementById("filterDateBtn")
  const filterStatusBtn = document.getElementById("filterStatusBtn")
  const newRequestsBtn = document.getElementById("newRequestsBtn")
  const approveAllBtn = document.querySelector(".approve-all-btn")
  const signOutBtn = document.getElementById("signOutBtn")
  const requestsTableBody = document.getElementById("requestsTableBody")
  const pendingCountElement = document.getElementById("pendingCount")
  const approvedCountElement = document.getElementById("approvedCount")
  const scheduledCountElement = document.getElementById("scheduledCount")
  const notificationBadge = document.getElementById("notificationBadge")

  // Modals
  const searchModal = document.getElementById("searchModal")
  const viewModal = document.getElementById("viewModal")
  const approveModal = document.getElementById("approveModal")
  const rejectModal = document.getElementById("rejectModal")
  const archiveModal = document.getElementById("archiveModal")
  const approveAllModal = document.getElementById("approveAllModal")
  const logoutModal = document.getElementById("logoutModal")

  // Date filter state (0: default, 1: most recent, 2: earliest)
  let dateFilterState = 0

  // Status filter state (0: default, 1: approved, 2: rejected, 3: issued, 4: archived, 5: draft)
  let statusFilterState = 0

  // Debug mode
  const DEBUG = false
  
  // Server connection status
  let serverConnected = false

  // Fetch document requests from server
  fetchDocumentRequests()

  // Function to fetch document requests from server
  function fetchDocumentRequests() {
    // Show loading state
    requestsTableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">Loading requests...</td></tr>'
    
    fetch('http://localhost:4000/api/document-requests')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch document requests')
        }
        return response.json()
      })
      .then(data => {
        if (DEBUG) console.log("Fetched document requests:", data)
        serverConnected = true
        
        // Process and display the data
        displayRequests(data)
        
        // Update summary counts
        updateSummaryCards(data)
        
        // Store the data in localStorage as backup
        localStorage.setItem("documentRequests", JSON.stringify(data))
      })
      .catch(error => {
        console.error('Error fetching document requests:', error)
        serverConnected = false
        
        // Show error message
        requestsTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="error-cell">
              Failed to fetch document requests. 
              <button id="retryBtn" class="retry-btn">Retry</button>
              <button id="offlineBtn" class="offline-btn">Work Offline</button>
            </td>
          </tr>
        `
        
        // Add event listeners to retry and offline buttons
        document.getElementById("retryBtn").addEventListener("click", fetchDocumentRequests)
        document.getElementById("offlineBtn").addEventListener("click", loadFromLocalStorage)
      })
  }

  // Function to load document requests from localStorage
  function loadFromLocalStorage() {
    const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {}
    
    if (Object.keys(documentRequests).length === 0) {
      // No data in localStorage, create sample data
      createSampleData()
    } else {
      // Display the data from localStorage
      displayRequests(documentRequests)
      updateSummaryCards(documentRequests)
    }
    
    // Show offline mode notification
    showNotification("Working in offline mode. Some features may be limited.", "warning")
  }

  // Function to update summary cards
  function updateSummaryCards(requests) {
    let pendingCount = 0
    let approvedCount = 0
    let scheduledCount = 0
    
    // Count by status
    Object.values(requests).forEach(request => {
      const status = (request.status || "").toLowerCase()
      
      if (
        status === "document verification" ||
        status === "processing" ||
        status === "pending" ||
        status === "draft" ||
        status === ""
      ) {
        pendingCount++
      } else if (status === "approved") {
        approvedCount++
      } else if (
        status === "ready for pickup" ||
        status === "scheduled" ||
        status === "for pickup"
      ) {
        scheduledCount++
      }
    })
    
    // Update the UI
    pendingCountElement.textContent = pendingCount
    approvedCountElement.textContent = approvedCount
    scheduledCountElement.textContent = scheduledCount
    notificationBadge.textContent = pendingCount
  }

  // Function to display requests in the table
  function displayRequests(requests) {
    // Clear existing table rows
    requestsTableBody.innerHTML = ""
    
    if (!requests || Object.keys(requests).length === 0) {
      requestsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="no-data-cell">No document requests found</td>
        </tr>
      `
      return
    }
    
    // Process each document request
    requests.forEach(request => {
      // Format the resident name
      const fullName = formatFullName(request.first_name, request.middle_initial, request.last_name)
      
      // Format the date
      const formattedDate = formatDate(request.request_date)
      
      // Get reference ID or fallback to regular ID
      const referenceId = request.reference_id || `ID-${request.id}`
      
      // Get document type
      const documentType = request.document_type || "Unknown"
      
      // Get status with default
      const status = request.status || "Pending"
      
      // Create table row
      const row = document.createElement("tr")
      row.setAttribute("data-id", request.id)
      row.setAttribute("data-ref", referenceId)
      row.setAttribute("data-name", fullName.toLowerCase())
      row.setAttribute("data-type", documentType.toLowerCase())
      
      // Create row content
      row.innerHTML = `
        <td>${referenceId}</td>
        <td>${fullName}</td>
        <td>${documentType}</td>
        <td>${formattedDate}</td>
        <td><span class="status-badge status-${status.toLowerCase().replace(/\s+/g, "-")}">${status}</span></td>
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
      requestsTableBody.appendChild(row)
    })
    
    // Initialize action buttons for new rows
    initActionButtons()
    
    // Show server status indicator if in debug mode
    if (DEBUG) {
      const statusIndicator = document.createElement("div")
      statusIndicator.className = `server-status ${serverConnected ? "connected" : "disconnected"}`
      statusIndicator.textContent = serverConnected ? "Server Connected" : "Server Disconnected"
      document.querySelector(".main-content").appendChild(statusIndicator)
    }
  }

  // Helper function to format full name
  function formatFullName(firstName, middleInitial, lastName) {
    if (!firstName && !lastName) return "Unknown"
    
    let fullName = firstName || ""
    
    if (middleInitial) {
      fullName += " " + middleInitial + "."
    }
    
    if (lastName) {
      fullName += " " + lastName
    }
    
    return fullName.trim()
  }

  // Helper function to format date
  function formatDate(dateString) {
    if (!dateString) return "Unknown"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  // Create sample data for demonstration
  function createSampleData() {
    const sampleRequests = [
      {
        id: 1,
        reference_id: "REF-ABC12-34567",
        first_name: "Juan",
        middle_initial: "M",
        last_name: "Dela Cruz",
        document_type: "Barangay Clearance",
        request_date: "2023-05-15 10:30:00",
        status: "Pending"
      },
      {
        id: 2,
        reference_id: "REF-DEF34-56789",
        first_name: "Maria",
        middle_initial: "L",
        last_name: "Santos",
        document_type: "Certificate of Residency",
        request_date: "2023-05-14 14:45:00",
        status: "Approved"
      },
      {
        id: 3,
        reference_id: "REF-GHI56-78901",
        first_name: "Pedro",
        middle_initial: "G",
        last_name: "Reyes",
        document_type: "Business Clearance",
        request_date: "2023-05-13 09:15:00",
        status: "Document Verification"
      },
      {
        id: 4,
        reference_id: "REF-JKL78-90123",
        first_name: "Ana",
        middle_initial: "C",
        last_name: "Gonzales",
        document_type: "Barangay ID",
        request_date: "2023-05-12 16:20:00",
        status: "Processing"
      }
    ]

    // Store in localStorage
    localStorage.setItem("documentRequests", JSON.stringify(sampleRequests))
    
    // Display the sample data
    displayRequests(sampleRequests)
    updateSummaryCards(sampleRequests)
  }

  // Initialize action buttons
  function initActionButtons() {
    // View buttons
    document.querySelectorAll(".btn-view").forEach((button) => {
      button.addEventListener("click", () => handleViewClick(button))
    })

    // Approve buttons
    document.querySelectorAll(".btn-approve").forEach((button) => {
      button.addEventListener("click", () => handleApproveClick(button))
    })

    // Reject buttons
    document.querySelectorAll(".btn-reject").forEach((button) => {
      button.addEventListener("click", () => handleRejectClick(button))
    })

    // Archive buttons
    document.querySelectorAll(".btn-archive").forEach((button) => {
      button.addEventListener("click", () => handleArchiveClick(button))
    })
  }

  // Function to save current state to localStorage
  function saveState() {
    const statusChanges = {}
    const tableRows = document.querySelectorAll("#requestsTableBody tr")

    tableRows.forEach((row) => {
      const certId = row.getAttribute("data-id")
      if (certId) {
        const statusBadge = row.querySelector("td:nth-child(5) .status-badge")
        if (statusBadge) {
          statusChanges[certId] = statusBadge.textContent
        }
      }
    })

    const dataToSave = {
      statusChanges: statusChanges,
      requestReasons: requestReasons,
    }

    localStorage.setItem("documentRequestsData", JSON.stringify(dataToSave))

    // If connected to server, update server as well
    if (serverConnected) {
      updateServerStatus()
    }
  }

  // Function to update server with status changes
  function updateServerStatus() {
    const tableRows = document.querySelectorAll("#requestsTableBody tr")

    tableRows.forEach((row) => {
      const id = row.getAttribute("data-id")
      if (id) {
        const statusBadge = row.querySelector("td:nth-child(5) .status-badge")
        if (statusBadge) {
          const status = statusBadge.textContent
          const reason = requestReasons[id] ? 
            (status === "Approved" ? requestReasons[id].approveReason : 
             status === "Rejected" ? requestReasons[id].rejectReason : 
             status === "Archived" ? requestReasons[id].archiveReason : "") : ""
          
          fetch(`http://localhost:4000/api/document-requests/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, reason })
          }).catch(error => {
            console.error(`Failed to update server for ${id}:`, error)
          })
        }
      }
    })
  }

  // View button click - Enhanced to show form data and uploaded documents
  function handleViewClick(button) {
    const row = button.closest("tr")
    const certId = row.getAttribute("data-ref") || row.querySelector("td:first-child").textContent
    const residentName = row.querySelector("td:nth-child(2)").textContent
    const certType = row.querySelector("td:nth-child(3)").textContent
    const dateIssued = row.querySelector("td:nth-child(4)").textContent
    const status = row.querySelector("td:nth-child(5) .status-badge").textContent

    // Get the full request data
    const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || []
    const requestData = documentRequests.find(req => req.reference_id === certId || req.id === parseInt(row.getAttribute("data-id"))) || {}

    // Get stored reasons or set default message
    const reasons = requestReasons[row.getAttribute("data-id")] || {
      approveReason: "No approval reason provided",
      rejectReason: "No rejection reason provided",
      archiveReason: "No archiving reason provided",
    }

    // Populate view modal
    document.getElementById("viewCertId").textContent = certId
    document.getElementById("viewResidentName").textContent = residentName
    document.getElementById("viewCertType").textContent = certType
    document.getElementById("viewDateIssued").textContent = dateIssued
    document.getElementById("viewStatus").textContent = status

    // Set reason based on status
    const reasonSection = document.getElementById("viewReason")

    if (status.toLowerCase() === "approved") {
      reasonSection.innerHTML = `<p><strong>Approval Reason:</strong> ${reasons.approveReason}</p>`
    } else if (status.toLowerCase() === "rejected") {
      reasonSection.innerHTML = `<p><strong>Rejection Reason:</strong> ${reasons.rejectReason}</p>`
    } else if (status.toLowerCase() === "archived") {
      reasonSection.innerHTML = `<p><strong>Archive Reason:</strong> ${reasons.archiveReason}</p>`
    } else {
      reasonSection.innerHTML = "<p>No action has been taken on this request yet.</p>"
    }

    // Populate form data
    const formDataContainer = document.getElementById("formDataContainer")
    formDataContainer.innerHTML = ""

    if (requestData) {
      // Create form fields display for all available data
      const fields = [
        { key: "first_name", label: "First Name" },
        { key: "middle_initial", label: "Middle Initial" },
        { key: "last_name", label: "Last Name" },
        { key: "gender", label: "Gender" },
        { key: "nationality", label: "Nationality" },
        { key: "civil_status", label: "Civil Status" },
        { key: "contact_number", label: "Contact Number" },
        { key: "birth_date", label: "Birth Date" },
        { key: "years_resident", label: "Years of Residency" },
        { key: "document_type", label: "Document Type" },
        { key: "purpose", label: "Purpose" },
        { key: "reference_id", label: "Reference ID" },
        { key: "request_date", label: "Request Date" }
      ]
      
      fields.forEach(field => {
        if (requestData[field.key]) {
          const fieldElement = document.createElement("div")
          fieldElement.className = "form-field"
          
          let value = requestData[field.key]
          
          // Format date fields
          if (field.key === "birth_date" || field.key === "request_date") {
            value = formatDate(value)
          }
          
          fieldElement.innerHTML = `
            <div class="form-field-label">${field.label}</div>
            <div class="form-field-value">${value}</div>
          `
          formDataContainer.appendChild(fieldElement)
        }
      })
    } else {
      formDataContainer.innerHTML = "<p>No form data available for this request.</p>"
    }

    // Populate uploaded documents section (placeholder for now)
    const uploadedDocumentsContainer = document.getElementById("uploadedDocumentsContainer")
    uploadedDocumentsContainer.innerHTML = "<p>No documents uploaded for this request.</p>"

    // Show the modal
    viewModal.style.display = "flex"
  }

  // Approve button click
  function handleApproveClick(button) {
    const row = button.closest("tr")
    const certId = row.getAttribute("data-id")
    const refId = row.getAttribute("data-ref") || row.querySelector("td:first-child").textContent

    // Set up approve modal
    document.getElementById("approveCertId").textContent = refId
    document.getElementById("approveReasonInput").value = ""

    // Show the modal
    approveModal.style.display = "flex"
    document.getElementById("approveReasonInput").focus()
  }

  // Reject button click
  function handleRejectClick(button) {
    const row = button.closest("tr")
    const certId = row.getAttribute("data-id")
    const refId = row.getAttribute("data-ref") || row.querySelector("td:first-child").textContent

    // Set up reject modal
    document.getElementById("rejectCertId").textContent = refId
    document.getElementById("rejectReasonInput").value = ""
    document.getElementById("rejectError").style.display = "none"

    // Show the modal
    rejectModal.style.display = "flex"
    document.getElementById("rejectReasonInput").focus()
  }

  // Archive button click
  function handleArchiveClick(button) {
    const row = button.closest("tr")
    const certId = row.getAttribute("data-id")
    const refId = row.getAttribute("data-ref") || row.querySelector("td:first-child").textContent

    // Set up archive modal
    document.getElementById("archiveCertId").textContent = refId
    document.getElementById("archiveReasonInput").value = ""
    document.getElementById("archiveError").style.display = "none"

    // Show the modal
    archiveModal.style.display = "flex"
    document.getElementById("archiveReasonInput").focus()
  }

  // Confirm approve
  document.getElementById("confirmApproveBtn").addEventListener("click", () => {
    const certIdDisplay = document.getElementById("approveCertId").textContent
    const reason = document.getElementById("approveReasonInput").value.trim() || "Approved without specific reason"

    // Find the row by reference ID
    const row = findRowByRefId(certIdDisplay)
    
    if (row) {
      const certId = row.getAttribute("data-id")
      
      // Store the reason
      if (!requestReasons[certId]) {
        requestReasons[certId] = {}
      }
      requestReasons[certId].approveReason = reason

      // Update status
      const statusCell = row.querySelector("td:nth-child(5)")
      statusCell.innerHTML = '<span class="status-badge status-approved">Approved</span>'
      
      // Save state to localStorage
      saveState()
      
      // If connected to server, update server directly
      if (serverConnected) {
        fetch(`http://localhost:4000/api/document-requests/${certId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved", reason })
        }).catch(error => {
          console.error(`Failed to update server for ${certId}:`, error)
        })
      }
      
      // Show notification
      showNotification("Request approved successfully")
    } else {
      showNotification("Could not find the request to approve", "error")
    }

    // Hide the modal
    approveModal.style.display = "none"
  })

  // Helper function to find row by reference ID
  function findRowByRefId(refId) {
    const rows = document.querySelectorAll("#requestsTableBody tr")
    for (let row of rows) {
      const rowRefId = row.getAttribute("data-ref") || row.querySelector("td:first-child").textContent
      if (rowRefId === refId) {
        return row
      }
    }
    return null
  }

  // Confirm reject
  document.getElementById("confirmRejectBtn").addEventListener("click", () => {
    const certIdDisplay = document.getElementById("rejectCertId").textContent
    const reason = document.getElementById("rejectReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("rejectError").style.display = "block"
      return
    }

    // Find the row by reference ID
    const row = findRowByRefId(certIdDisplay)
    
    if (row) {
      const certId = row.getAttribute("data-id")
      
      // Store the reason
      if (!requestReasons[certId]) {
        requestReasons[certId] = {}
      }
      requestReasons[certId].rejectReason = reason

      // Update status
      const statusCell = row.querySelector("td:nth-child(5)")
      statusCell.innerHTML = '<span class="status-badge status-rejected">Rejected</span>'
      
      // Save state to localStorage
      saveState()
      
      // If connected to server, update server directly
      if (serverConnected) {
        fetch(`http://localhost:4000/api/document-requests/${certId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected", reason })
        }).catch(error => {
          console.error(`Failed to update server for ${certId}:`, error)
        })
      }
      
      // Show notification
      showNotification("Request rejected")
    } else {
      showNotification("Could not find the request to reject", "error")
    }

    // Hide the modal
    document.getElementById("rejectError").style.display = "none"
    rejectModal.style.display = "none"
  })

  // Confirm archive
  document.getElementById("confirmArchiveBtn").addEventListener("click", () => {
    const certIdDisplay = document.getElementById("archiveCertId").textContent
    const reason = document.getElementById("archiveReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("archiveError").style.display = "block"
      return
    }

    // Find the row by reference ID
    const row = findRowByRefId(certIdDisplay)
    
    if (row) {
      const certId = row.getAttribute("data-id")
      
      // Store the reason
      if (!requestReasons[certId]) {
        requestReasons[certId] = {}
      }
      requestReasons[certId].archiveReason = reason

      // Update status
      const statusCell = row.querySelector("td:nth-child(5)")
      statusCell.innerHTML = '<span class="status-badge status-archived">Archived</span>'
      
      // Save state to localStorage
      saveState()
      
      // If connected to server, update server directly
      if (serverConnected) {
        fetch(`http://localhost:4000/api/document-requests/${certId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Archived", reason })
        }).catch(error => {
          console.error(`Failed to update server for ${certId}:`, error)
        })
      }
      
      // Show notification
      showNotification("Request archived")
    } else {
      showNotification("Could not find the request to archive", "error")
    }

    // Hide the modal
    document.getElementById("archiveError").style.display = "none"
    archiveModal.style.display = "none"
  })

  // Close view modal
  document.getElementById("closeViewBtn").addEventListener("click", () => {
    viewModal.style.display = "none"
  })

  // Cancel approve
  document.getElementById("cancelApproveBtn").addEventListener("click", () => {
    approveModal.style.display = "none"
  })

  // Cancel reject
  document.getElementById("cancelRejectBtn").addEventListener("click", () => {
    rejectModal.style.display = "none"
    document.getElementById("rejectError").style.display = "none"
  })

  // Cancel archive
  document.getElementById("cancelArchiveBtn").addEventListener("click", () => {
    archiveModal.style.display = "none"
    document.getElementById("archiveError").style.display = "none"
  })

  // Search functionality
  searchBtn.addEventListener("click", () => {
    searchModal.style.display = "flex"
    document.getElementById("searchInput").value = ""
    document.getElementById("searchError").style.display = "none"
  })

  document.getElementById("cancelSearchBtn").addEventListener("click", () => {
    searchModal.style.display = "none"
  })

  document.getElementById("confirmSearchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase()
    const tableRows = document.querySelectorAll("#requestsTableBody tr")

    if (searchTerm === "") {
      document.getElementById("searchError").style.display = "block"
      return
    }

    let found = false

    tableRows.forEach((row) => {
      const id = row.getAttribute("data-ref")?.toLowerCase() || ""
      const name = row.getAttribute("data-name")?.toLowerCase() || ""
      const type = row.getAttribute("data-type")?.toLowerCase() || ""

      if (id.includes(searchTerm) || name.includes(searchTerm) || type.includes(searchTerm)) {
        found = true
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })

    if (found) {
      searchModal.style.display = "none"
    } else {
      document.getElementById("searchError").style.display = "block"
    }
  })

  // Filter by Date functionality
  filterDateBtn.addEventListener("click", () => {
    const tableRows = Array.from(document.querySelectorAll("#requestsTableBody tr"))

    dateFilterState = (dateFilterState + 1) % 3

    if (dateFilterState === 1) {
      // Most recent first
      tableRows.sort((a, b) => {
        const dateA = a.querySelector("td:nth-child(4)")?.textContent || ""
        const dateB = b.querySelector("td:nth-child(4)")?.textContent || ""
        return new Date(dateB) - new Date(dateA)
      })

      filterDateBtn.textContent = "Filter by Date: Most Recent"
      filterDateBtn.classList.add("active")
    } else if (dateFilterState === 2) {
      // Earliest first
      tableRows.sort((a, b) => {
        const dateA = a.querySelector("td:nth-child(4)")?.textContent || ""
        const dateB = b.querySelector("td:nth-child(4)")?.textContent || ""
        return new Date(dateA) - new Date(dateB)
      })

      filterDateBtn.textContent = "Filter by Date: Earliest"
      filterDateBtn.classList.add("active")
    } else {
      // Default order (reset)
      tableRows.sort((a, b) => {
        const idA = a.querySelector("td:first-child")?.textContent || ""
        const idB = b.querySelector("td:first-child")?.textContent || ""
        return idA.localeCompare(idB)
      })

      filterDateBtn.textContent = "Filter by Date"
      filterDateBtn.classList.remove("active")
    }

    // Reorder the table
    const tbody = document.getElementById("requestsTableBody")
    tableRows.forEach((row) => tbody.appendChild(row))
  })

  // Filter by Status functionality
  filterStatusBtn.addEventListener("click", () => {
    statusFilterState = (statusFilterState + 1) % 6
    const tableRows = document.querySelectorAll("#requestsTableBody tr")

    tableRows.forEach((row) => {
      const statusBadge = row.querySelector("td:nth-child(5) .status-badge")
      if (!statusBadge) return
      
      const statusText = statusBadge.textContent.toLowerCase()

      if (statusFilterState === 0) {
        // Show all
        row.style.display = ""
        filterStatusBtn.textContent = "Filter by Status"
        filterStatusBtn.classList.remove("active")
      } else if (statusFilterState === 1) {
        // Show approved
        row.style.display = statusText === "approved" ? "" : "none"
        filterStatusBtn.textContent = "Filter by Status: Approved"
        filterStatusBtn.classList.add("active")
      } else if (statusFilterState === 2) {
        // Show rejected
        row.style.display = statusText === "rejected" ? "" : "none"
        filterStatusBtn.textContent = "Filter by Status: Rejected"
        filterStatusBtn.classList.add("active")
      } else if (statusFilterState === 3) {
        // Show ready for pickup
        row.style.display = statusText === "ready for pickup" ? "" : "none"
        filterStatusBtn.textContent = "Filter by Status: Ready for Pickup"
        filterStatusBtn.classList.add("active")
      } else if (statusFilterState === 4) {
        // Show archived
        row.style.display = statusText === "archived" ? "" : "none"
        filterStatusBtn.textContent = "Filter by Status: Archived"
        filterStatusBtn.classList.add("active")
      } else if (statusFilterState === 5) {
        // Show pending/processing/verification
        row.style.display =
          statusText === "document verification" || statusText === "processing" || statusText === "pending" || statusText === "draft"
            ? ""
            : "none"
        filterStatusBtn.textContent = "Filter by Status: Pending"
        filterStatusBtn.classList.add("active")
      }
    })
  })

  // New Requests button
  newRequestsBtn.addEventListener("click", () => {
    showNotification("Refreshing requests list")
    fetchDocumentRequests()
  })

  // Approve All button
  approveAllBtn.addEventListener("click", () => {
    approveAllModal.style.display = "flex"
    document.getElementById("approveAllReasonInput").focus()
  })

  // Confirm Approve All
  document.getElementById("confirmApproveAllBtn").addEventListener("click", () => {
    const reason = document.getElementById("approveAllReasonInput").value.trim() || "Batch approval without specific reason"
    
    if (serverConnected) {
      // Server-side batch approval
      fetch("http://localhost:4000/api/pending-requests")
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch pending requests")
          }
          return response.json()
        })
        .then(pendingRequests => {
          if (pendingRequests.length === 0) {
            showNotification("No pending requests to approve")
            approveAllModal.style.display = "none"
            return 0
          }
          
          // Create an array of promises for each approval
          const approvalPromises = pendingRequests.map(request => 
            fetch(`http://localhost:4000/api/document-requests/${request.id}/status`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Approved", reason })
            })
          )
          
          // Execute all approvals in parallel
          return Promise.all(approvalPromises).then(() => {
            // Refresh the data
            fetchDocumentRequests()
            return pendingRequests.length
          })
        })
        .then(approvedCount => {
          if (approvedCount > 0) {
            // Show notification
            showNotification(`${approvedCount} requests approved successfully`)
          }
          
          // Hide the modal
          approveAllModal.style.display = "none"
        })
        .catch(error => {
          console.error("Error in batch approval:", error)
          // Fall back to client-side approval
          clientSideBatchApproval(reason)
        })
    } else {
      // Client-side batch approval
      clientSideBatchApproval(reason)
    }
  })
  
  // Client-side batch approval function
  function clientSideBatchApproval(reason) {
    let approvedCount = 0
    const tableRows = document.querySelectorAll("#requestsTableBody tr")

    tableRows.forEach((row) => {
      const statusCell = row.querySelector("td:nth-child(5)")
      if (!statusCell) return
      
      const statusBadge = statusCell.querySelector(".status-badge")
      if (!statusBadge) return
      
      const statusText = statusBadge.textContent.toLowerCase()

      if (statusText === "document verification" || statusText === "processing" || statusText === "pending" || statusText === "draft") {
        const certId = row.getAttribute("data-id")

        // Store the reason
        if (!requestReasons[certId]) {
          requestReasons[certId] = {}
        }
        requestReasons[certId].approveReason = reason

        // Update status only, keep all buttons
        statusCell.innerHTML = '<span class="status-badge status-approved">Approved</span>'

        approvedCount++
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal
    approveAllModal.style.display = "none"

    // Show notification
    if (approvedCount > 0) {
      showNotification(`${approvedCount} requests approved successfully`)
    } else {
      showNotification("No pending requests to approve")
    }
  }

  // Cancel Approve All
  document.getElementById("cancelApproveAllBtn").addEventListener("click", () => {
    approveAllModal.style.display = "none"
  })

  // Logout functionality
  signOutBtn.addEventListener("click", (e) => {
    e.preventDefault()
    logoutModal.style.display = "flex"
  })

  document.getElementById("cancelLogoutBtn").addEventListener("click", () => {
    logoutModal.style.display = "none"
  })

  document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
    window.location.href = "Home.html"
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"

      // Clear error messages
      document.querySelectorAll(".error-message").forEach((error) => {
        error.style.display = "none"
      })
    }
  })

  // Show notification function
  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `notification-popup notification-${type}`
    
    let icon = "✓"
    if (type === "error") icon = "✗"
    if (type === "warning") icon = "⚠"
    
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
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