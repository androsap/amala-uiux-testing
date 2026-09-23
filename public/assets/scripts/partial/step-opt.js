jQuery(function($){

    $('#ecMember').easyWizard({
        prevButton: 'previous',
        nextButton: 'next',
        submitButtonText: 'Enroll member',
        buttonsClass: 'btn btn-default normal',
        submitButtonClass: 'btn btn-default normal final-enrollment',
        stepsText: '{n} {t}',
        before: function(wizardObj, currentStepObj, nextStepObj) {
            $('.title-description').hide();
        },
        showButtons: false,
        submitButton: false
    });

    $('#ecMember .previous').bind('click', function(e) {
        e.preventDefault();
        $('#ecMember').easyWizard('prevStep');
    });
    $('#ecMember .page-to').bind('click', function(e) {
        e.preventDefault();
        $('#ecMember').easyWizard('goToStep', $(this).attr('rel'));
    });
    $('#ecMember .next').bind('click', function(e) {
        e.preventDefault();
        $('#ecMember').easyWizard('nextStep');
    });

});