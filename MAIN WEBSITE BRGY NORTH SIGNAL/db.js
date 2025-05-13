const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin@1234',
  database: 'brgy_forms'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
    
    // Test query to verify connection
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
      if (err) {
        console.error('Test query failed:', err);
      } else {
        console.log('Database connection verified. Test query result:', results[0].solution);
      }
    });
    
    // Check if barangay_clearance table exists
    db.query("SHOW TABLES LIKE 'barangay_clearance'", (err, results) => {
      if (err) {
        console.error('Error checking for table:', err);
      } else if (results.length === 0) {
        console.error('Table barangay_clearance does not exist!');
      } else {
        console.log('Table barangay_clearance exists');
        
        // Check table structure
        db.query("DESCRIBE barangay_clearance", (err, results) => {
          if (err) {
            console.error('Error describing table:', err);
          } else {
            console.log('Table structure:', results.map(row => row.Field));
          }
        });
      }
    });
  }
});

module.exports = db;