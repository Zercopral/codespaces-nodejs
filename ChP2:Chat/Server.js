const express = require('express')

const app = express()

const io = require('socket.io')(app.listen(6000))

app.get('/', (request, response) => 
    response.sendFile(__dirname + '/Client.html'));

app.use(express.static(__dirname + ''));

io.sockets.on('connection', client => {
    console.log('Кто-то присоединился')
    client.emit('public_chat_info', 'Ты первый!')
});

