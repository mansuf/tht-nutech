const connectDB = require('../config/database');
const { getSqlFiles } = require('../sql/sql_files');

const transactionsController = {
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