const express = require('express')
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const ACTIONS = require('./src/Actions');

// create express app
const app = express();
// create express server
const server = http.createServer(app);

// create socket server
const io = new Server(server);


app.use(express.static('build'));
app.use((req,res,next)  => {
    res.sendFile(path.join(__dirname,'build','index.html'))
})

// mapping betn socket id and username
const userSocketMap = {};

function getAllConnectedClients(roomId){
    // datatype = Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    });
}
// when any socket is connected to this server, this connection event will be triggered - run callback fn
io.on('connection',(socket)=>{
    // console.log('socket connected',socket.id);

    socket.on(ACTIONS.JOIN,({roomId, username}) =>{
        userSocketMap[socket.id] = username;

        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // console.log(clients);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId: socket.id,
            });
        })
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        // console.log('recieving',code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{
            code,
        });
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        // console.log('recieving',code);
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{
            code,
        });
    })

    socket.on('disconnecting',() => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
})