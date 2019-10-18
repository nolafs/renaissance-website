import $ from "jquery";

export default {
  init() {

    $( window ).on('load', function() {
      $('.loading').fadeOut('fast');
    });

    let p_scroll=0;

    if($(window).scrollTop() > 10){

      setTimeout(() => {
        $('.top-bar').addClass('is-stuck')
      }, 500)

    }
    $(window).scroll(function () {

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
  },
  finalize() {
  },
};
