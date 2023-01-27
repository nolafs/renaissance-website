import twitterFetcher from 'twitter-fetcher';
var configProfile = {
    "profile": {"screenName": 'renaissancepruk'},
    "domId": 'tweet-post',
    "maxTweets": 6,
    "enableLinks": false,
    "showUser": false,
    "showTime": false,
    "showImages": false,
    "lang": 'en'
};
twitterFetcher.fetch(configProfile);
console.log('RUN TWITTER')
