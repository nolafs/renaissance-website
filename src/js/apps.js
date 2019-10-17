import $ from "jquery";

// PAGE LOADING
$( window ).on('load', function() {
    $('.loading').fadeOut('fast');
});

$(document).ready(function () {

    let p_scroll=0;
    console.log('check', $(window).scrollTop())

    if($(window).scrollTop() > 10){

        setTimeout(() => {
            $('.top-bar').addClass('is-stuck')
        }, 500)

    }
    $(window).scroll(function () {

        console.log('check', $(window).scrollTop() > 10)

        if($(window).scrollTop() >  10) {
            $('.top-bar').addClass('is-stuck')
        } else {
            $('.top-bar').removeClass('is-stuck')
        }
        if($(window).scrollTop() > 10) {
            if ($(window).scrollTop() < p_scroll) {
                $('.top-bar').addClass('scroll-up')
                $('.top-bar').removeClass('scroll-down')
            } else {
                $('.top-bar').addClass('scroll-down')
                $('.top-bar').removeClass('scroll-up')
            }
        }

        p_scroll = $(window).scrollTop();

    })
});

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
