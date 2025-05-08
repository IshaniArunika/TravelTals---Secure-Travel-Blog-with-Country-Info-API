const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set upload path to: /backend/src/uploads
const uploadPath = path.join(__dirname, '..', 'uploads');

// Create the folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
module.exports = upload;
