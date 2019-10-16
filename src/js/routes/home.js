import twitterFetcher from 'twitter-fetcher';
import $ from 'jquery';
import 'slick-carousel';

import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min';

import { TweenMax, TimelineMax } from "gsap"; // Also works with TweenLite and TimelineLite
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

import { SplitText } from "gsap/SplitText.js";


var controller = new ScrollMagic.Controller();
TweenLite.defaultEase = Expo.easeOut;

export default {

    animHeader() {
        const tl = new TimelineMax({repeat:0, delay: 0.2});
        const heading = $('.hero-header-inner');
        const title = new SplitText($('.hero-header-inner').find('h1'), {type:"words,chars"});
        const chars = title.words;



        tl.staggerFrom(chars, 0.8, {opacity:0, scaleY: 0, y:80,  ease:Expo.easeOut}, 0.1, "+=0");
        tl.from($('.content-subtitle-animate'), 0.5,  {opacity:0, y: 100, ease:Expo.easeOut});

        const anim = new ScrollMagic.Scene({
            triggerElement: heading,
            triggerHook: 0.4
        })
            .addIndicators({
                name: "Heading Timeline",
                colorTrigger: "green",
                colorStart: "red",
                colorEnd: "black"
            })
            .setTween(tl)
            .addTo(controller)

    },
    animServices() {

        const tl = new TimelineMax();
        const heading = $('.home-service-heading');
        tl.set(heading.find('.h-anim'), {x:'100%'})
        tl.from(heading.find('h2'), 0.3, {
           y: '-100%'
        });

        tl.to(heading.find('.h-anim'), 0.5, {
            x: '0%'
        });
        tl.from($('.h-anim-2'), 0.5, {
            x: '100%',
            opacity:0
        },'-=0.5');
        tl.from($('.home-service-content'), 0.5, {
            y: 100,
            opacity: 0
        });

        const anim = new ScrollMagic.Scene({
            triggerElement: heading,
            offset: 100,
            triggerHook: 0.5
        })
            .addIndicators({
                name: "Services Timeline",
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
                y: '30%',
                opacity: 0
            });
            tl.from($(this).find('.item > img'),0.5, {rotationY:90, y:-10, opacity:0 }, '=-0.4')


         new ScrollMagic.Scene({
            triggerElement: this,
             triggerHook: 0.5
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

        this.animHeader();
        this.animList();
        this.animServices();
    },
};
