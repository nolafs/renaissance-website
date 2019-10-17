import animations from "../util/animations"
import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';


export default {
  init() {
    // JavaScript to be fired on all pages
  },
  finalize() {
    //const cc = new CC();
    const controller = new ScrollMagic.Controller();
    const blocks =['#block-services', '#block-other-services', '#block-contact'];
    animations.animBlock(controller, blocks);
  },
};
