const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors())

// =========================================
// http web endpoints
// =========================================
app.get('/', (req, res) => {
  res.json({ username: 'Flavio' })
});

// =========================================
// Web Namespace
// =========================================
io.of("/web").on('connection', (socket) => {
  
  console.log('web app connected');

  socket.on("joint_states", data => {
    io.of("/delta").emit("joint_states", data)
  })

  socket.on('disconnect', function (msg) {
    console.log('🔥: A web app disconnected');
    socket.disconnect()
  });
});

// =========================================
// Delta Namespace
// =========================================
io.of("/delta").on('connection', (socket) => {

  console.log('a robot connected the delta namespace');

  socket.on("status", data => {
    console.log("status Received!")
    io.of("/web").emit("status", data)
  })

  socket.on('disconnect', function (msg) {
    console.log('🔥: A robot disconnected');
    socket.disconnect()
  });

});


// =========================================
// SocketIO endpoints
// =========================================
io.on('connection', function (socket) {

  console.log('user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});

// =========================================
// Start Server
// =========================================
http.listen(5001, () => {
  console.log('listening on *:5001');
});