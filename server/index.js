import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import { fileURLToPath } from 'url'
import urlRoutes from './src/routes/url_routes.js'
import analyticsRoutes from './src/routes/analytics_routes.js'
import redirectRoutes from './src/routes/redirectRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors(
    {
        origin : true,
        credentials : true
    }
));
app.use(helmet())

// View Engines
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Static Files
app.use(express.static(path.join(__dirname, 'views')))

// Routes
app.use('/api/v1/' , urlRoutes)
app.use('/api/v1/analytics' , analyticsRoutes)
app.use('/' , redirectRoutes)
app.get('/', (req, res) => {
    res.render('index')
})
app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/js') || req.path.startsWith('/css') || req.path.startsWith('/images')) {
        return next()
    }
    res.render('index')
})

// Server Listen
app.listen(PORT , (req,res)=> {
    console.log(`Server is runnig on Port : http://localhost:${PORT}`)
})