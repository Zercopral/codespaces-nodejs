const express = require('express')

const app = express()

const io = require('socket.io')(app.listen(6000))

app.get('/', (request, response) => 
    response.sendFile(__dirname + '/Client.html'));

// Для работы статических файлов
app.use(express.static(__dirname + ''));

// Цвет системных сообщений на стороне клиента
const system_msg_color = '#ba3c3c'

// Массив пользователей
let users_list = []

io.sockets.on('connection', client => {

    console.log('Кто-то присоединился')

    client.on('new_client', data => {
        // Инициализация новго клиента

        console.log('Новый пользователь: ' + data.name + '. Цвет его сообщений: ' + data.color)

        // Говорим всем. что пришел новый пользователь
        client.broadcast.emit('get_system_msg', {'msg':'К нам присоединился ' + data.name, 'color':system_msg_color})
        client.broadcast.emit('addUser', {'id':client.id,'name':data.name}) //Добавляем пользователя в обновляемый список клиентов

        let str = '' // Создание приветственной строки
        let users_online = [] // Создание списка текущих пользователей

        // Если есть другие клиенты
        if (users_list.length) {

            users_list.forEach((user) =>
            {
                str += user.name + ', '
                users_online.push({'id':user.id,'name':user.name})
            })

            str = str.slice(0, -2)
            str = 'Добро пожаловать! В чате уже присутствуют: ' + str + '.'

        } else {
            str = 'Ты первый!'
        }
        
        // Приветствуемся с пользователем и если кто-то есть, перечисляем их имена
        client.emit('get_system_msg', {'msg':str, 'color':system_msg_color})
        client.emit('addOnlineUsers', users_online)

        users_list.push({'id':client.id,'name': data.name, 'color': data.color})

    })

    client.on('disconnect', () => {
        // Отсоединение клиента

        let id = client.id
        let user_index = -1

        // Находим индекс пользователя в массиве пользователей
        users_list.forEach((user, index) => {
            if(user.id == id){
                user_index = index
            }
        })

        // Если пользователь был (ну а мало ли)
        if (user_index != -1) {

            str = users_list[user_index].name + ' нас покинул.'
            console.log(str)

            // Удаляем информацию о пользователе из массива
            users_list.splice(user_index, 1)

            // Если есть кого уведомлять - уведомляем
            if (users_list){
                client.broadcast.emit('get_system_msg', {'msg':str, 'color':system_msg_color})
                client.broadcast.emit('deleteUser', {'id':id})
            }
        }

        
    });

    client.on('msg_public', data => {
        // Обработка сообщения для всех

        console.log(data.from_user + ': ' + data.msg)

        let user_color = null

        // Находим цвет пользователя в массиве пользователей
        users_list.forEach((user) => {
                if(user.id == client.id){
                    user_color = user.color
                }
            })
        
        
        data.color = user_color

        // Отправляем сообщение всем, кроме текущего клиента - текущий клиент уже отрисовал сообщение на своей стороне
        client.broadcast.emit('get_public_msg', data)
    })

    client.on('msg_private', data => {
        // Обработка приватного сообщения

        let user_id = data.for_user
        console.log('Личное сообщение для: ' + user_id)

        // Отправляем сообщение лично конкретному сокету по id
        io.to(user_id).emit('get_private_msg', data)
    })
});


