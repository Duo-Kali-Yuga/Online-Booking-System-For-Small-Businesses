// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // 1. Ensure the upload directory exists
// const uploadDir = 'uploads/avatars/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // 2. Configure Disk Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Using an absolute path is safer
//     const dir = path.join(process.cwd(), 'uploads/avatars/');
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     // Ensure file.originalname exists before calling path.extname
//     const ext = file ? path.extname(file.originalname) : '.jpg';
//     cb(null, `avatar-${req.user._id}-${uniqueSuffix}${ext}`);
//   }
// });

// // 3. File Filter (Security)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const mimetype = allowedTypes.test(file.mimetype);
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimetype && extname) {
//     return cb(null, true);
//   }
//   cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
// };

// // 4. Initialize Multer
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024 // Limit: 2MB per file
//   },
//   fileFilter: fileFilter
// });

// export default upload;

import multer from 'multer';
import path from 'path';

// 1. Use memory storage instead of disk storage (important for Vercel Blob)
const storage = multer.memoryStorage();

// 2. File Filter (Security - keeps the same)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
};

// 3. Initialize Multer with memory storage
const upload = multer({
  storage: storage,  // Changed from diskStorage to memoryStorage
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export default upload;