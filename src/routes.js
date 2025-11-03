
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const transactionsController = require('./controllers/transactionsController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const auth = require('./middlewares/auth');

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        let filename;
        let fullpath;
        do {
            filename = `${uuid.v4()}${ext}`;
            fullpath = path.join('uploads', filename);
        } while (fs.existsSync(fullpath));
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Format Image tidak sesuai'));
        }
    }
});

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/profile", auth, userController.getProfile);
router.put("/profile/update", auth, userController.updateProfile);
router.put("/profile/image", auth, upload.single('file'), userController.updateProfileImage);

router.get("/banner", transactionsController.getBanners);
router.get("/services", transactionsController.getServices);

module.exports = router;