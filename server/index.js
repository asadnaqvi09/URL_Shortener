import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import urlRoutes from './src/routes/url_routes.js'
import analyticsRoutes from './src/routes/analytics_routes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors(
    {
        origin : 'http://localhost:5173',
        credentials : true
    }
));

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Server is running on port ${PORT}`
    })
})

// Routes
app.use('/api/v1/' , urlRoutes);
app.use('/api/v1/analytics' , analyticsRoutes);

// Server Listen
app.listen(PORT , (req,res)=> {
    console.log(`Server is runnig on Port : http://localhost:${PORT}`)
})