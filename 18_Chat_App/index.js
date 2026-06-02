const express = require('express')
const http = require('http')
const path = require('path')

const app = express()

const {Server} = require('socket.io')

app.use(express.static(path.resolve("./public")))

app.get("/", (req, res) => {
    return res.senFile('./public/index.html')
})

const server = http.createServer(app)

const io = new Server(server)

io.on('connection', (socket) => {
    // console.log(socket)
//    io.emit('user-message', socket)
    socket.on('user-message', (message) => {
        console.log(message)
        io.emit('message', message)
    })
})

server.listen(9000, () => console.log("server started at port 9000"))
