import "./scss/app.scss";

/* ===========================================================================
 Foundation
 =========================================================================== */
import $ from 'jquery';

import Foundation from 'foundation-sites/dist/js/foundation';
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
import 'foundation-sites/dist/js/plugins/foundation.core';
import 'foundation-sites/dist/js/plugins/foundation.util.keyboard';
import 'foundation-sites/dist/js/plugins/foundation.accordion';
import 'foundation-sites/dist/js/plugins/foundation.sticky';
import 'foundation-sites/dist/js/plugins/foundation.util.mediaQuery';
import 'foundation-sites/dist/js/plugins/foundation.offcanvas.js';
import 'foundation-sites/dist/js/plugins/foundation.responsiveMenu';
import 'foundation-sites/dist/js/plugins/foundation.util.triggers';
import 'foundation-sites/dist/js/plugins/foundation.util.box';
import 'foundation-sites/dist/js/plugins/foundation.util.nest';
import 'foundation-sites/dist/js/plugins/foundation.abide';
import 'foundation-sites/dist/js/plugins/foundation.util.motion';
import 'foundation-sites/dist/js/plugins/foundation.toggler';
import 'foundation-sites/dist/js/plugins/foundation.drilldown';
import 'foundation-sites/dist/js/plugins/foundation.equalizer';
import 'foundation-sites/dist/js/plugins/foundation.responsiveAccordionTabs';
import 'foundation-sites/dist/js/plugins/foundation.smoothScroll';
import 'foundation-sites/dist/js/plugins/foundation.dropdown';
import 'foundation-sites/dist/js/plugins/foundation.interchange';
import 'foundation-sites/dist/js/plugins/foundation.magellan';
import 'foundation-sites/dist/js/plugins/foundation.responsiveToggle';
import 'foundation-sites/dist/js/plugins/foundation.reveal';
import 'foundation-sites/dist/js/plugins/foundation.tabs';
import 'foundation-sites/dist/js/plugins/foundation.tooltip';
import 'foundation-sites/dist/js/plugins/foundation.util.imageLoader';


$(document).foundation();
// PAGE LOADING
$( window ).on('load', function() {
    $('.loading').fadeOut('fast');
});

// DOCUMENT READY
$(document).ready(function () {



});
