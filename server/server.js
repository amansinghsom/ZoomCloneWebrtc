const express = require('express');
const app  =express();
const Server = require('http').createServer(app);
const PORT = 5000;
const io = require('socket.io')(Server,{
    cors:{
        origin:"*"
    }
})
const users={}

io.on("connection",(socket)=>{
    console.log(`users`) 
    console.log(users)
    if(!users[socket.id]){
        users[socket.id] = socket.id;
    }
    io.sockets.emit('allusers',users)
    console.log(users)
    socket.emit("myid",socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-left');
        delete users[socket.id];
        // socket.broadcast.emit('allusers',users)

    });
    socket.on('user:signal',(data)=>{
        const {signal,from,to} = data;
        socket.to(to).emit('useroffer',{signal,from})
    })
    socket.on('callAccepted',({signal,to})=>{
        socket.to(to).emit('callAccpected',signal);
    })
})

Server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})
