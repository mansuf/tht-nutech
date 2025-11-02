
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const auth = require('./middlewares/auth');
const connectDB = require('./config/database');
const { getSqlFiles } = require('./sql/sql_files');

async function initializeApp() {
  const db = await connectDB();
  const sqlFiles = await getSqlFiles();

  try {
    await db.query(sqlFiles.createTableBanners);
    await db.query(sqlFiles.createTableServices);
    await db.query(sqlFiles.createTableUsers);
    await db.query(sqlFiles.createTableTransactions);

    await db.query(sqlFiles.insertBanner, ['Banner 1', 'https://files.mansuf.link/sus.png', 'Banner pertama']);
    await db.query(sqlFiles.insertBanner, ['Banner 2', 'https://files.mansuf.link/sus.png', 'Banner kedua']);
    await db.query(sqlFiles.insertBanner, ['Banner 3', 'https://files.mansuf.link/sus.png', 'Banner ketiga']);
    await db.query(sqlFiles.insertBanner, ['Banner 4', 'https://files.mansuf.link/sus.png', 'Banner keempat']);

    await db.query(sqlFiles.insertService, ['PLN', 'Listrik', 'https://files.mansuf.link/sus.png', 20000]);
    await db.query(sqlFiles.insertService, ['PDAM', 'Air', 'https://files.mansuf.link/sus.png', 15000]);
    await db.query(sqlFiles.insertService, ['TELKOM', 'Internet', 'https://files.mansuf.link/sus.png', 25000]);
    await db.query(sqlFiles.insertService, ['BPJS', 'Kesehatan', 'https://files.mansuf.link/sus.png', 30000]);
  } finally {
    db.release();
  }
}

app.use(express.static("uploads"));
app.use(express.json());

app.use('/', userRoutes);
// app.use('/items', auth, itemRoutes);

app.get('/', (req, res) => {
  res.send('Bismillah keterima kerja, amin 🤲');
});

module.exports = {
  initializeApp,
  app,
};
