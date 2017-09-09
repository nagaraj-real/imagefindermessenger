const FACEBOOK_ACCESS_TOKEN = 'EAAMI6ZB6sMu8BADwId6AoZApSxzo7VX7IEEkLQu6r7e7WCRVQvruZAsLkId4HwQQ6GaivOz42WsicjA9OI0F1ZBYSuV6bLGO17XJyBwVPW4DZA5098jQAPwMuuV8GMjgC7ZBeZAZBo2MufRKkDLegH3B3BOX73BUZABaFKqmiHdNrhQZDZD';

const request = require('request');

const GOOGLE_ACCESS_TOKEN = 'AIzaSyDxFwi3SlsxYpxFWr6O4UCA23fhDecv-KI'

const googleVisionApi = `https://vision.googleapis.com/v1/images:annotate`;

const googleBucketApi = 'https://www.googleapis.com/upload/storage/v1/b/imagefinderbucket/o';


const CAT_IMAGE_URL = 'https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg';

function download(url, callback) {
    request(url, { encoding: 'base64' }, function (err, resp, body) {
        callback(body);
    })
}


function getImageDetails(callback, imageUrl,detection) {
    request({
        url: googleVisionApi,
        qs: { key: GOOGLE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            requests: [
                {
                    image: {
                        content: imageUrl
                    },
                    features: [
                        {
                            type: detection
                        }
                    ],
                    imageContext: {
                        languageHints: []
                    }
                }
            ]
        }
    }, callback);

}

function uploadImage(callback, imageUrl, imgbody) {
    const token = GOOGLE_ACCESS_TOKEN;
    request({
        url: googleBucketApi,
        headers: {
            'Content-Type': 'image/jpeg',
            'Authorization': token
        },
        qs: {
            uploadType: 'media',
            name: 'test'
        },
        json: imgbody,
        method: 'POST'
    }, callback);

}

function listElements(title, subtitle, image_url, buttons, default_action) {
    this.title = title;
    this.subtitle = subtitle;
    this.image_url = image_url;
    this.buttons = buttons;
    this.default_action = default_action;
}

sendAttachments = (senderId, imageUri, type) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: type,
                    payload: { url: imageUri }
                }
            }
        }
    });
}

sendTemplate = (senderId, payload, callback) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: "template",
                    payload: payload
                }
            }

        }
    }, callback);
}

sendTextMessage = (senderId, text, quick_replies, callback) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: text,
                quick_replies: quick_replies
            }
        }
    }, callback);
}

module.exports = {
    listElements: listElements,
    sendAttachments: sendAttachments,
    sendTemplate: sendTemplate,
    sendTextMessage: sendTextMessage,
    getImageDetails: getImageDetails,
    uploadImage: uploadImage,
    download: download
}


