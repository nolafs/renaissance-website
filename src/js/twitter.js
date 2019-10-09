import twitterFetcher from 'twitter-fetcher';
var configProfile = {
    "profile": {"screenName": 'RenaissancePRUK'},
    "domId": 'tweet-post',
    "maxTweets": 1,
    "enableLinks": false,
    "showUser": false,
    "showTime": false,
    "showImages": false,
    "lang": 'en'
};
twitterFetcher.fetch(configProfile);
