import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min';

import { TweenMax, TimelineMax } from "../bonus/gsap"; // Also works with TweenLite and TimelineLite
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

export default {
    animBlock (controller, list){
        list.forEach((item)=> {
            const tl = new TimelineMax();
            tl.from(item, 0.5, {
                y: '30%',
                opacity: 0
            });

            new ScrollMagic.Scene({
                triggerElement: item,
                triggerHook: 1
            })
            /*
            .addIndicators({
                name: "Block Timeline",
                colorTrigger: "black",
                colorStart: "black",
                colorEnd: "black"
            })

             */

                .setTween(tl)
                .addTo(controller);
        })
    }
}
