const actionHelpers = require('./actionHelpers');
const apiFunctionHelpers = require('./apiFunctionHelpers');
const { selectMovieFallbackAction, sendWelcomeMessageAction } = actionHelpers;
const { sendTextMessage, sendAttachments, getImageDetails, uploadImage, download } = apiFunctionHelpers;


const processAction = (action, senderId, params, userInfo, payload) => {

    switch (action) {
        case 'input.welcome': sendAttachments(senderId, CAT_IMAGE_URL, 'image')
            break;
        case 'MOVIE_SEARCH_FALLBACK': selectMovieFallbackAction(senderId);
            break;
        case 'FACEBOOK_WELCOME': sendWelcomeMessageAction(senderId, userInfo);
            break;
        default: selectMovieFallbackAction(senderId);
    }

}


const processMessage = (event, userInfo) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const attachments = event.message.attachments;


    if (attachments && attachments.length > 0) {
        download(attachments[0].payload.url, function (data) {
            getImageDetails((res, err, data) => {
                console.log(data);
                if(data.responses && data.responses.length>0){
                    var anns=data.responses[0];
                    if(anns.labelAnnotations && anns.labelAnnotations.length>0){
                        const text=`I think this is ${anns.labelAnnotations[0].description}`;
                        sendTextMessage(senderId, text);
                    }
                }
                //sendAttachments(senderId, savedFileURL, attachments[0].type)
            }, data);

        });
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


module.exports = {
    processMessage: processMessage,
    processPostback: processPostback
}