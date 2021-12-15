import Shuffle from 'shufflejs';
import $ from 'jquery'
import ScrollMagic from "scrollmagic/scrollmagic/minified/ScrollMagic.min";
import animations from "../util/animations";

export default {
    init() {
        // JavaScript to be fired on all pages
        let hash = window.location.hash.substr(1).toLowerCase()
        if (!hash) {
            window.location.hash = "all";
            hash = "all"
        } else {
            $('#filters .isActive').removeClass('isActive');
            $(`#filter-${hash}`).addClass('isActive');
            $('#list-grid').attr('data-filter', '' + hash)
        }

        $(window).on('hashchange', function (e) {
            console.log('hash changed', e);
            let temp = window.location.hash.substr(1).toLowerCase();
            if (hash !== temp) {
                $('#filters .isActive').removeClass('isActive');
                $(`#filter-${temp}`).addClass('isActive');
                $('#list-grid').attr('data-filter', '' + temp)
            }
            hash = window.location.hash;
        });
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fire
        const hash = window.location.hash.substr(1).toLowerCase();
        const $scope = this

        this.shuffle = new Shuffle(document.querySelector('.list'), {
            itemSelector: '.item',
            sizer: '.my-sizer-element',
            useTransforms: true,
            isCentered: true,
            initialSort: {
                reverse: false,
                by: 'data-date-created',
            },
            buffer: 0
        });

        if (!hash || hash !== 'all') {
            this.shuffle.filter(hash)
        }

        $('#filters a').on('click', function ($event) {
            $event.preventDefault();
            const b = $(this);
            const cat = (b.data('cat')).toLowerCase();

            window.location.hash = cat;

            if (cat === 'all') {
                $('#list-grid .item-0').addClass('expand')
            } else {
                $('#list-grid .item-0').removeClass('expand')
            }

            if (cat !== 'all') {
                console.log('TEST', cat)
                $scope.shuffle.filter(cat)
            } else {
                $scope.shuffle.filter();
            }
        })


        setTimeout(() => {
            if ($scope.shuffle) {
                //$scope.shuffle.update();
            }
            window.dispatchEvent(new Event('resize'));
        }, 500);


        const controller = new ScrollMagic.Controller();
        const blocks = ['#block-studies', '#block-contact'];
        animations.animBlock(controller, blocks);

        window.addEventListener('resize', ()=> {
            console.log('RESIZE')
        })
    },
};
