const http = require('http');
const {Server} = require('socket.io')
const fs = require("fs");
const port = 8000;

const server  = http.createServer((req, res) => {
    if (req.url == '/') {
        fs.readFile('./templates/index.html', 'utf8', (err, data) => {
            res.write(data)
            res.end();
        })
    }
})

const io = new Server(server);

io.on('connection', (socket) => {
    let nameUser = ''

    socket.on('user-joined', (name) => {
        nameUser = name
    })

    socket.on('btn-click', (data) => {
        let message = data.name + " " + data.message
        io.emit('say-message', message)
    })

    socket.on('disconnect', () => {
        let message = nameUser + " disconnected"
        socket.broadcast.emit('user-disconnect', message)
    })
})

server.listen(port, 'localhost', () => {
    console.log('server listening on http://localhost:' + port)
})
