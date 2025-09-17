import multer from "multer";
import path from "path";
import fs from "fs";


const createMulter = (uploadFolder = "uploads", allowedTypes = []) => {
  
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

 
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  
  const fileFilter = (req, file, cb) => {
    if (allowedTypes.length > 0) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.includes(ext)) {
        return cb(new Error("Invalid file type"), false);
      }
    }
    cb(null, true);
  };

  return multer({ storage, fileFilter });
};

export default createMulter;
