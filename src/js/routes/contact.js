import $ from 'jquery'
export default {
    init() {
        $('#thanks').hide()
        console.log('CONTACT')
        $("#contact").submit(function(e) {
            e.preventDefault();
            const $form = $(this);
            $.post($form.attr("action"), $form.serialize()).then(function() {
                $('#form').fadeOut(500, () => $('#thanks').fadeIn(1000))
            });
        });

        $('#continue').on('click' , () => {
            $('#thanks').fadeOut(500, () => $('#form').fadeIn(1000))
        })
    },
    finalize() {



    },
};
