import twitterFetcher from 'twitter-fetcher';
import $ from 'jquery';
import 'slick-carousel';

import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min';
import TweenMax from 'gsap/src/minified/TweenMax.min';
import TimelineMax from 'gsap/src/minified/TimelineMax.min';
import {Elastic, Linear} from "gsap";

var controller = new ScrollMagic.Controller();
TweenLite.defaultEase = Linear.easeInOut;

export default {

    animHeader() {

        const tl = new TimelineMax();
        const heading = $('.home-service-heading');
        tl.set(heading.find('.h-anim'), {x:'100%'})
        tl.from(heading.find('h2'), 0.4, {
           y: '-100%'
        });

        tl.to(heading.find('.h-anim'), 0.2, {
            x: '0%'
        });
        tl.from($('.h-anim-2'), 0.3, {
            x: '100%',
            opacity:0
        },'-=0.1');
        tl.from($('.home-service-content'), 0.4, {
            y: 100,
            opacity: 0
        });

        const anim = new ScrollMagic.Scene({
            triggerElement: heading,
            offset: 200,
            triggerHook: 0.5
        })
            .addIndicators({
                name: "Heading Timeline",
                colorTrigger: "black",
                colorStart: "black",
                colorEnd: "black"
            })
            .setTween(tl)
            .addTo(controller);

    },
    animList () {

        $(".block-icon-list li").each(function(i) {
            const tl = new TimelineMax();
            tl.from($(this).find('.item'), 0.5, {
                x: '100%',
                opacity: 0
            });
         new ScrollMagic.Scene({
            triggerElement: this,
             offset: -150,
             triggerHook: 0.5
        })
             /*
            .addIndicators({
                name: "Box Timeline",
                colorTrigger: "black",
                colorStart: "black",
                colorEnd: "black"
            })*/
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

        this.animList();
        this.animHeader();
    },
};
