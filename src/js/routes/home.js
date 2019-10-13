import twitterFetcher from 'twitter-fetcher';
import $ from 'jquery';
import 'slick-carousel';

export default {
    init() {
        // JavaScript to be fired on all pages
        console.log('home')
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fired

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


        $('.slick-slider').slick({
            arrows: false,
            dots: true,
            autoplay: true,
            autoplaySpeed: 2500,
        });
    },
};
