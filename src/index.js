import "./scss/app.scss";

/* ===========================================================================
 Foundation
 =========================================================================== */
import $ from 'jquery';

import Foundation from 'foundation-sites/dist/js/foundation.min';
// import Rellax from 'rellax/rellax.min';
// import 'slick-carousel/slick/slick';
// import "magnific-popup";
// import mixitup from 'mixitup';
// import AOS from 'aos';
// import 'gsap';
// import ScrollMagic from 'ScrollMagic';
// import 'animation.gsap';
// import 'debug.addIndicators';
// import SplitText from 'splittext';

Foundation.addToJquery($);

/* Foundation Imports */
import 'foundation-sites/dist/js/plugins/foundation.core.min';
import 'foundation-sites/dist/js/plugins/foundation.util.keyboard.min';
import 'foundation-sites/dist/js/plugins/foundation.accordion.min';
import 'foundation-sites/dist/js/plugins/foundation.sticky.min';
import 'foundation-sites/dist/js/plugins/foundation.util.mediaQuery.min';
import 'foundation-sites/dist/js/plugins/foundation.offcanvas.min';
import 'foundation-sites/dist/js/plugins/foundation.responsiveMenu.min';
import 'foundation-sites/dist/js/plugins/foundation.util.triggers.min';
import 'foundation-sites/dist/js/plugins/foundation.util.box.min';
import 'foundation-sites/dist/js/plugins/foundation.util.nest.min';
import 'foundation-sites/dist/js/plugins/foundation.abide.min';
import 'foundation-sites/dist/js/plugins/foundation.util.motion.min';
import 'foundation-sites/dist/js/plugins/foundation.toggler.min';
import 'foundation-sites/dist/js/plugins/foundation.drilldown.min';
import 'foundation-sites/dist/js/plugins/foundation.equalizer.min';
import 'foundation-sites/dist/js/plugins/foundation.responsiveAccordionTabs.min';
import 'foundation-sites/dist/js/plugins/foundation.smoothScroll.min';
import 'foundation-sites/dist/js/plugins/foundation.dropdown.min';
import 'foundation-sites/dist/js/plugins/foundation.interchange.min';
import 'foundation-sites/dist/js/plugins/foundation.magellan.min';
import 'foundation-sites/dist/js/plugins/foundation.responsiveToggle.min';
import 'foundation-sites/dist/js/plugins/foundation.reveal.min';
import 'foundation-sites/dist/js/plugins/foundation.tabs.min';
import 'foundation-sites/dist/js/plugins/foundation.tooltip.min';
import 'foundation-sites/dist/js/plugins/foundation.util.imageLoader.min';


if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}

$(document).foundation();
// PAGE LOADING
$( window ).on('load', function() {
    $('.loading').fadeOut('fast');
});

// DOCUMENT READY
$(document).ready(function () {



});

