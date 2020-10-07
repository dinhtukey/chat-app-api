const express = require("express");
const http = require('http');
const socketIO = require('socket.io')

const Rooms = require('./model/Room');
const rooms = new Rooms

const app = express();
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
  "Access-Control-Allow-Headers",
  "Authorization, X-Mashape-Authorization, Origin, X-Requested-With, Content-Type, Accept, token"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  next();
});
const server = http.createServer(app);
const io = socketIO(server);




io.on('connection',(socket)=>{
    console.log(`client id: ${socket.id} connected`);
    socket.on("INFO_FROM_CLIENT_TO_SERVER", (msg) => {
      const { name, room } = msg
      rooms.createUser(socket.id, name, room,new Date())
      socket.join(room)

      io.to(room).emit("USER_LIST", {
        users: rooms.getUserByRoom(room)
      })
      
      console.log(rooms.getUserByRoom(room));
      socket.emit("FROM_SERVER_TO_CLIENT", {
        from: "admin",
        text: "welcome to web chat",
        createdAt: new Date()
      })
      socket.broadcast.to(room).emit("FROM_SERVER_TO_CLIENT", {
        from: "admin",
        text: `${name} join web chat`,
        createdAt: new Date()
      })
      socket.on('FROM_CLIENT_TO_SERVER', (data) => {
        socket.broadcast.emit('FROM_SERVER_TO_CLIENT', data)
      })

      socket.on('LOCATION_FROM_CLIENT_TO_SERVER', (data) => {
        socket.broadcast.emit('LOCATION_FROM_SERVER_TO_CLIENT', data)
      })

      // socket.on('FROM_CLIENT_TO_SERVER_SEARCH_USER', (data) => {
      //   io.to(room).emit("SEARCH_USER", {
      //     users: rooms.getUserById(data.name)
      //   })
      // })
      
      socket.on('disconnect', () => {
        const removeUser = rooms.removeUser(socket.id);
        socket.broadcast.emit("FROM_SERVER_TO_CLIENT", {
          from: "admin",
          text: `${removeUser.name} left room`,
          createdAt: new Date()
        })
        console.log(`client id: ${socket.id} disconnected`);
      })
    })
})

const port = process.env.PORT || 3000
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})