const soap = require('soap');
const wsdl = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';

class SOAP_Client{

    soap_client_cns

    constructor(soap, wsdl){

        this.soap = soap
        this.wsdl = wsdl
        
    }

    async createSOAPClient(){
        return await this.soap.createClientAsync(this.wsdl, {connection: 'keep-alive'})
    }
    
    currentDate(){

        const date = new Date();

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return [year, month, day].join('-');
        
    }

    fromDateToDate(data){

        const date = new Date(data);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return [year, month, day].join('-');
        
    }

    async getValutes(){

        const client = await this.soap.createClientAsync(this.wsdl, {connection: 'keep-alive'})
        // this.soap.createSOAPClient(this.wsdl)

        let result_EnumValutes = await client.EnumValutesXMLAsync({Seld:false})
        result_EnumValutes = result_EnumValutes[0].EnumValutesXMLResult.ValuteData.EnumValutes

        let result_GetCursOnDate = await client.GetCursOnDateXMLAsync({On_date:this.currentDate()})
        result_GetCursOnDate = result_GetCursOnDate[0].GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate

        // Vname, Vcode, Vcurs
        // {"code": "R01010", "name": "Австралийский доллар", "value": 16.0102}

        let output_json = []

        result_GetCursOnDate.array.forEach(element => {

            const elVname = element.Vname
            let elVcode = ''

            for(let i = 0; i < result_EnumValutes.array.length; i++){
                let enumV = result_EnumValutes[0]
                if (enumV.Vname == elVname) {
                    elVcode = enumV.Vcode
                    result_EnumValutes.splice(i, 1)
                    break
                }
            }

            output_json.push({"code":elVcode,"name":elVname,"value":element.Vcurs})
            
        });

        return JSON.stringify(output_json)
    }

    async getValute(ValutaCode, FromDate, ToDate){

        const client = await this.soap.createClientAsync(this.wsdl, {connection: 'keep-alive'})

        let result_EnumValutes = await client.GetCursDynamicXMLAsync({FromDate:FromDate,ToDate:ToDate,ValutaCode:ValutaCode})

        result_EnumValutes = result_EnumValutes[0].GetCursDynamicXMLResult.ValuteData.ValuteCursDynamic
        /* result
            [
                {
                    CursDate: '2023-12-28T00:00:00+03:00',
                    Vcode: 'R01820',
                    Vnom: '100',
                    Vcurs: '64.2868',
                    VunitRate: '0.642868'
                },
                {
                    CursDate: '2023-12-29T00:00:00+03:00',
                    Vcode: 'R01820',
                    Vnom: '100',
                    Vcurs: '63.7516',
                    VunitRate: '0.637516'
                }
            ]
            */

        // {"date": "01.03.2023", "value": 50.4031}
        let output_json = []

        result_EnumValutes.forEach(elem => {
            output_json.push({"date":this.fromDateToDate(elem.CursDate), "value":elem.Vcurs})
        })

        return JSON.stringify(output_json)

    }          
}

const soap_client = new SOAP_Client(soap, wsdl)

// Описание веб-службы
const myService = {
    ProxyServer: {
         MyPort: {
            getValutes: async function() {
                return {
                    Valutes: await soap_client.getValutes()
                };
            },
            getValute: async function(args) {
                 return {
                    Valute: await soap_client.getValute(args.ValutaCode, args.FromDate, args.ToDate)
                 };
             }
         }
     }
};

const http = require('http');

// Загрузка WSDL
const wsdl_proxy = require('fs').readFileSync('proxyserver.wsdl', 'utf8');

// Создание SOAP-сервера
const server = http.createServer((request, response) => 
	response.end('404: Not Found'));

server.listen(8000);

soap.listen(server, '/', myService, wsdl_proxy, () => 
   console.log('Сервер запущен'));



// // console.log(Date())
// // console.log(Date().toISOString())