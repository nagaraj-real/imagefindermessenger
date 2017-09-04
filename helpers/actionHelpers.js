const apiFunctionHelpers = require('./apiFunctionHelpers');

const { listElements, sendTemplate, sendTextMessage, sendAttachments } = apiFunctionHelpers;

selectMovieFallbackAction = (senderId) => {
    let movieSearchPayload = JSON.stringify({ MOVIE_SEARCH: null });
    let movieDiscoverPayload = JSON.stringify({ MOVIE_DISCOVER: null });

    let quick_replies = [
        {
            content_type: "text",
            title: "Search Movies",
            payload: movieSearchPayload
        },
        {
            content_type: "text",
            title: "Discover Movies",
            payload: movieDiscoverPayload
        }
    ]
    sendTextMessage(senderId, `Sorry I didn't understand.`, quick_replies, (res, err, done) => {
        console.log(res);
        console.log(err);
        console.log(done);
    })
}


sendWelcomeMessageAction = (senderId, userInfo) => {
    let movieSearchPayload = JSON.stringify({ MOVIE_SEARCH: null });
    let movieDiscoverPayload = JSON.stringify({ MOVIE_DISCOVER: null });

    let quick_replies = [
        {
            content_type: "text",
            title: "Search Movies",
            payload: movieSearchPayload
        },
        {
            content_type: "text",
            title: "Discover Movies",
            payload: movieDiscoverPayload
        }
    ]
    sendTextMessage(senderId, `Hi ${userInfo.first_name}, I am Movie bot.I can help you with movie information and reviews.`, quick_replies)
}



module.exports = {
    selectMovieFallbackAction: selectMovieFallbackAction,
    sendWelcomeMessageAction: sendWelcomeMessageAction
}