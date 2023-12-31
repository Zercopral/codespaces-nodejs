const soap = require('soap');
const wsdl = 'https://vigilant-journey-gpp6656wpvq29v5q-8000.app.github.dev/?wsdl';

soap.createClient(wsdl, (err, client) => {
	if(err) console.log("У нас проблемы: ", err);
 
 	if(client) {
   		// console.log(client.describe());
   		client.MyFunction({ name: 'IThub'}, (err, result) =>
       		console.log("result: ", result));
 	}
});