(function ($) {
    var halo = {
        initSpotlightSlider: function() {
            var spotlightBlock = $('[data-spotlight-slider]');
            
            spotlightBlock.each(function() {
                var self = $(this),
                    dataRows = self.data('rows'),
                    dataRowsMb = self.data('rows-mb'),
                    dataArrows = self.data('arrows'),
                    dataSwipe = self.data('swipe');
                    
                if ((dataSwipe == 'list' || dataSwipe == 'scroll') && window.innerWidth < 768) return;
                self.slick({
                    infinite: false,
                    speed: 1000, 
                    arrows: dataArrows,
                    dots: true,
                    nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 7.75 1.34375 L 6.25 2.65625 L 14.65625 12 L 6.25 21.34375 L 7.75 22.65625 L 16.75 12.65625 L 17.34375 12 L 16.75 11.34375 Z"></path></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 7.75 1.34375 L 6.25 2.65625 L 14.65625 12 L 6.25 21.34375 L 7.75 22.65625 L 16.75 12.65625 L 17.34375 12 L 16.75 11.34375 Z"></path></svg></button>',
                    slidesToShow: dataRows,
                    slidesToScroll: 1,
                      responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 2,
                                arrows: false
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: dataRowsMb,
                                arrows: false
                            }
                        }                                          
                      ]
                });
            });
        }
    }
    halo.initSpotlightSlider();
})(jQuery);