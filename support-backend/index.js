require('dotenv').config();
const express = require('express');
const connectToDB = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true
}));
app.use(cookieParser());

// Connect to the database
connectToDB();

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

//Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tickets', require('./routes/ticket.routes'));
app.use('/api/v1/leads', require('./routes/lead.routes'));

//Error Handler middleware
app.use(errorHandler);

app.listen(process.env.PORT || 8001, () => {
    console.log(`Server is running on port ${process.env.PORT || 8001}`);
    }
);

module.exports = app;