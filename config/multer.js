const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.memoryStorage(); // Store the file in memory as a buffer

// Initiate upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Maximum file size (5MB)
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed extensions
    const mimetype = filetypes.test(file.mimetype); // Check file mimetype
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images only!");
    }
  }, 
});

module.exports = upload;
