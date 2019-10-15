import $ from 'jquery'
export default {
    init() {
        console.log('CONTACT')
        $("#contact").submit(function(e) {
            e.preventDefault();

            var $form = $(this);
            $.post($form.attr("action"), $form.serialize()).then(function() {
                alert("Thank you!");
            });
        });
    },
    finalize() {



    },
};
