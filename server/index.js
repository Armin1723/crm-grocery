require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler.js');

const app = express();

const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
    credentials: true
}));
app.use(cookieParser());

// Database Connection
connectToDB();

// Routes
app.use('/api/v1/products', require('./routes/product.routes.js'));
app.use('/api/v1/purchases', require('./routes/purchase.routes.js'));
app.use('/api/v1/suppliers', require('./routes/supplier.routes.js'));
app.use('/api/v1/employees', require('./routes/employee.routes.js'));
app.use('/api/v1/inventory', require('./routes/inventory.routes.js'));
app.use('/api/v1/reports', require('./routes/report.routes.js'));
app.use('/api/v1/sales', require('./routes/sale.routes.js'));
app.use('/api/v1/stats', require('./routes/stat.routes.js'));
app.use('/api/v1/auth', require('./routes/auth.routes.js'));
app.use('/api/v1/expenses', require('./routes/expense.routes.js'));

// Server
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Error Handler middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
