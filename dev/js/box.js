(function () {

    $('.js-more').on('click', function(e) {
        var $this = $(this).parent().parent();
        $this.toggleClass('flip');

        var boxes = $('.box');

        boxes.each(function () {
            if (!$(this).hasClass('flip')) {
                $(this).animate({
                    opacity: 0
                }, 400);
            }
        });
    });

    $('.js-exit').on('click', function(e) {
        $(this).parents('.flip-box').toggleClass('flip');
        var boxes = $('.box');

        boxes.each(function () {
            if (!$(this).hasClass('flip')) {
                $(this).animate({
                    opacity: 1
                }, 400);
            }
        });
    });
})();

$(document).ready(function(){
    $('.slider').slick();
});