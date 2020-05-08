// Update this constant with your ServiceNow credentials
const options = {
  url: 'https://dev60071.service-now.com/',
  username: 'admin',
  password: 'Ukv@tim123',
  serviceNowTable: 'change_request'
};


/**
 * Import the Node.js request package.
 * See https://www.npmjs.com/package/request
 */
const request = require('request');


// We'll use this regular expression to verify REST API's HTTP response status code.
const validResponseRegex = /(2\d\d)/;

// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js.
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

/**
 * @function mainOnObject
 * @description Instantiates an object from the imported ServiceNowConnector class
 *   and tests the object's get and post methods.
 */
function mainOnObject() {
  // Instantiate an object from class ServiceNowConnector.
  const connector = new ServiceNowConnector(options);
  // Test the object's get and post methods.
  // You must write the arguments for get and post.
  
  
//   connector.get((data, error) => {
   
//     if (error) {
//       console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
//     }
//     console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
//   }); 
   connector.post((data, error) => {
    if (error) {
      console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
    }else{
    //console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`)
       var jsonstring = JSON.stringify(data);
  
  
     let jsonObject =  JSON.parse(jsonstring);//eval('(' + jsonstring + ')');
    let jsonbodystirng = JSON.stringify(jsonObject.body);
    let jsonresultobj = JSON.parse(jsonObject.body);
    console.info("jsonresultobj::::::::::",jsonresultobj.result.number);   


let finalVar = {change_ticket_number: jsonresultobj.result.number,
                 active: jsonresultobj.result.number,
                 priority:jsonresultobj.result.priority,
                 description:jsonresultobj.result.description,
                 work_start:jsonresultobj.result.work_start,
                 work_end:jsonresultobj.result.work_end,
                 change_ticket_key:jsonresultobj.result.sys_id,
                }

console.info("finalVar:::::::",finalVar);
   }
  });



}



// Call mainOnObject to run it.
mainOnObject();