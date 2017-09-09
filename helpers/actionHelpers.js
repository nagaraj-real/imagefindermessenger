const apiFunctionHelpers = require('./apiFunctionHelpers');

const { listElements, sendTemplate, sendTextMessage, sendAttachments, getImageDetails, download } = apiFunctionHelpers;

const photoTitlePayload = JSON.stringify({ PHOTO_TITLE: null });
const photoTextPayload = JSON.stringify({ PHOTO_TEXT: null });
const photoSimilarPayload = JSON.stringify({ PHOTO_SIMILAR: null });
const photoWebTitlePayload = JSON.stringify({ PHOTO_WEB_TITLE: null });

const init_quick_replies = [
    {
        content_type: "text",
        title: "What is this",
        payload: photoTitlePayload
    },
    {
        content_type: "text",
        title: "Web Info",
        payload: photoWebTitlePayload
    },
    {
        content_type: "text",
        title: "Extract text",
        payload: photoTextPayload
    },
    {
        content_type: "text",
        title: "Similar Photos",
        payload: photoSimilarPayload
    }

]

let imgData = null;

function selectMovieFallbackAction(senderId) {

    if (imgData) {
        sendTextMessage(senderId, `Sorry what did you mean? Please select any of the options below for your uploaded pic.`, init_quick_replies)
    } else {

        sendTextMessage(senderId, `Sorry I didn't understand. Please upload any photo to proceed`)
    }
}

function sendPhotoTitle(senderId, data) {
    getImageDetails((res, err, data) => {
        if (data.responses && data.responses.length > 0) {
            response = data.responses;
            if (response) {
                var anns = response[0];
                if (anns.labelAnnotations && anns.labelAnnotations.length > 0) {
                    let testresult = '\n';
                    anns.labelAnnotations.forEach(function (label, index) {
                        if (index < 5) {
                            testresult = testresult + `${index + 1} : ${label.description} \n`;
                        }
                    });
                    const text = `I think this could be any of the folowing - ${testresult}`;
                    sendTextMessage(senderId, text, init_quick_replies.filter(p => p.payload !== photoTitlePayload));
                } else {
                    sendTextMessage(senderId, `Sorry,no Info found`, init_quick_replies.filter(p => p.payload !== photoTitlePayload));
                }
            }
        }

    }, imagedata, 'LABEL_DETECTION');
}

function sendSimilarImages(senderId) {
    getImageDetails((res, err, data) => {
        if (data.responses && data.responses.length > 0) {
            response = data.responses;
            if (response) {
                var anns = response[0];
                if (anns.webDetection.partialMatchingImages && anns.webDetection.partialMatchingImages.length > 0) {
                    anns.webDetection.partialMatchingImages.forEach(function (image, index) {
                        if (index < 5) {
                            sendAttachments(senderId, image.url, 'image')
                        }

                    });

                } else {
                    sendTextMessage(senderId, `Sorry,no Images found`, init_quick_replies.filter(p => p.payload !== photoSimilarPayload));
                }
            }
        }
    }, imagedata, 'WEB_DETECTION');
}

function sendWebEntities(senderId) {
    getImageDetails((res, err, data) => {
        if (data.responses && data.responses.length > 0) {
            response = data.responses;
            if (response) {
                var anns = response[0];
                if (anns.webDetection.webEntities && anns.webDetection.webEntities.length > 0) {
                    let testresult = '\n';
                    anns.webDetection.webEntities.forEach(function (entity, index) {
                        if (index < 5) {
                            testresult = testresult + `${index + 1} : ${entity.description} \n`;
                        }
                    });
                    const text = `According to web, this could be any of the folowing - ${testresult}`;
                    sendTextMessage(senderId, text, init_quick_replies.filter(p => p.payload !== photoWebTitlePayload));


                } else {
                    sendTextMessage(senderId, `Sorry,no Images found`, init_quick_replies.filter(p => p.payload !== photoWebTitlePayload));
                }
            }
        }
    }, imagedata, 'WEB_DETECTION');


}

function sendPhotoText(senderId) {
    getImageDetails((res, err, data) => {
        if (data.responses && data.responses.length > 0) {
            response = data.responses;
            if (response) {
                var anns = response[0];
                if (anns.fullTextAnnotation && anns.fullTextAnnotation.text) {
                    const text = anns.fullTextAnnotation.text;
                    sendTextMessage(senderId, text, init_quick_replies.filter(p => p.payload !== photoTextPayload));
                } else {
                    sendTextMessage(senderId, `Sorry,no Text found`, init_quick_replies.filter(p => p.payload !== photoTextPayload));
                }
            }
        }
    }, imagedata, 'TEXT_DETECTION');


}

function imageUpload(senderId, url) {
    download(url, function (data) {
        imagedata = data;
        sendTextMessage(senderId, `Thanks for uploading the pic. Please select any of the options below for your uploaded pic.`, init_quick_replies)
    });

}

function sendWelcomeMessageAction(senderId, userInfo) {
    sendTextMessage(senderId, `Hi ${userInfo.first_name}, I am Click bot. I can help you with information about any photo. Please upload a photo to continue.`)
}



module.exports = {
    selectMovieFallbackAction: selectMovieFallbackAction,
    sendWelcomeMessageAction: sendWelcomeMessageAction,
    sendPhotoTitle: sendPhotoTitle,
    sendPhotoText: sendPhotoText,
    imageUpload: imageUpload,
    sendSimilarImages: sendSimilarImages,
    sendWebEntities: sendWebEntities
}