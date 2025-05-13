document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmBtn");
  const successPopup = document.getElementById("successPopup");
  const homeBtn = document.getElementById("homeBtn");
  const documentUpload = document.getElementById("documentUpload");
  const filesContainer = document.getElementById("filesContainer");
  const fileCount = document.getElementById("fileCount");
  const uploadInstructions = document.querySelector(".upload-instructions");
  const trackLink = document.getElementById("trackLink");
  const refNumberDisplay = document.getElementById("refNumberDisplay");
  
  // Maximum number of files
  const MAX_FILES = 20;
  
  // Array to store uploaded files
  let uploadedFiles = [];

  // Handle file upload
  if (documentUpload) {
    documentUpload.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      
      // Check if total files exceed the maximum
      if (uploadedFiles.length + files.length > MAX_FILES) {
        alert(`You can upload a maximum of ${MAX_FILES} files.`);
        return;
      }
      
      // Process each file
      files.forEach(file => {
        // Check if file already exists in the array
        const fileExists = uploadedFiles.some(f => f.name === file.name && f.size === file.size);
        if (!fileExists) {
          uploadedFiles.push(file);
          addFileToUI(file);
        }
      });
      
      // Update file count
      updateFileCount();
    });
  }
  
  // Function to add file to UI
  function addFileToUI(file) {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";
    
    // Format file size
    const fileSize = formatFileSize(file.size);
    
    // Get appropriate icon based on file type
    const fileIcon = getFileIcon(file.type);
    
    fileItem.innerHTML = `
      <div class="file-info">
        <img src="${fileIcon}" alt="File icon" class="file-icon">
        <div>
          <div class="file-name">${file.name}</div>
          <div class="file-size">${fileSize}</div>
        </div>
      </div>
      <button type="button" class="file-remove" data-name="${file.name}">×</button>
    `;
    
    // Add preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.createElement("div");
        preview.innerHTML = `<img src="${e.target.result}" alt="${file.name}" class="file-preview">`;
        fileItem.appendChild(preview);
      };
      reader.readAsDataURL(file);
    }
    
    filesContainer.appendChild(fileItem);
    
    // Add event listener to remove button
    const removeBtn = fileItem.querySelector(".file-remove");
    removeBtn.addEventListener("click", () => {
      const fileName = removeBtn.getAttribute("data-name");
      uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
      fileItem.remove();
      updateFileCount();
    });
  }
  
  // Function to update file count
  function updateFileCount() {
    fileCount.textContent = `${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''} selected`;
  }
  
  // Function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Function to get file icon based on file type
  function getFileIcon(fileType) {
    if (fileType.startsWith("image/")) {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==";
    } else if (fileType === "application/pdf") {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtdGV4dCI+PHBhdGggZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIvPjxwb2x5bGluZSBwb2ludHM9IjE0IDIgMTQgOCAyMCA4Ii8+PGxpbmUgeDE9IjE2IiB5MT0iMTMiIHgyPSI4IiB5Mj0iMTMiLz48bGluZSB4MT0iMTYiIHkxPSIxNyIgeDI9IjgiIHkyPSIxNyIvPjxwb2x5bGluZSBwb2ludHM9IjEwIDkgOSA5IDggOSIvPjwvc3ZnPg==";
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY2Y2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1maWxlLXRleHQiPjxwYXRoIGQ9Ik0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHoiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIvPjxsaW5lIHgxPSIxNiIgeTE9IjEzIiB4Mj0iOCIgeTI9IjEzIi8+PGxpbmUgeDE9IjE2IiB5MT0iMTciIHgyPSI4IiB5Mj0iMTciLz48cG9seWxpbmUgcG9pbnRzPSIxMCA5IDkgOSA4IDkiLz48L3N2Zz4=";
    } else {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUiPjxwYXRoIGQ9Ik0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOHoiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIvPjwvc3ZnPg==";
    }
  }

  // Show popup when confirm button is clicked
  if (confirmBtn && successPopup) {
    confirmBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Check if at least one file is uploaded
      if (uploadedFiles.length > 0) {
        // Generate a longer unique reference number (9 digits)
        const refNumber = "#" + Math.floor(100000000 + Math.random() * 900000000);
        console.log("Generated reference number:", refNumber);

        // Save the document request to localStorage
        const documentRequests = JSON.parse(localStorage.getItem("documentRequests")) || {};

        // Get form data from previous steps (stored in localStorage)
        const formData = JSON.parse(localStorage.getItem("formData")) || {};
        console.log("Form data:", formData);

        // Get the document type and purpose from localStorage
        const documentType = localStorage.getItem("documentType") || "Barangay Clearance";
        const documentPurpose = localStorage.getItem("documentPurpose") || "General Purpose";

        // Create applicant name from form data
        let applicantName = "Resident";
        if (formData.firstName) {
          applicantName = formData.firstName;
          if (formData.middleInitial) {
            applicantName += " " + formData.middleInitial;
          }
          if (formData.lastName) {
            applicantName += " " + formData.lastName;
          }
        }
        console.log("Applicant name:", applicantName);

        // Process uploaded files for storage
        const processedFiles = uploadedFiles.map(file => {
          // Create a URL for the file (in a real app, you would upload to a server)
          const fileUrl = URL.createObjectURL(file);
          
          return {
            name: file.name,
            type: file.type,
            size: formatFileSize(file.size),
            url: fileUrl
          };
        });

        // Create a new document request
        documentRequests[refNumber] = {
          id: refNumber,
          type: documentType,
          purpose: documentPurpose,
          status: "Document Verification",
          dateRequested: new Date().toLocaleDateString(),
          estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          applicantName: applicantName,
          formData: formData,
          uploadedDocuments: processedFiles
        };

        // Save to localStorage
        localStorage.setItem("documentRequests", JSON.stringify(documentRequests));
        console.log("Saved document requests:", documentRequests);

        // Display the reference number in the success popup
        if (refNumberDisplay) {
          refNumberDisplay.textContent = refNumber;
          console.log("Updated refNumberDisplay with:", refNumber);
        }

        // Update the track link to include the reference number
        if (trackLink) {
          trackLink.href = `trackmyrequest.html?ref=${refNumber}`;
          console.log("Updated trackLink href to:", trackLink.href);
        }

        // Show the success popup
        successPopup.style.display = "flex";
      } else {
        alert("Please upload at least one document before confirming.");
      }
    });
  }

  // Close popup and redirect when home button is clicked
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      // Add fade-out animation
      successPopup.classList.add("fade-out");

      // Wait for animation to complete before redirecting
      setTimeout(() => {
        successPopup.style.display = "none";
        window.location.href = "../HTML/SHome.html";
      }, 500);
    });
  }
});