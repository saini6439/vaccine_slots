const request = require('request');
const express = require('express')
const app = express()
var http = require('http');
var port = process.env.PORT || 3000;

var nowDate = new Date(); 
var month = (nowDate.getMonth()+1)
if(month<10)
{
    month="0"+month
}

var pincode = 303303

const accountSid = "AC841a66574bf4237482cde08206fb173e";
const authToken = "8bd3a98131017457457eee942e051f94";
const client = require('twilio')(accountSid, authToken);



function api_call(){
   // console.log("API call after 60 sec")
    for(let j=0;j<2;j++){
        var day =  nowDate.getDate()+j;
        var date = day+'-'+month+'-'+nowDate.getFullYear(); 
        //console.log(date);
        request(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`, function (error, response, body) {
            //console.log('body:', JSON.parse(body)['sessions'][0]['min_age_limit']); // Print the HTML for the Google homepage.
            var json_body=JSON.parse(body)['sessions'];
            //console.log(json_body)
            for(let i=0;i<json_body.length;i++){
                var available_capacity=json_body[i]['available_capacity']
                var date = json_body[i]['date']
                var name = json_body[i]['name']
                var slots = json_body[i]['slots']
                var vaccine = json_body[i]['vaccine']
                //console.log(`${i}: center name: ${name}\n date : ${date}\n available_capacity : ${available_capacity}\n vaccine name : ${vaccine}\n avilable slots : ${slots}`)
                //console.log(client)
                
                if(json_body[i]['min_age_limit']!=45){
                    
                    console.log("into 45",date);
                  client.messages
                  .create({
                      body: `${i}: center name: ${name}\n date : ${date}\n available_capacity : ${available_capacity}\n vaccine name : ${vaccine}\n avilable slots : ${slots}`,
                      from: '+15103437363',
                      to: '+917792839346'
                  })
                  .then(message => console.log(message.sid)).catch(err => console.log(err));
                }
          
          
              }
          });
    }
    setTimeout(api_call, 30000);

}

api_call();


app.get('/', function(req, res){
    res.send("Hello world!");
 });
 


 http.createServer(app).listen(port);
