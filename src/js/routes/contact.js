import $ from 'jquery'
export default {
    init() {
        console.log('CONTACT')
        $("#contact").submit(function(e) {
            e.preventDefault();

            var $form = $(this);
            $.post($form.attr("action"), $form.serialize()).then(function(e) {
                console.log(e)
                alert("Thank you!");
            });
        });
    },
    finalize() {



    },
};
