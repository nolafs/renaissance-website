import "./scss/app.scss";

/* ===========================================================================
 Foundation
 =========================================================================== */
import $ from 'jquery';
import 'custom-event-polyfill';

import Foundation from 'foundation-sites/dist/js/foundation.min';
/* Foundation Imports */
import 'foundation-sites/dist/js/plugins/foundation.core.min';
import 'foundation-sites/dist/js/plugins/foundation.util.keyboard.min';
import 'foundation-sites/dist/js/plugins/foundation.accordion.min';
import 'foundation-sites/dist/js/plugins/foundation.sticky.min';
import 'foundation-sites/dist/js/plugins/foundation.util.mediaQuery.min';
import 'foundation-sites/dist/js/plugins/foundation.offcanvas.min';
import 'foundation-sites/dist/js/plugins/foundation.responsiveMenu.min';
import 'foundation-sites/dist/js/plugins/foundation.util.triggers.min';
//import 'foundation-sites/dist/js/plugins/foundation.util.box.min';
import 'foundation-sites/dist/js/plugins/foundation.util.nest.min';
//import 'foundation-sites/dist/js/plugins/foundation.abide.min';
import 'foundation-sites/dist/js/plugins/foundation.util.motion.min';
import 'foundation-sites/dist/js/plugins/foundation.toggler.min';
//import 'foundation-sites/dist/js/plugins/foundation.drilldown.min';
//import 'foundation-sites/dist/js/plugins/foundation.equalizer.min';
import 'foundation-sites/dist/js/plugins/foundation.responsiveAccordionTabs.min';
//import 'foundation-sites/dist/js/plugins/foundation.smoothScroll.min';
//import 'foundation-sites/dist/js/plugins/foundation.dropdown.min';
import 'foundation-sites/dist/js/plugins/foundation.interchange.min';
//import 'foundation-sites/dist/js/plugins/foundation.magellan.min';
import 'foundation-sites/dist/js/plugins/foundation.responsiveToggle.min';
import 'foundation-sites/dist/js/plugins/foundation.reveal.min';
import 'foundation-sites/dist/js/plugins/foundation.tabs.min';
//import 'foundation-sites/dist/js/plugins/foundation.tooltip.min';
//import 'foundation-sites/dist/js/plugins/foundation.util.imageLoader.min';

Foundation.addToJquery($);
$(document).foundation();

/* ===========================================================================
 Fontawsome
 =========================================================================== */

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {faFacebook, faTwitter, faFacebookF, faXTwitter} from '@fortawesome/free-brands-svg-icons';
import { faCheck , faChevronRight } from "@fortawesome/free-solid-svg-icons";


library.add(faCheck, faChevronRight, faTwitter, faFacebookF, faXTwitter );

dom.watch();
/* ===========================================================================
 Tooling
 =========================================================================== */
import lazySizes from 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

lazySizes.cfg.loadMode = 3;
/* ===========================================================================
 Netlify
 =========================================================================== */

if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}
// DOCUMENT READY
import "./js/apps";
