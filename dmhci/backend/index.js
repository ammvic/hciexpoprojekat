require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute'); 
const userController = require('./controllers/userController')
const orderRoutes = require('./routes/orderRoutes');

// initialize a new express application instance
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoute);
app.post('/api/users/verify-email', userController.verifyEmail);
app.use('/api', orderRoutes);



// connect to DataBase (MONGODB)
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Connected to DB, and running on http://localhost:${PORT}/`)))
    .catch((error) => console.log(`Error:`, error.message));
