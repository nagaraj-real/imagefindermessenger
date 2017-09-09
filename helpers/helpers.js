const actionHelpers = require('./actionHelpers');
const apiFunctionHelpers = require('./apiFunctionHelpers');
const { selectMovieFallbackAction, sendWelcomeMessageAction, imageUpload, 
    sendPhotoText, sendPhotoTitle,sendSimilarImages,sendWebEntities } = actionHelpers;

let imagedata = null;

const processAction = (action, senderId, params, userInfo, payload) => {

    switch (action) {
        case 'FACEBOOK_WELCOME': sendWelcomeMessageAction(senderId, userInfo);
            break;
        case 'PHOTO_TITLE': sendPhotoTitle(senderId);
            break;
        case 'PHOTO_TEXT': sendPhotoText(senderId);
            break;
        case 'PHOTO_SIMILAR': sendSimilarImages(senderId);
            break;
        case 'PHOTO_WEB_TITLE': sendWebEntities(senderId);
            break;
        default: selectMovieFallbackAction(senderId);
    }

}


const processMessage = (event, userInfo) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const attachments = event.message.attachments;

    if (attachments && attachments.length > 0 && attachments[0].type === 'image') {
        imageUpload(senderId, attachments[0].payload.url);
    } else {
        selectMovieFallbackAction(senderId);
    }
};



const processPostback = (event, userInfo) => {
    const senderId = event.sender.id;
    let payload = {};
    try {
        payload = JSON.parse(event.postback.payload);
    } catch (e) {
        payload[event.postback.payload] = null;
    }
    const title = event.postback.title;
    const action = Object.keys(payload)[0];
    processAction(action, senderId, null, userInfo, payload);
}

const processQuickLink = (event, userInfo) => {
    const senderId = event.sender.id;
    const quickreply = event.message.quick_reply;
    let payload = {};
    try {
        payload = JSON.parse(quickreply.payload);
    } catch (e) {
        payload[quickreply.payload] = null;
    }
    const action = Object.keys(payload)[0];
    processAction(action, senderId, null, userInfo, payload);
}


module.exports = {
    processMessage: processMessage,
    processPostback: processPostback,
    processQuickLink: processQuickLink
}