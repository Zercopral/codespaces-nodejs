class Client {
    name
    color
    socket

    constructor(socket, name, color) {
        this.socket = socket
        this.name = name
        this.color = color

        this.initClientonServer()

        // События сообщений
        this.socket.on('get_public_msg', data => this.receivePublicMsg(data))
        this.socket.on('get_private_msg', data => this.receivePrivateMsg(data))
        this.socket.on('get_system_msg', data => this.receiveSystemMsg(data))

        // События списка пользователей
        this.socket.on('addUser', data => this.addUser(data))
        this.socket.on('deleteUser', data => this.deleteUser(data))

        // Добавляем себя в список пользователей
        this.addUser({'id': 'current_user', 'name': 'Я (' + name + ')'})

    }

    initClientonServer(){
        this.socket.emit('new_client', {'name': this.name, 'color': this.color})
    }

    sendMsg(msg, private_type = false, user = null){
        if (msg){ // Если сообщение существует

            if (private_type) {  // Если сообщение личное другому пользователю

                this.socket.emit('msg_private', {'msg':msg, 'from_user': this.name, 'for_user': user})
                // CreateMsg('my_private')
            } else { // Если сообщение публичное (всем юзерам)

                this.socket.emit('msg_public', {'msg':msg, 'from_user': this.name})
                CreateMsg('my', msg, this.color, this.name)
            }
        } 
    }

    receivePublicMsg(data) {
        CreateMsg('public', data.msg, data.color, data.from_user)
    }

    receivePrivateMsg(data) {
        CreateMsg('user', data.msg, data.color, data.from_user)
    }

    receiveSystemMsg(data) {
        CreateMsg('system', data.msg, data.color)
    }

    // События списка пользователей
    addUser(data){

        console.log('Добавляю в список нового пользователя' + data.name)

        let chats_list = document.querySelector('.users_list')

        let li_p = chats_list.querySelector('li > p')

        if (li_p) {
            li_p.parentNode.remove()
        }

        let li = document.createElement('li')

        li.id = data.id
        li.textContent = data.name

        chats_list.append(li)


    }

    deleteUser(data){
        
        console.log('Удаляю пользователя ' + data.id + ' из списка')

        let chats_list = document.querySelector('.users_list')

        chats_list.querySelector('#'+data.id).remove()
    }
}

let client

window.onunload = () => socket.disconnect()

window.addEventListener('load', (event) => {
    let name = prompt('Как тебя зовут?', 'Гость')
    let color = prompt(name + 'какой цвет тебе нравится?', '#000000')

    client = new Client(socket, name, color)
})

function SendMsg() {
    const msg = document.querySelector(".message")
    const text = msg.value
    msg.value = ''
    // CreateMsg(text, 1)
    client.sendMsg(text)
}

const sbm_btn = document.querySelector(".submit")
sbm_btn.addEventListener("click", SendMsg)

const msg = document.querySelector(".message")
msg.addEventListener('keyup', function(event) {
    if (event.code == 'Enter') {
        SendMsg()
    }
  });

function CreateMsg(type = 'my', msg, color, user = null){
    
    console.log(type)

    if (type != 'system') {

        let msg_html

        if (type == 'my') { // Я = хозяин сообщения
            msg_html = document.getElementById('my_msg')

        } else if (type == 'public'){ // Публичное сообщение
            msg_html = document.getElementById('public_msg')

        } else if (type == 'private') { // Приватное сообщение
            msg_html = document.getElementById('private_msg')
        } else { // Приватное сообщение от меня
            msg_html = document.getElementById('my_private_msg')
        }


        const template = document.importNode(msg_html.content, true)

        template.querySelector('.name_user').textContent = user

        template.querySelector('.text_msg').textContent = msg
        template.querySelector('.text_msg').style.color = color

        const chat_content_messages = document.querySelector('.chat_content_messages')

        chat_content_messages.append(template)

    } else {
        const p_html = document.createElement('p')
        p_html.innerHTML = msg
        p_html.style.color = color

        const chat_content_messages = document.querySelector('.chat_content_messages')

        chat_content_messages.append(p_html)
        console.log(msg)
    }
}