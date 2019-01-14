'use strict'

// Importing dependencies
const express = require('express')
const bodyParser = require('body-parser')
const request=require('request')
const app = express()


// Facebook tokens
const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN


// Setting server port 
app.set('port',(process.env.PORT))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Setting route
app.get('/', function(req, res){
  res.send("Hello, I am spaceFeX chat-bot");
});


// Creating the endpoint for the webhook
app.get('/webhook/', function(req, res){
  if(req.query['hub.verify_token'] === token){
    res.send(req.query['hub.challenge'])
  }
  res.send("wrong token")
});


// firing up server
app.listen(app.get('port'), function(){
  console.log("running: port")
});


// Adding support for GET requests to the webhook
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        
        switch(text){
            case "hello":
            sendTextMessage(sender, "Hello, Welcom to the spaceFeX, Please refer to spaceFeX manual to be able to chat with me about spaceEagle engine statuses");
            break;

            case "engine1":
            sendTextMessage(sender, "engine 1 ok ");
            break;

            case "engine2":
            sendTextMessage(sender, "engine 2 operationg at 55% capacity ");
            break;

            case "engine3":
            sendTextMessage(sender, "engine 3 is dead");
            break;

            case "engine4":
            sendTextMessage(sender, "engine 4 operationg at 20% capacity");
            break;

            default:
            sendTextMessage(sender, "Please refer to spaceFeX manual to be able to chat with me about spaceEagle engine statuses.");
        }
      };

      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  });


// Handling messages events
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:access},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
};
