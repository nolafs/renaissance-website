import Shuffle from 'shufflejs';
import $ from 'jquery'

export default {
    init() {
        // JavaScript to be fired on all pages
        console.log('case studies', window.location.hash.substr(1))
        let hash = window.location.hash.substr(1).toLowerCase()
        if(!hash){
            window.location.hash = "all";
            hash = "all"
        } else {
            $('#filters .isActive').removeClass('isActive');
            $(`#filter-${hash}`).addClass('isActive');
        }

        $( window ).on( 'hashchange', function( e ) {
            console.log( 'hash changed' );
            let temp = window.location.hash.substr(1).toLowerCase();
            if(hash !== temp) {
                $('#filters .isActive').removeClass('isActive');
                $(`#filter-${temp}`).addClass('isActive');
            }
            hash = window.location.hash;
        } );
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fire

        setTimeout(() => {
            const sizer = $('.my-sizer-element');

            const shuffle = new Shuffle($('.list'), {
                itemSelector: '.item',
                sizer:$('.my-sizer-element'),
                useTransforms: true,
            });

            const hash = window.location.hash.substr(1).toLowerCase()

            if(!hash || hash !== 'all'){
                shuffle.filter(hash)
            }

            $('#filters a').on('click', function ($event) {
                $event.preventDefault();
                const b = $(this);
                const cat = (b.data('cat')).toLowerCase();
                console.log(cat);
                window.location.hash = cat;
                if(cat !== 'all') {
                    shuffle.filter(cat)
                } else {
                    shuffle.filter(Shuffle.ALL_ITEMS);
                }
            })
        }, 500);
    },
};
