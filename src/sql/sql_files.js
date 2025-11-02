const path = require('path');
const fsPromises = require("node:fs/promises");
const basePath = path.resolve(__dirname);

const SQL_FILES_PATH = {
    createTableBanners: path.join(basePath, 'create_table', 'create_table_banners.sql'),
    createTableServices: path.join(basePath, 'create_table', 'create_table_services.sql'),
    createTableTransactions: path.join(basePath, 'create_table', 'create_table_transactions.sql'),
    createTableUsers: path.join(basePath, 'create_table', 'create_table_users.sql'),

    getServiceAndUser: path.join(basePath, 'get_data', 'get_service_and_user.sql'),
    getTransactionsHistory: path.join(basePath, 'get_data', 'get_transactions_history.sql'),
    getUser: path.join(basePath, 'get_data', 'get_user.sql'),

    insertService: path.join(basePath, 'insert_data', 'insert_service.sql'),
    insertBanner: path.join(basePath, 'insert_data', 'insert_banner.sql'),
    insertTransaction: path.join(basePath, 'insert_data', 'insert_transaction.sql'),
    insertUser: path.join(basePath, 'insert_data', 'insert_user.sql'),

    decrementBalanceUser: path.join(basePath, 'user_balance', 'decrement_balance_user.sql'),
    incrementBalanceUser: path.join(basePath, 'user_balance', 'increment_balance_user.sql'),

    updateUserImage: path.join(basePath, 'update_user_image.sql'),
    updateUser: path.join(basePath, 'update_user.sql'),
}

async function readFile(filePath) {
    const file = await fsPromises.readFile(filePath);
    return file.toString();
}

const getSqlFiles = async () => {
    return {
        createTableBanners: await readFile(SQL_FILES_PATH.createTableBanners),
        createTableServices: await readFile(SQL_FILES_PATH.createTableServices),
        createTableTransactions: await readFile(SQL_FILES_PATH.createTableTransactions),
        createTableUsers: await readFile(SQL_FILES_PATH.createTableUsers),
        
        getServiceAndUser: await readFile(SQL_FILES_PATH.getServiceAndUser),
        getTransactionsHistory: await readFile(SQL_FILES_PATH.getTransactionsHistory),
        getUser: await readFile(SQL_FILES_PATH.getUser),

        insertService: await readFile(SQL_FILES_PATH.insertService),
        insertBanner: await readFile(SQL_FILES_PATH.insertBanner),
        insertTransaction: await readFile(SQL_FILES_PATH.insertTransaction),
        insertUser: await readFile(SQL_FILES_PATH.insertUser),

        decrementBalanceUser: await readFile(SQL_FILES_PATH.decrementBalanceUser),
        incrementBalanceUser: await readFile(SQL_FILES_PATH.incrementBalanceUser),

        updateUserImage: await readFile(SQL_FILES_PATH.updateUserImage),
        updateUser: await readFile(SQL_FILES_PATH.updateUser),
    }
}

module.exports = {
    getSqlFiles,
    SQL_FILES_PATH
};