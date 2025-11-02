const connectDB = require('../config/database');
const { getSqlFiles } = require('../sql/sql_files');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const regexEmail = /.{1,}@.{1,}\..{1,}/;

function sendBadRequestResponse(res, message) {
    res.status(400).json({
        status: 102,
        message: message,
        data: null
    });
}

const userController = {
    registration: async (req, res) => {
        const { email, first_name, last_name, password } = req.body;
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();

        if (!regexEmail.test(email)) {
            db.release();
            return sendBadRequestResponse(res, 'Parameter email tidak sesuai format');
        }

        if (password.length < 8) {
            db.release();
            return sendBadRequestResponse(res, 'Password harus memiliki minimal 8 karakter');
        }

        const existingUser = await db.query(sqlFiles.getUser, [email]);
        if (existingUser.rows.length > 0) {
            res.status(400).json({
                status: 103,
                message: "Email sudah terdaftar",
                data: null
            });
            db.release();
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let result;
        result = await db.query(sqlFiles.insertUser, [email, first_name, last_name, hashedPassword]);
        db.release();

        res.status(200).json({
            status: 0,
            message: "Registrasi berhasil silahkan login",
            "data": null
        });
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        
        if (!regexEmail.test(email)) {
            db.release();
            sendBadRequestResponse(res, 'Parameter email tidak sesuai format');
            return;
        }

        if (password.length < 8) {
            db.release();
            sendBadRequestResponse(res, 'Password harus memiliki minimal 8 karakter');
            return;
        }

        let result;
        try {
            result = await db.query(sqlFiles.getUser, [email]);
        } finally {
            db.release();
        }

        let user = result.rows[0];

        if (!user) {
            return res.status(400).json({
                status: 101,
                message: "Email atau password salah",
                data: null
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({
                status: 101,
                message: "Email atau password salah",
                data: null
            });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            status: 0,
            message: "Login berhasil",
            data: {
                token: token
            }
        });
    },

    getProfile: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        let result;
        try {
            result = await db.query(sqlFiles.getUser, [req.user.email]);
        } finally {
            db.release();
        }

        const user = result.rows[0];

        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    },

    updateProfile: async (req, res) => {
        const { first_name, last_name } = req.body;
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        let result;
        try {
            result = await db.query(sqlFiles.updateUser, [first_name, last_name, req.user.email]);
        } finally {
            db.release();
        }

        const user = result.rows[0];

        res.status(200).json({
            status: 0,
            message: "Update Profile berhasil",
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    },

    updateProfileImage: async (req, res) => {
        if (!req.file) {
            return sendBadRequestResponse(res, 'File gambar tidak ditemukan');
        }
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        let result;
        try {
            const imagePath = `${req.protocol}://${req.host}/uploads/${req.file.filename}`;
            result = await db.query(sqlFiles.updateUserImage, [imagePath, req.user.email]);
        } finally {
            db.release();
        }
        const user = result.rows[0];

        res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    }
}
module.exports = userController;
