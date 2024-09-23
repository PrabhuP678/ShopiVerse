import express from 'express';
import env from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import authRoute from './routers/authRoute.js';
import categoryRoutes from './routers/categoryRoute.js';
import productRoute from './routers/productRoute.js';
import reviewRoute from './routers/reviewRoute.js';
import userRoutes from './routers/userRoutes.js'; // Import the new route
import paymentRoute from './routers/paymentRoute.js'
import cors from 'cors';
import path from 'path';
env.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

connectDB();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './client/build')))

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/products', reviewRoute);
app.use('/api/v1/payment', paymentRoute)
app.use('/api/v1/user', userRoutes);
// Use the payment route
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
