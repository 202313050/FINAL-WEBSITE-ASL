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

  // Load document requests from localStorage
  loadDocumentRequests()

  // Function to load document requests from localStorage
  function loadDocumentRequests() {
    // Get document requests from localStorage
    const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {}

    // If no document requests exist, create sample data
    if (Object.keys(documentRequests).length === 0) {
      createSampleData()
      return
    }

    // Clear existing table rows
    requestsTableBody.innerHTML = ""

    // Counter for different statuses
    let pendingCount = 0
    let approvedCount = 0
    let scheduledCount = 0

    // Process each document request
    Object.entries(documentRequests).forEach(([refNumber, request]) => {
      // Apply any saved status changes
      if (savedRequestData.statusChanges[refNumber]) {
        request.status = savedRequestData.statusChanges[refNumber]
      }

      // Count by status
      if (
        request.status === "Document Verification" ||
        request.status === "Processing" ||
        request.status === "Pending"
      ) {
        pendingCount++
      } else if (request.status === "Approved") {
        approvedCount++
      } else if (request.status === "Ready for Pickup") {
        scheduledCount++
      }

      // Create table row
      const row = document.createElement("tr")
      row.setAttribute("data-id", refNumber)
      row.setAttribute("data-name", request.applicantName.toLowerCase())
      row.setAttribute("data-type", request.type.toLowerCase())

      // Create row content
      row.innerHTML = `
        <td>${refNumber}</td>
        <td>${request.applicantName}</td>
        <td>${request.type}</td>
        <td>${request.dateRequested}</td>
        <td><span class="status-badge status-${request.status.toLowerCase().replace(/\s+/g, "-")}">${request.status}</span></td>
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

    // Update summary counts
    pendingCountElement.textContent = pendingCount
    approvedCountElement.textContent = approvedCount
    scheduledCountElement.textContent = scheduledCount

    // Update notification badge
    notificationBadge.textContent = pendingCount

    // Initialize action buttons for new rows
    initActionButtons()
  }

  // Create sample data for demonstration
  function createSampleData() {
    const sampleRequests = {
      "CERT-001": {
        applicantName: "Juan Dela Cruz",
        type: "Barangay Clearance",
        dateRequested: "2023-05-15",
        status: "Pending",
        formData: {
          firstName: "Juan",
          middleInitial: "M",
          lastName: "Dela Cruz",
          gender: "Male",
          nationality: "Filipino",
          civilStatus: "Single",
          contactNumber: "09123456789",
          dateOfBirth: "1990-05-15",
          yearOfResidency: "2015"
        },
        uploadedDocuments: [
          { name: "ID.jpg", type: "image/jpeg", url: "https://via.placeholder.com/300x200.jpg?text=ID+Card", size: "250 KB" },
          { name: "ProofOfResidency.pdf", type: "application/pdf", url: "https://example.com/sample.pdf", size: "1.2 MB" }
        ]
      },
      "CERT-002": {
        applicantName: "Maria Santos",
        type: "Certificate of Residency",
        dateRequested: "2023-05-14",
        status: "Approved",
        formData: {
          firstName: "Maria",
          middleInitial: "L",
          lastName: "Santos",
          gender: "Female",
          nationality: "Filipino",
          civilStatus: "Married",
          contactNumber: "09187654321",
          dateOfBirth: "1995-10-20",
          yearOfResidency: "2010"
        },
        uploadedDocuments: [
          { name: "Selfie.jpg", type: "image/jpeg", url: "https://via.placeholder.com/300x200.jpg?text=Selfie", size: "180 KB" },
          { name: "BirthCertificate.pdf", type: "application/pdf", url: "https://example.com/sample.pdf", size: "950 KB" }
        ]
      },
      "CERT-003": {
        applicantName: "Pedro Reyes",
        type: "Business Clearance",
        dateRequested: "2023-05-13",
        status: "Document Verification",
        formData: {
          firstName: "Pedro",
          middleInitial: "G",
          lastName: "Reyes",
          gender: "Male",
          nationality: "Filipino",
          civilStatus: "Married",
          contactNumber: "09198765432",
          dateOfBirth: "1985-03-25",
          businessName: "Reyes General Merchandise",
          businessAddress: "123 Main St, North Signal Village",
          yearOfResidency: "2008"
        },
        uploadedDocuments: [
          { name: "BusinessTax.jpg", type: "image/jpeg", url: "https://via.placeholder.com/300x200.jpg?text=Business+Tax", size: "320 KB" },
          { name: "AffidavitOfClosure.pdf", type: "application/pdf", url: "https://example.com/sample.pdf", size: "1.5 MB" },
          { name: "OldBusinessClearance.pdf", type: "application/pdf", url: "https://example.com/sample.pdf", size: "1.1 MB" }
        ]
      },
      "CERT-004": {
        applicantName: "Ana Gonzales",
        type: "Barangay ID",
        dateRequested: "2023-05-12",
        status: "Processing",
        formData: {
          firstName: "Ana",
          middleName: "Cruz",
          lastName: "Gonzales",
          address: "456 Park Ave, North Signal Village",
          contactNumber: "09123456789",
          birthday: "1992-08-10",
          precinct: "12345",
          dateToday: "2023-05-12",
          emergencyName: "Carlos Gonzales",
          emergencyContact: "09187654321",
          emergencyRelationship: "Husband",
          sectorType: "SENIOR CITIZEN"
        },
        uploadedDocuments: [
          { name: "IDPhoto.jpg", type: "image/jpeg", url: "https://via.placeholder.com/300x200.jpg?text=ID+Photo", size: "150 KB" },
          { name: "Signature.jpg", type: "image/jpeg", url: "https://via.placeholder.com/300x100.jpg?text=Signature", size: "100 KB" }
        ]
      }
    }

    localStorage.setItem("documentRequests", JSON.stringify(sampleRequests))
    loadDocumentRequests()
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
      const certId = row.querySelector("td:first-child").textContent
      const statusText = row.querySelector("td:nth-child(5) .status-badge").textContent
      statusChanges[certId] = statusText
    })

    const dataToSave = {
      statusChanges: statusChanges,
      requestReasons: requestReasons,
    }

    localStorage.setItem("documentRequestsData", JSON.stringify(dataToSave))

    // Reload document requests to update counts
    loadDocumentRequests()
  }

  // View button click - Enhanced to show form data and uploaded documents
  function handleViewClick(button) {
    const row = button.closest("tr")
    const certId = row.querySelector("td:first-child").textContent
    const residentName = row.querySelector("td:nth-child(2)").textContent
    const certType = row.querySelector("td:nth-child(3)").textContent
    const dateIssued = row.querySelector("td:nth-child(4)").textContent
    const status = row.querySelector("td:nth-child(5) .status-badge").textContent

    // Get the full request data from localStorage
    const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {}
    const requestData = documentRequests[certId] || {}

    // Get stored reasons or set default message
    const reasons = requestReasons[certId] || {
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

    // Populate form data based on document type
    const formDataContainer = document.getElementById("formDataContainer")
    formDataContainer.innerHTML = ""

    if (requestData.formData) {
      const formData = requestData.formData
      
      // Create form fields display
      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty values
        if (!value) return
        
        const fieldElement = document.createElement("div")
        fieldElement.className = "form-field"
        
        // Format the key for display (capitalize first letter, add spaces before capital letters)
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
        
        fieldElement.innerHTML = `
          <div class="form-field-label">${formattedKey}</div>
          <div class="form-field-value">${value}</div>
        `
        formDataContainer.appendChild(fieldElement)
      })
    } else {
      formDataContainer.innerHTML = "<p>No form data available for this request.</p>"
    }

    // Populate uploaded documents
    const uploadedDocumentsContainer = document.getElementById("uploadedDocumentsContainer")
    uploadedDocumentsContainer.innerHTML = ""

    if (requestData.uploadedDocuments && requestData.uploadedDocuments.length > 0) {
      requestData.uploadedDocuments.forEach(doc => {
        const docElement = document.createElement("div")
        docElement.className = "document-item"
        
        // Determine icon based on file type
        let iconSrc = ""
        if (doc.type.startsWith("image/")) {
          iconSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg=="
        } else if (doc.type === "application/pdf") {
          iconSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtdGV4dCI+PHBhdGggZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIvPjxwb2x5bGluZSBwb2ludHM9IjE0IDIgMTQgOCAyMCA4Ii8+PGxpbmUgeDE9IjE2IiB5MT0iMTMiIHgyPSI4IiB5Mj0iMTMiLz48bGluZSB4MT0iMTYiIHkxPSIxNyIgeDI9IjgiIHkyPSIxNyIvPjxwb2x5bGluZSBwb2ludHM9IjEwIDkgOSA5IDggOSIvPjwvc3ZnPg=="
        } else {
          iconSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUiPjxwYXRoIGQ9Ik0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHoiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIvPjwvc3ZnPg=="
        }
        
        // Create document item HTML
        docElement.innerHTML = `
          <div class="document-info">
            <img src="${iconSrc}" alt="Document icon" class="document-icon">
            <div>
              <div class="document-name">${doc.name}</div>
              <div class="document-size">${doc.size}</div>
            </div>
          </div>
          <div class="document-actions">
            <button class="document-btn document-btn-view" data-url="${doc.url}">View</button>
            <button class="document-btn document-btn-download" data-url="${doc.url}" data-name="${doc.name}">Download</button>
          </div>
        `
        
        uploadedDocumentsContainer.appendChild(docElement)
        
        // Add preview for images
        if (doc.type.startsWith("image/")) {
          const previewElement = document.createElement("div")
          previewElement.innerHTML = `<img src="${doc.url}" alt="${doc.name}" class="document-preview">`
          uploadedDocumentsContainer.appendChild(previewElement)
        }
      })
      
      // Add event listeners for document buttons
      uploadedDocumentsContainer.querySelectorAll(".document-btn-view").forEach(btn => {
        btn.addEventListener("click", function() {
          window.open(this.getAttribute("data-url"), "_blank")
        })
      })
      
      uploadedDocumentsContainer.querySelectorAll(".document-btn-download").forEach(btn => {
        btn.addEventListener("click", function() {
          const link = document.createElement("a")
          link.href = this.getAttribute("data-url")
          link.download = this.getAttribute("data-name")
          link.target = "_blank"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      })
    } else {
      uploadedDocumentsContainer.innerHTML = "<p>No documents uploaded for this request.</p>"
    }

    // Show the modal
    viewModal.style.display = "flex"
  }

  // Approve button click
  function handleApproveClick(button) {
    const row = button.closest("tr")
    const certId = row.querySelector("td:first-child").textContent

    // Set up approve modal
    document.getElementById("approveCertId").textContent = certId
    document.getElementById("approveReasonInput").value = ""

    // Show the modal
    approveModal.style.display = "flex"
    document.getElementById("approveReasonInput").focus()
  }

  // Reject button click
  function handleRejectClick(button) {
    const row = button.closest("tr")
    const certId = row.querySelector("td:first-child").textContent

    // Set up reject modal
    document.getElementById("rejectCertId").textContent = certId
    document.getElementById("rejectReasonInput").value = ""
    document.getElementById("rejectError").style.display = "none"

    // Show the modal
    rejectModal.style.display = "flex"
    document.getElementById("rejectReasonInput").focus()
  }

  // Archive button click
  function handleArchiveClick(button) {
    const row = button.closest("tr")
    const certId = row.querySelector("td:first-child").textContent

    // Set up archive modal
    document.getElementById("archiveCertId").textContent = certId
    document.getElementById("archiveReasonInput").value = ""
    document.getElementById("archiveError").style.display = "none"

    // Show the modal
    archiveModal.style.display = "flex"
    document.getElementById("archiveReasonInput").focus()
  }

  // Confirm approve
  document.getElementById("confirmApproveBtn").addEventListener("click", () => {
    const certId = document.getElementById("approveCertId").textContent
    const reason = document.getElementById("approveReasonInput").value.trim() || "Approved without specific reason"

    // Store the reason
    if (!requestReasons[certId]) {
      requestReasons[certId] = {}
    }
    requestReasons[certId].approveReason = reason

    // Find the row and update status
    const tableRows = document.querySelectorAll("#requestsTableBody tr")
    tableRows.forEach((row) => {
      if (row.querySelector("td:first-child").textContent === certId) {
        const statusCell = row.querySelector("td:nth-child(5)")
        statusCell.innerHTML = '<span class="status-badge status-approved">Approved</span>'
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal
    approveModal.style.display = "none"

    // Show notification
    showNotification("Request approved successfully")
  })

  // Confirm reject
  document.getElementById("confirmRejectBtn").addEventListener("click", () => {
    const certId = document.getElementById("rejectCertId").textContent
    const reason = document.getElementById("rejectReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("rejectError").style.display = "block"
      return
    }

    // Store the reason
    if (!requestReasons[certId]) {
      requestReasons[certId] = {}
    }
    requestReasons[certId].rejectReason = reason

    // Find the row and update status
    const tableRows = document.querySelectorAll("#requestsTableBody tr")
    tableRows.forEach((row) => {
      if (row.querySelector("td:first-child").textContent === certId) {
        const statusCell = row.querySelector("td:nth-child(5)")
        statusCell.innerHTML = '<span class="status-badge status-rejected">Rejected</span>'
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal
    document.getElementById("rejectError").style.display = "none"
    rejectModal.style.display = "none"

    // Show notification
    showNotification("Request rejected")
  })

  // Confirm archive
  document.getElementById("confirmArchiveBtn").addEventListener("click", () => {
    const certId = document.getElementById("archiveCertId").textContent
    const reason = document.getElementById("archiveReasonInput").value.trim()

    // Validate reason
    if (!reason) {
      document.getElementById("archiveError").style.display = "block"
      return
    }

    // Store the reason
    if (!requestReasons[certId]) {
      requestReasons[certId] = {}
    }
    requestReasons[certId].archiveReason = reason

    // Find the row and update status
    const tableRows = document.querySelectorAll("#requestsTableBody tr")
    tableRows.forEach((row) => {
      if (row.querySelector("td:first-child").textContent === certId) {
        const statusCell = row.querySelector("td:nth-child(5)")
        statusCell.innerHTML = '<span class="status-badge status-archived">Archived</span>'
      }
    })

    // Save state to localStorage
    saveState()

    // Hide the modal
    document.getElementById("archiveError").style.display = "none"
    archiveModal.style.display = "none"

    // Show notification
    showNotification("Request archived")
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
      const id = row.getAttribute("data-id").toLowerCase()
      const name = row.getAttribute("data-name").toLowerCase()
      const type = row.getAttribute("data-type").toLowerCase()

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
        const dateA = a.querySelector("td:nth-child(4)").textContent
        const dateB = b.querySelector("td:nth-child(4)").textContent
        return new Date(dateB) - new Date(dateA)
      })

      filterDateBtn.textContent = "Filter by Date: Most Recent"
      filterDateBtn.classList.add("active")
    } else if (dateFilterState === 2) {
      // Earliest first
      tableRows.sort((a, b) => {
        const dateA = a.querySelector("td:nth-child(4)").textContent
        const dateB = b.querySelector("td:nth-child(4)").textContent
        return new Date(dateA) - new Date(dateB)
      })

      filterDateBtn.textContent = "Filter by Date: Earliest"
      filterDateBtn.classList.add("active")
    } else {
      // Default order (reset)
      tableRows.sort((a, b) => {
        const idA = a.querySelector("td:first-child").textContent
        const idB = b.querySelector("td:first-child").textContent
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
      const statusText = row.querySelector("td:nth-child(5) .status-badge").textContent.toLowerCase()

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
          statusText === "document verification" || statusText === "processing" || statusText === "pending"
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
    loadDocumentRequests()
  })

  // Approve All button
  approveAllBtn.addEventListener("click", () => {
    approveAllModal.style.display = "flex"
    document.getElementById("approveAllReasonInput").focus()
  })

  // Confirm Approve All
  document.getElementById("confirmApproveAllBtn").addEventListener("click", () => {
    const reason =
      document.getElementById("approveAllReasonInput").value.trim() || "Batch approval without specific reason"
    let approvedCount = 0
    const tableRows = document.querySelectorAll("#requestsTableBody tr")

    tableRows.forEach((row) => {
      const statusCell = row.querySelector("td:nth-child(5)")
      const statusText = statusCell.querySelector(".status-badge").textContent.toLowerCase()

      if (statusText === "document verification" || statusText === "processing" || statusText === "pending") {
        const certId = row.querySelector("td:first-child").textContent

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
  })

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