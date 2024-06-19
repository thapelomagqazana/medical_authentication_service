const app = require("./app");
const connectDB = require("./config/db");

// Load environment variables from .env file
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});