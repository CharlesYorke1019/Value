const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require('./models');
const controller = require('./controllers/controller');
const socketIo = require('socket.io');
const http = require('http');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    origin: 'exp://192.168.1.235:8081'
}));

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "exp://192.168.1.235:8081"
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 3 * 60 * 1000, // 3 minutes
        skipMiddlewares: true
    },
    pingInterval: 25000,
    pingTimeout: 100000
},);

const PORT = process.env.PORT || 5000;

const socketPORT = 8000;

// app.post('/register', controller.register);

// app.post('/login', )

app.post('/users', controller.createUser);

app.get('/users', controller.getUsers);

io.on('connection', (socket) => {

    console.log('connect');

    socket.on('register', async (userInfo) => {
        controller.register(socket, userInfo);
    })

    socket.on('logIn', async (userInfo) => {
        console.log(socket.handshake.headers);
        controller.logIn(socket, userInfo)
    })

})

db.sequelize.sync();

app.listen(PORT, () => {
    console.log(`Lets win some money fellas`)
});

server.listen(socketPORT, () => {
    console.log(``);
});