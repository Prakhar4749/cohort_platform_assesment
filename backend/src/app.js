import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConfig.js';
import userRoutes from './routes/userRoutes.js';
import searchRoutes from './routes/searchRoutes.js'
import communityRoutes from './routes/communityRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
// import gamificationRoutes from './routes/gamificationRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parses JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

// Routes
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/memberships', membershipRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/gamification', gamificationRoutes);
app.use('/api/permissions', permissionRoutes);

app.use('/api/search', searchRoutes);


// Error Handling
app.use(notFound);
app.use(errorHandler);;

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

startServer();
