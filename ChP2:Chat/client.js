function SendMsg() {
    const msg = document.querySelector(".message")
    const text = msg.value
    msg.value = ''
    CreateMsg(text, 1)
}

const sbm_btn = document.querySelector(".submit")
sbm_btn.addEventListener("click", SendMsg)

const msg = document.querySelector(".message")
msg.addEventListener('keyup', function(event) {
    if (event.code == 'Enter') {
        SendMsg()
    }
  });

function CreateMsg(msg, owner){

    let msg_html
    if (owner == 1) { // Я = хозяин сообщения
        msg_html = document.getElementById('my_msg')
    } else {
        msg_html = document.getElementById('their_msg')
    }


    const template = document.importNode(msg_html.content, true)

    const p_html = document.createElement('p')
    p_html.innerHTML = msg

    template.querySelector('div').append(p_html)

    const chat_content_messages = document.querySelector('.chat_content_messages')

    chat_content_messages.append(template)

}

socket.on('public_chat_info', data => {
    CreateMsg(data, 0)
})
