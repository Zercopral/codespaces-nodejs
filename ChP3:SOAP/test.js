const soap = require('soap');
const wsdl = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';


async function getValutes(){
    const client = await soap.createClientAsync(wsdl, {connection: 'keep-alive'})

    // console.log(client)

    let result = await client.GetCursOnDateXMLAsync({On_date:"2023-12-29"})

    // while (!result[0]){
    //     // result = await client.GetCursOnDateXML({On_date:"2023-12-28T00:00:00"})
    //     console.log(result[0])
    // }

    return result[0].GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate

    //console.log(result[0].GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate)

    // return result.GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate
}

console.log(getValutes())

// console.log(getValutes())

// soap.createClientAsync(wsdl).then((err, client) => {
//     return err.GetCursOnDateXML({On_date:"2023-12-28T00:00:00"});
//   })
// // let Valuta = {data : ''}
// console.log("Начало")

// // class DataStack {}

// // DataStack.on("write", data=>{ Valuta = data})
// function AAaaaaaa() {

//     let Valuta = {data : ''}

//     soap.createClient(wsdl, (err, client) => {
//         if(err) console.log("У нас проблемы: ", err);
    
//         if(client) {


//             // console.log(client.describe());
//             // client.MyFunction({ name: 'IThub'}, (err, result) =>
//             // 	console.log("result: ", result));

//             client.GetCursOnDateXML({On_date:"2023-12-28T00:00:00"}, (err, result) => {
//             if (err) { console.log("У нас проблемы: ", err)}
//             else {
//                 // console.log(result.GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate)
//                 console.log("Запрос")
//                 Valuta.data = result.GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate
//                 // Data.emit("write", Valuta)
//                 // console.log(Valuta)
//             }})
//         }})
//     return Valuta
// }

// let Valuta = AAaaaaaa()

// console.log(Valuta)
// soap.createClient(wsdl, (err, client) => {
// 	if(err) console.log("У нас проблемы: ", err);
 
//  	if(client) {


//    		// console.log(client.describe());
//    		// client.MyFunction({ name: 'IThub'}, (err, result) =>
//        	// 	console.log("result: ", result));

//         client.GetCursOnDateXML({On_date:"2023-12-28T00:00:00"}, (err, result) => {
//         if (err) { console.log("У нас проблемы: ", err)}
//         else {
//             // console.log(result.GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate)
//             console.log("Запрос")
//             Valuta = result.GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate
//             Data.emit("write", Valuta)
//             // console.log(Valuta)
//         }})
    // return Valuta

        /* result
        [{
            Vname: 'Японская иена',
            Vnom: '100',
            Vcurs: '64.2868',
            Vcode: '392',
            VchCode: 'JPY',
            VunitRate: '0.642868'
        }
        ]
        */

        // client.EnumValutesXML({Seld:false}, (err, result) => {
        //     if (err) { console.log("У нас проблемы: ", err)}

        //     else {
        //         console.log(result.EnumValutesXMLResult.ValuteData.EnumValutes)

                /*

                [
                {
                    Vcode: 'R01820',
                    Vname: 'Японская иена',
                    VEngname: 'Japanese Yen',
                    Vnom: '100',
                    VcommonCode: 'R01820',
                    VnumCode: '392',
                    VcharCode: 'JPY'
                }
                ]

                */
        //     }
        // })

        // client.GetCursDynamicXML({FromDate:"2023-12-28T00:00:00",ToDate:"2023-12-29T00:00:00",ValutaCode:'R01820'}, (err, result) => {
        //     if (err) { console.log("У нас проблемы: ", err)}
        //     else {
        //         console.log(result.GetCursDynamicXMLResult.ValuteData.ValuteCursDynamic)
        //     }
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
        // })

        
//  	}
// });

// console.log(Valuta)
// console.log("Конец")