const netServer = require('net')
const jmpTemplate = require('./lib/JMPTemplate')

class JMPServer extends jmpTemplate{

    left
    right
    middle

    constructor(stream){
        super(stream)
        this.stream = stream

        super.on('message', msg => {
            this.msgReceived(msg)
        })

    }

    msgReceived(msg){
        if ('range' in msg){
            this.getRange(msg)
        } else if ('hint' in msg){
            this.guessNumber(msg)
        } else {
            console.log(`Загаданное число - ${this.middle}`)
        }
    }

    msgSend(msg){
        this.stream.write(`${JSON.stringify(msg)}\n`)
    }

    getRange(msg){
        //Получаем данные от клиента
        //Парсим, разделяем строку, преобразуем границы диапозона в числа
        const range = msg.range.split('-').map(Number)

        //Разделяем границы в разные переменные
        this.left = range[0]
        this.right = range[1]
        this.binarySearch()
    }

    guessNumber(msg){
        //управляем бинарным поиском
        const hint = msg.hint

        if (hint == 'more'){
            //Число больше -> сдвигаем левую границу
            this.left = this.middle + 1
        } else {
            //Число меньше -> сдвигаем правую границу
            this.right = this.middle - 1
        }

        this.binarySearch()
    }

    binarySearch(){
        
        this.middle = Math.floor((this.left + this.right) / 2)

        //Проверки границ не будет. Знаем, что клиент точно загадал число
        //А не водит нас за нос

        this.msgSend({'answer': this.middle})
    }

}

const server = netServer.createServer(cnn=>{

    jmpServer = new JMPServer(cnn)

})

server.listen(25556, console.log("Готов к игре..."))
