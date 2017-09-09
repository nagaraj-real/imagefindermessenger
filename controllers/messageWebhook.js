const helpers = require('../helpers/helpers');
const FACEBOOK_ACCESS_TOKEN = 'EAAMI6ZB6sMu8BAM2YcZC0OO37P6HLJB3DnMczazZCYiCl6QIAr088D7dZAZCoQwfMFBhXefRcDE0ZAk52QWknuCqLk03LH6RFTA9ZBLdTlqZCZALIiJ6igW3XCQDfUwKQNplj4buBu7qqkWpKLPbMgW1YOKkeHEzBg60wON2L5uSKTgZDZD';

const request = require('request');
let userInfo=null;


const {processMessage,processPostback,processQuickLink}=helpers;

const getUserInfo = (userid, callback) => {
    request({
        url: `https://graph.facebook.com/v2.6/${userid}`,
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'GET'
    }, callback);
}

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if(event.message.quick_reply){
                    if (!userInfo) {
                        getUserInfo(event.sender.id, (err, response, body) => {
                            userInfo = JSON.parse(body);
                            processQuickLink(event,userInfo);
                        });
                    } else {                       
                         processQuickLink(event,userInfo);
                    }
                }else if (event.message && (event.message.text || event.message.attachments)) {
                    if (!userInfo) {
                        getUserInfo(event.sender.id, (err, response, body) => {
                            userInfo = JSON.parse(body);
                            processMessage(event,userInfo);
                        });
                    } else {                       
                         processMessage(event,userInfo);
                    }
                }else if(event.postback){
                    if (!userInfo) {
                        getUserInfo(event.sender.id, (err, response, body) => {
                            userInfo = JSON.parse(body);
                            processPostback(event,userInfo);
                        });
                    } else {                       
                         processPostback(event,userInfo);
                    }
                }
            });
        });

        res.status(200).end();
    }
};