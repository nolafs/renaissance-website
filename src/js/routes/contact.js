import $ from 'jquery';
import 'jquery-validation';
export default {
    init() {



    },
    finalize() {

        let error = false;
        $('#thanks').hide();
        $('#sending').hide();
        $('#error').hide();

        $("#contact").validate({
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
            submitHandler: function (form) {

                $('#form').fadeOut(500, () => $('#sending').fadeIn(500, ()=>{

                    $.post($(form).attr("action"), $(form).serialize()).then(function(response) {
                        $('#sending').fadeOut(500, () => $('#thanks').fadeIn(500))
                    });
                }));

                return false;
            }
        });


        $('.continue').on('click' , () => {
            $("#contact").reset();
            if(!error) {
                $('#thanks').fadeOut(500, () => $('#form').fadeIn(500))
            } else {
                $('#error').fadeOut(500, () => $('#form').fadeIn(500))
            }
        })

    },
};
