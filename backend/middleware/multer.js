import multer from "multer";

const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        // Sanitize filename - remove special characters
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueName = Date.now() + '_' + sanitizedName;
        callback(null, uniqueName);
    }
});

// File filter for security - only allow specific image types and PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 
        'image/jpg',
        'image/png', 
        'image/webp',
        'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.'), false);
    }
};

// Configure multer with security settings
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 10 // Maximum 10 files per request
    }
});

export default upload;