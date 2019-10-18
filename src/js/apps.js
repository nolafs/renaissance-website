import $ from "jquery";


// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import services from './routes/services';
import contact from './routes/contact';
import about from './routes/about';
import caseStudies from './routes/caseStudies';

/** Populate Router instance with DOM routes */
const routes = new Router({
    // All pages
    common,
    home,
    contact,
    caseStudies,
    services,
    about
});

// Load Events
$(document).ready(() => routes.loadEvents());
