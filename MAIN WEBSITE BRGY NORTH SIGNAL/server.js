const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (_req, res) => {
  res.send('Welcome to the Barangay Form Backend!');
});

// Function to generate a unique reference ID
function generateReferenceId() {
  const randomPart = uuidv4().substring(0, 5).toUpperCase();
  const timestampPart = Date.now().toString().slice(-5);
  return `REF-${randomPart}-${timestampPart}`;
}

// POST route for form submission
app.post('/submit-form', (req, res) => {
  console.log("Server - Incoming request body:", req.body);
  const {
    id,
    first_name,
    middle_initial,
    last_name,
    gender,
    nationality,
    civil_status,
    contact_number,
    birth_date,
    years_resident,
    document_type,
    purpose
  } = req.body;
  
  // If there's an ID, update the existing row
  if (id) {
    console.log("Server - Attempting UPDATE for id:", id);
    const sql = `
      UPDATE barangay_clearance SET
        first_name = ?, middle_initial = ?, last_name = ?, gender = ?, nationality = ?,
        civil_status = ?, contact_number = ?, birth_date = ?, years_resident = ?, 
        document_type = ?, purpose = ?
      WHERE id = ?
    `;
    
    const values = [
      first_name, middle_initial, last_name, gender, nationality,
      civil_status, contact_number, birth_date, years_resident, 
      document_type, purpose, id
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Server - Update error:', err);
        return res.status(500).json({ message: 'Failed to update form data.' });
      }

      console.log("Server - Update result:", result);
      if (result.affectedRows === 0) {
        console.log("Server - No rows updated! ID might not exist:", id);
        return res.status(404).json({ message: 'No record found with that ID.' });
      }

      res.json({ message: 'Form updated successfully', affectedRows: result.affectedRows });
    });
  } else {
    // If no ID, insert a new one with reference_id and request_date
    console.log("Server - Attempting INSERT (new record)");
    
    // Generate reference ID and current date/time with timezone adjustment
    const reference_id = generateReferenceId();
    const now = new Date();
    // Adjust for local timezone
    const request_date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    
    const sql = `
      INSERT INTO barangay_clearance (
        first_name, middle_initial, last_name, gender, nationality,
        civil_status, contact_number, birth_date, years_resident, 
        document_type, purpose, reference_id, request_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')
    `;

    const values = [
      first_name || 'Pending',
      middle_initial || null,
      last_name || 'Completion',
      gender || null,
      nationality || null,
      civil_status || null,
      contact_number || 'Pending',
      birth_date || null,
      years_resident || null,
      document_type,
      purpose,
      reference_id,
      request_date
    ];

    console.log("Server - SQL:", sql);
    console.log("Server - Values:", values);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Server - Insert error:', err);
        return res.status(500).json({ message: 'Failed to insert form data.' });
      }

      console.log("Server - Insert result:", result);
      res.json({ 
        message: 'Form inserted successfully', 
        insertId: result.insertId,
        reference_id: reference_id
      });
    });
  }
});

// GET route to fetch document requests for admin dashboard
app.get('/api/document-requests', (req, res) => {
  console.log("Fetching document requests...");
  
  const sql = `
    SELECT 
      id,
      reference_id,
      first_name,
      middle_initial,
      last_name,
      document_type,
      request_date,
      status
    FROM barangay_clearance
    ORDER BY id DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching document requests:', err);
      return res.status(500).json({ message: 'Failed to fetch document requests' });
    }
    
    console.log("Fetched document requests:", results);
    res.json(results);
  });
});

// GET route to fetch pending requests count
app.get('/api/scheduled-requests-count', (req, res) => {
  console.log("Fetching scheduled requests count...");
  
  const sql = `
    SELECT COUNT(*) as count 
    FROM barangay_clearance 
    WHERE status = 'Ready for Pickup' 
       OR status = 'Scheduled' 
       OR status = 'For Pickup'
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching scheduled count:', err);
      return res.status(500).json({ message: 'Failed to fetch scheduled count' });
    }
    
    console.log("Scheduled count result:", results);
    res.json({ count: results[0].count });
  });
});

// GET route to fetch pending requests
app.get('/api/pending-requests', (req, res) => {
  console.log("Fetching pending requests...");
  
  const sql = `
    SELECT * 
    FROM barangay_clearance 
    WHERE status IS NULL 
       OR status = 'Draft' 
       OR status = 'Pending'
       OR status = 'Processing'
       OR status = 'Document Verification'
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching pending requests:', err);
      return res.status(500).json({ message: 'Failed to fetch pending requests' });
    }
    
    console.log("Pending requests:", results.length);
    res.json(results);
  });
});

// PUT route to update document status
app.put('/api/document-requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const sql = 'UPDATE barangay_clearance SET status = ? WHERE id = ?';
  
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating document status:', err);
      return res.status(500).json({ message: 'Failed to update document status' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document request not found' });
    }
    
    res.json({ 
      message: `Document status updated to ${status}`,
      reason: reason || null
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Add necessary columns if they don't exist
  try {
    // Add reference_id column
    db.query("ALTER TABLE barangay_clearance ADD COLUMN reference_id VARCHAR(20)", (err) => {
      if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding reference_id column:', err);
      } else if (!err) {
        console.log('Added reference_id column to barangay_clearance table');
      }
    });
    
    // Add request_date column
    db.query("ALTER TABLE barangay_clearance ADD COLUMN request_date DATETIME", (err) => {
      if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding request_date column:', err);
      } else if (!err) {
        console.log('Added request_date column to barangay_clearance table');
      }
    });
    
    // Add status column
    db.query("ALTER TABLE barangay_clearance ADD COLUMN status VARCHAR(20) DEFAULT 'Draft'", (err) => {
      if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding status column:', err);
      } else if (!err) {
        console.log('Added status column to barangay_clearance table');
      }
    });
  } catch (error) {
    console.error('Error adding columns:', error);
  }
});