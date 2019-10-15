import twitterFetcher from 'twitter-fetcher';
import $ from 'jquery';
import 'slick-carousel';

import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min';
import TweenMax from 'gsap/src/minified/TweenMax.min';
import TimelineMax from 'gsap/src/minified/TimelineMax.min';
export default {

    animation () {
        console.log('ANIM')
        TweenLite.defaultEase = Linear.easeInOut;
        const controller = new ScrollMagic.Controller();

        $(".block-icon-list li").each(function(i) {
            const tl = new TimelineMax();
            tl.from($(this).find('.item'), 0.2, {
                x: 100,
                opacity: 0
            });


         new ScrollMagic.Scene({
            triggerElement: this,
            //duration: "50%",
             offset: -200,
             triggerHook: 0.25
        })
            .addIndicators({
                name: "Box Timeline",
                colorTrigger: "black",
                colorStart: "black",
                colorEnd: "black"
            })
            .setTween(tl)
            .addTo(controller);
        });
    },
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
            infinite: true,
            fade: true,
            autoplaySpeed: 2500,
        });

        this.animation();
    },
};
