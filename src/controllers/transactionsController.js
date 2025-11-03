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
                    message: "User tidak ditemukan",
                    data: null
                });
            }

            const user = userResult.rows[0];

            res.status(200).json({
                status: 0,
                message: "Get Balance Berhasil",
                data: {
                    balance: user.balance
                }
            });
        } finally {
            db.release();
        }
    },

    doTopup: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        let invoiceNumber = `INV-${Date.now()}`;

        if (!req.body.amount || isNaN(req.body.amount) || req.body.amount <= 0) {
            return res.status(400).json({
                status: 102,
                message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                data: null
            });
        }

        const amount = parseInt(req.body.amount);
        let user;

        // Get userinfo
        try {
            const userResult = await db.query(sqlFiles.getUser, [req.user.email]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    status: 104,
                    message: "User tidak ditemukan",
                    data: null
                });
            }
            user = userResult.rows[0];
        } catch (error) {
            console.error(error);
            db.release();
            return res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
                data: null
            });
        }

        try {
            const userResult = await db.query(
                sqlFiles.insertTransaction, [
                    invoiceNumber,
                    user.user_id,
                    'TOPUP',
                    'Top Up Saldo',
                    'TOPUP',
                    amount
                ]
            );
            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    status: 104,
                    message: "User tidak ditemukan",
                    data: null
                });
            }
        } catch (error) {
            db.release();
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
                data: null
            });
        }    

        try {
            await db.query(
                sqlFiles.incrementBalanceUser, [
                    amount,
                    user.user_id
                ]
            );
            res.status(200).json({
                status: 0,
                message: "Top Up Balance Berhasil",
                data: {
                    balance: user.balance + amount
                }
            });
        } finally {
            db.release();
        }
    },

    doTransaction: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        let invoiceNumber = `INV-${Date.now()}`;
        const { service_code } = req.body;

        if (!service_code) {
            return res.status(400).json({
                status: 102,
                message: "Parameter service_code wajib diisi",
                data: null
            });
        }
        let user;

        try {
            // Get userinfo
            const userResult = await db.query(sqlFiles.getUser, [req.user.email]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    status: 104,
                    message: "User tidak ditemukan",
                    data: null
                });
            }
            user = userResult.rows[0];

            // Get Service Info
            let service;
            const serviceInfo = await db.query(sqlFiles.getServiceAndUser, [user.user_id, req.body.service_code]);
            if (serviceInfo.rows.length === 0) {
                return res.status(404).json({
                    status: 104,
                    message: "Service ataus Layanan tidak ditemukan",
                    data: null
                });
            }
            service = serviceInfo.rows[0];
            if (user.balance < service.service_tariff) {
                return res.status(400).json({
                    status: 105,
                    message: "Saldo tidak cukup untuk melakukan transaksi",
                    data: null
                });
            }

            const transactionResult = await db.query(
                sqlFiles.insertTransaction, [
                    invoiceNumber,
                    user.user_id,
                    service.service_code,
                    service.service_name,
                    'PAYMENT',
                    service.service_tariff
                ]
            );
            if (transactionResult.rows.length === 0) {
                return res.status(404).json({
                    status: 104,
                    message: "User tidak ditemukan",
                    data: null
                });
            }

            let amount = service.service_tariff;

            await db.query(
                sqlFiles.decrementBalanceUser, [
                    amount,
                    user.user_id
                ]
            );
            res.status(200).json({
                status: 0,
                message: "Transaksi berhasil",
                data: {
                    invoice_number: invoiceNumber,
                    service_code: service.service_code,
                    service_name: service.service_name,
                    transaction_type: 'PAYMENT',
                    total_amount: amount,
                    created_on: transactionResult.rows[0].created_on
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan pada server",
                data: null
            });
        } finally {
            db.release();
        }
    },

    getTransactionHistory: async (req, res) => {
        const db = await connectDB();
        const sqlFiles = await getSqlFiles();
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit || 10;

            const result = await db.query(sqlFiles.getTransactionsHistory, [req.user.email, limit, offset]);
            res.status(200).json({
                status: 0,
                message: "Get History Berhasil",
                data: result.rows.map(row => ({
                    invoice_number: row.invoice_number,
                    transaction_type: row.transaction_type,
                    description: row.description,
                    total_amount: row.total_amount,
                    created_on: row.created_on
                }))
            });
        } finally {
            db.release();
        }
    }
};

module.exports = transactionsController;