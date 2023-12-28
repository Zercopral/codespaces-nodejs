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
        this.socket.on('addOnlineUsers', data => this.addUsers(data))
        this.socket.on('deleteUser', data => this.deleteUser(data))

        // Добавляем себя в список пользователей
        this.addUser({'id': 'current_user', 'name': 'Я (' + name + ')'})

    }

    // Функция инициализации клиента на сервере
    initClientonServer(){
        this.socket.emit('new_client', {'name': this.name, 'color': this.color})
    }

    // Функция отправки сообщения
    sendMsg(msg, private_type = false, user = null){
        if (msg){ // Если сообщение существует

            if (private_type) { 
                // Если сообщение личное другому пользователю

                // Отправляем сообщение и сопутствующую информацию на сервер
                this.socket.emit('msg_private', {'msg':msg, 'from_user': this.name, 'for_user': user})
                
                // Отрисовываем сообщение в чате
                CreateMsg('my_private_msg', msg, this.color, this.getUserNameById())

            } else {
                // Если сообщение публичное (всем пользователем)

                // Отправляем сообщение и сопутствующую информацию на сервер
                this.socket.emit('msg_public', {'msg':msg, 'from_user': this.name})

                // Отрисовываем сообщение в чате
                CreateMsg('my_msg', msg, this.color, this.name)
            }
        } 
    }

    // Функции обработки получения сообщений
    receivePublicMsg(data) {
        CreateMsg('public_msg', data.msg, data.color, data.from_user)
    }

    receivePrivateMsg(data) {
        CreateMsg('private_msg', data.msg, data.color, data.from_user)
    }

    receiveSystemMsg(data) {
        CreateMsg('system', data.msg, data.color)
    }

    // Функции списка пользователей
    
    // Функция добавления одного пользователя в список пользователей
    addUser(data){

        // Добавлем пользователя в левый список

        let users_list = document.querySelector('.users_list')
        let li_p = users_list.querySelector('li > p')

        if (li_p) {
            li_p.parentNode.remove()
        }

        let li = document.createElement('li')
        li.id = data.id
        li.textContent = data.name

        users_list.append(li)

        
        // Добавлем пользователя в выпадающий список

        let for_user_list = document.querySelector('#for_user_list')
        let list_option = document.createElement('option')

        if (data.id != 'current_user') {
            // Если добавлем в список другого пользователя

            list_option.value = data.id
            list_option.innerHTML = data.name

        } else {
            // Если добавлем в список текущего пользователя
            // Добавлем вариант отправки сообщения всем

            list_option.value = 'all'
            list_option.innerHTML = 'Всем'
            list_option.selected

        }

        for_user_list.append(list_option)

    }

    // Функция добавления списка пользователей в список пользователей
    addUsers(data) { data.forEach((user) => { this.addUser(user) }) }

    // Функция удаления пользователя из списков
    deleteUser(data){

        // Удаляем пользователя из списка пользователей
        document.querySelector('.users_list').querySelector('#'+data.id).remove()

        // Удаляем пользователя из выпадающего списка пользователей
        document.querySelector('#for_user_list').querySelector('option[value="'+ data.id +'"]').remove()
    }

    // Функция получения id пользователя
    getUserNameById(){ return document.getElementById(selected_user).innerHTML }

}

// Чтобы js не ругался
let client

window.onunload = () => socket.disconnect()

// При загрузке страницы
window.addEventListener('load', (event) => {
    // Спрашиваем имя и люимый цвет клиента
    let name = prompt('Как тебя зовут?', 'Гость')
    let color = prompt(name + ', какой цвет тебе нравится?', '#000000')

    // Создаем новый объект класса
    client = new Client(socket, name, color)

    // Помечаем цвет сообщений клиента
    document.querySelector('.circle1').style.backgroundColor = color
})

// Добавление функционала выбора пользователя из выпадающего списка
let for_user_list = document.querySelector('select')
let selected_user = 'all'
for_user_list.addEventListener('change', () => { selected_user = for_user_list.value });

// Функция обработки отправления сообщения
function SendMsg() {
    
    // Выбираем поле ввода текста
    const msg = document.querySelector(".message")

    // Получаем текст сообщения
    const text = msg.value

    // Очищаем поле ввода текста
    msg.value = ''
    
    // Если в выпадающем списке выбран вариант "Всем"
    if (selected_user == 'all'){
        client.sendMsg(text)
    }
    // Если в выпадающем списке выбран вариант конкретный ползователь
    else {
        client.sendMsg(text, true, selected_user)
    }
        
}

// Добавление функционала отправки сообщения по кнопке "Отправить"
const sbm_btn = document.querySelector(".submit")
sbm_btn.addEventListener("click", SendMsg)

// Добавление функционала отправки сообщения по нажатию на "Enter"
const msg = document.querySelector(".message")
msg.addEventListener('keyup', function(event) {if (event.code == 'Enter') { SendMsg() }});

// Функция отрисовки сообщения в чате
function CreateMsg(type = 'my', msg, color, user = null){
    
    if (type != 'system') {

        // Находим шаблон сообщения
        let msg_html = document.getElementById(type)

        // Импортируем шаблон в файл
        const template = document.importNode(msg_html.content, true)

        // Вписываем наше имя или имя другого пользователя
        template.querySelector('.name_user').textContent = user

        // Указываем текст сообщения и его цвет
        template.querySelector('.text_msg').textContent = msg
        template.querySelector('.text_msg').style.color = color

        // Выбираем тег содержимого чата
        const chat_content_messages = document.querySelector('.chat_content_messages')

        // Добавляем сообщение в содержимое чата
        chat_content_messages.append(template)

    } else {
        // Если сообщение системное

        // Создаем тег абзаца
        const p_html = document.createElement('p')

        // Вписываем текст сообщения и его цвет
        p_html.innerHTML = msg
        p_html.style.color = color

        // Выбираем тег содержимого чата
        const chat_content_messages = document.querySelector('.chat_content_messages')

        // Добавляем сообщение в содержимое чата
        chat_content_messages.append(p_html)
    }
}