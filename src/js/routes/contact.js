import $ from 'jquery';
import 'jquery-validation';
export default {
    init() {
        $('#thanks').hide();
        $('#sending').hide();

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
                $.ajax({
                    type: $(form).attr('method'),
                    url: $(form).attr('action'),
                    data: $(form).serialize(),
                    dataType : 'json'
                })
                    .done(function (response) {
                        if (response.success == 'success') {
                            $('#sending').fadeOut(500, () => $('#thanks').fadeIn(500))
                        } else {
                            alert('fail');
                        }
                    });
                return false;
            }
        });


        $('#continue').on('click' , () => {
            $('#thanks').fadeOut(500, () => $('#form').fadeIn(500))
        })


    },
    finalize() {



    },
};
