const connectDB = require('../config/database');
const { getSqlFiles } = require('../sql/sql_files');

const transactionsController = {
    getBanners: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        try {
            const result = await db.query(sqlFiles.getBanners);
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: result.rows.map(row => {
                    return {
                        banner_name: row.banner_name, 
                        banner_image: row.banner_image,
                        description: row.description
                    };
                })
            });
        } finally {
            db.release();
        }
    },

    getServices: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        try {
            const result = await db.query(sqlFiles.getServices);
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: result.rows.map(row => {
                    return {
                        service_code: row.service_code,
                        service_name: row.service_name,
                        service_icon: row.service_icon,
                        service_tariff: row.service_tariff
                    };
                })
            });
        } finally {
            db.release();
        }
    },


    getBalance: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        try {
            const userResult = await db.query(sqlFiles.getUser, [req.user.email]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    status: 104,
                    message: "User not found",
                    data: null
                });
            }
            const user = userResult.rows[0];
            res.status(200).json({
                status: 0,
                message: "Balance retrieved successfully",
                data: {
                    balance: user.balance
                }
            });
        } finally {
            db.release();
        }
    },
};

module.exports = transactionsController;