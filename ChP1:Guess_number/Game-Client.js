const netClient = require('net').connect({port: 25556})
const jmpTemplate = require('./lib/JMPTemplate')

class JMPClient extends jmpTemplate{

    constructor(stream){
        super(stream)
        this.stream = stream

        // Запоминаем диапозон и делаем строку
        const range_start = process.argv[2]
        const range_end = process.argv[3]
        const range_string = `${range_start}-${range_end}`

        //Загадываем число в диапозоне
        this.guessed_number = Math.floor(Math.random()*(range_end-range_start+1) + range_start)

        this.msgSend({"range":range_string})

        super.on('message', msg => {
            this.msgReceived(msg)
        })
    }

    msgReceived(msg){
        //получаем ответ сервера
        let s_number = msg.answer
        
        //создаем ответ клиента
        let cl_answer = {}

        if (s_number == this.guessed_number) {
            //игра закончилась
            cl_answer = {'victory': this.guessed_number}
            console.log(cl_answer)
        } else if (s_number > this.guessed_number) {
            //ответ меньше
            cl_answer = {'hint': 'less'}
        } else {
            //ответ больше
            cl_answer = {'hint': 'more'}
        }

        this.msgSend(cl_answer)
    }

    msgSend(msg){
        this.stream.write(`${JSON.stringify(msg)}\n`)
    }
}

jmpClient = new JMPClient(netClient)