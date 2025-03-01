require('dotenv').config();
const express = require('express');
const connectToDB = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');
const http = require('http');
const { Server } = require('socket.io');
const leadRoutes = require('./routes/lead.routes');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5174', process.env.CRM_BACKEND_URL],
    credentials: true,
  },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5174', process.env.CRM_BACKEND_URL],
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
app.use('/api/v1/stats', require('./routes/stat.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tickets', require('./routes/ticket.routes'));
app.use('/api/v1/leads', leadRoutes(io));
app.use('/api/v1/clients', require('./routes/client.routes'));

//Error Handler middleware
app.use(errorHandler);

server.listen(process.env.PORT || 8001, () => {
    console.log(`Server is running on port ${process.env.PORT || 8001}`);
    }
);

module.exports = app;