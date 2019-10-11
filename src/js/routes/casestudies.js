import Shuffle from 'shufflejs';
import $ from 'jquery'

export default {
    init() {
        // JavaScript to be fired on all pages
        console.log('case studies')
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fired

        setTimeout(() => {
            const sizer = $('.my-sizer-element');

            const shuffle = new Shuffle($('.list'), {
                itemSelector: '.item',
                sizer:$('.my-sizer-element'),
                useTransforms: true,
            });

            $('#filters a').on('click', function ($event) {
                $event.preventDefault();
                const b = $(this);
                const cat = (b.data('cat')).toLowerCase();
                console.log(cat);
                if(cat !== 'all') {
                    shuffle.filter(cat)
                } else {
                    shuffle.filter(Shuffle.ALL_ITEMS);
                }
            })
        }, 500);
    },
};
