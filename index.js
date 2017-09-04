const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const path=require('path');

const verificationController = require('./controllers/verification');

const messageWebhookController = require('./controllers/messageWebhook');

app.use(express.static(path.join(__dirname,'www/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', verificationController);

app.post('/', messageWebhookController);

app.get('/webview', (req,res)=>{
    res.sendFile(path.join(__dirname,'www/index.html'));
});


let port = process.env.PORT || 5000;

app.listen(port, () => console.log('Webhook server is listening, port 5000'));