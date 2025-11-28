const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const port = 8000;
// sets up variable for socket.io to connect to the app
const server = http.createServer(app);

// routers and middleware
const errorHandler = require('./middlewares/error_hander'); // custom error handler
const expressListRoutes = require('express-list-routes'); // sets up express

// grabs routers 
const authRouter = require('./routes/auth_router');
const userRouter = require('./routes/user_router');

// makes sure the app is using imported routes/utilities
app.use('/', express.static('./public/dist')); // for potential deployment
app.use(express.json()); 
app.use(errorHandler);
app.use(authRouter);
app.use(userRouter);
expressListRoutes(app);

// catch-all route to handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/dist', 'index.html'));
});

// initialize Socket.IO and allow CORS for Vite frontend
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173", // for testing
    origin: "https://securechatapp-oiky.onrend/er.com/", // for deployment
    methods: ["GET", "POST"]
  }
});

// import and use socket logic
require('./utils/socket')(io);

// start the server
server.listen(port, () => {
  console.log('server + socket listening on port', port);
});
