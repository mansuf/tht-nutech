
const {app, initializeApp} = require('./app');
const dotenv = require('dotenv');

dotenv.config();

initializeApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
