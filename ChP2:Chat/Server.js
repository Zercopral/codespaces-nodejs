const express = require('express')

const app = express()

const io = require('socket.io')(app.listen(6000))

app.get('/', (request, response) => 
    response.sendFile(__dirname + '/Client.html'));

app.use(express.static(__dirname + ''));

const system_msg_color = '#ba3c3c'

let users_list = []

io.sockets.on('connection', client => {
    console.log('Кто-то присоединился')

    client.on('new_client', data => {
        console.log('Новый пользователь: ' + data.name + '. Цвет его сообщений: ' + data.color)
        client.broadcast.emit('get_system_msg', {'msg':'К нам присоединился ' + data.name, 'color':system_msg_color})
        // Добавить внутренюю регистрацию пользователя

        let str = ''

        if (users_list.length) {

            users_list.forEach((user) =>
            {
                str += user.name + ', '
                console.log('forEach: ' + user.name)
            })

            str = str.slice(0, -2)

            str = 'Добро пожаловать! В чате уже присутствуют: ' + str + '.'

        } else {

            str = 'Ты первый!'

        }
        
        client.emit('get_system_msg', {'msg':str, 'color':system_msg_color})
        client.broadcast.emit('addUser', {'id':client.id,'name':data.name})

        users_list.push({'id':client.id,'name': data.name, 'color': data.color})

    })

    client.on('disconnect', () => {
        if (users_list){
            let id = client.id
            let user_index = -1

            users_list.forEach((user, index) => {
                if(user.id == id){
                    user_index = index
                }
            })

            if (user_index != -1) {
                str = users_list[user_index].name + ' нас покинул.'
                console.log(str)
                client.broadcast.emit('get_system_msg', {'msg':str, 'color':system_msg_color})
                client.broadcast.emit('deleteUser', {'id':id})
                users_list.splice(user_index, 1)
            }
        }
    });

    client.on('msg_public', data => {
        console.log(data.from_user + ': ' + data.msg)
        client.broadcast.emit('get_public_msg', data)
    })
});


