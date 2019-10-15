import $ from 'jquery';
import 'jquery-validation';
export default {
    init() {
        $('#thanks').hide();
        $('#sending').hide();

        $("form[name='contact']").validate({
            rules : {
                name: 'required',
                telephone: 'required',
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: 'Please enter your full name',
                email: 'Please enter a valid email address',
                telephone: 'Please enter your telephone number'
            },
            submitHandler: (form) => {
                form.submit(() => {
                    e.preventDefault();
                    $('#form').fadeOut(100, () => $('#sending').fadeIn(100))
                    const $form = $(this);
                    $.post($form.attr("action"), $form.serialize()).then(function () {
                        $('#sending').fadeOut(500, () => $('#thanks').fadeIn(500))
                    });
                })
            }
        });



        $('#continue').on('click' , () => {
            $('#thanks').fadeOut(500, () => $('#form').fadeIn(500))
        })


    },
    finalize() {



    },
};
