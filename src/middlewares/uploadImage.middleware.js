const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { logger } = require("../apps/logging.js");  

const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    logger.info('Created directory for images: public/images');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        logger.info(`Preparing to upload file to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + ext;
        logger.info(`Saving file as: ${uniqueName}`);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        logger.warn(`Invalid file type: ${file.mimetype}`);
        return cb(new Error('Only images are allowed!'), false);
    }
    logger.info(`File accepted: ${file.originalname}`);
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
});

const uploadImage = upload.single('baby_photo_url');

module.exports = {
    uploadImage
};
