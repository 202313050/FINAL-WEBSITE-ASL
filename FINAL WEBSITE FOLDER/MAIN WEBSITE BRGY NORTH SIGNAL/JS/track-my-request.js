document.addEventListener("DOMContentLoaded", () => {
  const trackForm = document.getElementById("trackForm")
  const trackResults = document.getElementById("trackResults")
  const referenceInput = document.getElementById("referenceNumber")
  const displayRefNumber = document.getElementById("displayRefNumber")
  const requestType = document.getElementById("requestType")
  const statusBadge = document.getElementById("statusBadge")
  const dateRequested = document.getElementById("dateRequested")
  const estimatedCompletion = document.getElementById("estimatedCompletion")
  const applicantName = document.getElementById("applicantName")
  const statusNotes = document.getElementById("statusNotes")

  // Timeline steps
  const verificationStep = document.getElementById("verificationStep")
  const processingStep = document.getElementById("processingStep")
  const readyStep = document.getElementById("readyStep")
  const completedStep = document.getElementById("completedStep")

  // Check if there's a reference number in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const refFromUrl = urlParams.get("ref")
  if (refFromUrl) {
    referenceInput.value = refFromUrl
    // Automatically submit the form if reference number is in URL
    setTimeout(() => {
      trackForm.dispatchEvent(new Event("submit"))
    }, 500)
  }

  trackForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const refNumber = referenceInput.value.trim()

    // Get stored document requests from localStorage
    const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {}

    // Check if reference number exists in our stored data
    if (documentRequests[refNumber]) {
      const data = documentRequests[refNumber]

      // Update the display with the request details
      displayRefNumber.textContent = refNumber
      requestType.textContent = data.type
      statusBadge.textContent = data.status
      dateRequested.textContent = data.dateRequested
      estimatedCompletion.textContent = data.estimatedCompletion

      // Use the actual applicant name from form data
      if (data.formData && data.formData.firstName) {
        const fullName = `${data.formData.firstName} ${data.formData.middleInitial ? data.formData.middleInitial + " " : ""}${data.formData.lastName}`
        applicantName.textContent = fullName
      } else {
        applicantName.textContent = data.applicantName || "Resident"
      }

      // Default notes based on status
      let notes =
        "Your request is currently being processed. Please check back for updates or wait for our SMS notification when your document is ready for pickup."

      if (data.status === "Ready for Pickup") {
        notes =
          "Your document is ready for pickup. Please bring a valid ID and the reference number when claiming your document."
      } else if (data.status === "Completed") {
        notes = "Your request has been completed and the document has been claimed."
      } else if (data.status === "Document Verification") {
        notes = "Your submitted documents are currently being verified. We will update you once processing begins."
      }

      statusNotes.textContent = data.notes || notes

      // Update status badge color
      statusBadge.className = "status-badge"
      if (data.status === "Processing") {
        statusBadge.classList.add("status-processing")
      } else if (data.status === "Ready for Pickup") {
        statusBadge.classList.add("status-ready")
      } else if (data.status === "Completed") {
        statusBadge.classList.add("status-completed")
      } else if (data.status === "Document Verification") {
        statusBadge.classList.add("status-verification")
      }

      // Update timeline based on status
      const timeline = {
        verification: data.status !== "Draft",
        processing: ["Processing", "Ready for Pickup", "Completed"].includes(data.status),
        ready: ["Ready for Pickup", "Completed"].includes(data.status),
        completed: data.status === "Completed",
      }

      verificationStep.className = timeline.verification ? "timeline-item completed" : "timeline-item"

      if (timeline.processing) {
        processingStep.className = "timeline-item completed"
      } else if (data.status === "Document Verification") {
        processingStep.className = "timeline-item"
        verificationStep.className = "timeline-item active"
      } else {
        processingStep.className = "timeline-item"
      }

      if (timeline.ready) {
        readyStep.className = "timeline-item completed"
      } else if (data.status === "Processing") {
        readyStep.className = "timeline-item"
        processingStep.className = "timeline-item active"
      } else {
        readyStep.className = "timeline-item"
      }

      completedStep.className = timeline.completed ? "timeline-item completed" : "timeline-item"

      // Show results
      trackResults.style.display = "block"

      // Scroll to results
      trackResults.scrollIntoView({ behavior: "smooth" })
    } else {
      alert("Reference number not found. Please check and try again.")
    }
  })
})
