import twitterFetcher from 'twitter-fetcher';
import $ from 'jquery';
import 'slick-carousel';

import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min';

import { gsap } from "../bonus/gsap"; // Also works with TweenLite and TimelineLite
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

import { SplitText } from "../bonus/SplitText";
import animations from "../util/animations"
gsap.registerPlugin(SplitText);


gsap.defaultEase = Expo.easeOut;

export default {
    controller: null,
    videoPlayStop() {
        const players = []
        $('.video-player').each(function () {
            players.push({
                player: new Vimeo.Player($(this).find("iframe").get(0)),
                top: $(this).position().top,
                status: "paused"
            })
        });
        const viewportHeight = $(window).height();

        $(window).on('scroll', function () {
            const scrollPos = $(window).scrollTop();
            for (let i = 0; i < players.length; i++) {
                console.log('scroll', players)
                const elementFromTop = players[i].top - scrollPos;
                const status = (elementFromTop > 0 && elementFromTop < players[i].top + viewportHeight) ? "play" : "pause";
                if (players[i].status != status) {
                    players[i].status = status;
                    players[i].player[status]();
                    console.log(i, status);
                }
            }
        });

    },
    animHeader() {
        const tl = gsap.timeline({repeat:0, delay: 2});
        const heading = $('.hero-header-inner');
        const title = new SplitText($('.hero-header-inner').find('h1'), {type:"words,chars"});
        const chars = title.words;

        tl.staggerFrom(chars, 0.8, {opacity:0, scaleY: 0, y:80,  ease:Expo.easeOut}, 0.1, "+=0");
        tl.from($('.content-subtitle-animate'), 0.5,  {opacity:0, y: 100, ease:Expo.easeOut});

        const anim = new ScrollMagic.Scene({
            triggerElement: heading,
            triggerHook: 0.4
        })
            /*
            .addIndicators({
                name: "Heading Timeline",
                colorTrigger: "green",
                colorStart: "red",
                colorEnd: "black"
            })

             */

            .setTween(tl)
            .addTo(this.controller)

    },
    animServices() {

        const tl = gsap.timeline();
        const heading = $('#service-intro .home-service-heading');
        const video = $('#services-video > .video-player');
        tl.set(heading.find('.h-anim'), {x:'100%'})
        tl.from(heading.find('h2'), 0.3, {
           y: '-100%'
        });

        tl.to(heading.find('.h-anim'), 0.5, {
            x: '0%'
        });
        tl.from($('.home-service-content'), 0.5, {
            y: 100,
            opacity: 0
        });

        tl.from(video, 0.5, {
            y: '30%', opacity: 0, onComplete: function () {
                const player = new Vimeo.Player($(".video-player").find("iframe").get(0));
                console.log(player);
                if(player) {
                    //const player = new Vimeo.Player(player);
                    player.pause(0);
                }
            }
        });


        const anim = new ScrollMagic.Scene({
            triggerElement: heading,
            //offset: 100,
            triggerHook: 0.9
        })


            .setTween(tl)
            .addTo(this.controller);

    },
    animateAward() {
        const w = 300;
        const width = $('.award-logo').length * w;
        console.log(width);

        gsap.set(".award-logo", {
            x: (i) => i * w
        });

        let wrap = gsap.utils.wrap(0, width);


        gsap.to(".award-logo", {
            duration: 10,
            ease: "none",
            x: `-=${width}`, //move each box 500px to right
            modifiers: {
                x: gsap.utils.unitize(x => wrap(parseFloat(x))) //force x value to be between 0 and 500 using modulus
            },
            repeat: -1
        });



    },
    animList () {

        const tl = gsap.timeline();
        const heading = $('#service-list .home-service-heading');

        tl.set(heading.find('.h-anim'), {x: '100%'})
        tl.from(heading.find('h3'), 0.3, {
            y: '-100%'
        });

        tl.to(heading.find('.h-anim'), 0.5, {
            x: '0%'
        });

        tl.staggerFrom($('.list-services  .cell'), 0.5, {
            y: '30%',
            opacity: 0
        }, 0.2);
        tl.staggerFrom($('.list-services  .cell  img'), 0.5, {rotationY: 90, y: -10, opacity: 0, }, '0.2', '-=0.8')
        tl.from('#service-link', 0.5, {y:'30%', opacity: 0, ease: 'Expo.easeOut'});

        const anim = new ScrollMagic.Scene({
            triggerElement: '#service-list',
            triggerHook: 0.9,
            //offset: 100
        })
        /*
            .addIndicators({
                name: "service-list Timeline",
                colorTrigger: "black",
                colorStart: "green",
                colorEnd: "red"
            })

         */

            .setTween(tl)
            .addTo(this.controller);

    },
    animBlocks() {
        const blocks = ['#case-studies', '#clients', '#testimonial', '#block-awards', '#block-contact'];
       animations.animBlock(this.controller,blocks);
    },
    init() {
        // JavaScript to be fired on all pages
        console.log('home')
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fired
        this.controller = new ScrollMagic.Controller();
        $('.slick-slider').not('.slick-initialized').slick({
            arrows: false,
            dots: true,
            autoplay: true,
            infinite: true,
            fade: true,
            autoplaySpeed: 3000,
        });

        console.log('home final')
        this.animHeader();
        this.animServices();
        this.animBlocks();
        this.animList();
        //this.videoPlayStop();
        setTimeout(() => {
            this.animateAward()

        }, 1000);


    },
};
