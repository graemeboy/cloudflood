jQuery(document).ready(function($) {
    var previewOffset = $('#campaign-create-section-preview').offset();
    $('#campaign-create-section-preview').css('left', previewOffset.left);
    $(window).scroll(function() {
        if ($(this).scrollTop() > previewOffset.top) {
            $('#campaign-create-section-preview').addClass('preview-fixed');
        } // if
        else {
            $('#campaign-create-section-preview').removeClass('preview-fixed');
        } // else
    }); // window scroll
    var pickerTarget;
    updateMessagePreview(); // on load, update the preview
    updateInterfacePreview();
    $('.campaign-create-picker-btn, .campaign-create-picker-btn span').click(function(e) {
        e.preventDefault();
        $('#' + $(this).attr('data-target')).iris('show');
    });
    // Twitter and Facebook Listeners
    $('#campaign-create-checkbox-twitter').change(function() {
        $('.twitter-signin').toggle();
    });
    $('#campaign-create-checkbox-facebook').change(function() {
        $('.facebook-signin').toggle();
    });
    $('.campaign-create-color-picker').each(function() {
        $(this).iris({
            change: function(event, ui) {
                pickerTarget = $(this).attr('data-target');
                if (pickerTarget === 'social-intro-background') {
                    $('.social-modal-container, #campaign-message-preview').css('background-color', ui.color.toString());
                } // if
                else if (pickerTarget === 'share-text') {
                    $('.share-text').css('color', ui.color.toString());
                } else {
                    $('#' + pickerTarget).css('color', ui.color.toString());
                } // else
                $('#' + pickerTarget + '-preview').css('background-color', ui.color.toString());
                $('#campaign-create-' + $(this).attr('data-target') + '-btn-text').text(ui.color.toString())
            } // change
        }); // .iris
    }); // . each
    // Hide iris on document click
    listenHideIris();

    function listenHideIris() {
        $('#dashboard-campaign-wrapper').click(function(e) {
            if (!$(e.target).is('input[type="submit"], a')) {
                if (!$(e.target).is(".campaign-create-color-picker, .campaign-create-picker-btn span, .iris-picker, .iris-picker-inner, input[type='checkbox'], label")) {
                    $('.campaign-create-color-picker').iris('hide');
                    $('.campaign-create-color-picker').hide();
                    return false;
                } // if
                $('.campaign-create-color-picker').click(function() {
                    $('.campaign-create-color-picker').iris('hide');
                    $(this).iris('show');
                    return false;
                }); // .color-picker click
            } // if
        }); // document.click
    }
    $('.campaign-create-input').focus(function() {
        $('.campaign-create-section').removeClass('campaign-create-section-active');
        $('#campaign-create-section-' + $(this).attr('data-section')).addClass('campaign-create-section-active');
    });
    $('#campaign-message, #campaign-link').keyup(function() {
        updateMessagePreview();
    }); // #campaign-link keyup
    $('#campaign-heading, #campaign-paragraph, #campaign-security').keyup(function() {
        updateInterfacePreview();
    }); // #campaign-heading keyup

    function updateInterfacePreview() {
        $('#social-intro-heading').text($('#campaign-heading').val());
        $('#social-intro-paragraph').text($('#campaign-paragraph').val());
        $('#post-security').text($('#campaign-security').val());
    }

    function updateMessagePreview() {
        $('#campaign-message-preview').val($('#campaign-message').val() + " " + $('#campaign-link').val());
    } // updateMessagePreview()
    
    $('#campaign-font').change(function ()
    {
        $('.social-modal-container').css('font-family', $(this).find(":selected").val());
    });
/*
    $('#campaign-create-form').submit(function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
            type: "post",
            url: "",
            data: data
        }) // ajax post
        .done(function(msg) {
            console.log("Data Saved: " + msg);
        }); // ajax done

    }); // campaign-create submit*/
}); // jquery document ready