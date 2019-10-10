import $ from "jquery";


Foundation.addToJquery($);

$(document).foundation();
// PAGE LOADING
$( window ).on('load', function() {
    $('.loading').fadeOut('fast');
});

$(document).ready(function () {
    let p_scroll=0;

    if($(window).scrollTop() > 2){
        console.log('check')
        setTimeout(() => {
            $('.top-bar').addClass('is-stuck')
        }, 500)

    }
    $(window).scroll(function () {
        if($(window).scrollTop() > 2 ) {
            $('.top-bar').addClass('is-stuck')
        } else {
            $('.top-bar').removeClass('is-stuck')
        }
        if($(window).scrollTop() < p_scroll ) {
            $('.top-bar').addClass('scroll-up')
            $('.top-bar').removeClass('scroll-down')
        } else {
            $('.top-bar').addClass('scroll-down')
            $('.top-bar').removeClass('scroll-up')
        }

        p_scroll = $(window).scrollTop();

    })
});

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import contact from './routes/home';

/** Populate Router instance with DOM routes */
const routes = new Router({
    // All pages
    common,
    home,
    contact
});

// Load Events
$(document).ready(() => routes.loadEvents());
