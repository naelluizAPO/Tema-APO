(function ($) {
    var $body = $('body'),
        $doc = $(document),
        $html = $('html'),
        $win = $(window);

    $doc.ready(() => {
        $doc.ajaxStart(() => {
            halo.isAjaxLoading = true;
        });

        $doc.ajaxStop(() => {
            halo.isAjaxLoading = false;
        });

        halo.ready();
    });

    window.onload = function() { 
        halo.init();
    }

    var halo = {
        haloTimeout: null,
        isAjaxLoading: false,

        ready: function (){
            this.loaderScript();
            this.loaderProductBlock();

            if (navigator.userAgent.match(/OS X.*Safari/) && ! navigator.userAgent.match(/Chrome/)) {
                document.body.classList.add('safari')
            } else {
                document.body.classList.add('chrome')
            }

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) document.body.classList.add('iOS')

            if($body.hasClass('template-product')) {
                this.loaderRecommendationsBlock();
                this.scrollToReview();
            }

            if($('[data-product-tab-block]').length) {
                this.clickedActiveProductTabs();
            }
        },
        
        init: function () {
            this.initMultiTabMobile();
            this.productBlockInfiniteScroll();
            this.initGlobalCheckbox();
            this.initColorSwatch();
            this.initAddToCart();
            this.initQuickShop();
            this.initQuickCart();
            this.initBeforeYouLeave();
            this.initNotifyInStock();
            this.initCompareProduct();
            this.initQuickView();
            this.initWishlist();
            this.initAskAnExpert();
            this.closeAnnouncementBar();
            this.sliderAnnouncementBar();
            this.headerdropdownCurrency();
            this.headerdropdownLanguage();
            this.headerMasonry();
            this.initLiveChat();
            this.menuSidebarMobile();
            this.menuSidebarMobileToggle();
            this.headerSidebarSearch();
            this.headerStickySearchForm();
            this.initCountdown();
            this.collectionCountdown();
            this.handleScrollDown();
            this.initVideoPopup();
            this.swapHoverVideoProductCard();
            this.initDynamicBrowserTabTitle();
            this.initWarningPopup();
            this.initBannerAnimation();
            this.initBreadcrumbFadeout();
            this.initLazyloadObserver();

            if($body.hasClass('show_effect_close')) {
                this.backgroundOverlayHoverEffect();
            }

            if (window.innerWidth > 1024) {
                this.productMenuSlider();
            }

            if($('[data-lookbook-icon]').length) {
                this.addEventLookbookModal();
            }

            if($body.hasClass('template-page')) {
                this.initWishlistPage();
            }

            if($body.hasClass('template-cart')) {
                this.initFreeShippingMessage();
                this.updateGiftWrapper();
            }

            if($body.hasClass('template-product')) {
                this.initProductView($('.halo-productView'));
                this.initProductBundle();
                this.articleGallery();
                this.toggleSidebarMobile(); 
                this.initCollapseSidebarBlock();    
                this.initCategoryActive();
                this.initProductReviewSection();
                this.productCustomInformation();
                this.iconZoomClickMobile();
            }

            if($body.hasClass('template-blog') || $body.hasClass('template-article')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.initBlogMasonry();
                this.productBlockSilderSidebar();
                this.productBlockSilderArticle();
            }

            if($body.hasClass('template-article')) {
                this.articleGallery();
            }

            if($body.hasClass('template-collection') || $body.hasClass('template-search')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.productBlockSilderSidebar();
                this.initInfiniteScrolling();
                this.initQuickShopProductList();
            }

            if($body.hasClass('template-collection') && $('.collection-express-order').length) {
                this.toggleVariantsForExpressOrder();
                this.initExpressOrderAddToCart();
            }

            if ($("[data-lookbook-icon]").length) {
                const lookbookIcons = [...document.querySelectorAll("[data-lookbook-icon]")];
                lookbookIcons.forEach((dot, index) => {
                    this.getProductDataForLookbook(dot);
                });

                const sectionIds = lookbookIcons.map((icon) => {
                    const section = icon.closest(".articleGallery-block") || icon.closest(".slideshow-wrapper") || icon.closest('.collection-lookbook') || icon.closest('.large-lookbook-banner');
                    if (section != null) {
                        return section.id;
                    } else {
                        return null
                    }

                }).filter(id => id != null);

                const filteredSectionIds = new Set(sectionIds);
                filteredSectionIds.forEach((sectionId) => {
                    const parentElement = document.getElementById(`${sectionId}`);
                    const imagesContainer = parentElement.querySelector("[data-style]");
                    const showLookbookByDefault = imagesContainer?.dataset.showLookbookDefault;
                    const lookbookStyle = parseInt(imagesContainer?.dataset.style) || 3;

                    if (lookbookStyle === 1) {
                        this.addEventLookbookModal(sectionId);
                    } else if (lookbookStyle === 2) {
                        this.addEventLookbookModalStyle2(sectionId, showLookbookByDefault);
                    } else {
                        this.addEventLookbookModalStyle3(sectionId);
                    }

                    this.addEventLookbookModalMobile(sectionId);
                });

            }

            if ($("[data-drag-container]").length) {
                const dragToScrollContainers = document.querySelectorAll('[data-drag-container]')
                if (dragToScrollContainers.length === 0) return 

                dragToScrollContainers.forEach(container => {
                    this.initDragToScroll(container);
                })
            }

            $win.on('resize', () => {
                this.headerSidebarSearch();
            });
        },

        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        },

        loaderScript: function() {
            var load = function(){
                var script = $('[data-loader-script]');

                if (script.length > 0) {
                    script.each((index, element) => {
                        var $this = $(element),
                            link = $this.data('loader-script'),
                            top = element.getBoundingClientRect().top;

                        if (!$this.hasClass('is-load')){
                            if (top < window.innerHeight + 100) {
                                halo.buildScript(link);
                                $('[data-loader-script="' + link + '"]').addClass('is-load');
                            }
                        }
                    })
                }
            }
            
            load();
            window.addEventListener('scroll', load);
        },

        buildScript: function(name) {
            var loadScript = document.createElement("script");
            loadScript.src = name;
            document.body.appendChild(loadScript);
        },

        loaderProductBlock: function() {
            halo.buildProductBlock();
        },

        buildProductBlock: function() {
            var isAjaxLoading = false;

            $doc.ajaxStart(() => {
                isAjaxLoading = true;
            });

            $doc.ajaxStop(() => {
                isAjaxLoading = false;
            });

            var productBlock = $('[data-product-block]');

            var load = function() {
                productBlock.each((index, element) => {
                    var top = element.getBoundingClientRect().top,
                        $block = $(element);

                    if (!$block.hasClass('ajax-loaded')) {
                        if (top < window.innerHeight) {
                            var url = $block.data('collection'),
                                layout = $block.data('layout'),
                                limit = $block.data('limit'),
                                image_ratio = $block.data('image-ratio'),
                                swipe = $block.data('swipe'),
                                sectionId = $block.attr('sectionId');
                                hasCountdown = $block.attr('hasCountdown');

                            if(url != null && url != undefined) {
                                $.ajax({
                                    type: 'get',
                                    url: window.routes.root + '/collections/' + url,
                                    cache: false,
                                    data: {
                                        view: 'ajax_product_block',
                                        constraint: 'limit=' + limit + '+layout=' + layout + '+sectionId=' + sectionId + '+imageRatio=' + image_ratio + '+swipe=' + swipe + '+hasCountdown=' + hasCountdown
                                    },
                                    beforeSend: function () {
                                        $block.addClass('ajax-loaded');
                                    },
                                    success: function (data) {
                                        if (url != '') {
                                            if (layout == 'grid') {
                                                $block.find('.products-grid').html(data);
                                            } else if (layout == 'slider'){
                                                $block.find('.products-carousel').html(data);
                                            } else if (layout == 'scroll') {
                                                $block.find('.products-flex').html(data);
                                            }
                                        }
                                    },
                                    complete: function () {
                                        if (layout == 'slider') {
                                            halo.productBlockSilder($block);
                                        }

                                        if (layout == 'scroll') {
                                            const enableHover = $block.find('[data-enable-hover]').attr('data-enable-hover')
                                            if (enableHover === 'true') {
                                                halo.productBlockScroller($block);
                                            }
                                        }   
                                        
                                        if(window.compare.show){
                                            var $compareLink = $('a[data-compare-link]');

                                            halo.setLocalStorageProductForCompare($compareLink);
                                        }

                                        halo.swapHoverVideoProductCard();

                                        if(window.wishlist.show){
                                            halo.setLocalStorageProductForWishlist();
                                        }

                                        if (halo.checkNeedToConvertCurrency()) {
                                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                        };

                                        if (window.review.show && $('.shopify-product-reviews-badge').length > 0) {
                                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                                        }

                                    }
                                });
                            } else {
                                $block.addClass('ajax-loaded');

                                if (layout == 'slider') {
                                    halo.productBlockSilder($block);
                                }

                                if (halo.checkNeedToConvertCurrency()) {
                                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                };
                            }
                        }
                    }
                });
            }

            load();
            window.addEventListener('scroll', load);
        },

        loaderRecommendationsBlock: function(){
            halo.buildRecommendationBlock();
        },

        scrollToReview: function() {
            var $scope = $('.productView-tab');

            if($scope.length){
                $doc.on('click', '.productView-details .halo-productReview', (event)  => {
                    event.preventDefault();

                    $('body,html').animate({
                        scrollTop: $scope.offset().top 
                    }, 1000);
                    var activeTab = $scope.find('[href="#tab-review"]');
                    var activeTabCustom = $scope.find('[href="#tab-customer-reviews"]');
                    var activeTabMb = $scope.find('[href="#tab-review-mobile"]');
                    var activeTabCustomMb = $scope.find('[href="#tab-customer-reviews-mobile"]');
                    if (!activeTab.hasClass('is-open') || !activeTabMb.hasClass('is-open') || !activeTabCustom.hasClass('is-open') || !activeTabCustomMb.hasClass('is-open')) {
                        activeTab[0]?.click();
                        activeTabMb[0]?.click();
                        activeTabCustom[0]?.click();
                        activeTabCustomMb[0]?.click();
                    }
                })
            }
        },

        closeAnnouncementBar: function (){
            var announcementEml = $('.announcement-bar'),
                closeAnnouncementElm = announcementEml.find('[data-close-announcement]');

            if ($.cookie('announcement') == 'closed') {
                announcementEml.remove();
            } else {
                announcementEml.css('opacity',1);
                announcementEml.css('visibility','visible');
            };
            closeAnnouncementElm.off('click.closeAnnouncementBar').on('click.closeAnnouncementBar', function (e) {
                e.preventDefault();
                e.stopPropagation();

                announcementEml.remove();
                $.cookie('announcement', 'closed', {
                    expires: 1,
                    path: '/'
                });
            });
        },

        sliderAnnouncementBar: function(){
            var announcement_bar = $('[data-announcement-bar]');
            var announcement_item = announcement_bar.find('.announcement-bar__message');


            if(announcement_item.length > 1){
                if(!announcement_bar.hasClass('slick-initialized')){
                    announcement_bar.slick({
                        infinite: true,
                        vertical: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                        arrows: announcement_bar.data('arrows'),
                        autoplay: true,
                        autoplaySpeed: 3000,
                        nextArrow: '<button type="button" class="slick-next"><svg viewBox="0 0 478.448 478.448" class="icon icon-chevron-right" id="icon-chevron-right"><g><g><polygon points="131.659,0 100.494,32.035 313.804,239.232 100.494,446.373 131.65,478.448 377.954,239.232"></polygon></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg viewBox="0 0 370.814 370.814" class="icon icon-chevron-left" id="icon-chevron-left"><g><g><polygon points="292.92,24.848 268.781,0 77.895,185.401 268.781,370.814 292.92,345.961 127.638,185.401"></polygon></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></button>',
                    });
                }
            }
        },

        headerMasonry: function(){
            $('.menu-dropdown__wrapper [data-masonry]').masonry({
              columnWidth: '.grid-sizer',
              itemSelector: '[data-gridItem]'
            });
        },

        initLiveChat: function () {
            var $item_globe = $('.live-wrapper-icon');
            $item_globe.on('click', function (e) {
                $(this).parent().toggleClass('active');          
            });

            $body.on('click', function (e) {
                if(($('.live_help').hasClass('active')) && ($(event.target).closest('.live_help').length === 0)){
                    e.preventDefault();
                    $('.live_help').removeClass('active');
                }
            });
        },

        headerdropdownCurrency: function() {
            if ($('.header-language_currency').length) {
                var curency_top = $('.dropdown-currency');
                $(document).on('click', '.header-language_currency .halo-top-currency .currency-dropdown', function(e) {
                    if (!curency_top.is(e.target) && curency_top.has(e.target).length == 0){
                        curency_top.toggleClass('show');
                    }
                });
              
                $(document).on('click', '.header-language_currency .halo-top-currency .dropdown-menu .dropdown-item', function(e) {
                    curency_top.removeClass('show');
                });

                $(document).on('click', function(event) {
                    if (curency_top.hasClass('show') && ($(event.target).closest('.halo-top-currency').length === 0)) {
                        curency_top.removeClass('show');
                    }
                });

                if($('.header').hasClass('header-03') || $('.header').hasClass('header-04') || $('.header').hasClass('header-05') || $('.header').hasClass('header-06') || $('.header').hasClass('header-07') || $('.header').hasClass('header-08')){
                    $(document).on('click', '.header-language_currency', function(e) {
                        if($('.header').hasClass('header-06') || $('.header').hasClass('header-08')){
                            if (!$('.top-language-currency').is(e.target) && $('.top-language-currency').has(e.target).length == 0){
                                $('.top-language-currency').toggleClass('show');
                            }
                        } else{
                            if (!$('.top-language-currency').is(e.target)){
                                $('.top-language-currency').toggleClass('show');
                            }
                        }
                    });
                    $(document).on('click', function(event) {
                        // if ($('.top-language-currency').hasClass('show') && ($(event.target).closest('.top-language-currency').length === 0)) {
                        //     $('.top-language-currency').removeClass('show');
                        // }
                        if (!$('.header-language_currency').is(event.target) && $('.header-language_currency').has(event.target).length == 0){
                            if ($('.top-language-currency').hasClass('show') && ($(event.target).closest('.top-language-currency').length === 0) && ($(event.target).closest('.header-language_currency').length === 0)) {
                                $('.top-language-currency').removeClass('show');
                            }
                        }
                    });
                }

            }
        },

        headerdropdownLanguage: function() {
            if ($('.header-language_currency').length) {
                $(document).on('click', '.header-language_currency .halo-top-language', function(e) {
                    $('.dropdown-language').toggleClass('show');
                });

                $(document).on('click', '.header-language_currency .halo-top-language .dropdown-menu .dropdown-item', function(e) {
                    $('.dropdown-language').removeClass('show');
                });

                $(document).on('click', function(event) {
                    if ($('.dropdown-language').hasClass('show') && ($(event.target).closest('.halo-top-language').length === 0)) {
                        $('.dropdown-language').removeClass('show');
                    }
                });
            }
        },

        headerSidebarSearch: function() {
            var headerSearchPC = $('.header-top .header__search .search_details'),
                headerSearchMB = $('#search-form-mobile .halo-sidebar-wrapper .search_details'),
                headerwraperSearchPC = $('.header-top .header__search'),
                headerwraperSearchMB = $('#search-form-mobile .halo-sidebar-wrapper'),
                searchDetails = $('.search_details');

            if ($(window).width() < 1025) {
                if($('.header').hasClass('header-01')){
                    headerSearchPC.appendTo(headerwraperSearchMB);
                }
                searchDetails.attr('open','true');
                $('[data-search-mobile]').on('click', (event) => {
                    event.preventDefault();
                    $('body').addClass('open_search_mobile');
                });
                $('[data-search-close-sidebar], .background-overlay').on('click', (event) => {
                    event.preventDefault();
                    $('body').removeClass('open_search_mobile');
                });
            }else{
                if($('.header').hasClass('header-01')){
                    headerSearchMB.appendTo(headerwraperSearchPC);
                }
                searchDetails.removeAttr('open');
                $(document).on('click', (event) =>{
                    if($('body').hasClass('open_search') && !$('.header').hasClass('header-02') && ($(event.target).closest('.header__search').length === 0)){
                        $('body').removeClass('open_search');
                        $('.search_details').removeAttr('open');
                    }
                });
                $('.search-modal__close-button').on('click', (event) => {
                    $('.search_details').removeAttr('open');
                });

                if($('.header').hasClass('header-02')){
                    searchDetails.attr('open','true'); 
                    $('[data-search-desktop]').on('click', (event) => {
                        event.preventDefault();
                        $('body').addClass('open_search_desktop');
                    });
                    $('[data-search-close-popup], .background-overlay').on('click', (event) => {
                        event.preventDefault();
                        $('body').removeClass('open_search_desktop');
                    });
                }
            }
        },

        headerStickySearchForm: function() {
            var iconSearchSlt = '[data-search-sticky-form]';
            if ($(window).width() > 1025) {
                $(document).off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('body').addClass('sticky-search-open');
                    $('.search_details').attr('open','true');
                });

                $(document).off('click.hideSearch').on('click.hideSearch', function(event) {
                    var formSearch = $('.search-modal__form'),
                        quickSearch = $('.quickSearchResultsWrap');
                    if ($('body').hasClass('sticky-search-open') && !formSearch.has(event.target).length && !quickSearch.has(event.target).length) {
                        $('body').removeClass('sticky-search-open');
                         $('.search_details').removeAttr('open');
                    }
                });
            }
        },

        menuSidebarMobile: function() {
            var buttonIconOpen = $('.mobileMenu-toggle'),
                buttonClose = $('.halo-sidebar-close, .background-overlay');

            buttonIconOpen.off('click.toggleCurrencyLanguage').on('click.toggleCurrencyLanguage', () =>{
                $body.addClass('menu_open');
                    if(window.mobile_menu == 'default'){
                        if(!$('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').length){
                            $('.header .header__inline-menu').appendTo('#navigation-mobile .site-nav-mobile.nav');
                        }
                    }
                    if(!$('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').length){
                        $('.header-top--wrapper .header-top--right .free-shipping-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                    }
                    if(!$('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').length){
                        $('.header-top--wrapper .header-top--right .customer-service-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                    }
                    if(!$('#navigation-mobile .site-nav-mobile.nav-account .header__location').length){
                        $('.header-top--wrapper .header-top--right .header__location').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                    }
                    if(!$('#navigation-mobile .top-language-currency').length){
                        if($('.header').hasClass('header-03')){
                            $('.header .header-bottom-right .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                        }else if($('.header').hasClass('header-05')){
                            $('.header .header-top--left .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                        }else{
                            $('.header .header-language_currency .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                        }
                    }
                    halo.productMenuSlider();
            });

            buttonClose.off('click.toggleCloseCurrencyLanguage').on('click.toggleCloseCurrencyLanguage', () =>{
                $body.removeClass('menu_open');
                $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
                    if (!$body.hasClass('menu_open')) {

                        if(!$('.header .header__inline-menu').length){
                            if($('.header').hasClass('header-03') || $('.header').hasClass('header-04') || $('.header').hasClass('header-07') || $('.header').hasClass('header-08')){
                                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper .header-bottom-left');
                            }else{
                                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper');
                            }
                        }
                        if(!$('.header-top--wrapper .header-top--right .free-shipping-text').length){
                            if(!$('.header-04').hasClass('style_2')){
                                $('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').insertBefore('.header-top--wrapper .header-top--right .header__group');
                            }
                        }
                        if(!$('.header-top--wrapper .header-top--right .header__location').length){
                            $('#navigation-mobile .site-nav-mobile.nav-account .header__location').insertBefore('.header-top--wrapper .header-top--right .header__group');
                        }
                        if(!$('.header-top--wrapper .header-top--right .customer-service-text').length){
                            if($('.header').hasClass('header-03')){
                                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .header__group .header__icon--wishlist');
                            }else{
                                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .top-language-currency');
                            }
                        }
                        if(!$('.header-language_currency .top-language-currency').length){
                            if($('.header').hasClass('header-03')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                            }else if($('.header').hasClass('header-04')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                            }else if($('.header').hasClass('header-05')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-top--wrapper .header-top--left .header-language_currency');
                            }else{
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').insertBefore('.header .header-language_currency .header__search');
                            }
                        }
                    }
                })
                    
            });
        },

        menuSidebarMobileToggle: function() {
            $body.on('click', '.site-nav-mobile .list-menu .menu_mobile_link', function (e) {
                if(!e.currentTarget.classList.contains('list-menu__item--end')){
                    e.preventDefault();
                    e.stopPropagation();
                    var $target = $(this);
                    var $parent = $target.parent();
                    var $menuDislosure1 = $target.parent().find('ul.list-menu--disclosure-1');
                    
                    $parent.removeClass('is-hidden').addClass('is-open').removeClass('d-none');
                    $menuDislosure1.off('transitionend.toggleMenuLink1').on('transitionend.toggleMenuLink1', () => {
                        if ($parent.hasClass('is-open') && !$parent.hasClass('is-hidden') && !$parent.hasClass('d-none')) {
                            $parent.addClass('d-none')
                            $parent.siblings().removeClass('is-open').addClass('is-hidden').removeClass('d-none');
                        }
                    })

                    // $target.parent().siblings().removeClass('is-open').addClass('is-hidden');
                    // $target.parent().removeClass('is-hidden').addClass('is-open');
                }
            });

            $body.on('click', '.site-nav-mobile .list-menu .menu_mobile_link_2', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $target = $(this);
                var $target = $(this);
                var $parent = $target.parent().parent();
                var $menuDislosure2 = $target.parent().find('ul.list-menu--disclosure-2');
                var $parentToScroll = $target.parent().parent().parent().parent().parent().parent();

                $parent.removeClass('is-hidden').addClass('is-open').removeClass('d-none');
                $menuDislosure2.off('transitionend.toggleMenuLink2').on('transitionend.toggleMenuLink2', () => {
                    if ($parent.hasClass('is-open') && !$parent.hasClass('is-hidden') && !$parent.hasClass('d-none')) {
                        $parent.addClass('d-none')
                        $parent.siblings().removeClass('is-open').addClass('is-hidden').removeClass('d-none');
                        $parentToScroll.animate({
                            scrollTop: 0
                        }, 0);
                    }
                })

                // if($('.header').hasClass('header-04') || $('.header').hasClass('header-01') || $('.header').hasClass('header-02')){
                    // $target.parent().parent().siblings().removeClass('is-open').addClass('is-hidden');
                    // $target.parent().parent().removeClass('is-hidden').addClass('is-open');
                    // $target.parent().parent().parent().parent().parent().parent().animate({
                    //     scrollTop: 0
                    // }, 0);
                // } else{
                //     $target.parents('.site-nav').siblings().removeClass('is-open').addClass('is-hidden');
                //     $target.parents('.site-nav').removeClass('is-hidden').addClass('is-open');
                //     $target.parents('.menu-dropdown__wrapper').animate({
                //         scrollTop: 0
                //     }, 0);
                // }
                    
                if($('.menu-dropdown').hasClass('megamenu_style_4') || $('.menu-dropdown').hasClass('megamenu_style_1')){
                    $target.parents('.menu-dropdown').animate({
                        scrollTop: 0
                    }, 0);
                }

                $target.parents('.menu-dropdown').addClass('is-overflow');
            });

            $body.on('click', '.nav-title-mobile', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $target = $(this),
                    $parentLv1 = $target.parent().parent().parent().parent('.is-open'),
                    $parentLv2 = $target.parent().parent().parent('.is-open'),
                    $parentLv3 = $target.parent().parent('.is-open');

                $parentLv1.siblings().removeClass('is-hidden');
                $parentLv1.removeClass('is-open').removeClass('d-none');
                $parentLv2.siblings().removeClass('is-hidden');
                $parentLv2.removeClass('is-open').removeClass('d-none');
                $parentLv3.siblings().removeClass('is-hidden');
                $parentLv3.removeClass('is-open').removeClass('d-none');
                $('.menu-dropdown').removeClass('is-overflow');
            });

            if(window.mobile_menu != 'default'){
                $doc.on('click', '[data-mobile-menu-tab]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var tabItem = event.currentTarget.closest('li'),
                        tabTarget = event.currentTarget.dataset.target;

                    if(!tabItem.classList.contains('is-active')){

                        document.querySelector('[data-navigation-tab-mobile]').querySelectorAll('li').forEach((element) =>{
                            if(element != tabItem){
                                element.classList.remove('is-active');
                            } else {
                                element.classList.add('is-active');

                                document.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((tab) =>{
                                    if(tab.getAttribute('id') == tabTarget) {
                                        tab.classList.remove('is-hidden');
                                        tab.classList.add('is-visible');
                                    } else {
                                        tab.classList.remove('is-visible');
                                        tab.classList.add('is-hidden');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },

        initMultiTabMobile: function() {
            if ($win.width() < 1025) {
                if(window.mobile_menu == 'custom'){
                    var chk = false,
                        menuElement = $('[data-section-type="menu"]'),
                        menuMobile = $('[data-navigation-mobile]'),
                        menuTabMobile = $('[data-navigation-tab-mobile]');

                        document.body.addEventListener('touchstart', () => {
                            if (chk == false) {
                                chk = true;
                                const content = document.createElement('div');
                                const tab = document.createElement('ul');
                                
                                Object.assign(tab, {
                                    className: 'menu-tab list-unstyled'
                                });

                                tab.setAttribute('role', 'menu');
                                
                                menuElement.each((index, element) => {
                                    var currentMenu = element.querySelector('template').content.firstElementChild.cloneNode(true);
                                    
                                    if(index == 0){
                                        currentMenu.classList.add('is-visible'); 
                                    } else {
                                        currentMenu.classList.add('is-hidden');
                                    }
                                    
                                    content.appendChild(currentMenu);
                                });

                                content.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((element, index) => {
                                    var tabTitle = element.dataset.heading,
                                        tabId = element.getAttribute('id'),
                                        tabElement = document.createElement('li');

                                    Object.assign(tabElement, {
                                        className: 'item'
                                    });

                                    tabElement.setAttribute('role', 'menuitem');

                                    if (index == 0) {
                                        tabElement.classList.add('is-active');
                                    }

                                    tabElement.innerHTML = `<a class="link" href="#" data-mobile-menu-tab data-target="${tabId}">${tabTitle}</a>`;

                                    tab.appendChild(tabElement);
                                });

                                menuTabMobile.html(tab);
                                menuMobile.html(content.innerHTML);
                            }
                        }, false);
                }
            }
        },

        clickedActiveProductTabs: function() {
            var load = function() {
              var productTabsSection = $('[data-product-tab-block]');
              productTabsSection.each(function (index, element) {
                
                  var top = element.getBoundingClientRect().top,
                      $block = $(element);
                  var self = $(this),
                      listTabs = self.find('.list-product-tabs'),
                      tabLink = listTabs.find('[data-product-tabTop]'),
                      tabContent = self.find('[data-product-TabContent]'),
                      limit = self.data('limit');

                  var linkActive = listTabs.find('.tab-links.active'),
                      activeTab = self.find('.product-tabs-content .tab-content.active');
                      
                  if (!$block.hasClass('ajax-loaded')) {
                    if (top < window.innerHeight) {
                        halo.doAjaxProductTabs(
                            linkActive.data('href'), 
                            activeTab.find('.loading'), 
                            activeTab.find('.products-load'), 
                            self.attr('sectionid'), 
                            limit,
                            self
                        );
                    }
                  }
                  tabLink.off('click').on('click', function (e) {
                      e.preventDefault();
                      e.stopPropagation();

                      if($(this).hasClass('active')) {
                          return;
                      }

                      if (!$(this).hasClass('active')) {
                          var curTab = $(this),
                              curTabContent = $(curTab.data('target'));

                          tabLink.removeClass('active');
                          tabContent.removeClass('active');

                          if (!curTabContent.hasClass('loaded')) {
                              halo.doAjaxProductTabs(curTab.data('href'), curTabContent.find('.loading'), curTabContent.find('.products-load'), self.attr('sectionid'), limit);
                          }
                          
                          curTab.addClass('active');
                          curTabContent.addClass('active');
                          curTabContent.find('.slick-slider').slick('refresh');
                      };
                  });
              });
            };
            
            load();
            window.addEventListener('scroll', load);
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent, sectionId, limit, self) {
            $.ajax({
                type: "get",
                url: handle,
                data: {
                    constraint: `sectionId=${handle}+limit=${limit}`
                },

                beforeSend: function () {
                    loadingElm.text('Loading... please wait');
                    if (self != undefined) {
                        self.addClass('ajax-loaded');
                    }
                },

                success: function (data) {
                    loadingElm.hide();

                    if (handle == '?view=ajax_product_block') {
                        loadingElm.text('Please link to collections').show();
                        curTabContent.parent().addClass('loaded');
                    } else {    
                        curTabContent.html(data);
                        curTabContent.parent().addClass('loaded');

                        if(window.wishlist.show){
                            halo.setLocalStorageProductForWishlist();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };
                    };
                },
                complete: function () {
                    if (curTabContent.hasClass('products-carousel')) {
                        halo.productBlockSilder(curTabContent.parent());
                    }

                    if (window.review.show && $('.shopify-product-reviews-badge').length > 0) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    }
                },
                error: function (xhr, text) {
                    loadingElm.text('Sorry, there are no products in this collection').show();
                }
            });
        },

        addEventLookbookModal: function (sectionId) {
            if (window.innerWidth <= 1024) return;
            const wrapper = document.getElementById(`${sectionId}`);

            $(wrapper)
                .off("click.addEvenLookbookModal touchstart.addEvenLookbookModal", "[data-lookbook-icon]")
                .on("click.addEvenLookbookModal touchstart.addEvenLookbookModal", "[data-lookbook-icon]", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var handle = $(this).data("handle"),
                        position = $(this);

                    const activeGlyphicon = e.currentTarget;
                    activeGlyphicon.classList.add("active");

                    halo.doAjaxAddLookbookModal(handle, position);

                    // set events to close modal
                    $doc.on("click", (e) => {
                        if ($body.hasClass("popup-lookbook-product-style-1") && $(e.target).closest("[data-lookbook-popup].style-1").length == 0) {
                            $(".halo-lookbook-popup.style-1").fadeOut(250);
                            $body.removeClass("popup-lookbook-product-style-1");
                            var activeGlyphicons = $(wrapper).find("[data-lookbook-icon].active");
                            activeGlyphicons.each(function () {
                                $(this).removeClass("active");
                            });
                            return false;
                        }
                    });

                    $(activeGlyphicon).on("click", () => {
                        if ($body.hasClass("popup-lookbook-product-style-1")) {
                            $(".halo-lookbook-popup.style-1").fadeOut(250);
                            $body.removeClass("popup-lookbook-product-style-1");
                            var activeGlyphicons = $(wrapper).find("[data-lookbook-icon].active");
                            activeGlyphicons.each(function () {
                                $(this).removeClass("active");
                            });
                            return false;
                        }
                    });
                });
        },

        getProductDataForLookbook(lookbookIcon) {
            const handle = lookbookIcon.dataset.handle;
            
            $.ajax({
                type: "get",
                dataType: "json",
                url: window.routes.root + "/products/" + handle + "?view=ajax_card",
                success: function (data) {
                    const product = data.product

                    let title, price, priceCompare, link, vendor, image

                    if (product.variants.length > 0) {
                        title = product.title;
                        price = `${product.variants[0].price}`;
                        priceCompare = `${product.variants[0].compare_at_price}`;
                        link = `${window.routes.root}/products/${handle}`;
                        vendor = product.vendor;
                        image = product.image.src;
                    } else {
                        title = product.title 
                        price = `${product.price}`;
                        priceCompare = `${product.compare_at_price}`;
                        link = `${window.routes.root}/products/${handle}`;
                        vendor = product.vendor;
                        image = product.image.src;
                    }

                    lookbookIcon.dataset.title = title;
                    lookbookIcon.dataset.price = price;
                    lookbookIcon.dataset.priceCompare = priceCompare;
                    lookbookIcon.dataset.link = link;
                    lookbookIcon.dataset.vendor = vendor;
                    lookbookIcon.dataset.image = image;

                    lookbookIcon.classList.add('data-fetched')
                },
                complete: function () {},
            });
        },

        createFixedLookbook: function (dot, lookbookBackgroundColor, lookbookTextColor) {
            const handle = dot.dataset.handle;
            const dotContainer = dot.closest("[data-lookbook-item-container]");
            const dotLeftPosition = dot.offsetLeft;
            const dotTopPosition = dot.offsetTop;

            let topPosition = ((dotTopPosition - 50) * 100) / dotContainer.getBoundingClientRect().height;
            let leftPosition = ((dotLeftPosition - 170) * 100) / dotContainer.getBoundingClientRect().width;

            let swapped = false;

            if (leftPosition < 0) {
                // flip the side of the popup arrow if the lookbook is outside of its container's left side
                leftPosition *= -1;
                swapped = true;
            }

            const haloLookBookPopup = document.createElement("div");
            haloLookBookPopup.classList.add("halo-lookbook-popup", "style-2", "fixed");
            haloLookBookPopup.dataset.lookbookPopup = "";

            const haloPopupWrapper = document.createElement("div");
            haloPopupWrapper.classList.add("halo-popup-wrapper", "style-2", "fixed");

            const haloPopupContent = document.createElement("div");
            haloPopupContent.classList.add("halo-popup-content", "lookbook-content", "custom-scrollbar");

            haloPopupWrapper.appendChild(haloPopupContent);
            haloLookBookPopup.appendChild(haloPopupWrapper);

            if (lookbookBackgroundColor) {
                haloPopupWrapper.style.setProperty("--lookbook-background-color", lookbookBackgroundColor);
            }

            if (lookbookTextColor) {
                haloPopupWrapper.style.setProperty("--lookbook-text-color", lookbookTextColor);
            }

            // creating skeleton
            const skeletonData = `   <div class="product-item style-2">
                        <div class="card style-2"">
                            <div class="card-information">
                                <div class="card-information__wrapper text-center">
                                    <a class="card-title link-underline card-title-ellipsis" href="javascript:void(0)">
                                        <span class="text">
                                            <span style="opacity: 0;">Lorem Ipsum Commopolis</span>
                                        </span>
                                    </a>
                                    <div class="card-price">
                                        <div class="price  price--on-sale">
                                            <span class="money" style="opacity: 0;">Lorem Ipsum</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                `;
            // end creating skeleton

            haloPopupContent.innerHTML = skeletonData;

            haloLookBookPopup.style.left = `${leftPosition}%`;
            haloLookBookPopup.style.top = `${topPosition}%`;

            if (swapped) {
                haloLookBookPopup.classList.add("swapped");
            }

            const titleText = dot.dataset.title;
            const priceText = `${Symbol}${dot.dataset.price}`;
            const link = `${window.routes.root}/products/${handle}`;

            if (titleText && priceText) {
                const titleElement = haloLookBookPopup.querySelector(".halo-popup-wrapper.style-2 .lookbook-content .card-title .text");
                titleElement.innerHTML = titleText;
                titleElement.setAttribute("href", link);

                const priceElement = haloLookBookPopup.querySelector(".halo-popup-wrapper.style-2 .lookbook-content .card-price .price .money");
                priceElement.innerHTML = priceText;
                priceElement.style.opacity = "1";

                const cardElement = haloLookBookPopup.querySelector(".halo-popup-wrapper.style-2");
                $(cardElement)
                    .off("click")
                    .on("click", () => {
                        window.location.href = link;
                    });

                dotContainer.appendChild(haloLookBookPopup);

                setTimeout(() => {
                    haloLookBookPopup.classList.add("visible");
                    Currency.convertAll(window.shop_currency, $("#currencies .active").attr("data-currency"), "span.money", "money_format");
                }, 10);
            }
        },

        createLookbookModalForSeperateDot: function (dot, lookbookBackgroundColor, lookbookTextColor) {
            const position = $(dot).find(".glyphicon");
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = 220,
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;

            let pushToRight;
            if (window.innerWidth > 767) {
                if (left > innerLookbookModal + 31) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " + " + "35px" + ")";
                    pushToRight = false;
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "50px" + ")";
                    pushToRight = true;
                }
                newtop = top - (innerLookbookModal / 4 - 10) + "px";
            } else {
                newleft = left;
                newtop = top - 10 + "px";
            }

            newtop = top - (innerLookbookModal / 4 - 10) + "px";

            const haloLookBookPopup = document.createElement("div");
            haloLookBookPopup.classList.add("halo-lookbook-popup", "style-2");
            haloLookBookPopup.dataset.lookbookPopup = "";

            const haloPopupWrapper = document.createElement("div");
            haloPopupWrapper.classList.add("halo-popup-wrapper", "style-2");

            const haloPopupContent = document.createElement("div");
            haloPopupContent.classList.add("halo-popup-content", "lookbook-content", "custom-scrollbar");

            haloPopupWrapper.appendChild(haloPopupContent);
            haloLookBookPopup.appendChild(haloPopupWrapper);

            if (lookbookBackgroundColor) {
                haloPopupWrapper.style.setProperty("--lookbook-background-color", lookbookBackgroundColor);
            }

            if (lookbookTextColor) {
                haloPopupWrapper.style.setProperty("--lookbook-text-color", lookbookTextColor);
            }

            if (pushToRight) {
                $(haloPopupWrapper).css({
                    "margin-left": "auto",
                    "margin-right": "0",
                });
                $(haloPopupWrapper).addClass("swapped");
            } else {
                $(haloPopupWrapper).css({
                    "margin-right": "auto",
                    "margin-left": "0",
                });
            }

            // creating skeleton
            const skeletonData = `   <div class="product-item style-2">
                        <div class="card style-2"">
                            <div class="card-information">
                                <div class="card-information__wrapper text-center">
                                    <a class="card-title link-underline card-title-ellipsis" href="javascript:void(0)">
                                        <span class="text">
                                            <span style="opacity: 0;">Lorem Ipsum Commopolis</span>
                                        </span>
                                    </a>
                                    <div class="card-price">
                                        <div class="price  price--on-sale">
                                            <span class="money" style="opacity: 0;">Lorem Ipsum</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                `;
            // end creating skeleton

            haloPopupContent.innerHTML = skeletonData;

            haloLookBookPopup.style.left = newleft;
            haloLookBookPopup.style.top = newtop;

            const titleText = dot.dataset.title;
            const priceText = `${window.currencySymbol}${dot.dataset.price}`;
            const link = `${window.routes.root}/products/${dot.dataset.handle}`;
            const src = dot.dataset.image;

            if (titleText && priceText) {
                const titleElement = haloLookBookPopup.querySelector(".halo-popup-wrapper.style-2 .lookbook-content .card-title-ellipsis .text");
                titleElement.innerHTML = titleText;
                titleElement.setAttribute("href", link);

                const priceElement = haloLookBookPopup.querySelector(".halo-popup-wrapper.style-2 .lookbook-content .card-price .price .money");
                priceElement.innerHTML = priceText;
                priceElement.style.opacity = "1";

                const cardElement = haloLookBookPopup.querySelector(".halo-popup-wrapper.style-2");
                $(cardElement)
                    .off("click")
                    .on("click", () => {
                        window.location.href = link;
                    });

                document.body.appendChild(haloLookBookPopup);

                setTimeout(() => {
                    haloLookBookPopup.classList.add("visible");
                    Currency.convertAll(window.shop_currency, $("#currencies .active").attr("data-currency"), "span.money", "money_format");
                }, 10);
                requestAnimationFrame(() => {});
            }
            return haloLookBookPopup;
        },

        addEventLookbookModalStyle2: function (sectionId, showLookbookByDefault) {
            if (window.innerWidth <= 1024) return;
            const wrapper = document.getElementById(`${sectionId}`);
            const imageGalleryContainer = wrapper.querySelector("[data-show-lookbook-container]");
            const enableDots = imageGalleryContainer.dataset.dotsEnabled;
            const lookbookBackgroundColor = imageGalleryContainer.dataset.lookbookBackgroundColor;
            const lookbookTextColor = imageGalleryContainer.dataset.lookbookTextColor;

            if (showLookbookByDefault === "true") {
                console.log("fixed lookbook");
                // show lookbook without the need to hover
                const dots = wrapper.querySelectorAll("[data-lookbook-icon]");

                const checkDataInterval = setInterval(() => {
                    const isLoaded = [...dots].every((dot) => dot.dataset.title != null);
                    console.log("is checking: ", isLoaded);
                    if (isLoaded) {
                        clearInterval(checkDataInterval);
                        dots.forEach((dot) => {
                            dot.style.visibility = "hidden";
                            halo.createFixedLookbook(dot, lookbookBackgroundColor, lookbookTextColor);
                        });
                    }
                }, 50);
                return;
            }
            if (enableDots === "true") {
                // show the lookbook of the hovered dot
                $(wrapper)
                    .off("mouseenter.addEvenLookbookModal touchstart.addEvenLookbookModal", "[data-lookbook-icon]")
                    .on("mouseenter.addEvenLookbookModal touchstart.addEvenLookbookModal", "[data-lookbook-icon]", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var handle = $(this).data("handle"),
                            position = $(this);
                        const dot = position[0];
                        const haloLookBookPopup = halo.createLookbookModalForSeperateDot(dot, lookbookBackgroundColor, lookbookTextColor);
                        document.body.style.cursor = "pointer";

                        // set event to close modal
                        $(haloLookBookPopup).on("mouseleave", function () {
                            haloLookBookPopup.classList.remove("visible");
                            document.body.style.cursor = "auto";
                            setTimeout(() => {
                                $(haloLookBookPopup).remove();
                            }, 350);
                            return false;
                        });
                    });
            } else {
                // show all the lookbooks inside the same set
                const galleryImages = wrapper.querySelectorAll("[data-lookbook-item-container]");
                let lookbookPopupElements;
                galleryImages.forEach((image) => {
                    image.addEventListener("mouseenter", () => {
                        const lookbookDots = [...image.querySelectorAll("[data-lookbook-icon]")];
                        if (image.classList.contains("has-popup")) return;
                        image.classList.add("has-popup");
                        lookbookPopupElements = lookbookDots.map((dot) => {
                            const handle = dot.dataset.handle;
                            const position = $(dot).find(".glyphicon");
                            return halo.createLookbookModalForSeperateDot(dot, lookbookBackgroundColor, lookbookTextColor);
                        });
                    });

                    // set events to close modal
                    image.addEventListener("mouseleave", (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const stillInLookbook = lookbookPopupElements.some((lookbookPopup) => {
                            const box = lookbookPopup.getBoundingClientRect();
                            // checking if the cursor is still being hovered upon lookupPopups which may lie outside the image
                            if (e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom) {
                                return true;
                            } else {
                                return false;
                            }
                        });

                        if (stillInLookbook) {
                            lookbookPopupElements.forEach((lookbookPopup) => {
                                lookbookPopup.addEventListener("mouseleave", (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    const galleryBox = image.getBoundingClientRect();
                                    if (e.clientX >= galleryBox.left && e.clientX <= galleryBox.right && e.clientY >= galleryBox.top && e.clientY <= galleryBox.bottom) return;
                                    lookbookPopupElements.forEach((lookbookPopup) => {
                                        lookbookPopup.classList.remove("visible");
                                        setTimeout(() => {
                                            $(lookbookPopup).remove();
                                        }, 350);
                                    });

                                    image.classList.remove("has-popup");
                                });
                            });
                        } else {
                            lookbookPopupElements.forEach((lookbookPopup) => {
                                lookbookPopup.classList.remove("visible");
                                setTimeout(() => {
                                    $(lookbookPopup).remove();
                                }, 350);
                            });
                            image.classList.remove("has-popup");
                        }
                    });
                });
            }
        },

        doAjaxAddLookbookModal: function (handle, position) {
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = $(".halo-lookbook-popup.style-1").innerWidth(),
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;

            if (window.innerWidth > 767) {
                if (left > innerLookbookModal + 31) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " - " + "20px" + ")";
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                }

                newtop = top - innerLookbookModal / 2 + "px";
            } else {
                newleft = 0;
                newtop = top + 10 + "px";
            }

            $doc.ajaxStop(() => {
                isAjaxLoading = false;
            });

            // start creating skeleton before getting real data
            const skeletonData = `   <div class="product-item">
                    <div class="card">
                        <div class="card-product">
                            <div class="card-product__wrapper">
                                <a class="card-media card-media--adapt media--hover-effect animated-loading" style="width: 100%; max-height: 226px;"></a>
                            </div>
                        </div>
                        <div class="card-information">
                            <div class="card-information__wrapper text-center">
                                <div class="card-information__group card-information__group-2">
                                    <div class="card-vendor animated-loading"">
                                        <span style="opacity: 0;">Lorem Ipsum</span>
                                    </div>
                                </div>
                                <a class="card-title link-underline card-title-ellipsis">
                                    <span class="text animated-loading">
                                        <span style="opacity: 0;">Lorem Ipsum Commopolis</span>
                                    </span>
                                </a>
                                <div class="card-price animated-loading">
                                    <div class="price  price--on-sale">
                                        <span style="opacity: 0;">Lorem Ipsum</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            `;
            // end creating skeleton

            $(".halo-lookbook-popup.style-1 .halo-popup-wrapper.style-1 .lookbook-content").html(skeletonData);

            $(".halo-lookbook-popup.style-1").css({
                left: newleft,
                top: newtop,
            });

            $body.addClass("popup-lookbook-product-style-1");

            $(".halo-lookbook-popup.style-1").fadeIn(250);
            $.ajax({
                type: "get",
                url: window.routes.root + "/products/" + handle + "?view=ajax_card",

                success: function (data) {
                    $(".halo-lookbook-popup.style-1 .halo-popup-wrapper.style-1 .lookbook-content").html(data);
                },

                complete: function () {
                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $("#currencies .active").attr("data-currency"), "span.money", "money_format");
                    }
                },
            });
        },

        addEventLookbookModalMobile: function (sectionId) {
            if (window.innerWidth > 1024) return;
            const wrapper = document.getElementById(`${sectionId}`);
            const imagesContainer = wrapper.querySelector("[data-show-lookbook-container]");
            let wrapperType
            if (sectionId.startsWith('collection-lookbook')) {
                wrapperType = 'collection-lookbook'
            } else if (sectionId.startsWith('large-lookbook-banner')) {
                wrapperType = 'large-lookbook-banner'
            } else {
                wrapperType = imagesContainer.classList.contains("articleGallery-slider") ? "gallery" : "slideshow";
            }

            const dots = imagesContainer.querySelectorAll("[data-lookbook-icon]");
            const mobileDotsEnabled = wrapperType === 'collection-lookbook' || wrapperType === 'large-lookbook-banner' ? 'true' : imagesContainer.dataset.dotsMobileEnabled;
            const mobilePopupModalLayer = document.querySelector("[data-lookbook-popup-mobile]");
            const mobilePopupModalContainer = document.querySelector("[data-lookbook-mobile-images-container]");
            const closeMobileLookbookPopup = mobilePopupModalLayer.querySelector(".close-modal");

            const checkDataInterval = setInterval(() => {
                const isLoaded = [...dots].every((dot) => dot.dataset.title != null);
                if (isLoaded) {
                    clearInterval(checkDataInterval);

                    if (mobileDotsEnabled === "true") {
                        if (wrapperType === "gallery") {
                            dots.forEach((dot) => {
                                dot.addEventListener("click", (e) => {
                                    halo.handleLookbookModalIconMobileClick(e, true);
                                });
                            });
                        } else {
                            wrapper.querySelectorAll("[data-show-lookbook-container]").forEach((imageContainer) => {
                                const dots = imageContainer.querySelectorAll("[data-lookbook-icon]");
                                dots.forEach((dot) => {
                                    dot.addEventListener("click", (e) => {
                                        halo.handleLookbookModalIconMobileClick(e, true);
                                    });
                                });
                            });
                        }
                    } else {
                        if (wrapperType === "gallery") {
                            const hasFancyBoxes = imagesContainer.querySelectorAll("[data-fancybox]").length > 0;
                            hasFancyBoxes &&
                                imagesContainer.querySelectorAll(".fancybox-disabled").forEach((image) => {
                                    delete image.dataset.fancybox;
                                    image.addEventListener("click", (e) => {
                                        halo.handleLookbookModalIconMobileClick(e, false);
                                    });
                                });
                        } else {
                            wrapper.querySelectorAll("[data-show-lookbook-container]").forEach((imageContainer) => {
                                const image = imageContainer.querySelector("[data-lookbook-item-container]");
                                image.addEventListener("click", (e) => {
                                    halo.handleLookbookModalIconMobileClick(e, false);
                                });
                            });
                            imagesContainer.querySelectorAll("[data-lookbok-item-container]").forEach((image) => {
                                image.addEventListener("click", (e) => {
                                    halo.handleLookbookModalIconMobileClick(e, false);
                                });
                            });
                        }
                    }
                }
            }, 50);

            // addEventListener to close modal
            mobilePopupModalLayer.addEventListener("click", (e) => {
                if (e.target.closest("[data-lookbook-popup-mobile-wrapper]") != null) return;
                document.body.classList.remove("mobile-popup-active");
                mobilePopupModalLayer.addEventListener("transitionend", () => {
                    halo.mobileLookbookModalSlideDown(mobilePopupModalContainer);
                });
            });

            closeMobileLookbookPopup.addEventListener("click", () => {
                document.body.classList.remove("mobile-popup-active");
                mobilePopupModalLayer.addEventListener("transitionend", () => {
                    this.mobileLookbookModalSlideDown(mobilePopupModalContainer);
                });
            });
        },

        handleLookbookModalIconMobileClick: function (e, enableMobileDots) {
            e.preventDefault();
            e.stopPropagation();

            const imageContainer = e.target.closest("[data-lookbook-item-container]");
            const dotsInSameContainer = imageContainer.querySelectorAll("[data-lookbook-icon]");
            const selectedHandle = e.target.closest("[data-lookbook-icon]")?.dataset.handle;

            // setting the dots and image container OR the image itself in case mobile dots are enabled

            dotsInSameContainer.forEach((dot, index) => {
                halo.createLookbookModalMobile(dot, selectedHandle, enableMobileDots, index, dotsInSameContainer.length);
            });
        },

        createLookbookModalMobile: function (dot, selectedHandle = null, enableMobileDots, index, itemsAmount) {
            const handle = dot.dataset.handle;
            const mobilePopupModalLayer = document.querySelector("[data-lookbook-popup-mobile]");
            const mobilePopupModalContainer = document.querySelector("[data-lookbook-mobile-images-container]");
            const showProductInfo = dot.closest("[data-show-lookbook-container]").dataset.showLookbookInfo || 'true';
            
            // creating the product image card for product handle
            const lookBookMobileImage = document.createElement("div");
            lookBookMobileImage.classList.add("lookbook-mobile-item");
            lookBookMobileImage.dataset.lookbookMobileItem = "true";

            const productImageContainer = document.createElement("div");
            productImageContainer.classList.add("img-box");

            const a = document.createElement("a");
            a.classList.add("lookbook-mobile-image-container");

            const img = document.createElement("img");
            a.appendChild(img);
            productImageContainer.appendChild(a);

            lookBookMobileImage.appendChild(productImageContainer);

            const titleElement = document.createElement("a");
            titleElement.classList.add("mobile-lookbook-title", "text-shorten");

            const priceElement = document.createElement("div");
            priceElement.classList.add("mobile-lookbook-price", "price");
            const priceContentString = "<div class='regular-price price__regular'><div class='last-price price__last'><span class='price-item price-item--regular'><span class='money'></span></span></div> </div> <div class='sale-price price__sale'><div class='price-at-compare price__compare'><span class='price-item price-item--regular'><span class='money'></span></span></div> <div class='last-price price__last'><span class='price-item price-item--sale'><span class='money'></span></span></div></div>"
            
            priceElement.innerHTML = priceContentString
            lookBookMobileImage.appendChild(titleElement);
            lookBookMobileImage.appendChild(priceElement);
            lookBookMobileImage.dataset.handle = handle;

            const title = dot.dataset.title;
            const price = dot.dataset.price;
            const priceCompare = dot.dataset.priceCompare
            const link = `${window.routes.root}/products/${handle}`;
            const image = dot.dataset.image;

            if (title && price && link && image) {
                $(a).attr("href", link);
                $(img).attr("src", image);
                $(img).on('load', function() {
                    $(img).addClass('loaded')
                })
                if (showProductInfo === "true") {
                    titleElement.innerHTML = title 
                    titleElement.href = link 

                    priceElement.querySelectorAll('.last-price .money').forEach(el => {
                        console.log(el)
                        el.textContent = `${window.currencySymbol}${price}`
                    })

                    if (priceCompare) {
                        priceElement.classList.add('price--on-sale')
                        priceElement.querySelector('.price-at-compare .money').textContent = `${window.currencySymbol}${priceCompare}`
                        priceElement.querySelector('.price-at-compare .money').style.marginRight = '10px'
                        priceElement.querySelector('.regular-price').style.display = 'none'
                    } else {
                        priceElement.querySelector('.sale-price').style.display = 'none'
                    }
                    
                } else {
                    $(titleElement).remove();
                    $(priceElement).remove();
                }

                mobilePopupModalContainer.appendChild(lookBookMobileImage);
                if (mobilePopupModalContainer.querySelectorAll("[data-lookbook-mobile-item]").length >= 2) {
                    if (window.innerWidth < 767) {
                        mobilePopupModalContainer.style.width = "max-content";
                    }
                } else {
                    mobilePopupModalContainer.style.width = "100%";
                }

                if (!document.body.classList.contains("mobile-popup-active")) {
                    if (index === itemsAmount - 1) {
                        const images = [...mobilePopupModalContainer.querySelectorAll('img')]
                        let checkImagesLoaded = setInterval(() => {
                            if (images.every(img => img.classList.contains('loaded'))) {
                                clearInterval(checkImagesLoaded)
                                this.mobileLookbookModalSlideUp()
                            }
                        }, 50)
                    }
                }

                // On mobile, if a product dot is clicked, the modal will slide to the target product
                if (enableMobileDots) {
                    const selectedLookbookProduct = [...document.querySelectorAll("[data-lookbook-mobile-item]")].find((item) => item.dataset.handle === selectedHandle);
                    if (selectedLookbookProduct == null) return;
                    document.querySelector("[data-lookbook-popup-mobile-wrapper]").addEventListener("transitionend", () => {
                        selectedLookbookProduct.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    });
                }
            }
        },

        mobileLookbookModalSlideUp: function () {
            Currency.convertAll(window.shop_currency, $("#currencies .active").attr("data-currency"), "span.money", "money_format");
            document.body.classList.add("mobile-popup-active");
        },

        mobileLookbookModalSlideDown: function (mobilePopupModalContainer) {
            if (!document.body.classList.contains("mobile-popup-active")) {
                while (mobilePopupModalContainer.firstChild) {
                    mobilePopupModalContainer.removeChild(mobilePopupModalContainer.firstChild);
                }
            }
        },
        
        addEventLookbookModalStyle3: function (sectionId) {
            if (window.innerWidth <= 1024) return;
            const parentElement = document.querySelector(`#${sectionId}`)
            const dots = [...parentElement.querySelectorAll('[data-lookbook-icon]')]
            const lookbookImages = [...parentElement.querySelectorAll('[data-lookbook-image]')]

            const setDataToModal = (dot) => {
                const lookbookModal = dot.querySelector('.lookbook-modal')
                if (!lookbookModal) return 
                const title = dot.dataset.title
                const price = dot.dataset.price 
                const priceCompare = dot.dataset.priceCompare
                const vendor = dot.dataset.vendor
                const link = dot.dataset.link

                // Set link 
                const linkElement = lookbookModal.querySelector('.product-title')
                const linkArrowElement = lookbookModal.querySelector('.icon-wrapper')
                if (link) {
                    linkElement.href = link
                    linkArrowElement.href = link
                }

                // Set title
                const titleElement = lookbookModal.querySelector('.product-title .text')
                if (title) titleElement.textContent = title

                // Set price
                const priceCompareElement = lookbookModal.querySelector('.sale-price .price-at-compare .price-item .money')
                const lastPriceElements = lookbookModal.querySelectorAll('.product-price .last-price .price-item .money')

                if (price) lastPriceElements.forEach(priceElement => priceElement.textContent = `${window.currencySymbol}${price}`)
                if (priceCompare) {
                    const productPriceWrapper = lookbookModal.querySelector('.product-price')

                    priceCompareElement.textContent = `${window.currencySymbol}${priceCompare}`
                    lookbookModal.querySelector('.regular-price .last-price').style.display = 'none'
                    productPriceWrapper.classList.add('price--on-sale')
                } else {
                    lookbookModal.querySelector('.sale-price').style.display = 'none'
                }

            }

            const setLookbookAllEvent = (lookbookImage) => {
                const isStyle2 = lookbookImage.dataset.productsShowStyle == 2

                const showAllButton = lookbookImage.querySelector('[data-show-all-lookbook]')
                const closeButton = lookbookImage.querySelector('[data-lookbook-show-all-close]')

                showAllButton?.addEventListener('click', () => {
                    if (isStyle2) return lookbookImage.classList.add('show-all-products')
                    lookbookImage.classList.toggle('show-all')
                })

                closeButton?.addEventListener('click', () => {
                    lookbookImage.classList.remove('show-all-products')
                })
            }   

            let checkDataFetched = setInterval(() => {
                if (dots.every(dot => dot.classList.contains('data-fetched'))) {
                    dots.forEach(setDataToModal)
                    lookbookImages.forEach(setLookbookAllEvent)
                    clearInterval(checkDataFetched)
                }
            }, 10)
        },

        productBlockSilder: function(wrapper) {
            var productGrid = wrapper.find('.products-carousel'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemArrows = productGrid.data('item-arrows');

            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: true,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: 
                        [
                            {
                                breakpoint: 1599,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            return this.slidesToShow = itemToShow;
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 1024,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            if(itemToShow == 5 || itemToShow == 6){
                                                return this.slidesToShow = itemToShow - 1;
                                            } else {
                                                if (productGrid.parents('.collection-column-2').length){
                                                    return this.slidesToShow = 2;
                                                } else{
                                                    return this.slidesToShow = itemToShow;
                                                }
                                               
                                            }
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 991,
                                settings: {
                                    get slidesToShow(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            if (productGrid.parents('.product-block-has__banner').length && productGrid.parents('.product-block-has__banner').data('width-banner') > 40) {
                                                return this.slidesToShow = 2;
                                            }
                                            else {
                                                return this.slidesToShow = 3;
                                            }
                                        }
                                        else{
                                            if (productGrid.parents('.collection-column-2').length){
                                                return this.slidesToShow = 2;
                                            } else{
                                                return this.slidesToShow = 4;
                                            }
                                        }
                                    },
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    get slidesToShow(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            return this.slidesToShow = 2;
                                        }else{
                                            return this.slidesToShow = 3;
                                        }
                                    },
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 320,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });

                    if (!wrapper.hasClass('ajax-loaded')) {

                    }
                }
            }
        },

        productBlockInfiniteScroll: function() {
            var productBlock = $('[data-product-block], [data-product-tab-block]');

            productBlock.each((index, element) => {
                var $block = $(element),
                    showMore = $block.find('[data-product-infinite]');
            
                if (showMore.length > 0) {
                    showMore.find('.button').on('click', (event) => {
                        var showMoreButton = $(event.target);

                        if (!showMoreButton.hasClass('view-all')) {
                            event.preventDefault();
                            event.stopPropagation();

                            // var text = window.button_load_more.loading;

                            showMoreButton.addClass('is-loading');
                            // showMoreButton.text(text);

                            var url = showMoreButton.attr('data-collection'),
                                limit = showMoreButton.attr('data-limit'),
                                swipe = showMoreButton.attr('data-swipe'),
                                total = showMoreButton.attr('data-total'),
                                image_ratio = showMoreButton.attr('data-image-ratio'),
                                sectionId = showMoreButton.attr('sectionId'),
                                page = parseInt(showMoreButton.attr('data-page'));

                            halo.doProductBlockInfiniteScroll(url, total, limit, swipe, image_ratio, sectionId, page, showMoreButton, $block);
                        }
                    });
                }
            });
        },

        doProductBlockInfiniteScroll: function(url, total, limit, swipe, image_ratio, sectionId, page, showMoreButton, $block){
            $.ajax({
                type: 'get',
                url: window.routes.root + '/collections/' + url,
                cache: false,
                data: {
                    view: 'ajax_product_block_load_more',
                    constraint: 'limit=' + limit + '+page=' + page + '+sectionId=' + sectionId + '+imageRatio=' + image_ratio + '+swipe=' + swipe
                },
                beforeSend: function () {
                    // halo.showLoading();
                },
                success: function (data) {
                    $block.find('.products-grid').append(data);

                    var length = $block.find('.products-grid .product').length;

                    if($(data).length == limit && length < 50){
                        var text = window.button_load_more.default;

                        showMoreButton.removeClass('is-loading');
                        showMoreButton.attr('data-page', page + 1);
                        showMoreButton.find('span').text(text);
                    } else {
                        if (total > 50) {
                            var text = window.button_load_more.view_all;

                            showMoreButton.find('span').text(text);
                            showMoreButton.removeClass('is-loading');
                            showMoreButton.attr('href', window.routes.root + '/collections/' + url).addClass('view-all');
                        } else {
                            var text = window.button_load_more.no_more;

                            showMoreButton.find('span').text(text);
                            showMoreButton.removeClass('is-loading');
                            showMoreButton.attr('disabled', 'disabled');
                        }
                    }
                },
                complete: function () {
                    // halo.hideLoading();
                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    };

                    if (window.review.show && $('.shopify-product-reviews-badge').length > 0) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    }
                }
            });
        },

        productMenuSlider: function(){
            var productGrid = $('.megamenu_style_5');
            if(productGrid.length > 0) {
                productGrid.each((index, el) => {
                    let _self = $(el).find('.products-carousel'),
                        _dataRows = _self.data('row');
                    if(_self.not('.slick-initialized')) {
                        _self.slick({
                            mobileFirst: true,
                            adaptiveHeight: true,
                            vertical: false,
                            infinite: false,
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            arrows: false,
                            dots: true,
                            responsive: 
                            [
                                {
                                    breakpoint: 1024,
                                    settings: {
                                        slidesToShow: 3,
                                        slidesToScroll: 1,
                                    }
                                },
                                {
                                    breakpoint: 1500,
                                    settings: {
                                        slidesToShow: _dataRows,
                                        slidesToScroll: 1,
                                        dots: false
                                    }
                                }
                            ]
                        });
                    }
                })
            }
        },

        buildRecommendationBlock: function(){
            var $this = document.querySelector('[data-recommendations-block]'),
                layout = $this.dataset.layout;
                swipe = $this.dataset.swipe;

            const config = {
                rootMargin: '1000px'
            }

            const handleIntersection = (entries, observer) => {
                const recommendationsContainer = $this.querySelector('.wrapper-container');
                if (!entries[0].isIntersecting) return;
                if ($this.innerHTML.trim() != '' && !recommendationsContainer.classList.contains('product-recommendations-loading') && !recommendationsContainer.classList.contains('has-product')) return;
                recommendationsContainer.classList.add('has-product');

                fetch($this.dataset.url)
                .then(response => response.text())
                .then(text => {
                    const html = document.createElement('div');
                    html.innerHTML = text;
                    const recommendations = html.querySelector('[data-recommendations-block]');
                    if (recommendations && recommendations.innerHTML.trim().length) {
                        $this.innerHTML = recommendations.innerHTML;

                        if (layout == 'slider') {
                            halo.productBlockSilder($($this));
                        } else {
                            if(swipe == true){
                                console.log("ok");
                            }
                        }

                        var productItems = $($this).find('.product-item')
                        productItems.each(async (index, rawProduct) => {
                            var product = $(rawProduct);
                            var productId = product.data('product-id');
                            var productJson = product.data('json-product');
                            var handle = productJson.handle 
                            
                            await  $.ajax({
                                type: 'get',
                                url: window.routes.root + '/products/' + handle + '?view=ajax_variant_quantity',
                                beforeSend: function () {},
                                success: function (data) {
                                    const element = new DOMParser().parseFromString(data, 'text/html')
                                    const quantityInfo = JSON.parse(element.querySelector(`[data-quantity-product-id="${productId}"]`).innerHTML)
                                    window[`quick_view_inven_array_${productId}`] = quantityInfo
                                },      
                                error: function (xhr, text) {
                                    halo.showWarning($.parseJSON(xhr.responseText).description);
                                },
                                complete: function () {}
                            });
                        }) 

                        const loadingImages = $this.querySelectorAll('.media--loading-effect img');
                        this.observeImageLazyloaded(loadingImages);

                        if(window.compare.show){
                            var $compareLink = $('a[data-compare-link]');

                            halo.setLocalStorageProductForCompare($compareLink);
                        }

                        if(window.wishlist.show){
                            halo.setLocalStorageProductForWishlist();
                        }

                        if (window.review.show && $('.shopify-product-reviews-badge').length > 0) {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        }
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            }

            new IntersectionObserver(handleIntersection.bind($this), ({}, config)).observe($this);
        },

        initVideoPopup: function (){
            if ($(".video-open-popup ").length) {
            } else {return}
            $('.video-open-popup a').off('click').on('click',function(){
                let video_type = $(this).attr('data-type'),
                    video_src = $(this).attr('data-src'),
                    aspect_ratio = $(this).attr('aspect_ratio'),
                    modal = $('[data-popup-video]');

                const $content = `<div class="fluid-width-video-wrapper" style="padding-top: ${aspect_ratio}">
                                    ${video_type == 'youtube' ? 
                                        `<iframe
                                            id="player"
                                            type="text/html"
                                            width="100%"
                                            frameborder="0"
                                            webkitAllowFullScreen
                                            mozallowfullscreen
                                            allowFullScreen
                                            src="https://www.youtube.com/embed/${video_src}?autoplay=1&mute=1">
                                        </iframe>`
                                        :
                                        `<iframe 
                                            src="https://player.vimeo.com/video/${video_src}?autoplay=1&mute=1" 
                                            class="js-vimeo" 
                                            allow="autoplay; 
                                            encrypted-media" 
                                            webkitallowfullscreen 
                                            mozallowfullscreen 
                                            allowfullscreen">
                                        </iframe>`
                                    }
                                </div>`;
                modal.find('.halo-popup-content').html($content);
                $body.addClass('video-show');
            });

            $('[data-popup-video], [data-popup-video] .halo-popup-close, .background-overlay').on('click', function (e) {
                // e.preventDefault();
                // e.stopPropagation();
                let modalContent = $('[data-popup-video] .halo-popup-content');
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    $body.removeClass('video-show');
                    $('[data-popup-video] iframe').remove();
                };
            });
        },

        swapHoverVideoProductCard: function () {
            if (window.innerWidth > 1200) {
                $('.product-item .card').mouseenter(function(){
                    var chil = $(this).find('video');
                    var _chil = $(this).find('video').get(0);
                    if (chil.length > 0) {
                        _chil.play();
                    }
                });
                $('.product-item .card').mouseleave(function(){
                    var chil = $(this).find('video');
                    var _chil = $(this).find('video').get(0);
                    if (chil.length > 0) {
                        _chil.pause();
                    }
                })
            }
        },

        initGlobalCheckbox: function() {
            $doc.on('change', '.global-checkbox--input', (event) => {
                var targetId = event.target.getAttribute('data-target');

                if(event.target.checked){
                    $(targetId).attr('disabled', false);
                } else{
                    $(targetId).attr('disabled', true);
                }
            });

            $doc.on('click', '[data-term-condition]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                $body.addClass('term-condition-show');
            });

            $doc.on('click', '[data-close-term-condition-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                $body.removeClass('term-condition-show');
            });

            $doc.on('click', (event) => {
                setTimeout(() => {
                    if ($body.hasClass('cart-sidebar-show')) {
                        if (($(event.target).closest('[data-term-condition-popup]').length === 0)){
                            $body.removeClass('term-condition-show');
                        }
                    }
                    if ($body.hasClass('term-condition-show')) {
                        if ($(event.target).closest('[data-term-condition-popup]').length === 0){
                            $body.removeClass('term-condition-show');
                        }
                    }
                }, 10);
            });
        },

        initColorSwatch: function() {
            $('.card .swatch-label.is-active').trigger('click');

            $doc.on('click', '.card .swatch-label', (event) => {
                var $target = $(event.currentTarget),
                    title = $target.attr('title').replace(/^\s+|\s+$/g, ''),
                    product = $target.closest('.product-item'),
                    productJson = product.data('json-product'),
                    productTitle = product.find('.card-title'),
                    productAction = product.find('[data-btn-addtocart]'),
                    variantId = $target.data('variant-id'),
                    productHref = product.find('a').attr('href'),
                    oneOption = $target.data('with-one-option'),
                    newImage = $target.data('variant-img'),
                    mediaList = []; 

                $target.parents('.swatch').find('.swatch-label').removeClass('is-active');
                $target.addClass('is-active');

                if(productTitle.hasClass('card-title-change')){
                    if($body.hasClass('style_2_text_color_varriant')){
                        productTitle.find('[data-change-title]').text(title);
                    }else{
                        productTitle.find('[data-change-title]').text(' - ' + title);
                    }
                } else {
                    if($body.hasClass('style_2_text_color_varriant')){
                        productTitle.addClass('card-title-change').append('<span data-change-title>' + title + '</span>');
                    }else{
                        productTitle.addClass('card-title-change').append('<span data-change-title> - ' + title + '</span>');
                    }
                }

                const selectedVariant = productJson.variants.find(variant => variant.id === variantId);

                if (selectedVariant.compare_at_price > selectedVariant.price) {
                    product.find('.price__sale .price-item--regular').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format));
                    product.find('.price__sale .price-item--sale').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                    const labelSale = `-${Math.round((selectedVariant.compare_at_price - selectedVariant.price) * 100 / selectedVariant.compare_at_price)}%`;
                    product.find('.price__label_sale .label_sale').html(labelSale);
                } else {
                    product.find('.price__regular .price-item').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                }

                product.find('a:not(.single-action):not(.number-showmore)').attr('href', productHref.split('?variant=')[0]+'?variant='+ variantId);

                if (oneOption != undefined) {
                    var quantity = $target.data('quantity');

                    product.find('[name="id"]').val(oneOption);

                    if (quantity > 0) {
                        if(window.notify_me.show){
                            productAction
                                .removeClass('is-notify-me')
                                .addClass('is-visible');
                        } else {
                            productAction
                                .removeClass('is-soldout')
                                .addClass('is-visible');
                        }
                    } else {
                       if(window.notify_me.show){
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-notify-me');
                        } else {
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-soldout');
                        }
                    }

                    if(productAction.hasClass('is-soldout') || productAction.hasClass('is-notify-me')){
                        if(productAction.hasClass('is-notify-me')){
                            productAction.text(window.notify_me.button);
                        } else {
                            productAction
                                .text(window.variantStrings.soldOut)
                                .prop('disabled', true);
                        }
                    } else {
                        productAction
                            .text(window.variantStrings.addToCart)
                            .prop('disabled', false);
                    }
                } else {
                    if (productJson != undefined) {
                        if(window.quick_shop.show){
                            halo.checkStatusSwatchQuickShop(product, productJson);
                        }
                    }

                    product.find('.swatch-element[data-value="' + title + '"]').find('.single-label').trigger('click');
                }

                if (productJson.media != undefined) {
                    var mediaList = productJson.media.filter((index, element) => {
                        return element.alt === title;
                    });
                }

                if (mediaList.length > 0) {
                    if (mediaList.length > 1) {
                        var length = 2;
                    } else {
                        var length = mediaList.length;
                    }

                    for (var i = 0; i < length; i++) {
                        product.find('.card-media img:eq('+ i +')').attr('srcset', mediaList[i].src);
                    }
                } else {
                    if (newImage) {
                        product.find('.card-media img:nth-child(1)').attr('srcset', newImage);
                    }
                }
            });

            $doc.on('click', '.item-swatch-more a', (event) => {
                if ($(event.target).closest('.swatch').hasClass('show--more')) {
                    $(event.target).closest('.swatch').removeClass('show--more');
                    $(event.target).find('span:eq(0)').text('+');
                } else {
                    $(event.target).closest('.swatch').addClass('show--more');
                    $(event.target).find('span:eq(0)').text('-'); 
                }
            })
        },

        initQuickShop: function() {
            if(window.quick_shop.show) {
                $doc.on('click', '[data-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.target),
                        product = $target.parents('.product-item'),
                        productJson = product.data('json-product'),
                        variantPopup = product.find('.variants-popup'),
                        listViewPopup = $body.find('[data-product-list-view]');

                    if(!product.hasClass('quickshop-popup-show')){
                        $('.product-item').removeClass('quickshop-popup-show');

                        if ($body.hasClass('quick_shop_option_2')) {
                            var height = product.find('.card-media').outerHeight(true);

                            if ($body.hasClass('product-card-layout-02')){
                                if ($win.width() > 1024) {
                                    variantPopup.find('.variants').css('max-height', (height - 114) + 'px');
                                    variantPopup.find('.variants').css('min-height', (height - 114) + 'px');
                                } else {
                                    variantPopup.find('.variants').css('max-height', (height - 70) + 'px');
                                    variantPopup.find('.variants').css('min-height', (height - 70) + 'px');
                                } 
                            } else if ($body.hasClass('product-card-layout-04')){
                                if ($win.width() > 1024) {
                                    variantPopup.find('.variants').css('max-height', (height - 116) + 'px');
                                    variantPopup.find('.variants').css('min-height', (height - 116) + 'px');
                                } else {
                                    variantPopup.find('.variants').css('max-height', (height - 70) + 'px');
                                    variantPopup.find('.variants').css('min-height', (height - 70) + 'px');
                                } 
                            } else {
                                if ($win.width() > 1024) {
                                    variantPopup.find('.variants').css('max-height', (height - 74) + 'px');
                                    variantPopup.find('.variants').css('min-height', (height - 74) + 'px');
                                } else {
                                    variantPopup.find('.variants').css('max-height', (height - 20) + 'px');
                                    variantPopup.find('.variants').css('min-height', (height - 20) + 'px');
                                } 
                            }

                            if (variantPopup.find('.variants')[0].scrollHeight > variantPopup.find('.variants')[0].clientHeight) {
                                variantPopup.find('.variants').addClass('scrollable')
                            }

                            if (!$('.productListing').hasClass('productList')){
                                halo.appendProductQuickShopOption2(product);
                            }
                        } else if ($body.hasClass('quick_shop_option_3')) {
                            const handle = $target.data('product-handle');
                            if (!$('.productListing').hasClass('productList')){
                                halo.updateContentQuickshopOption3(handle);
                            }
                            
                            $doc.on('click', '[data-close-quick-shop-popup]', (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                
                                $body.removeClass('quickshop-popup-show');
                            });
                            
                            $doc.off('click.quickShopOverlay').on('click.quickShopOverlay', (event) => {
                                if ($body.hasClass('quickshop-popup-show') && $(event.target).is('.background-overlay')) {
                                    $body.removeClass('quickshop-popup-show');
                                }
                            })
                        } 

                        if (!$body.hasClass('quick_shop_option_3')) {
                            if ($win.width() < 767) {
                                if ($('.productListing').hasClass('productList')) {
                                    halo.appendToListViewModal(product)
                                } else {
                                    product.addClass('quickshop-popup-show');
                                }
                            } else {
                                product.addClass('quickshop-popup-show');
                            }
                        } else {
                            if ($('.productListing').hasClass('productList')){
                                halo.appendToListViewModal(product)
                                // product.addClass('quickshop-popup-show');
                            }
                        }
                        
                        product.find('.swatch-label.is-active').trigger('click');
                        halo.checkStatusSwatchQuickShop(product, productJson);

                        if($('.card-swatch').hasClass('quick_shop_type_2') || ($('productListing').hasClass('productList') && !$('.card-swatch').hasClass('quick_shop_type_3'))){
                            if ($win.width() < 767) {
                                if (!$('.productListing').hasClass('productList')){
                                    var quickshopVariantPopup = $('#halo-card-mobile-popup .variants-popup');
                                    quickshopVariantPopup.find('.selector-wrapper').each((index, element) => {
                                        $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                    });
                                } else {
                                    variantPopup.find('.selector-wrapper').each((index, element) => {
                                        $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                    });
                                }
                            } else {
                                variantPopup.find('.selector-wrapper').each((index, element) => {
                                    $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                });
                            }
                            if (!$('.productListing').hasClass('productList')){
                                $body.addClass('quick_shop_popup_mobile');
                            }
                        } else {
                            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                                $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                            });
                        }
                    } else {
                        halo.initAddToCartQuickShop($target, variantPopup);
                    }
                });

                $doc.on('click', '[data-cancel-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.currentTarget),
                        product = $target.parents('.product-item'),
                        quickshopMobilePopup = $doc.find('#halo-card-mobile-popup');

                    product.removeClass('quickshop-popup-show');
                    var productQuickshopShown = $doc.find('.quickshop-popup-show')
                    productQuickshopShown.removeClass('quickshop-popup-show')
                     
                    if($('.card-swatch').hasClass('quick_shop_type_2')){
                        $body.removeClass('quick_shop_popup_mobile');
                        quickshopMobilePopup.removeClass('show');
                    }
                });

                $doc.on('click', (event) => {
                    if ($(event.target).closest('[data-quickshop-popup]').length === 0 && $(event.target).closest('.variants-popup').length === 0 && $(event.target).closest('.card-swatch').length === 0 && $(event.target).closest('[data-warning-popup]').length === 0) {
                        $('.product-item').removeClass('quickshop-popup-show');
                        if($('.card-swatch').hasClass('quick_shop_type_2')){
                            $body.removeClass('quick_shop_popup_mobile');
                        }
                    }
                });

                halo.changeSwatchQuickShop();
            }
        },

        appendToListViewModal: function(product)  {
            const quickshopMobilePopup = $doc.find('#list-view-popup');
            const quickshopForm = product.clone();
            quickshopMobilePopup.find('.halo-popup-content').empty();
            quickshopMobilePopup.find('.halo-popup-content').append(quickshopForm);

            const form = quickshopMobilePopup.find('[data-quickshop] .card-information .variants-popup form').eq('0');
            const mobilePopupId = form.attr('id') + '-mobile';
            const optionInputs = form.find('.single-option');
            const optionLabels = form.find('.single-label');
            const cardInfoWrapper = quickshopMobilePopup.find('.card-product')
            const variantsPopup = quickshopMobilePopup.find('.variants-popup')
            const submitBtn = quickshopMobilePopup.find('[data-btn-addtocart]')
            variantsPopup.removeClass("card-list__hidden")
            let clicked = {
                selected1: false,
                selected2: false,
                selected3: false
            } 
            // cardInfoWrapper.remove()

            // variantsPopup.addEventListener('click', () => console.log('variant clicked'))

            form.attr('id', mobilePopupId);
            submitBtn.attr('data-form-id', submitBtn.attr('data-form-id') + '-mobile')

            optionInputs.each((index, optionInput) => {
                $(optionInput).attr('id', $(optionInput).attr('id') + '-mobile');
                $(optionInput).attr('name', $(optionInput).attr('name') + '-mobile');
            })

            optionLabels.each((index, optionLabel) => {
                $(optionLabel).attr('for', $(optionLabel).attr('for') + '-mobile');

                const swatchWrapper = $(optionLabel).closest('.selector-wrapper')
                const swatchElement = $(optionLabel).closest('.swatch-element')
                if (!swatchElement.hasClass('available')) return 
                
                if (swatchWrapper.hasClass('selector-wrapper-1') && !clicked.selected1) {
                    clicked.selected1 = true
                    $(optionLabel).trigger('click')
                } else if (swatchWrapper.hasClass('selector-wrapper-2') && !clicked.selected2) {
                    clicked.selected2 = true 
                    $(optionLabel).trigger('click')
                } else if (swatchWrapper.hasClass('selector-wrapper-3') && !clicked.selected3) {
                    clicked.selected3 = true
                    $(optionLabel).trigger('click')
                }
            })

            $body.addClass('quickshop-list-view-show');

            $('.background-overlay').off('click.closeListViewModal').on('click.closeListViewModal', () => {
                $body.removeClass('quickshop-list-view-show');
            })
        },

        changeSwatchQuickShop: function () {
            $doc.on('change', '[data-quickshop] .single-option', (event) => {
                var $target = $(event.target),
                    product = $target.parents('.product-item'),
                    productJson = product.data('json-product'),
                    variantList,
                    optionColor = product.find('.option-color').data('option-position'),
                    optionIndex = $target.closest('[data-option-index]').data('option-index'),
                    swatch = product.find('.swatch-element'),
                    thisVal = $target.val(),
                    selectedVariant,
                    productInput = product.find('[name=id]'),
                    selectedOption1 = product.find('.selector-wrapper-1').find('input:checked').val(),
                    selectedOption2 = product.find('.selector-wrapper-2').find('input:checked').val(),
                    selectedOption3 = product.find('.selector-wrapper-3').find('input:checked').val();

                if ($body.hasClass('quick_shop_option_2') && $('.productListing').hasClass('productList')) {
                    selectedOption1 = product.find('.selector-wrapper-1').eq('1').find('input:checked').val();
                } else {
                    if ($('.productListing').hasClass('productList') && $win.width() < 767) {
                        selectedOption1 = product.find('.selector-wrapper-1').eq('1').find('input:checked').val();
                        selectedOption2 = product.find('[data-option-index="1"]').eq('1').find('input:checked').val();
                    } else {
                        selectedOption1 = product.find('.selector-wrapper-1').eq('0').find('input:checked').val();
                    }
                }

                if (productJson != undefined) {
                    variantList = productJson.variants;
                }

                swatch.removeClass('soldout');
                swatch.find('input[type="radio"]').prop('disabled', false);

                switch (optionIndex) {
                    case 0:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == thisVal && variant.option1 == selectedOption2;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == thisVal && variant.option1 == selectedOption2;
                                } else {
                                    return variant.option1 == thisVal && variant.option2 == selectedOption2;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        } else{
                            var altAvailableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == thisVal;
                                    } else {
                                        return variant.option1 == thisVal;
                                    }
                                }
                            });

                            selectedVariant =  altAvailableVariants;
                        }

                        break;
                    case 1:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == selectedOption1 && variant.option1 == thisVal && variant.option3 == selectedOption2;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == selectedOption1 && variant.option1 == thisVal && variant.option2 == selectedOption2;
                                } else {
                                    return variant.option1 == selectedOption1 && variant.option2 == thisVal && variant.option3 == selectedOption2;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        } else {
                            var altAvailableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == thisVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == thisVal;
                                    }
                                }
                            });

                            selectedVariant =  altAvailableVariants;
                        }

                        break;
                    case 2:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == thisVal;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == thisVal;
                                } else {
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == thisVal;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        }

                        break;
                }

                if (selectedVariant == undefined) {
                    return;
                }

                productInput.val(selectedVariant.id);
                var value = $target.val();
                $target.parents('.selector-wrapper').find('.form-label span').text(value);
                
                // if (selectedVariant.compare_at_price > selectedVariant.price) {
                //     product.find('.price__sale .price-item--regular').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format));
                //     product.find('.price__sale .price-item--sale').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                //     const labelSale = `-${Math.round((selectedVariant.compare_at_price - selectedVariant.price) * 100 / selectedVariant.compare_at_price)}%`;
                //     product.find('.price__label_sale .label_sale').html(labelSale);
                // } else {
                //     product.find('.price__regular .price-item').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                // }

                if (selectedVariant.available) {
                    product.find('[data-btn-addtocart]').removeClass('btn-unavailable');
                    product.find('[data-quickshop] quickshop-update-quantity').removeClass('disabled')
                } else {
                    product.find('[data-btn-addtocart]').addClass('btn-unavailable');
                    product.find('[data-quickshop] quickshop-update-quantity').addClass('disabled')
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

                if (!$body.hasClass('quick_shop_option_2') && !$body.hasClass('quick_shop_option_3') && $win.width() < 767) {
                    
                } 

                // var product = $('[data-product-list-view] .product-item')
                // var productJson = product.data('json-product')

                halo.checkStatusSwatchQuickShop(product, productJson);
            });
        },

        checkStatusSwatchQuickShop: function(product, productJson){
            var variantPopup = product.find('.card-variant'),
                variantList,
                productOption = product.find('[data-option-index]'),
                optionColor = product.find('.option-color').data('option-position'),
                selectedOption1 = product.find('[data-option-index="0"]').find('input:checked').val(),
                selectedOption2 = product.find('[data-option-index="1"]').find('input:checked').val(),
                selectedOption3 = product.find('[data-option-index="2"]').find('input:checked').val(),
                productId = product.data('product-id');

            
            if ($body.hasClass('quick_shop_option_2')) {
                var height = product.find('.card-media').outerHeight(true);
                if (selectedOption3 != undefined) {
                    if ($body.hasClass('product-card-layout-01')) {
                        if (height < 310) {
                            $('[data-quickshop]').addClass('active_option_3');
                        } else {
                            $('[data-quickshop]').removeClass('active_option_3');
                        }  
                    } else {
                        if (height < 370) {
                            $('[data-quickshop]').addClass('active_option_3');
                        } else {
                            $('[data-quickshop]').removeClass('active_option_3');
                        } 
                    }
                } else {
                    if ($win.width() > 1024) {
                        if ($body.hasClass('product-card-layout-05')) {
                            if (height < 350 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }    
                        } else if ($body.hasClass('product-card-layout-01')) {
                            if (height < 310 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }  
                        }else {
                            if (height < 370 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        }
                    } else {
                        if ($body.hasClass('product-card-layout-01')) {
                            if (height < 310) {
                                if (selectedOption1 != undefined || selectedOption2 != undefined) {
                                    $('[data-quickshop]').removeClass('active_option_3');
                                } else {
                                    $('[data-quickshop]').addClass('active_option_3');
                                }
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        } else {
                            if (height < 370) {
                                if (selectedOption1 != undefined || selectedOption2 != undefined) {
                                    $('[data-quickshop]').removeClass('active_option_3');
                                } else {
                                    $('[data-quickshop]').addClass('active_option_3');
                                }
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        }
                    }
                }
            }

            if ($body.hasClass('quick_shop_option_2') && $('.productListing').hasClass('productList')) {
                selectedOption1 = product.find('[data-option-index="0"]').eq('1').find('input:checked').val();
            } else {
                if ($('.productListing').hasClass('productList') && $win.width() < 767) {
                    selectedOption1 = product.find('[data-option-index="0"]').eq('1').find('input:checked').val();
                    selectedOption2 = product.find('[data-option-index="1"]').eq('1').find('input:checked').val();
                } else {
                    selectedOption1 = product.find('[data-option-index="0"]').eq('0').find('input:checked').val();
                }
            }
            
            if (productJson != undefined) {
                variantList = productJson.variants;
            }

            productOption.each((index, element) => {
                var optionIndex = $(element).data('option-index'),
                    swatch = $(element).find('.swatch-element');

                switch (optionIndex) {
                    case 0: 
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal;
                                    } else {
                                        return variant.option1 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;
                    case 1:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal;
                                    } else {
                                        // CHECK: find the error and value of selectedOption1 
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action-selector')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                            
                        });
                        break;
                    case 2:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action-selector')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('unavailable soldout').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;  
                }
            });

            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                var item = $(element);

                if (item.find('.swatch-element').find('input:checked').length < 1) {
                    if (item.find('.swatch-element.available').length > 0) {
                        item.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                    } else {
                        item.find('.swatch-element.soldout').eq('0').find('.single-label').trigger('click');
                    }
                }
            });

            if ($body.hasClass('quick_shop_option_2')) {
                var variantId = product.find('[data-quickshop]').eq(1).find('[name="id"]').val();
                var arrayInVarName = `quick_view_inven_array_${productId}`,
                    inven_array = window[arrayInVarName]; 
                
                if(inven_array != undefined) {
                    var inven_num = inven_array[variantId],
                        inventoryQuantity = parseInt(inven_num),
                        quantityInput = product.find('input[name="quantity"]').eq(0);
                    
                    quantityInput.attr('data-inventory-quantity', inventoryQuantity);
                    if (quantityInput.val() > inventoryQuantity) {
                        quantityInput.val(inventoryQuantity)
                    }
                }
            }
        },

        initAddToCartQuickShop: function($target, popup){
            var variantId = popup.find('[name="id"]').val(),
                qty = 1;

            halo.actionAddToCart($target, variantId, qty);
            
        },

        initAddToCart: function() {
            $doc.off('click.addToCart').on('click.addToCart', '[data-btn-addtocart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.target),
                    product = $target.parents('.product-item'),
                    MobilePopup_Option_2 = $doc.find('#halo-card-mobile-popup'),
                    ProductQuickShopShown_Option_2 = $doc.find('.quickshop-popup-show');

                if($target.closest('product-form').length > 0){
                    var productForm = $target.closest('form');
                    
                    halo.actionAddToCart2($target, productForm);
                } else {
                    if(!$target.hasClass('is-notify-me') && !$target.hasClass('is-soldout')){
                        var form = $target.parents('form'),
                            variantId = form.find('[name="id"]').val(),
                            qty = form.find('[name="quantity"]').val();
                            input = form.find('[name="quantity"]').eq(0);
                        if(qty == undefined){
                            qty = 1;
                        }
                        
                        halo.actionAddToCart($target, variantId, qty, input);
                    
                    } else if($target.hasClass('is-notify-me')){
                        halo.notifyInStockPopup($target);
                    }
                }
            });
            
            $doc.on('click', '[data-close-add-to-cart-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('add-to-cart-show');
            });


            $doc.on('click', (event) => {
                if($body.hasClass('add-to-cart-show')){
                    if (($(event.target).closest('[data-add-to-cart-popup]').length === 0)) {
                        $body.removeClass('add-to-cart-show');
                    }
                }
            });
        },

        actionAddToCart: function($target, variantId, qty, input){
            var originalMessage = window.variantStrings.submit,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;
            
            if($target.hasClass('button-text-change')){
                originalMessage = $target.text();
            }

            $target.addClass('is-loading');

            if($body.hasClass('quick-view-show')){
                Shopify.addItem(variantId, qty, () => {
                    // $target.text(successMessage);
                    if (window.after_add_to_cart.type == 'cart') {
                        halo.redirectTo(window.routes.cart);
                    } else {
                        Shopify.getCart((cartTotal) => {
                            $body.addClass('cart-sidebar-show');
                            halo.updateSidebarCart(cartTotal);
                            $body.find('[data-cart-count]').text(cartTotal.item_count);
                            $target.removeClass('is-loading');
                        });
                    }
                }, input);
            } else {
                Shopify.addItem(variantId, qty, () => {
                    // $target.text(successMessage);
                    $target.removeClass('is-loading');
                    if ($body.hasClass('quickshop-popup-show') && $body.hasClass('quick_shop_option_3')) {
                        $body.removeClass('quickshop-popup-show');
                        
                        $('.quickshop-popup-show').removeClass('quickshop-popup-show');
                    }

                    if ($body.hasClass('quickshop-list-view-show')) {
                        $body.removeClass('quickshop-list-view-show')
                    }

                    if ($body.hasClass('show-mobile-options')) {
                        $body.removeClass('show-mobile-options');
                        $('.background-overlay').addClass('hold');
                    }

                    if ($body.hasClass('quick_shop_popup_mobile') && $body.hasClass('quick_shop_option_2')) {
                        // setTimeout(() => {
                            $body.removeClass('quick_shop_popup_mobile');
                            $doc.find('#halo-card-mobile-popup').removeClass('show');
                            $doc.find('.quickshop-popup-show').each((index, popup) => {
                                $(popup).removeClass('quickshop-popup-show');
                            })
                        // }, 200);
                    }

                    switch (window.after_add_to_cart.type) {
                        case 'cart':
                            halo.redirectTo(window.routes.cart);

                            break;
                        case 'quick_cart':
                            if(window.quick_cart.show){
                                Shopify.getCart((cart) => {
                                    if( window.quick_cart.type == 'popup'){
                                        // $body.addClass('cart-modal-show');
                                        // halo.updateDropdownCart(cart);
                                    } else {
                                        $body.addClass('cart-sidebar-show');
                                        halo.updateSidebarCart(cart);
                                    }

                                    $target.removeClass('is-loading');
                                    $('.background-overlay').removeClass('hold');
                                });
                            } else {
                                halo.redirectTo(window.routes.cart);
                            }

                            break;
                        case 'popup_cart_1':
                            Shopify.getCart((cart) => {
                                halo.updatePopupCart(cart, 1);
                                halo.updateSidebarCart(cart);
                                $body.addClass('add-to-cart-show');
                                $target.removeClass('is-loading');
                                $('.background-overlay').removeClass('hold');
                            });

                            break;
                    }
                }, input);
            }
        },

        actionAddToCart2: function($target, productForm) {
            const config = fetchConfig('javascript');
            var originalMessage = window.variantStrings.submit,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;

            if($target.hasClass('button-text-change')){
                originalMessage = $target.text();
            }

            $target.addClass('is-loading');

            let addToCartForm = document.querySelector('[data-type="add-to-cart-form"]');
            let formData = new FormData(addToCartForm);

            const enoughInStock = halo.checkSufficientStock(productForm);
            if (!enoughInStock && $body.hasClass('quickshop-popup-show')) {
                alert(window.cartStrings.addProductOutQuantity);
                $target.removeClass('is-loading');
                return 
            }

            const addItemToCart = () => {
                fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    if ($body.hasClass('quickshop-popup-show')) {
                        $body.removeClass('quickshop-popup-show');
                    }
    
                    if($body.hasClass('quick-view-show')){
                        if (window.after_add_to_cart.type == 'cart') {
                            halo.redirectTo(window.routes.cart);
                        } else {
                            Shopify.getCart((cartTotal) => {
                                $body.find('[data-cart-count]').text(cartTotal.item_count);
                                $target.removeClass('is-loading');
                            });
                        }
                    } else {
                        switch (window.after_add_to_cart.type) {
                            case 'cart':
                                halo.redirectTo(window.routes.cart);
                            
                                break;
                            case 'quick_cart':
                                if(window.quick_cart.show){
                                    Shopify.getCart((cart) => {
                                        if( window.quick_cart.type == 'popup'){
                                            // $body.addClass('cart-modal-show');
                                            // halo.updateDropdownCart(cart);
                                        } else {
                                            $body.addClass('cart-sidebar-show');
                                            halo.updateSidebarCart(cart);
                                        }
                                        
                                        $target.removeClass('is-loading');
                                    });
                                } else {
                                    halo.redirectTo(window.routes.cart);
                                }
                                
                                break;
                            case 'popup_cart_1':
                                Shopify.getCart((cart) => {
                                    halo.updatePopupCart(cart, 1);
                                    halo.updateSidebarCart(cart);
                                    $body.addClass('add-to-cart-show');
                                    $target.removeClass('is-loading');
                                });
    
                                break;
                        }
                    }
                });
            }

            fetch(window.Shopify.routes.root + 'cart.js', {
                method: 'GET',
            })
            .then(response => {
                return response.json();
            }).then(response => { 
                const variantId = parseInt($(addToCartForm).serialize().split('id=')[1])
                const item = response.items.find(item => item.variant_id == variantId)
                const currentQuantity = item?.quantity 
                const moreQuantity = parseInt(productForm.find('[data-inventory-quantity]').val()) 
                const maxQuantity = parseInt(productForm.find('[data-inventory-quantity]').data('inventory-quantity'))

                if (!currentQuantity || !maxQuantity) return addItemToCart()
                if (currentQuantity + moreQuantity > maxQuantity)  {
                    const remainingQuantity = maxQuantity - currentQuantity 
                    console.log(remainingQuantity) 
                    throw new Error(`You ${remainingQuantity > 0 ? `can only add ${remainingQuantity}` : 'cannot add'} more of the items into the cart`)
                } else {
                    addItemToCart() 
                }
            }).catch(err => {
                this.showWarning(err)
            }).finally(() => {
                $target.removeClass('is-loading');
            })
        },

        checkSufficientStock: function(productForm) {
            const maxValidQuantity = productForm.find('[data-inventory-quantity]').data('inventory-quantity')
            const inputQuantity = parseInt(productForm.find('[data-inventory-quantity]').val())
            
            return maxValidQuantity >= inputQuantity
        },  

        updateContentQuickshopOption3: function(handle){
            var quickShopPopup = $('#halo-quickshop-popup-option-3'),
                quickShopPopupContent = quickShopPopup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_shop',
                beforeSend: function () {
                    $('[data-quick-view-popup] .halo-popup-content').empty()
                },
                success: function (data) {
                    quickShopPopupContent.html(data);       
                },
                error: function (xhr, text) {
                    // alert($.parseJSON(xhr.responseText).description);
                    halo.showWarning($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = quickShopPopup.find('.quickshop');
                    
                    halo.productImageGallery($scope);
                    setTimeout(() => {
                        $body.addClass('quickshop-popup-show');
                    }, 150)
                }
            });
        },
        
        appendProductQuickShopOption2: function(product) {
            //  Append Product Popup Quick Shop 2 Show Mobile
            if (window.innerWidth <= 767) {
                var quickshopMobilePopup = $doc.find('#halo-card-mobile-popup');
                var quickshopForm = product.clone();
                quickshopMobilePopup.find('.halo-popup-content').empty();
                quickshopMobilePopup.find('.halo-popup-content').append(quickshopForm);

                var form = quickshopMobilePopup.find('[data-quickshop] form').eq('0');
                var mobilePopupId = form.attr('id') + 'mobile';
                form.attr('id', mobilePopupId);
                var optionInputs = form.find('.single-option');
                var optionLabels = form.find('.single-label');

                optionInputs.each((index, optionInput) => {
                    $(optionInput).attr('id', $(optionInput).attr('id') + '-mobile');
                })
                
                optionLabels.each((index, optionLabel) => {
                    $(optionLabel).attr('for', $(optionLabel).attr('for') + '-mobile');
                })

                quickshopMobilePopup.addClass('show');

                $doc.on('click', (e) => {
                    var $target = $(e.target)
                    if ($target.hasClass('background-overlay')) {
                        quickshopMobilePopup.removeClass('show');
                        $body.removeClass('quick_shop_popup_mobile');
                        product.removeClass('quickshop-popup-show');
                    }
                })
            } 
        },

        isRunningInIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        redirectTo: function(url){
            if (halo.isRunningInIframe() && !window.iframeSdk) {
                window.top.location = url;
            } else {
                window.location = url;
            }
        },

        initBeforeYouLeave: function() {
            var $beforeYouLeave = $('#halo-leave-sidebar'),
                time = $beforeYouLeave.data('time'),
                idleTime = 0;

            if (!$beforeYouLeave.length) {
                return;
            } else{
                var slickInterval = setInterval(() => {
                    timerIncrement();
                }, time);

                $body.on('mousemove keydown scroll', () => {
                    resetTimer();
                });
            }

            $body.on('click', '[data-close-before-you-leave]', (event) => {
                event.preventDefault();

                $body.removeClass('before-you-leave-show');
            });

            $body.on('click', (event) => {
                if ($body.hasClass('before-you-leave-show')) {
                    if ($(event.target).closest('#halo-leave-sidebar').length === 0){
                        $body.removeClass('before-you-leave-show');
                    }
                }
            });

            function timerIncrement() {
                idleTime = idleTime + 1;

                if (idleTime >= 1 && !$body.hasClass('before-you-leave-show')) {
                    if($beforeYouLeave.find('.products-carousel').length > 0){
                        var slider = $beforeYouLeave.find('.products-carousel');

                        productsCarousel(slider);
                    }

                    $body.addClass('before-you-leave-show');
                }
            }

            function resetTimer() {
                idleTime = -1;
            }

            function productsCarousel(slider){
                if(!slider.hasClass('slick-slider')) {
                    slider.slick({
                        dots: true,
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        slidesPerRow: 1,
                        rows: 3,
                        infinite: false,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev
                    });
                }
            }
        },

        initQuickCart: function() {
            if(window.quick_cart.show){
                if(window.quick_cart.type == 'popup'){
                    // halo.initDropdownCart();
                } else {
                    halo.initSidebarCart();
                }
            }

            halo.initEventQuickCart();
        },

        initEventQuickCart: function(){
            halo.removeItemQuickCart();
            halo.updateQuantityItemQuickCart();
            halo.editQuickCart();
        },

        initFreeShippingMessage: function () {
            $.getJSON('/cart.js', (cart) => {
                halo.freeShippingMessage(cart);
            });
        },

        freeShippingMessage: function(cart){
            var freeshipEligible = 0,
                $wrapper = $('.haloCalculatorShipping'),
                $progress = $('[data-shipping-progress]'),
                $message = $('[data-shipping-message]');
            
            var textEnabled = $progress.data('text-enabled');
            
            var freeshipText = window.free_shipping_text.free_shipping_message,
                freeshipText1 = window.free_shipping_text.free_shipping_message_1,
                freeshipText2 = window.free_shipping_text.free_shipping_message_2,
                freeshipText3 = window.free_shipping_text.free_shipping_message_3,
                freeshipText4 = window.free_shipping_text.free_shipping_message_4,
                extraPrice = 0,
                shipVal = window.free_shipping_text.free_shipping_1,
                classLabel1 = 'progress-30',
                classLabel2 = 'progress-60',
                classLabel3 = 'progress-100',
                freeshipPrice = parseInt(window.free_shipping_price);

            var cartTotalPrice =  parseInt(cart.total_price)/100,
                freeshipBar = Math.round((cartTotalPrice * 100)/freeshipPrice);

            if(cartTotalPrice == 0) {
                $progress.addClass('progress-hidden');
                freeshipText =  '<span>' + freeshipText + ' ' + Shopify.formatMoney(freeshipPrice * 100, window.money_format) +'!</span>';
            } else if (cartTotalPrice >= freeshipPrice) {
                $progress.removeClass('progress-hidden');
                freeshipEligible = 1;
                freeshipText = freeshipText1;
            } else {
                $progress.removeClass('progress-hidden');
                extraPrice = parseInt(freeshipPrice - cartTotalPrice);
                freeshipText = '<span>' + freeshipText2 + ' </span>' + Shopify.formatMoney(extraPrice * 100, window.money_format) + '<span>' + freeshipText3 + ' </span><span class="text">' + freeshipText4 + '</span>';
                shipVal = window.free_shipping_text.free_shipping_2;
            }

            if(freeshipBar >= 100 ){
                freeshipBar = 100;
            }

            var classLabel = 'progress-free';

            if(freeshipBar == 0){
                classLabel = 'none';
            } else if(freeshipBar <= 30 ) {
                classLabel = classLabel1;
            } else if(freeshipBar <= 60) {
                classLabel = classLabel2;
            } else if(freeshipBar < 100){
                classLabel = classLabel3;
            }

            var progress = '<div class="progress_shipping" role="progressbar">\
                                <div class="progress-meter" style="width: '+ freeshipBar +'%;">'+ freeshipBar +'%</div>\
                            </div>';

            setTimeout(() => {
                $wrapper.find('.progress-meter').removeClass('animated-loading');
            }, 200);
            
            setTimeout(() => {
                $progress.removeClass('progress-30 progress-60 progress-100 progress-free');
                $progress.addClass(classLabel);
                $progress.find('.progress-meter').css('width', freeshipBar + '%');
                if (textEnabled) $progress.find('.progress-meter .text').text(freeshipBar + '%');

                $message.html(freeshipText);
                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };
            }, 400);
        },

        productCollectionCartSlider: function(){
            var productCart = $('[data-product-collection-cart]');

            productCart.each((index, element) => {
                var self = $(element),
                    productGrid = self.find('.products-carousel'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            responsive: [
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows
                                }
                            }]
                        });
                    }
                }
            });
        },

        updatePopupCart: function(cart, layout) {
            var item = cart.items[0],
                popup = $('[data-add-to-cart-popup]'),
                product = popup.find('.product-added'),
                productTitle = product.find('.product-title'),
                productImage = product.find('.product-image'),
                title = item.product_title,
                image = item.featured_image,
                img = '<img src="'+ image.url +'" alt="'+ image.alt +'" title="'+ image.alt +'"/>';

            productImage.attr('href', item.url).html(img);

            productTitle
                .find('.title')
                .attr('href', item.url)
                .empty()
                .append(title);

            Shopify.getCart((cartTotal) => {
                $body.find('[data-cart-count]').text(cartTotal.item_count);
            });
        },

        initSidebarCart: function() {
            var cartIcon = $('[data-cart-sidebar]');
            Shopify.getCart((cart) => {
                halo.updateSidebarCart(cart);
            });
            if ($body.hasClass('template-cart')) {
                cartIcon.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $('html, body').animate({
                        scrollTop: 0
                    }, 700);
                });
            } else {
                cartIcon.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    $body.addClass('cart-sidebar-show');
                });
            }

            $doc.on('click', '[data-close-cart-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if ($body.hasClass('cart-sidebar-show')) {
                    $body.removeClass('cart-sidebar-show');
                }
            });

            $body.on('click', '.background-overlay', (event) => {
                if ($body.hasClass('cart-sidebar-show') && !$body.hasClass('edit-cart-show') && !$body.hasClass('term-condition-show') && !$body.hasClass('has-warning')) {
                    if (($(event.target).closest('#halo-cart-sidebar').length === 0) && 
                        ($(event.target).closest('[data-cart-sidebar]').length === 0) && 
                        ($(event.target).closest('[data-edit-cart-popup]').length === 0) && 
                        ($(event.target).closest('[data-warning-popup]').length === 0) && 
                        ($(event.target).closest('[data-term-condition-popup]').length === 0)){
                        $body.removeClass('cart-sidebar-show');
                    }
                }
            })
        },

        updateSidebarCart: function(cart) {
            if(!$.isEmptyObject(cart)){
                const $cartDropdown = $('#halo-cart-sidebar .halo-sidebar-wrapper .previewCart-wrapper');
                const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
                        <div class="loading-overlay__spinner">\
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
                            </svg>\
                        </div>\
                    </div>';
                const loadingClass = 'is-loading';

                $cartDropdown
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: window.routes.root + '/cart?view=ajax_side_cart',
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cartDropdown
                            .removeClass(loadingClass)
                            .html(response);
                    },
                    error: function (xhr, text) {
                        // alert($.parseJSON(xhr.responseText).description);
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.productCollectionCartSlider();
                        halo.initFreeShippingMessage();
                        halo.updateGiftWrapper();
                        if (halo.checkNeedToConvertCurrency()) {
                          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };
                    }
                });
            }
        },

        updateGiftWrapper: function() {
            let debounce 
            $('#gift-wrapping').off('click').on('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                clearTimeout(debounce)
                debounce = setTimeout(() => {
                    const variantId = event.target.dataset.giftId;
                    Shopify.addItem(variantId, 1, () => {
                        Shopify.getCart((cart) => {
                            halo.updateSidebarCart(cart);
                        });
                    }); 
                }, 250)
            });

            $('#cart-gift-wrapping').off('click').on('click', (event) => {
                event.stopPropagation()
                event.preventDefault()

                var $target = $(event.currentTarget),
                    text = $target.attr('data-adding-text');
                $target.text(text);

                clearTimeout(debounce)
                debounce = setTimeout(() => {
                    const variantId = event.target.dataset.giftId;
                    Shopify.addItem(variantId, 1, () => {
                        Shopify.getCart((cart) => {
                            halo.updateCart(cart)
                        });
                    }); 
                }, 250)
            });
        },

        removeItemQuickCart: function () {
            $doc.on('click', '[data-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-remove-id'),
                    text = $('#cart-gift-wrapping').attr('data-add-text'),
                    productLine = $target.data('line');

                $('#cart-gift-wrapping').text(text);

                Shopify.removeItem(productLine, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-modal-show')){
                        // halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    }
                });
            });
        },

        updateCart: function(cart){
            if(!$.isEmptyObject(cart)){
                const $sectionId = $('#main-cart-items').data('id');
                const $cart = $('[data-cart]')
                const $cartContent = $cart.find('[data-cart-content]');
                const $cartTotals = $cart.find('[data-cart-total]');
                const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
                        <div class="loading-overlay__spinner">\
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
                            </svg>\
                        </div>\
                    </div>';
                const loadingClass = 'is-loading';

                $cart
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: `/cart?section_id=${$sectionId}`,
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cart.removeClass(loadingClass);
                        $cart.find('.loading-overlay').remove();

                        if(cart.item_count > 0){
                            var contentCart =  response.find('[data-cart-content] .cart').html(),
                                subTotal = response.find('[data-cart-total] .cart-total-subtotal').html(),
                                grandTotal = response.find('[data-cart-total] .cart-total-grandtotal').html();

                            $cartContent.find('.cart').html(contentCart);
                            $cartTotals.find('.cart-total-subtotal').html(subTotal);
                            $cartTotals.find('.cart-total-grandtotal').html(grandTotal);

                            if(response.find('.haloCalculatorShipping').length > 0){
                                var calculatorShipping = response.find('.haloCalculatorShipping');

                                $cart.find('.haloCalculatorShipping').replaceWith(calculatorShipping);
                            }
                        } else {
                            var contentCart =  response.find('#main-cart-items').html(),
                                headerCart =  response.find('.page-header').html();

                            $('#main-cart-items').html(contentCart);
                            $('.page-header').html(headerCart);
                        }
                    },
                    error: function (xhr, text) {
                        // alert($.parseJSON(xhr.responseText).description);
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.initFreeShippingMessage();
                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                        if ($body.hasClass('template-cart')) {
                            const giftWrapping = document.getElementById('cart-gift-wrapping')
                            const isChecked = giftWrapping?.dataset.isChecked
                            const variantId = giftWrapping?.dataset.giftId
                            if (isChecked === 'true') {
                                $('#is-a-gift').hide()
                                const giftCardRemoveButton = document.querySelector(`[data-cart-remove-id="${variantId}"]`)
                                const giftCardQuantityInput = document.querySelector(`[data-cart-quantity-id="${variantId}"]`)

                                giftCardRemoveButton?.addEventListener('click', () => {
                                    giftWrapping.dataset.isChecked = 'false'
                                })

                                giftCardQuantityInput?.addEventListener('change', (e) => {
                                    const value = Number(e.target.value)
                                    if (value  <= 0) {
                                        giftWrapping.dataset.isChecked = 'false'
                                    }
                                })
                            } else {
                                $('#is-a-gift').show()
                            }
                        }
                    }
                });
            }
        },

        updateQuantityItemQuickCart: function(){
            $doc.on('change', '[data-cart-quantity]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-quantity-id'),
                    productLine = $target.data('line'),
                    quantity = parseInt($target.val()),
                    stock = parseInt($target.data('inventory-quantity'));
                let enoughInStock = true;
               
                if (stock < quantity && stock > 0) {
                    quantity = stock;
                    enoughInStock = false;
                }

                Shopify.changeItem(productLine, quantity, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-modal-show')){
                        // halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    }
                    if (!enoughInStock) halo.showWarning(`${ window.cartStrings.addProductOutQuantity }`)
                });
            });
        },

        editQuickCart: function() {
            $doc.on('click', '[data-open-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    url = $target.data('edit-cart-url'),
                    itemId = $target.data('edit-cart-id'),
                    itemLine = $target.data('line'),
                    quantity = $target.data('edit-cart-quantity'),
                    option = $target.parents('.previewCartItem').find('previewCartItem-variant').text();

                const modal = $('[data-edit-cart-popup]'),
                    modalContent = modal.find('.halo-popup-content');

                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    dataType: 'html',
                    beforeSend: function() {
                        if($body.hasClass('template-cart')){
                            // halo.showLoading();
                        }
                    },
                    success: function(data) {
                        modalContent.html(data);
                        modalContent
                            .find('[data-template-cart-edit]')
                            .attr({
                                'data-cart-update-id': itemId,
                                'data-line': itemLine
                            });

                        var productItem = modalContent.find('.product-edit-item');
                        productItem.find('input[name="quantity"]').val(quantity);
                    },
                    error: function(xhr, text) {
                        // alert($.parseJSON(xhr.responseText).description);
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                        if($body.hasClass('template-cart')){
                            // halo.hideLoading();
                        }
                    },
                    complete: function () {
                        $body.addClass('edit-cart-show');

                        if($body.hasClass('template-cart')){
                            // halo.hideLoading();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                    }
                });
            });

            $doc.on('click', '[data-close-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('edit-cart-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('edit-cart-show')) {
                    if (($(event.target).closest('[data-edit-cart-popup]').length === 0) && ($(event.target).closest('[data-open-edit-cart]').length === 0)){
                        $body.removeClass('edit-cart-show');
                    }
                }
            });

            halo.addMoreItemEditCart();
            halo.addAllItemCartEdit();
        },

        addMoreItemEditCart: function(){
            $doc.on('click', '[data-edit-cart-add-more]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var itemWrapper = $('[data-template-cart-edit]'),
                    currentItem = $(event.target).parents('.product-edit-item'),
                    count = parseInt(itemWrapper.attr('data-count')),
                    cloneProduct = currentItem.clone().removeClass('product-edit-itemFirst');
                    cloneProductId = cloneProduct.attr('id') + count;

                cloneProduct.attr('id', cloneProductId);

                halo.updateClonedProductAttributes(cloneProduct, count);

                cloneProduct.insertAfter(currentItem);

                count = count + 1;
                itemWrapper.attr('data-count', count);
            });

            $doc.on('click', '[data-edit-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var currentItem = $(event.target).parents('.product-edit-item');

                currentItem.remove();
            });
        },

        updateClonedProductAttributes: function(product, count){
            var form = $('.shopify-product-form', product),
                formId = form.attr('id'),
                newFormId = formId + count;

            form.attr('id', newFormId);

            $('.product-form__radio', product).each((index, element) => {
                var formInput = $(element),
                    formLabel = formInput.next(),
                    id = formLabel.attr('for'),
                    newId = id + count,
                    formInputName = formInput.attr('name');

                formLabel.attr('for', newId);

                formInput.attr({
                    id: newId,
                    name: formInputName + count
                });
            });
        },

        addAllItemCartEdit: function() {
            $doc.on('click', '#add-all-to-cart', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    cartEdit = $('[data-template-cart-edit]'),
                    product = cartEdit.find('.product-edit-item.isChecked'),
                    productId = cartEdit.attr('data-cart-update-id');
                    productLine = cartEdit.data('line');

                if(product.length > 0){
                    $target.addClass('is-loading');

                    Shopify.removeItem(productLine, (cart) => {
                        if(!$.isEmptyObject(cart)) {
                            var productHandleQueue = [];

                            var ajax_caller = function(data) {
                                return $.ajax(data);
                            }

                            product.each((index, element) => {
                                var item = $(element),
                                    variantId = item.find('input[name="id"]').val(),
                                    qty = parseInt(item.find('input[name="quantity"]').val());

                                productHandleQueue.push(ajax_caller({
                                    type: 'post',
                                    url: window.routes.root + '/cart/add.js',
                                    data: 'quantity=' + qty + '&id=' + variantId,
                                    dataType: 'json',
                                    async: false
                                }));
                            });

                            if(productHandleQueue.length > 0) {
                                $.when.apply($, productHandleQueue).done((event) => {
                                    setTimeout(function(){ 
                                        $target.removeClass('is-loading');
                                    }, 1000);

                                    Shopify.getCart((cart) => {
                                        $body.removeClass('edit-cart-show');

                                        if($body.hasClass('template-cart')){
                                            halo.updateCart(cart);
                                        } else if($body.hasClass('cart-modal-show')){
                                            // halo.updateDropdownCart(cart);
                                        } else if($body.hasClass('cart-sidebar-show')) {
                                            halo.updateSidebarCart(cart);
                                        }
                                    });
                                });
                            }
                        }
                    });
                } else {
                    alert(window.variantStrings.addToCart_message);
                }
            });
        },

        initNotifyInStock: function() {
            $doc.on('click', '[data-open-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                halo.notifyInStockPopup($target);
            });

            $doc.on('click', '[data-close-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('notify-me-show');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('notify-me-show')){
                    if (($(event.target).closest('[data-open-notify-popup]').length === 0) && ($(event.target).closest('[data-notify-popup]').length === 0)){
                        $body.removeClass('notify-me-show');
                    }
                }
            });

            $doc.on('click', '[data-form-notify]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                halo.notifyInStockAction($target);
            });
        },

        notifyInStockPopup: function($target){
            var variant,
                product = $target.parents('.product-item'),
                title = product.find('.card-title').data('product-title'),
                link = product.find('.card-title').data('product-url'),
                popup = $('[data-notify-popup]');

            if($target.hasClass('is-notify-me')){
                variant = product.find('.card-swatch .swatch-label.is-active').attr('title');
            } else {
                variant = $target.data('variant-id');
            }

            popup.find('[name="halo-notify-product-title"]').val($.trim(title));
            popup.find('[name="halo-notify-product-link"]').val(link);

            if(variant){
                popup.find('[name="halo-notify-product-variant"]').val(variant);
            }

            // console.log(variant);

            $body.addClass('notify-me-show');
        },

        notifyInStockAction: function($target){
            var proceed = true,
                $notify = $target.parents('.halo-notifyMe'),
                $notifyForm = $notify.find('.notifyMe-form'),
                $notifyText = $notify.find('.notifyMe-text'),
                notifyMail = $notify.find('input[name="email"]').val(),
                email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                message;

            if (!email_reg.test(notifyMail) || (!notifyMail)){
                $notify
                    .find('.form-field')
                    .removeClass('form-field--success')
                    .addClass('form-field--error');

                proceed = false;
                message = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ window.notify_me.error +'</p></div>';

                $notifyText.html(message).show();
            } else {
                $notify
                    .find('.form-field')
                    .removeClass('form-field--error')
                    .addClass('form-field--success');

                $notifyText.html('').hide();
            }

            if (proceed) {
                var notifySite = $notify.find('[name="halo-notify-product-site"]').val(),
                    notifySiteUrl = $notify.find('[name="halo-notify-product-site-url"]').val(),
                    notifyToMail = window.notify_me.mail,
                    notifySubjectMail = window.notify_me.subject,
                    notifyLabelMail = window.notify_me.label,
                    productName = $notify.find('[name="halo-notify-product-title"]').val(),
                    productUrl = $notify.find('[name="halo-notify-product-link"]').val(),
                    productVariant = $notify.find('[name="halo-notify-product-variant"]').val();

                var content = '<div style="margin:30px auto;width:650px;border:10px solid #f7f7f7"><div style="border:1px solid #dedede">\
                        <h2 style="margin: 0; padding:20px 20px 20px;background:#f7f7f7;color:#555;font-size:2em;text-align:center;">'+ notifySubjectMail +'</h2>';

                content += '<table style="margin:0px 0 0;padding:30px 30px 30px;line-height:1.7em">\
                          <tr><td style="padding: 5px 25px 5px 0;"><strong>Product Name: </strong> ' + productName + '</td></tr>\
                          <tr><td style="padding: 5px 25px 5px 0;"><strong>Product URL: </strong> ' + productUrl + '</td></tr>\
                          <tr><td style="padding: 5px 25px 5px 0;"><strong>Email Request: </strong> ' + notifyMail + '</td></tr>\
                          '+ ((productVariant != '') ? '<tr><td style="padding: 5px 25px 5px 0;"><strong>Product Variant: </strong>' + productVariant + '</td></tr>' : '') +'\
                       </table>';

                content += '<a href="'+ notifySiteUrl +'" style="display:block;padding:30px 0;background:#484848;color:#fff;text-decoration:none;text-align:center;text-transform:uppercase">&nbsp;'+ notifySite +'&nbsp;</a>';
                content += '</div></div>';

                var notify_post_data = {
                    'api': 'i_send_mail',
                    'subject': notifySubjectMail,
                    'email': notifyToMail,
                    'from_name': notifyLabelMail,
                    'email_from': notifyMail,
                    'message': content
                };

                $.post('https://themevale.net/tools/sendmail/quotecart/sendmail.php', notify_post_data, (response) => {
                    if (response.type == 'error') {
                       message = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ response.text +'</p></div>';
                    } else {
                       message = '<div class="alertBox alertBox--success"><p class="alertBox-message">'+ window.notify_me.success +'</p></div>';
                       halo.resetForm($notifyForm);
                    }

                    $notifyText.html(message).show();
                }, 'json');
            }
        },

        initAskAnExpert: function(){
            $doc.on('click', '[data-open-ask-an-expert]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var askAnExpert = $('[data-ask-an-expert-popup]'),
                    modalContent = askAnExpert.find('.halo-popup-content'),
                    url;

                if($body.hasClass('template-product')){
                    var handle = $('.productView').data('product-handle');

                    url = window.routes.root + '/products/' + handle + '?view=ajax_ask_an_expert';
                } else if($body.hasClass('quick-view-show')){
                    var handle = $('.halo-quickView').data('product-quickview-handle');

                    url = window.routes.root + '/products/' + handle + '?view=ajax_ask_an_expert';
                } else {
                    url = window.routes.root + '/search?view=ajax_ask_an_expert';
                }

                $.ajax({
                    type: 'get',
                    url: url,
                    beforeSend: function () {
                        modalContent.empty();
                    },
                    success: function (data) {
                        modalContent.html(data);
                    },
                    error: function (xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.addClass('ask-an-expert-show');
                    }
                });
            });

            $doc.on('click', '#halo-ask-an-expert-button', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var self = $(event.currentTarget);

                halo.askAnExpertAction(self);
            });

            $doc.on('click', '[data-close-ask-an-expert]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('ask-an-expert-show');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('ask-an-expert-show')){
                    if (($(event.target).closest('[data-open-ask-an-expert]').length === 0) && ($(event.target).closest('#halo-ask-an-expert-popup').length === 0)){
                        $body.removeClass('ask-an-expert-show');
                    }
                }
            });
        },

        askAnExpertAction: function($target){
            var proceed = true,
                $askAnExpert = $target.parents('.halo-ask-an-expert'),
                $askAnExpertForm = $askAnExpert.find('.halo-ask-an-expert-form'),
                $askAnExpertMessage = $askAnExpert.find('.message'),
                askAnExpertMail = $askAnExpert.find('input[name="askAnExpertMail"]').val(),
                alertMessage,
                email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

            $('input[required], textarea[required]', $askAnExpertForm).each((index, element) => {
                if (!$.trim($(element).val())) {
                    $(element)
                        .parent('.form-field')
                        .removeClass('form-field--success')
                        .addClass('form-field--error');

                    alertMessage = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ window.ask_an_expert.error_2 +'</p></div>';

                    $askAnExpertMessage.html(alertMessage).show();

                    proceed = false;
                } else {
                    $(element)
                        .parent('.form-field')
                        .removeClass('form-field--error')
                        .addClass('form-field--success');

                    $askAnExpertMessage.html('').hide();
                }

                if (($(element).attr("name") == 'askAnExpertMail') && (!email_reg.test(askAnExpertMail))){
                    $(element)
                        .parent('.form-field')
                        .removeClass('form-field--success')
                        .addClass('form-field--error');

                    alertMessage = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ window.ask_an_expert.error_1 +'</p></div>';
                    
                    $askAnExpertMessage.html(alertMessage).show();
                            
                    proceed = false;
                }
            });

            if (proceed) {
                var toMail = window.ask_an_expert.mail,
                    subjectMail =window.ask_an_expert.subject,
                    labelMail =window.ask_an_expert.label,
                    customerName = $askAnExpert.find('[name="askAnExpertName"]').val(),
                    customerMail = askAnExpertMail,
                    customerPhone = $askAnExpert.find('[name="askAnExpertPhone"]').val(),
                    typeRadio1 = $askAnExpert.find('input[name=askAnExpertRadioFirst]:checked').val(),
                    typeRadio2 = $askAnExpert.find('input[name=askAnExpertRadioSecond]:checked').val(),
                    customerMessage = $askAnExpert.find('[name="askAnExpertMessag"]').val();

                var message = "<div style='border: 1px solid #e6e6e6;padding: 30px;max-width: 500px;margin: 0 auto;'>\
                                    <h2 style='margin-top:0;margin-bottom:30px;color: #000000;'>"+ subjectMail +"</h2>\
                                    <p style='border-bottom: 1px solid #e6e6e6;padding-bottom: 23px;margin-bottom:25px;color: #000000;'>You received a new message from your online store's ask an expert form.</p>\
                                    <table style='width:100%;'>";

                if($askAnExpert.hasClass('has-product')){
                    var productName = $askAnExpert.find('[name="halo-product-title"]').val(),
                        productUrl = $askAnExpert.find('[name="halo-product-link"]').val(),
                        productImage = $askAnExpert.find('[name="halo-product-image"]').val();

                    message += "<tr>\
                                    <td style='border-bottom: 1px solid #e6e6e6;padding-bottom: 25px;margin-bottom:25px;width:50%;'>\
                                        <img style='width: 100px' src='"+ productImage +"' alt='"+ productName +"' title='"+ productName +"'>\
                                    </td>\
                                    <td style='border-bottom: 1px solid #e6e6e6;padding-bottom: 25px;margin-bottom:25px;'>\
                                        <a href='"+ productUrl +"'>"+ productName +"</a>\
                                    </td>\
                                </tr>";
                }

                message += "<tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>"+ window.ask_an_expert.customer_name +": </strong></td><td>" + customerName + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>"+ window.ask_an_expert.customer_mail +": </strong></td><td>" + customerMail + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>"+ window.ask_an_expert.customer_phone +": </strong></td><td>" + customerPhone + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>"+ window.ask_an_expert.type_radio1 +" </strong></td><td>"+ typeRadio1 +"</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>"+ window.ask_an_expert.type_radio2 +": </strong></td><td>"+ typeRadio2 +"</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>"+ window.ask_an_expert.customer_message +"? </strong></td><td>" + customerMessage + "</td></tr>\
                        </table></div>";

                var post_data = {
                    'api': 'i_send_mail',
                    'subject': subjectMail,
                    'email': toMail,
                    'from_name': labelMail,
                    'email_from': askAnExpertMail,
                    'message': message
                };

                $.post('https://themevale.net/tools/sendmail/quotecart/sendmail.php', post_data, (response) => {
                    if (response.type == 'error') {
                       alertMessage = '<div class="alertBox alertBox--error"><p class="alertBox-message">'+ response.text +'</p></div>';
                    } else {
                       alertMessage = '<div class="alertBox alertBox--success"><p class="alertBox-message">'+ window.ask_an_expert.success +'</p></div>';

                       halo.resetForm($askAnExpertForm);

                       $askAnExpertForm.hide();
                    }

                    $askAnExpertMessage.html(alertMessage).show();
                }, 'json');
            }
        },

        resetForm: function(form){
            $('.form-field', form).removeClass('form-field--success form-field--error');
            $('input[type=email], input[type=text], textarea', form).val('');
        },

        initCompareProduct: function() {
            var $compareLink = $('a[data-compare-link]');

            if(window.compare.show){
                halo.setLocalStorageProductForCompare($compareLink);
                halo.setAddorRemoveProductForCompare($compareLink);
                halo.setProductForCompare();

                $doc.on('click', '[data-close-compare-product-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $body.removeClass('compare-product-show');
                });

                $doc.on('click', (event) => {
                    if($body.hasClass('compare-product-show')){
                        if (($(event.target).closest('[data-compare-link]').length === 0) && ($(event.target).closest('[data-compare-product-popup]').length === 0)){
                            $body.removeClass('compare-product-show');
                        }
                    }
                });
            }
        },

        setLocalStorageProductForCompare: function($link) {
            var count = JSON.parse(localStorage.getItem('compareItem')),
                items = $('[data-product-compare-handle]');

            if(count !== null){ 
                if(items.length > 0) {
                    items.each((index, element) => {
                        var item = $(element),
                            handle = item.data('product-compare-handle');

                        if(count.indexOf(handle) >= 0) {
                            item.find('.compare-icon').addClass('is-checked');
                            item.find('.text').text(window.compare.added);
                            item.find('input').prop('checked', true);
                        } else {
                            item.find('.compare-icon').removeClass('is-checked');
                            item.find('.text').text(window.compare.add);
                            item.find('input').prop('checked', false);
                        }
                    });

                    halo.updateCounterCompare($link);
                }
            }
        },

        setAddorRemoveProductForCompare: function($link) {
            $doc.on('change', '[data-product-compare] input', (event) => {
                var $this = $(event.currentTarget),
                    item = $this.parents('.card-compare'),
                    handle = $this.val(),
                    count = JSON.parse(localStorage.getItem('compareItem'));

                count = halo.uniqueArray(count);

                if(event.currentTarget.checked) {
                    item.find('.compare-icon').addClass('is-checked');
                    item.find('.text').text(window.compare.added);
                    item.find('input').prop('checked', true);
                    halo.incrementCounterCompare(count, handle, $link);
                } else {
                    item.find('.compare-icon').removeClass('is-checked');
                    item.find('.text').text(window.compare.add);
                    item.find('input').prop('checked', false);
                    halo.decrementCounterCompare(count, handle, $link);
                }
            });
        },

        setProductForCompare: function() {
            $doc.on('click', '[data-compare-link]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var count = JSON.parse(localStorage.getItem('compareItem'));

                if (count.length <= 1) {
                    alert(window.compare.message);

                    return false;
                } else {
                    halo.updateContentCompareProduct(count);
                }
            });

            $doc.on('click', '[data-compare-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var id = $(event.currentTarget).data('compare-item'),
                    compareTable = $('[data-compare-product-popup] .compareTable'),
                    item = compareTable.find('.compareTable-row[data-product-compare-id="'+ id +'"]'),
                    handle = item.data('compare-product-handle');


                if(compareTable.find('tbody .compareTable-row').length <= 2){
                    alert(window.compare.message);
                } else {
                    item.remove();
                    
                    var count = JSON.parse(localStorage.getItem('compareItem')),
                        index = count.indexOf(handle),
                        $compareLink = $('a[data-compare-link]');

                    if (index > -1) {
                        count.splice(index, 1);
                        count = halo.uniqueArray(count);
                        localStorage.setItem('compareItem', JSON.stringify(count));

                        halo.setLocalStorageProductForCompare($compareLink);
                        halo.updateCounterCompare($compareLink);
                    }
                }
            });
        },

        updateCounterCompare: function($link) {
            var count = JSON.parse(localStorage.getItem('compareItem'));

            if (count.length > 1) {
                $link.parent().addClass('is-show');
                $link.find('span.countPill').html(count.length);
            } else {
                $link.parent().removeClass('is-show');
            }
        },

        uniqueArray: function(list) {
            var result = [];

            $.each(list, function(index, element) {
                if ($.inArray(element, result) == -1) {
                    result.push(element);
                }
            });

            return result;
        },

        incrementCounterCompare: function(count, item, $link){
            const index = count.indexOf(item);

            count.push(item);
            count = halo.uniqueArray(count);

            localStorage.setItem('compareItem', JSON.stringify(count));

            halo.updateCounterCompare($link);
        },

        decrementCounterCompare: function(count, item, $link){
            const index = count.indexOf(item);

            if (index > -1) {
                count.splice(index, 1);
                count = halo.uniqueArray(count);
                localStorage.setItem('compareItem', JSON.stringify(count));

                halo.updateCounterCompare($link);
            }
        },

        updateContentCompareProduct: function(list){
            var popup = $('[data-compare-product-popup]'),
                compareTable = popup.find('.compareTable');

            compareTable.find('tbody').empty();

            $.ajax({
                type: 'get',
                url: window.routes.root + '/collections/all',
                cache: false,
                data: {
                    view: 'ajax_product_card_compare',
                    constraint: `limit=${list.length}+sectionId=list-compare+list_handle=` + encodeURIComponent(list)
                },
                beforeSend: function () {},
                success: function (data) {
                    compareTable.find('tbody').append(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    $body.addClass('compare-product-show');
                }
            });
        },

        initProductView: function($scope){
            halo.productImageGallery($scope);
            halo.productLastSoldOut($scope);
            halo.productCustomerViewing($scope);
            halo.productCountdown($scope);
            halo.productSizeChart($scope);
            halo.productCustomCursor($scope);
            halo.productVideoGallery($scope);
            halo.initVariantImageGroup($scope, window.variant_image_group);
        },

        initQuickView: function(){
            $doc.on('click', '[data-open-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var handle = $(event.currentTarget).data('product-handle');

                halo.updateContentQuickView(handle);
            });

            $doc.on('click', '[data-close-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('quick-view-show');
            });
            // $doc.on('click', (event) => {
            //     event.stopPropagation();
            //     if($body.hasClass('quick-view-show')){
            //         if(!$body.hasClass('cart-sidebar-show') && !$body.hasClass('ask-an-expert-show') && !$body.hasClass('size-chart-show') && !$body.hasClass('compare-color-show') && !$body.hasClass('cart-sidebar-show') && !$body.hasClass('term-condition-show')){
            //             if (($(event.target).closest('[data-open-quick-view-popup]').length === 0) && ($(event.target).closest('[data-quick-view-popup]').length === 0)){
            //                 $body.removeClass('quick-view-show');
            //             }
            //         }
            //     }
            // });
            $('.background-overlay').off('click.closeQuickView').on('click.closeQuickView', e => {
                if ($body.hasClass('quick-view-show') &&
                       !$body.hasClass('cart-sidebar-show') && 
                       !$body.hasClass('ask-an-expert-show') && 
                       !$body.hasClass('size-chart-show') && 
                       !$body.hasClass('compare-color-show') && 
                       !$body.hasClass('term-condition-show')
                   ) {
                    $body.removeClass('quick-view-show');
                }
            });
        },

        updateContentQuickView: function(handle){
            var popup = $('[data-quick-view-popup]'),
                popupContent = popup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_view',
                beforeSend: function () {
                    popupContent.empty();
                    $('#halo-quickshop-popup-option-3').find('.halo-popup-content').empty()
                },
                success: function (data) {
                    popupContent.html(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = popup.find('.quickView');
                    const items = $('.halo-popup-content .halo-compare-color-popup li.item'),
                        tableList = $('.halo-popup-content .halo-compare-color-popup #sortTableList'),
                        compareColorPopup = $('.halo-popup-content .halo-compare-color-popup'),
                        sizeChartPopup = $('.halo-popup-content .halo-size-chart-popup');

                    halo.productImageGallery($scope);
                    halo.productLastSoldOut($scope);
                    halo.productCustomerViewing($scope);
                    halo.productCountdown($scope);
                    halo.productSizeChart($scope);
                    halo.setProductForWishlist(handle);
                    halo.initVariantImageGroup($scope, window.variant_image_group_quick_view);

                    $body.addClass('quick-view-show');

                    if (window.Shopify && Shopify.PaymentButton) {
                        Shopify.PaymentButton.init();
                    }

                    tableList.attr('id', 'quickViewSortTableList');

                    items.each((index, element) => {
                        const itemInput = $(element).find('.swatch-compare-color-option'),
                            itemLabel = $(element).find('.swatch-compare-color-label'),
                            itemId = itemInput.attr('id');

                        itemInput
                            .attr('id', `quickView-${itemId}`)
                            .attr('name', `quickView-${itemId}`);
                        itemLabel.attr('for', `quickView-${itemId}`);
                    });

                    compareColorPopup.attr('id', 'quickView-halo-compare-color-popup');
                    sizeChartPopup.attr('id', 'quickView-halo-size-chart-popup');

                    if ($('.halo-productView .addthis_inline_share_toolbox').length) {
                        var html = $('.halo-productView .addthis_inline_share_toolbox').html();

                        $('.halo-popup-content .share-button__button').click(function(){
                            $('.halo-popup-content .addthis_inline_share_toolbox').append(html);
                        });
                    }

                    const thisSortTable = document.getElementById('quickViewSortTableList');
                    const thisImageList = $('.halo-popup-content .halo-compareColors-image');

                    if (window.innerWidth >= 1025 && thisSortTable) {
                        new Sortable(thisSortTable, {
                            animation: 150
                        });
                    } else {
                        onRemoveHandlerQuickView();
                    }

                    function onRemoveHandlerQuickView(){
                        thisImageList.on('click', '.item', (event) => {
                            event.preventDefault();

                            var $target = event.currentTarget,
                                itemId = $target.classList[1].replace('item-', ''),
                                optionId = `swatch-compare-color-${itemId}`,
                                item = $(document.getElementById(optionId));

                            item.trigger('click');
                        });
                    }

                    if (window.review.show_quick_view && $('.shopify-product-reviews-badge').length > 0) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    }
                }
            });
        },

        productImageGallery: function($scope) {
            var sliderNav = $scope.find('.productView-nav'),
                sliderFor = $scope.find('.productView-for:not(".mobile")'),
                sliderForMobile = $scope.find('.productView-for.mobile');

            if(!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                const navArrowsDesk = sliderNav.data('arrows-desk'),
                    navArrowsMobi = sliderNav.data('arrows-mobi'),
                    navCounterMobi = sliderNav.data('counter-mobi'),
                    navMediaCount = sliderNav.data('media-count'),
                    thumbnailToShow = parseInt(sliderFor.data('max-thumbnail-to-show'));
                
                let checkNav, checkFor;

                if (sliderNav.closest('.productView').is('.layout-4')) {
                    checkFor = false;
                }
                else {
                    checkFor = sliderFor;
                }

                if(sliderNav.hasClass('productView-nav-gallery')) {
                    var sliderNav2 = $scope.find('.productView-nav.productView-nav-gallery'),
                        length = sliderNav2.data('media-count'),
                        show = 2,
                        rows = 2;

                    if (length == 1) {
                      show = 1;
                      rows = 1;
                    }
                    if (length == 2) {
                      show = 2;
                      rows = 1;
                    }  

                    sliderNav2.slick({
                        dots: true,
                        rows: rows,
                        arrows: navArrowsDesk,
                        infinite: true,
                        slidesPerRow: 1,
                        slidesToShow: show,
                        focusOnSelect: false,
                        asNavFor: checkFor,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: navArrowsMobi
                                }
                            }
                        ]
                    });
                } else if(sliderNav.hasClass('productView-horizontal-tabs')) {
                    var sliderNav2 = $scope.find('.productView-nav.productView-horizontal-tabs'),
                        show = 2,
                        rows = 1;

                    sliderNav2.slick({
                        dots: true,
                        rows: rows,
                        arrows: navArrowsDesk,
                        infinite: true,
                        slidesPerRow: 1,
                        slidesToShow: show,
                        focusOnSelect: false,
                        asNavFor: checkFor,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: navArrowsMobi
                                }
                            }
                        ]
                    });
                } else {
                    if (!sliderNav.is('.style-2, .style-3') || window.innerWidth < 768) {
                        sliderNav.slick({
                            fade: true,
                            dots: false,
                            arrows: navArrowsDesk,
                            infinite: true,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            asNavFor: checkFor,
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            responsive: [
                                {
                                    breakpoint: 768,
                                    settings: {
                                        arrows: navArrowsMobi
                                    }
                                }
                            ]
                        }); 
                        checkNav = sliderNav;
                    }
                    else {
                        checkNav = false;
                    }
                }

                if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                    sliderFor.on('init',(event, slick) => {
                        sliderFor.find('.animated-loading').removeClass('animated-loading');
                    });

                    sliderFor.slick({
                        slidesToShow: thumbnailToShow,
                        slidesToScroll: 1,
                        asNavFor: checkNav,
                        arrows: true,
                        dots: false,
                        draggable: false,
                        adaptiveHeight: false,
                        focusOnSelect: true,
                        vertical: true,
                        verticalSwiping: true,
                        infinite: true,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: thumbnailToShow > 3 ? thumbnailToShow - 1 : thumbnailToShow,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 1280,
                                settings: {
                                    vertical: false,
                                    verticalSwiping: false
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    vertical: false,
                                    verticalSwiping: false
                                }
                            }
                        ]
                    });
                } else if($scope.hasClass('layout-3')){
                    sliderFor.on('init',(event, slick) => {
                        sliderFor.find('.animated-loading').removeClass('animated-loading');
                    });

                    sliderFor.slick({
                        slidesToShow: thumbnailToShow,
                        slidesToScroll: 1,
                        asNavFor: checkNav,
                        arrows: true,
                        dots: false,
                        focusOnSelect: true,
                        infinite: true,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: thumbnailToShow > 3 ? thumbnailToShow - 1 : thumbnailToShow,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                }

                sliderForMobile.on('init',(event, slick) => {
                    sliderForMobile.find('.animated-loading').removeClass('animated-loading');
                });

                sliderForMobile.slick({
                    slidesToShow:  parseInt(sliderForMobile.data('max-thumbnail-to-show')),
                    slidesToScroll: 1,
                    asNavFor: checkNav,
                    arrows: true,
                    dots: false,
                    draggable: false,
                    adaptiveHeight: false,
                    focusOnSelect: true,
                    vertical: true,
                    verticalSwiping: true,
                    infinite: true,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    responsive: [
                        {
                            breakpoint: 1600,
                            settings: {
                                slidesToShow: thumbnailToShow > 3 ? thumbnailToShow - 1 : thumbnailToShow,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 1280,
                            settings: {
                                vertical: false,
                                verticalSwiping: false
                            }
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 2.2,
                                slidesToScroll: 1,
                                vertical: false,
                                verticalSwiping: false
                            }
                        }
                    ]
                });
                    
                if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                    if ($win.width() > 1279) {
                        if (sliderFor.find('.slick-arrow').length > 0) {
                            var height_for = sliderFor.outerHeight(),
                                height_nav = sliderNav.outerHeight(),
                                pos = (height_nav - height_for)/2;

                            sliderFor.parent().addClass('arrows-visible');
                            sliderFor.parent().css('top', pos);
                        } else {
                            sliderFor.parent().addClass('arrows-disable');
                        }
                    } else {
                        if (sliderFor.find('.slick-arrow').length > 0) {
                            sliderFor.parent().css('top', 'unset');
                        }
                    }
                }

                if (sliderNav.find('[data-youtube]').length > 0) {
                    if (typeof window.onYouTubeIframeAPIReady === 'undefined') {
                        window.onYouTubeIframeAPIReady = halo.initYoutubeCarousel.bind(window, sliderNav);

                        const tag = document.createElement('script');
                        tag.src = 'https://www.youtube.com/player_api';
                        const firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    } else {
                        halo.initYoutubeCarousel(sliderNav);
                    }
                }

                if (sliderNav.find('[data-vimeo]').length > 0) {
                    sliderNav.on('beforeChange', (event, slick) => {
                        var currentSlide,
                            player,
                            command;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('iframe').get(0);

                        command = {
                            'method': 'pause',
                            'value': 'true'
                        };

                        if (player != undefined) {
                            player.contentWindow.postMessage(JSON.stringify(command), '*');
                        }
                    });

                    sliderNav.on('afterChange', (event, slick) => {
                        var currentSlide,
                            player,
                            command;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('iframe').get(0);

                        command = {
                            'method': 'play',
                            'value': 'true'
                        };

                        if (player != undefined) {
                            player.contentWindow.postMessage(JSON.stringify(command), '*');
                        }
                    });
                }

                if (sliderNav.find('[data-mp4]').length > 0) {
                    sliderNav.on('beforeChange', (event, slick) => {
                        var currentSlide,
                            player;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('video').get(0);

                        if (player != undefined) {
                            player.pause();
                        }
                    });

                    sliderNav.on('afterChange', (event, slick) => {
                        var currentSlide,
                            player;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('video').get(0);

                        if (player != undefined) {
                            player.play();
                        }
                    });
                }

                if (window.innerWidth < 768 && navCounterMobi) {
                    sliderNav.append(`<div class="slick-counter">
                                        <span class="slick-counter--current">1</span>
                                        <span aria-hidden="true">/</span>
                                        <span class="slick-counter--total">`+navMediaCount+`</span>
                                    </div>`);
                    sliderNav.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                        var i = (currentSlide ? currentSlide : 0) + 1;
                        sliderNav.find('.slick-counter--current').text(i);
                    });
                }
            }

            var productFancybox = $scope.find('[data-fancybox]');

            if(productFancybox.length > 0){
                productFancybox.fancybox({
                    buttons: [
                        "zoom",
                        "share",
                        "slideShow",
                        "fullScreen",
                        //"download",
                        "thumbs",
                        "close"
                    ],
                    loop : true,
                    thumbs : {
                        autoStart : true,
                    }
                });
            }

            var productZoom = $scope.find('[data-zoom-image]');

            if ($win.width() > 1024) {
                productZoom.each((index, element) => {
                    var $this = $(element);
                    
                    if ($win.width() > 1024) {
                        $this.zoom({ url: $this.attr('data-zoom-image'), touch: false });
                    } else {
                        $this.trigger('zoom.destroy');
                    }
                });
            }

            $win.on('resize', () => {
                if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                    if ($win.width() > 1279) {
                        setTimeout(() => {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                var height_for = sliderFor.outerHeight(),
                                    height_nav = sliderNav.outerHeight(),
                                    pos = (height_nav - height_for)/2;

                                sliderFor.parent().addClass('arrows-visible');
                                sliderFor.parent().css('top', pos);
                            } else {
                                sliderFor.parent().addClass('arrows-disable');
                            }
                        }, 200);
                    } else {
                        setTimeout(() => {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                sliderFor.parent().css('top', 'unset');
                            }
                        }, 200);
                    }
                }
            });
        },

        productVideoGallery: function($scope) {
            const videoThumbnail = $scope.find('[data-video-thumbnail]'),
                videoThumbnailLen = videoThumbnail.length,
                productVideoLen = $('.productView-video').length;

            if (videoThumbnailLen) {
                const $imageWrapper = $scope.find('.productView-image-wrapper'),
                    videoModal = $('[data-popup-video]'),
                    sliderNav = $scope.find('.productView-nav');
                let offsetTop = $imageWrapper.offset().top + $imageWrapper.outerHeight();

                if (productVideoLen) {
                    $body.addClass('has-product-video');
                }
                
                $win.on('scroll', (event) => {
                    const $targetCur = $(event.currentTarget),
                        thisVideo = $scope.find('.slick-current .productView-video'),
                        videoType = thisVideo.data('type'),
                        videoUrl = thisVideo.data('video-url');

                    if (videoUrl != undefined) {
                        if ($targetCur.scrollTop() > offsetTop) {
                            if (!videoModal.is('.is-show')) {
                                const player = sliderNav.find('.slick-slide.slick-active').data('youtube-player'),
                                    dataTime = parseInt(player.getCurrentTime()),
                                    videoContent = `<div class="fluid-width-video-wrapper" style="padding-top: 56.24999999999999%">
                                                    ${videoType == 'youtube' ? 
                                                        `<iframe
                                                            id="player"
                                                            type="text/html"
                                                            width="100%"
                                                            frameborder="0"
                                                            webkitAllowFullScreen
                                                            mozallowfullscreen
                                                            allowFullScreen
                                                            src="https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=1&start=${dataTime}">
                                                        </iframe>`
                                                        :
                                                        `<iframe 
                                                            src="https://player.vimeo.com/video/${videoUrl}?autoplay=1&mute=1" 
                                                            class="js-vimeo" 
                                                            allow="autoplay; 
                                                            encrypted-media" 
                                                            webkitallowfullscreen 
                                                            mozallowfullscreen 
                                                            allowfullscreen">
                                                        </iframe>`
                                                    }
                                                </div>`;
                                videoModal.addClass('is-show');
                                videoModal.find('.halo-popup-content').html(videoContent);
                                $body.addClass('video-show product-video-show');
                                player.pauseVideo();
                            }
                        } else {
                            const player = sliderNav.find('.slick-slide.slick-active').data('youtube-player');
                            videoModal.removeClass('is-show');
                            videoModal.find('.halo-popup-content').empty();
                            $body.removeClass('video-show product-video-show');
                            player.playVideo();
                        }
                    }
                });
            }
        },

        initVariantImageGroup: function($scope, enable = false) {
            if(enable){
                var inputChecked = $scope.find('[data-filter]:checked'),
                    sliderFor = $scope.find('.productView-for'),
                    sliderNav = $scope.find('.productView-nav');    

                if(inputChecked.length > 0){
                    var className = inputChecked.data('filter');

                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    }
                }

                $doc.on('change', 'input[data-filter]', (event) => {
                    var className = $(event.currentTarget).data('filter');

                    sliderNav.slick('slickUnfilter');
                    sliderFor.slick('slickUnfilter');

                    if(className !== undefined) {

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    }
                });
            }
        },

        initYoutubeCarousel: function(slider) {
            slider.each((index, slick) => {
                const $slick = $(slick);

                if ($slick.find('[data-youtube]').length > 0) {
                    $slick.addClass('slick-slider--video');

                    halo.initYoutubeCarouselEvent(slick);
                }
            });
        },

        initYoutubeCarouselEvent: function(slick){
            var $slick = $(slick),
                $videos = $slick.find('[data-youtube]');

            bindEvents(slick);

            function bindEvents() {
                if ($slick.hasClass('slick-initialized')) {
                    onSlickImageInit($slick, $videos);
                }

                $doc.on('init', $slick, onSlickImageInit);
                $doc.on('beforeChange', $slick, onSlickImageBeforeChange);
                $doc.on('afterChange', $slick, onSlickImageAfterChange);
            }

            function onPlayerReady(event) {
                $(event.target.getIframe()).closest('.slick-slide').data('youtube-player', event.target);

                setTimeout(function(){
                    if ($(event.target.getIframe()).closest('.slick-slide').hasClass('slick-active')) {
                        $slick.slick('slickPause');
                        event.target.playVideo();
                    }
                }, 200);
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    $slick.slick('slickPause');
                }

                if (event.data === YT.PlayerState.ENDED) {
                    $slick.slick('slickNext');
                }
            }

            function onSlickImageInit() {
                $videos.each((j, vid) => {
                    const $vid = $(vid);
                    const id = `youtube_player_${Math.floor(Math.random() * 100)}`;

                    $vid.attr('id', id);

                    const player = new YT.Player(id, {
                        host: 'http://www.youtube.com',
                        videoId: $vid.data('youtube'),
                        wmode: 'transparent',
                        playerVars: {
                            autoplay: 0,
                            controls: 0,
                            disablekb: 1,
                            enablejsapi: 1,
                            fs: 0,
                            rel: 0,
                            showinfo: 0,
                            iv_load_policy: 3,
                            modestbranding: 1,
                            wmode: 'transparent',
                        },
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                        },
                    });
                });
            }

            function onSlickImageBeforeChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    player.stopVideo();
                    $slick.removeClass('slick-slider--playvideo');
                }
            }

            function onSlickImageAfterChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    $slick.slick('slickPause');
                    $slick.addClass('slick-slider--playvideo');
                    player.playVideo();
                }
            }
        },

        productSizeChart: function($scope){
            window.sizeChart = function() {
                var sizeChartBtn =  $scope.find('[data-open-size-chart-popup]');

                sizeChartBtn.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    document.body.classList.add('size-chart-show');
                    if (document.body.classList.contains('quick-view-show')) {
                        $('.halo-popup-content .halo-size-chart-popup').addClass('is-show');
                    }
                    else {
                        $('#MainContent .halo-size-chart-popup').addClass('is-show');
                    }
                });

                $doc.on('click', '[data-close-size-chart-popup]', () => {
                    $body.removeClass('size-chart-show');
                    $('.halo-size-chart-popup').removeClass('is-show');
                });

                $doc.on('click', (event) => {
                    if ($body.hasClass('size-chart-show')) {
                        if (($(event.target).closest('[data-open-size-chart-popup]').length === 0) && ($(event.target).closest('[data-size-chart-popup]').length === 0)) {
                            $body.removeClass('size-chart-show');
                        }
                    }
                });
            };

            var quickViewShow = document.body.classList.contains('quick-view-show'),
                productSizeChart = $('.halo-productView .productView-sizeChart').length;

            if (document.body.classList.contains('template-product')) {
                if (!quickViewShow && productSizeChart) {
                    window.sizeChart();
                } else if (quickViewShow && productSizeChart === 0) {
                    window.sizeChart();
                }
            } else {
                window.sizeChart();
            }
        },

        productLastSoldOut: function($scope) {
            var wrapper = $scope.find('[data-sold-out-product]');

            if (wrapper.length > 0) {
                var numbersProductList = wrapper.data('item').toString().split(','),
                    numbersProductItem = Math.floor(Math.random() * numbersProductList.length),
                    numbersHoursList = wrapper.data('hours').toString().split(','),
                    numbersHoursItem = Math.floor(Math.random() * numbersHoursList.length);

                wrapper.find('[data-sold-out-number]').text(numbersProductList[numbersProductItem]);
                wrapper.find('[data-sold-out-hours]').text(numbersHoursList[numbersHoursItem]);
                wrapper.show();
            }
        },

        productCustomerViewing: function($scope) {
            var wrapper = $scope.find('[data-customer-view]');

            if (wrapper.length > 0) {
                var numbersViewer = wrapper.data('customer-view'),
                    numbersViewerList =  JSON.parse('[' + numbersViewer + ']'),
                    numbersViewerTime = wrapper.data('customer-view-time'),
                    timeViewer =  parseInt(numbersViewerTime) * 1000;
                
                setInterval(function() {
                    var numbersViewerItem = (Math.floor(Math.random() * numbersViewerList.length));

                    wrapper.find('.text').text(window.customer_view.text.replace('[number]', numbersViewerList[numbersViewerItem]));
                }, timeViewer);
            }
        },

        productCountdown: function($scope){
            var wrapper = $scope.find('[data-countdown-id]'),
                countDown = wrapper.data('countdown'),
                countDownDate = new Date(countDown).getTime(),
                countDownText = window.countdown.text;

            if(wrapper.length > 0) {
                var countdownfunction = setInterval(function() {
                    var now = new Date().getTime(),
                        distance = countDownDate - now;

                    if (distance < 0) {
                        clearInterval(countdownfunction);
                        wrapper.remove();
                    } else {
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000),
                            strCountDown;

                        if (wrapper.is('.style-2, .style-3')) {
                            strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num">'+days+'<span>'+ window.countdown.day_2 +'</span></span>\
                                <span class="num">'+hours+'<span>'+ window.countdown.hour_2 +'</span></span>\
                                <span class="num">'+minutes+'<span>'+ window.countdown.min_2 +'</span></span>\
                                <span class="num">'+seconds+'<span>'+ window.countdown.sec_2 +'</span></span>';
                        }
                        else {
                            strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num">'+days+'<span>'+ window.countdown.day +'</span></span>\
                                <span class="num">'+hours+'<span>'+ window.countdown.hour +'</span></span>\
                                <span class="num">'+minutes+'<span>'+ window.countdown.min +'</span></span>\
                                <span class="num">'+seconds+'<span>'+ window.countdown.sec +'</span></span>';
                        }

                        wrapper.html(strCountDown);
                    }
                }, 1000);
            }
        },

        productCustomCursor: function($scope){
            if ($('.cursor-wrapper').length == 0) return;
            const { Back } = window;

            this.cursorWrapper = document.querySelector(".cursor-wrapper");
            this.innerCursor = document.querySelector(".custom-cursor__inner");
            this.outerCursor = document.querySelector(".custom-cursor__outer");

            this.cursorWrapperBox = this.cursorWrapper.getBoundingClientRect();
            this.innerCursorBox = this.innerCursor.getBoundingClientRect();
            this.outerCursorBox = this.outerCursor.getBoundingClientRect();

            document.addEventListener("mousemove", e => {
                this.clientX = e.clientX;
                this.clientY = e.clientY;
            });

            const render = () => {
                TweenMax.set(this.cursorWrapper, {
                    x: this.clientX,
                    y: this.clientY
                });
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);

            this.fullCursorSize = 60;
            this.enlargeCursorTween = TweenMax.to(this.outerCursor, 0.3, {
                width: this.fullCursorSize,
                height: this.fullCursorSize,
                ease: this.easing,
                paused: true
            });

            const handleMouseEnter = () => {
                this.enlargeCursorTween.play();
                $('.cursor-wrapper').addClass('handleMouseEnter').removeClass('handleMouseLeave');
            };

            const handleMouseLeave = () => {
                this.enlargeCursorTween.reverse();
                $('.cursor-wrapper').addClass('handleMouseLeave').removeClass('handleMouseEnter');
            };

            const gridItems = document.querySelectorAll(".productView-image");
            gridItems.forEach(el => {
                if (el?.querySelector('.productView-video')) return;
                el.addEventListener("mouseenter", handleMouseEnter);
                el.addEventListener("mouseleave", handleMouseLeave);
            });

            this.bumpCursorTween = TweenMax.to(this.outerCursor, 0.1, {
                scale: 0.7,
                paused: true,
                onComplete: () => {
                    TweenMax.to(this.outerCursor, 0.2, {
                        scale: 1,
                        ease: this.easing
                    });
                }
            });

            $(document).on('mouseover', '[data-cursor-image]', (event) => {
                var $target = $(event.currentTarget),
                    imagesInView = new Array();

                imagesInView.push($target.attr('data-index'));
                $("#count-image").text(imagesInView[0]);
            });

            $.fn.isInViewport = function(excludePartials) {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).height();

                var viewportTop = $(document).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                if (excludePartials) {
                    var bottomVisible = (elementBottom - viewportTop) / $(this).height();
                    var isInView = elementBottom > viewportTop && elementTop < viewportBottom;

                    return isInView && bottomVisible > 0.5;
                }

                return elementBottom > viewportTop && elementTop < viewportBottom;
            };

            
            if ($('.product-full-width').length > 0 || $('.product-full-width-2').length > 0) {
                $(window).on('resize scroll', function() {
                    var imagesInView = new Array();
                    $('.productView-image').each(function() {
                        if ($(this).isInViewport(true)) {
                            imagesInView.push($(this).attr('data-index'));
                            $("#count-image").text(imagesInView[0]);
                        }
                    });
                });
            }
        },

        initWishlist: function() {
            if(window.wishlist.show){
                halo.setLocalStorageProductForWishlist();
                
                $doc.on('click', '[data-wishlist]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $('[data-wishlist-items-display]').removeClass('is-loaded');
                    
                    var $target = $(event.currentTarget),
                        id = $target.data('product-id'),
                        handle = $target.data('wishlist-handle'),
                        wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
                        index = wishlistList.indexOf(handle),
                        wishlistContainer = $('[data-wishlist-container]');
                    if(!$target.hasClass('wishlist-added')){
                        $target
                            .addClass('wishlist-added')
                            .find('.text')
                            .text(window.wishlist.added);

                        if(wishlistContainer.length > 0) {
                            halo.setProductForWishlistPage(handle);
                        }

                        wishlistList.push(handle);
                        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));
                    } else {
                        $target
                            .removeClass('wishlist-added')
                            .find('.text')
                            .text(window.wishlist.add);
                        if(wishlistContainer.length > 0) {
                            if($('[data-wishlist-added="wishlist-'+ id +'"]').length > 0) {
                                $('[data-wishlist-added="wishlist-'+ id +'"]').remove();
                            }
                        }

                        wishlistList.splice(index, 1);
                        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));
                        halo.wishlistPagination();                         

                        if(wishlistContainer.length > 0) {
                            wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];

                            if (wishlistList.length > 0) {
                                halo.updateShareWishlistViaMail();
                            } else {
                                $('[data-wishlist-container]')
                                    .addClass('is-empty')
                                    .html(`\
                                    <div class="wishlist-content-empty text-center">\
                                        <span class="wishlist-content-text">${window.wishlist.empty}</span>\
                                        <div class="wishlist-content-actions">\
                                            <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                                                ${window.wishlist.continue_shopping}\
                                            </a>\
                                        </div>\
                                    </div>\
                                `);

                                $('[data-wishlist-footer]').hide();
                            }   
                        }
                    }
                    $('[data-wishlist-count]').text(wishlistList.length);
                    halo.setProductForWishlist(handle);
                });
            }
        },

        wishlistPagination: function() {
            var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
            var wlpaggingContainer = $('#wishlist-paginate');
            let paggingTpl

            if (window.pagination.style === 1) {
                paggingTpl = '<li class="pagination-arrow prev disabled style-1"><a href="#" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"><svg class="icon thin-arrow" viewBox="0 0 50 50"><path d="M 11.957031 13.988281 C 11.699219 14.003906 11.457031 14.117188 11.28125 14.308594 L 1.015625 25 L 11.28125 35.691406 C 11.527344 35.953125 11.894531 36.0625 12.242188 35.976563 C 12.589844 35.890625 12.867188 35.625 12.964844 35.28125 C 13.066406 34.933594 12.972656 34.5625 12.71875 34.308594 L 4.746094 26 L 48 26 C 48.359375 26.003906 48.695313 25.816406 48.878906 25.503906 C 49.058594 25.191406 49.058594 24.808594 48.878906 24.496094 C 48.695313 24.183594 48.359375 23.996094 48 24 L 4.746094 24 L 12.71875 15.691406 C 13.011719 15.398438 13.09375 14.957031 12.921875 14.582031 C 12.753906 14.203125 12.371094 13.96875 11.957031 13.988281 Z"></path></svg></span></a></li>';
            } else if (window.pagination.style === 2) {
                paggingTpl = '<li class="pagination-arrow prev disabled style-2"><a href="#" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg></span></a></li>';
            } else {
                paggingTpl = '<li class="pagination-arrow prev disabled style-3"><a href="#" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg><span class="arrow-text">'+ window.pagination.prev +'</span></a></li>';
            }

            let wishlistItemDisplay = $('[data-wishlist-items-display]');
            wishlistItemDisplay.removeClass('is-loaded')
            setTimeout(() => {
                wlpaggingContainer.children().remove();
                var totalPages = Math.ceil(wishlistList.filter(item => item != null).length / 3);
                
                if (totalPages <= 1) {
                    wishlistItemDisplay.children().show();
                    wishlistItemDisplay.addClass('is-loaded');
                    return;
                }

                for (var i = 0; i < totalPages; i++) {
                    var pageNum = i + 1;
                    if (i === 0) paggingTpl += '<li class="active pagination-num"><a class="pagination__item link" data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
                    else paggingTpl += '<li class="pagination-num"><a class="pagination__item link" data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
                }
                
                if (window.pagination.style === 1) {
                    paggingTpl += '<li class="pagination-arrow next style-1"><a href="#" class="pagination__item pagination__item--next pagination__item-arrow link"><svg class="icon thin-arrow" viewBox="0 0 50 50"><path d="M 11.957031 13.988281 C 11.699219 14.003906 11.457031 14.117188 11.28125 14.308594 L 1.015625 25 L 11.28125 35.691406 C 11.527344 35.953125 11.894531 36.0625 12.242188 35.976563 C 12.589844 35.890625 12.867188 35.625 12.964844 35.28125 C 13.066406 34.933594 12.972656 34.5625 12.71875 34.308594 L 4.746094 26 L 48 26 C 48.359375 26.003906 48.695313 25.816406 48.878906 25.503906 C 49.058594 25.191406 49.058594 24.808594 48.878906 24.496094 C 48.695313 24.183594 48.359375 23.996094 48 24 L 4.746094 24 L 12.71875 15.691406 C 13.011719 15.398438 13.09375 14.957031 12.921875 14.582031 C 12.753906 14.203125 12.371094 13.96875 11.957031 13.988281 Z"></path></svg></span></a></li>';
                } else if (window.pagination.style === 2) {
                    paggingTpl += '<li class="pagination-arrow next style-2"><a href="#" class="pagination__item pagination__item--next pagination__item-arrow link"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg></span></a></li>';
                } else {
                    paggingTpl += '<li class="pagination-arrow next style-3"><a href="#" class="pagination__item pagination__item--next pagination__item-arrow link"><span class="arrow-text">' + window.pagination.next +'</span><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"></svg></span></a></li>';
                }

                wlpaggingContainer.append(paggingTpl);
                wishlistItemDisplay.children().each(function(idx, elm) {
                    if (idx >= 3) {
                        $(elm).hide();
                    }
                    else {
                        $(elm).show();
                    }
                });

                wishlistItemDisplay.children().slice(3).css('display', 'none')

                wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function(e) {
                    e.preventDefault();
                    var isPrev = $(this).parent().hasClass('prev');
                    var isNext = $(this).parent().hasClass('next');
                    var pageNumber = $(this).data('page');

                    const curPage = parseInt($(this).parent().siblings('.active').children().data('page'));

                    if (isPrev) {
                        pageNumber = curPage - 1;
                    }

                    if (isNext) {
                        pageNumber = curPage + 1;
                    }

                    wishlistItemDisplay.children().each(function(idx, elm) {
                        if (idx >= (pageNumber - 1) * 3 && idx < pageNumber * 3) {
                            $(elm).show();
                        }
                        else {
                            $(elm).hide();
                        }
                    });

                    if (pageNumber === 1) {
                        wlpaggingContainer.find('.prev').addClass('disabled');
                        wlpaggingContainer.find('.next').removeClass('disabled');
                    }
                    else if (pageNumber === totalPages) {
                        wlpaggingContainer.find('.next').addClass('disabled');
                        wlpaggingContainer.find('.prev').removeClass('disabled');
                    }
                    else {
                        wlpaggingContainer.find('.prev').removeClass('disabled');
                        wlpaggingContainer.find('.next').removeClass('disabled');
                    }

                    $(this).parent().siblings('.active').removeClass('active');
                    wlpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');
                });
                wishlistItemDisplay.addClass('is-loaded')
            }, 500)  
        },

        initWishlistPage: function (){
            if (typeof(Storage) !== 'undefined') {
                var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
                if (wishlistList.length > 0) {
                    wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));
                    wishlistList.forEach((handle, index) => {
                        halo.setProductForWishlistPage(handle, index);
                    });
                } else {
                    $('[data-wishlist-container]')
                        .addClass('is-empty')
                        .html(`\
                        <div class="wishlist-content-empty text-center">\
                            <span class="wishlist-content-text">${window.wishlist.empty}</span>\
                            <div class="wishlist-content-actions">\
                                <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                                    ${window.wishlist.continue_shopping}\
                                </a>\
                            </div>\
                        </div>\
                    `);

                    $('[data-wishlist-footer]').hide();
                }
                halo.wishlistPagination()
            } else {
                alert('Sorry! No web storage support..');
            }
        },

        setProductForWishlistPage: function(handle, index) {
            var wishlistContainer = $('[data-wishlist-container]');

            $.getJSON(window.routes.root + '/products/'+ handle +'.js', (product) => {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                productHTML += '<div class="wishlist-row" data-wishlist-added="wishlist-'+ product.id +'" data-product-id=product-'+ product.id +'">';
                productHTML += '<div class="wishlist-rowItem wishlist-image text-left">';
                productHTML += '<div class="item">';
                productHTML += '<a class="item-image" href="'+ product.url +'"><img srcset="'+ product.featured_image +'" alt="'+ product.featured_image.alt +'"></a></div>';
                productHTML += '</div>';
                productHTML += '<div class="wishlist-rowItem wishlist-meta text-left">';
                productHTML += '<div class="item">';
                productHTML += '<div class="item-info"><a class="item-title link link-underline" href="'+ product.url +'"><span class="text">'+ product.title +'</span></a></div>';
                productHTML += '<a class="item-vendor" href="'+ window.routes.root +'/collections/vendors?q='+ product.vendor +'">'+ product.vendor +'</a>';
                productHTML += '</div></div>';
                productHTML += '<div class="wishlist-rowItem wishlist-price text-left"><div class="item-price">'+ price_min +'</div></div>';
                productHTML += '<div class="wishlist-rowItem wishlist-add text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-'+ product.id +'" data-id="product-actions-'+ product.id +'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="item-btn button add-to-cart-btn"data-form-id="#wishlist-product-form-' + product.id +'" type="submit">'+ window.variantStrings.addToCart +'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />';
                    }

                    if (product.variants.length > 1){
                        productHTML += '<a class="item-btn button" title="'+ product.title +'" href="'+ product.url +'">'+ window.variantStrings.select +'</a>';
                    }
                } else {
                    productHTML += '<button class="item-btn button add-to-cart-btn" type="submit" disabled>'+ window.variantStrings.soldOut +'</button>';
                }

                productHTML += '</form></div>';
                productHTML += '<div class="wishlist-rowItem wishlist-remove text-center"><a class="item-remove wishlist-added" href="#" data-wishlist-handle="'+ product.handle +'" data-wishlist data-product-id="'+ product.id +'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"/></svg></a></div>';
                productHTML += '</div>';

                wishlistContainer.find('.wishlist-items-display').append(productHTML);
                halo.updateShareWishlistViaMail();

                if(index == wishlistContainer.find('[data-wishlist-added]').length - 1){
                    halo.updateShareWishlistViaMail();
                }
            });
        },

        updateShareWishlistViaMail: function() {
            const regex = /(<([^>]+)>)/ig;

            var $share = $('[data-wishlist-share]'),
                href = 'mailto:?subject= Wish List&body=',
                product,
                title,
                url,
                price;

            $('[data-wishlist-added]').each((index, element) => {
                product = $(element);
                price = product.find('.item-price .money').text();
                title = product.find('.item-title .text').text();
                url = product.find('.item-title').attr('href');

                href += encodeURIComponent(title + '\nPrice: ' + price.replace(regex, '') + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + url +'\n\n');
            });

            $share.attr('href', href);
        },

        setProductForWishlist: function(handle){
            var wishlistList = JSON.parse(localStorage.getItem('wishlistItem')),
                item = $('[data-wishlist-handle="'+ handle +'"]'),
                index = wishlistList.indexOf(handle);
            
            if(index >= 0) {
                item
                    .addClass('wishlist-added')
                    .find('.text')
                    .text(window.wishlist.added)
            } else {
                item
                    .removeClass('wishlist-added')
                    .find('.text')
                    .text(window.wishlist.add);
            }
        },

        setLocalStorageProductForWishlist: function() {
            var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
            localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

            if (wishlistList.length > 0) {
                wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));
                
                wishlistList.forEach((handle) => {
                    halo.setProductForWishlist(handle);
                });
            }
            $('[data-wishlist-count]').text(wishlistList.length);
        },

        initCountdown: function () {
            var countdownElm = $('[data-countdown]').not('[data-countdown-id]');

            if (countdownElm.length) {
                countdownElm.each(function () {
                    var self = $(this),
                        countDown = self.data('countdown-value');
                        countDownDate = new Date(countDown).getTime(),
                        countDownText = window.countdown.text;

                    var countdownfunction = setInterval(function() {
                        var now = new Date().getTime(),
                            distance = countDownDate - now;

                        if (distance < 0) {
                            clearInterval(countdownfunction);
                            if (self.hasClass('hide--countdown')) {
                                self.remove();
                            }
                            else {
                                self.parents('.shopify-section').remove();
                            }
                        } else {
                            var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                                hours = `0${Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2),
                                minutes = `0${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2),
                                seconds = `0${Math.floor((distance % (1000 * 60)) / 1000)}`.slice(-2),
                                strCountDown = '';
                            if (self.hasClass('product-countdown-block')) {
                                if($('.halo-block-header').hasClass('countdown_style_2')){
                                    strCountDown = '<div class="clock-item"><span class="num">'+days+ window.countdown.d +'</span><span class="icon">:</span></div>\
                                                <div class="clock-item"><span class="num">'+hours+ window.countdown.h +'</span><span class="icon">:</span></div>\
                                                <div class="clock-item"><span class="num">'+minutes+ window.countdown.m +'</span><span class="icon">:</span></div>\
                                                <div class="clock-item"><span class="num">'+seconds+ window.countdown.s +'</span><span class="icon"></span></div>';
                                } else{
                                    strCountDown = `<div class="clock-item"><span class="num">${days}d&nbsp;</span></div>
                                    <div class="clock-item"><span class="num">${hours}:</span></div>
                                    <div class="clock-item"><span class="num">${minutes}:</span></div>
                                    <div class="clock-item"><span class="num">${seconds}</span></div>`;
                                }
                            } else {
                                strCountDown = '<div class="clock-item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.days +'</span></div>\
                                                <div class="clock-item"><span class="num">'+hours+'</span><span class="text">'+ window.countdown.hours +'</span></div>\
                                                <div class="clock-item"><span class="num">'+minutes+'</span><span class="text">'+ window.countdown.mins +'</span></div>\
                                                <div class="clock-item"><span class="num">'+seconds+'</span><span class="text">'+ window.countdown.secs +'</span></div>';
                            }
                            self.html(strCountDown);
                        }
                    }, 1000);
                });
            }
        },

        collectionCountdown: function () {
            var countdownElm = $('[data-collection-countdown]');

            if (countdownElm.length) {
                countdownElm.each(function () {
                    var self = $(this);

                    var countDownCollection = (self) => {
                        var countDown = self.data('collection-countdown-value'),
                            countDownDate = new Date(countDown).getTime(),
                            countDownText = window.countdown.text,
                            now = new Date().getTime(),
                            distance = countDownDate - now;

                        if (distance < 0) {
                            clearInterval(countDownCollection);
                            if (self.hasClass('hide--countdown')) {
                                self.remove();
                            }
                            else {
                                self.parents('.shopify-section').remove();
                            }
                        } else {
                            var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                                hours = `0${Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2),
                                minutes = `0${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2),
                                seconds = `0${Math.floor((distance % (1000 * 60)) / 1000)}`.slice(-2),
                                strCountDown = '';
                            if (self.hasClass('collection-countdown')) {
                                strCountDown = '<div class="clock-item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.days +'</span></div>\
                                                <div class="clock-item"><span class="num">'+hours+'</span><span class="text">'+ window.countdown.hours +'</span></div>\
                                                <div class="clock-item"><span class="num">'+minutes+'</span><span class="text">'+ window.countdown.mins +'</span></div>\
                                                <div class="clock-item"><span class="num">'+seconds+'</span><span class="text">'+ window.countdown.secs +'</span></div>';
                            }
                            self.html(strCountDown);
                        }
                    }

                    setInterval(() =>{
                        countDownCollection(self)
                    }, 1000);
                });
            }
        },

        handleScrollDown: function() {
            var iconSrollDownSlt = '[data-scroll-down]',
                iconSrollDown = $(iconSrollDownSlt);

            if (iconSrollDownSlt.length) {
                iconSrollDown.each(function() {
                    var self = $(this);
                    var target = self.closest('.shopify-section').next('.shopify-section').attr('id');

                    self.attr('href', '#'+ target +'');

                    iconSrollDown.on('click', function(e) {
                        e.preventDefault();
                        var scroll = $(this.getAttribute('href'));

                        if (scroll.length) {
                            $('html, body').stop().animate({
                                scrollTop: scroll.offset().top
                            }, 400);
                        };
                    });
                });
            }
        },

        toggleSidebarMobile: function() {
            $doc.on('click', '[data-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.addClass('open-mobile-sidebar');
            });

            $doc.on('click', '[data-close-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('open-mobile-sidebar');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('open-mobile-sidebar')){
                    if (($(event.target).closest('[data-sidebar]').length === 0) && ($(event.target).closest('#halo-sidebar').length === 0)) {
                        $body.removeClass('open-mobile-sidebar');
                    }
                }
            });
        },

        initBlogMasonry: function() {
            const $blogMasonry = $('.blog-layout-masonry .blog-block-item');

            $blogMasonry.masonry({
                columnWidth: '.blog-grid-sizer',
                itemSelector: '[data-masonry-item]'
            });
        },

        articleGallery: function() {
            const $gallery = $('.articleGallery-block'),
                $gallerySlider = $('.articleGallery-slider'),
                galleryLength = $gallery.length,
                col = $gallerySlider.data('col');

            if (galleryLength > 0 && $gallerySlider.not('.slick-initialized')) {
                $gallerySlider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true,
                    infinite: false,
                    mobileFirst: true,
                    focusOnSelect: false,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: col,
                                slidesToScroll: col
                            }
                        },
                        {
                            breakpoint: 319,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });
            }
        },

        initCollapseSidebarBlock: function (){
            $doc.on('click', '.sidebarBlock-headingWrapper .sidebarBlock-heading', (event) => {
                var $target = $(event.currentTarget),
                    $blockCollapse = $target.parent().siblings(),
                    $sidebarBlock = $target.parents('.sidebarBlock');

                if($target.hasClass('is-clicked')){
                    $target.removeClass('is-clicked');
                    $blockCollapse.slideUp('slow');
                } else {
                    $target.addClass('is-clicked');
                    $blockCollapse.slideDown('slow');

                    if ($sidebarBlock.hasClass('sidebar-product')) {
                        $sidebarBlock.find('.products-carousel').slick('refresh');
                    }
                }
            });
        },

        initCategoryActive: function(){
            if ($('.all-categories-list').length > 0) {
                $doc.on('click', '.all-categories-list .icon-dropdown', (event) => {
                    var $target = $(event.currentTarget).parent();

                    $target.siblings().removeClass('is-clicked current-cate');
                    $target.toggleClass('is-clicked');
                    $target.siblings().find('> .dropdown-category-list').slideUp('slow');
                    $target.find('> .dropdown-category-list').slideToggle('slow');
                });

                $('.all-categories-list li').each((index, element) =>{
                    if ($(element).hasClass('current-cate')) {
                        $(element).find('> .dropdown-category-list').slideToggle('slow');
                    }
                });
            }
        },

        productBlockSilderSidebar: function() {
            var productGrid = $('[data-product-slider-sidebar]'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemArrows = productGrid.data('item-arrows');

            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: false,
                        slidesToShow: itemToShow,
                        slidesToScroll: 1,
                        arrows: itemArrows,
                        dots: itemDots,
                        autoplay: true,
                        autoplaySpeed: 2000,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                    });

                  
                }
            }
        },

        productBlockSilderArticle: function() {
            var productGrid = $('[data-product-slider-article]'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemArrows = productGrid.data('item-arrows');

            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: false,
                        slidesToShow: itemToShow,
                        slidesToScroll: 1,
                        arrows: itemArrows,
                        dots: itemDots,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [{
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                }
                            },
                            {
                                breakpoint: 551,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            }
        },

        articleGallery: function() {
            const $gallery = $('.articleGallery-block'),
                $gallerySlider = $('.articleGallery-slider'),
                galleryLength = $gallery.length,
                col = $gallerySlider.data('col');

            if (galleryLength > 0 && $gallerySlider.not('.slick-initialized')) {
                $gallerySlider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true,
                    infinite: false,
                    mobileFirst: true,
                    focusOnSelect: false,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: col,
                                slidesToScroll: col
                            }
                        },
                        {
                            breakpoint: 319,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });
            }
        },

        initInfiniteScrolling: function(){
            if ($('.pagination-infinite'.length > 0)) {
                $win.on('scroll load', () => {
                    var currentScroll = $win.scrollTop(),
                        pageInfinite = $('.pagination-infinite'),
                        linkInfinite = pageInfinite.find('[data-infinite-scrolling]'),
                        position; 

                    if(linkInfinite.length > 0 && !linkInfinite.hasClass('is-loading')){
                        position = pageInfinite.offset().top - 500;
                        
                        if (currentScroll > position) {
                            var url = linkInfinite.attr('href');

                            halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
                        }
                    }
                });
            }

            $doc.on('click', '[data-infinite-scrolling]', (event) => {
                var linkInfinite = $(event.currentTarget),
                    url = linkInfinite.attr('href');

                event.preventDefault();
                event.stopPropagation();

                halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
            });
        },

        doAjaxInfiniteScrollingGetContent: function(url, link){
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: function () {
                    link.text(link.attr('data-loading-more'));
                    link.addClass('is-loading');
                    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('is-loading');
                    // $body.addClass('has-halo-loader');
                },
                success: function (data) {
                    halo.ajaxInfiniteScrollingMapData(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    link.text(link.attr('data-load-more'));
                    link.removeClass('is-loading');
                    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.remove('is-loading');
                    // $body.removeClass('has-halo-loader');
                    if (document.querySelector('.collection-masonry')) {
                        resizeAllGridItems();
                    }
                }
            });
        },

        ajaxInfiniteScrollingMapData: function(data){
            var currentTemplate = $('#CollectionProductGrid'),
                currentProductListing = currentTemplate.find('.productListing'),
                currentPagination = currentTemplate.find('.pagination'),
                newTemplate = $(data).find('#CollectionProductGrid'),
                newProductListing = newTemplate.find('.productListing'),
                newPagination = newTemplate.find('.pagination'),
                newProductItem = newProductListing.children('.product');
                
            if (newProductItem.length > 0) {
                currentProductListing.append(newProductItem);
                currentPagination.replaceWith(newPagination);

                $('[data-total-start]').text(1);

                if(window.compare.show){
                    var $compareLink = $('a[data-compare-link]');
                    halo.setLocalStorageProductForCompare($compareLink);
                }

                if(window.wishlist.show){
                    halo.setLocalStorageProductForWishlist();
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            }
        },

        initQuickShopProductList: function() {
            $doc.on('click', '[data-open-quickshop-popup-list]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var handle = $(event.currentTarget).data('product-handle'),
                    product = $(event.currentTarget).closest('.card');

                if(!product.hasClass('quick-shop-show')){
                    halo.updateContentQuickShop(product, handle);
                }
            });

            $doc.on('click', '[data-close-quickshop-popup-list]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var product = $(event.currentTarget).closest('.card');

                product.removeClass('quick-shop-show');
                product.find('.card-popup-content').empty();
            });

            $doc.on('click', (event) => {
                if($('.card').hasClass('quick-shop-show')){
                    if (($(event.target).closest('[data-open-quickshop-popup-list]').length === 0) && ($(event.target).closest('.card-popup').length === 0)){
                        $('.card').removeClass('quick-shop-show');
                        $('.card').find('.card-popup-content').empty();
                    }
                }
            });
        },

        updateContentQuickShop: function(product, handle) {
            var popup = product.find('.card-popup'),
                popupContent = popup.find('.card-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_shop',
                beforeSend: function () {
                    $('.card').removeClass('quick-shop-show');
                },
                success: function (data) {
                    popupContent.append(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    product.addClass('quick-shop-show');
                }
            });
        },

        toggleVariantsForExpressOrder: function () {
            var toggleVariant = '[data-toggle-variant]';

            $(document).on('click', toggleVariant, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    curVariants = self.data('target');

                if(self.hasClass('show-options-btn')) {
                    self.text(window.inventory_text.hide_options);
                    $(curVariants).slideDown(700, function () {
                        self.addClass('hide-options-btn').removeClass('show-options-btn');
                    });
                }
                else {
                    self.text(window.inventory_text.show_options);
                    $(curVariants).slideUp(700, function () {
                        self.addClass('show-options-btn').removeClass('hide-options-btn');
                    });
                };
            })
        },

        initExpressOrderAddToCart: function() {
            var addToCartSlt = '[data-express-addtocart]';

            $(document).off('click.addToCartExpress', addToCartSlt).on('click.addToCartExpress', addToCartSlt, function (e) {
                e.preventDefault();

                var self = $(this);

                if (self.attr('disabled') != 'disabled') {
                    var productItem = self.closest('.product-item');

                    if(productItem.length == 0) {
                        productItem = self.closest('.col-options');
                    }

                    var form = productItem.find('form');
                    var variant_id = form.find('select[name=id]').val();

                    if (!variant_id) {
                        variant_id = form.find('input[name=id]').val();
                    };

                    var quantityElm = productItem.find('input[name=quantity]');

                    if(quantityElm.length == 0) {
                        quantityElm = productItem.siblings('.col-qtt').find('input[name=quantity]');
                    }

                    var quantity = quantityElm.val();
                    if (!quantity) {
                        quantity = 1;
                    };

                    if(parseInt(quantity) !== 0) {
                        if (window.ajax_cart == 'none') {
                            form.submit();
                        } else {
                            halo.expressAjaxAddToCart(variant_id, quantity, self, form);
                            form.next('.feedback-text').show();
                        }
                    }
                    else {
                        form.next('.feedback-text').text('Quantity cannot be blank').show();
                    }
                }
                return false;
            });
        },

        expressAjaxAddToCart: function(variant_id, quantity, cartBtn, form) {
            $.ajax({
                type: "post",
                url: "/cart/add.js",
                data: 'quantity=' + quantity + '&id=' + variant_id,
                dataType: 'json',

                beforeSend: function() {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.adding +"...");
                    }, 100);
                },

                success: function(msg) {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.thank_you);
                        cartBtn.addClass('add_more');
                        form.next('.feedback-text').text(window.inventory_text.cart_feedback).addClass('is-added');
                    }, 600);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_more + "...");
                    }, 1000);

                    switch (window.after_add_to_cart.type) {
                        case 'cart':
                            halo.redirectTo(window.routes.cart);

                            break;
                        case 'quick_cart':
                            if(window.quick_cart.show){
                                Shopify.getCart((cart) => {
                                    if( window.quick_cart.type == 'popup'){
                                        // $body.addClass('cart-modal-show');
                                        // halo.updateDropdownCart(cart);
                                    } else {
                                        $body.addClass('cart-sidebar-show');
                                        halo.updateSidebarCart(cart);
                                    }
                                });
                            } else {
                                halo.redirectTo(window.routes.cart);
                            }

                            break;
                        case 'popup_cart_1':
                            Shopify.getCart((cart) => {
                                halo.updatePopupCart(cart, 1);
                                halo.updateSidebarCart(cart);
                                $body.addClass('add-to-cart-show');
                            });

                            break;
                    }
                },

                error: function(xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_to_cart);
                    }, 400);
                }
            });
        },

        initProductBundle: function() {
            var productBundle = $('[data-product-bundle]'),
                bundleList = productBundle.find('[data-bundle-slider]'),
                dots = bundleList.data('dots'),
                arrows = bundleList.data('arrows');

            if(bundleList.length > 0){
                if(!bundleList.hasClass('slick-initialized')){
                    bundleList.slick({
                        dots: true,
                        arrows: arrows,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        mobileFirst: true,
                        infinite: false,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [
                            {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1,
                                    dots: dots
                                }
                            },
                            {
                                breakpoint: 551,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    dots: dots
                                }
                            }
                        ]
                    });

                    productBundle.find('.bundle-product-wrapper').removeClass('has-halo-block-loader');

                    bundleList.on('afterChange', function(){
                        bundleList.find('.bundle-product-item').removeClass('is-open');
                    });
                }
            }
        },

        initProductReviewSection: function() {
            $doc.ready(() => {
                setTimeout(() => {
                    const $reviewTabContent = $('.productView-review .spr-content'),
                        $thisReviewSection = $('.shopify-app-block .spr-content');
        
                    if ($reviewTabContent && $thisReviewSection) {
                        const reviewContent = $reviewTabContent.html();
                        $thisReviewSection.html(reviewContent);
                    }
                }, 1000);
            });
        },

        initDynamicBrowserTabTitle: function() {
            if(window.dynamic_browser_title.show){
                var pageTitleContent = document.title,
                    newPageTitleContent = window.dynamic_browser_title.text;

                window.onblur = function () {
                    document.title = window.dynamic_browser_title.text;
                }

                window.onfocus = function () {
                    document.title = pageTitleContent;
                }
            }
        },

        initWarningPopup: function() {
            this.warningPopup = document.querySelector('[data-warning-popup]');
            this.warningPopupContent = this.warningPopup.querySelector('[data-halo-warning-content]');
            this.warningPopupCloseButton = this.warningPopup.querySelector('[data-close-warning-popup]');
            this.warningPopupCloseButton.addEventListener('click', () => {
                document.body.classList.remove('has-warning');
            })
            
            this.warningTime = 3000
            this.warningTimeout = undefined;

            window.warningTimeout = this.warningTimeout;
        },  

        showWarning: function(content, time = this.warningTime) {
            if (this.warningTimeout) {
                clearTimeout(this.warningTimeout);
            }

            this.warningPopupContent.textContent = content;
            document.body.classList.add('has-warning');
            
            if (time) {
                this.warningTimeout = setTimeout(() => {
                    document.body.classList.remove('has-warning');
                }, time);
            }
        },

        initBannerAnimation: function () {
            const intoViewObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $target = entry.target;
                        const blockParent = $target.closest('.shopify-section');
                        $target.classList.add('shouldShow')
                        if (!blockParent.classList.contains('observed')) {
                            blockParent.classList.add('observed')
                        }

                        if ($target.closest('.instagram-slide') != null) {
                            const instaSlides = $target.closest('.instagram-slide').querySelectorAll('.halo-item')
                            instaSlides.forEach(instaSlide => instaSlide.classList.add('shouldShow'))
                        }
                        observer.unobserve(entry.target)
                    }
                })
            }, {
                threshold: 0.25,
            })

            function testimonialsSlick() {
                if (typeof $.fn.slick == 'function') {
                    // initialize banners and text animation
                    const bannerAnimationArray = [
                        {
                            klass: '.spotlight-block',
                            type: '.halo-item'
                        },
                        {
                            klass: '.halo-collection-content',
                            type: '.halo-item'
                        },
                        {
                            klass: '.instagram-slide',
                            type: '.halo-item'
                        },
                        {
                            klass: '.featured-blog-block',
                            type: ['.blog-block', '.halo-item']
                        },
                        // {
                        //     klass: '.portfolio-header-container.has-bg-image',
                        //     type: null
                        // },
                        {
                            klass: '.container.has-bg-image',
                            type: null
                        },
                        {
                            klass: '.contact-container',
                            type: null
                        },
                        {
                            klass: '.product-block-has__banner .product-block__banner',
                            type: null
                        },
                        {
                            klass: '.featured-collection-block',
                            type: '.halo-item'
                        },
                        {
                            klass: '.custom-image-banner-block',
                            type: '.halo-item'
                        },
                        {
                            klass: '.product-tab--block-has__banner .product-block__banner',
                            type: null
                        },
                        {
                            klass: '.block-banner-slider',
                            type: '.banner'
                        },
                        // {
                        //     klass: '.articleLookbook-block',
                        //     type: '.articleLookbook-item'
                        // },
                        {
                            klass: '.policies-block-wrapper',
                            type: '.halo-item'
                        },
                        {
                            klass: '.brands-block',
                            type: '.halo-item'
                        },
                        {
                            klass: '.brands-slider',
                            type: '.brand-image-container'
                        },
                        {
                            klass: '.halo-banner-wrapper',
                            type: '.item'
                        },
                        {
                            klass: '.customer-review-block',
                            type: '.halo-item'
                        }
                    ]
                    if ($body.hasClass('banner-animation-1')) {
                        const slideshows = document.querySelectorAll('.slideshow')
                        slideshows.forEach(slideshow => {
                            if (slideshow.classList.contains('slick-initialized')){
                                halo.enableSlideshowAnimationWithSlick(slideshow);
                            } else {
                                const elementsToObserve = slideshow.querySelectorAll('.item')
                                elementsToObserve.forEach(element => {
                                    intoViewObserver.observe(element)
                                })
                            }
                        })

                        bannerAnimationArray.forEach(sliderObj => {
                            let parentsToObserve = document.querySelectorAll(sliderObj.klass);
                            if (parentsToObserve.length > 0) {
                                parentsToObserve.forEach(parent => {
                                    if (parent.classList.contains('slideshow') && parent.querySelectorAll('.item').length > 1) return;

                                    if (sliderObj.type == null) {
                                        intoViewObserver.observe(parent)
                                    } else {
                                        let elementsToObserve = parent.querySelectorAll(sliderObj.type)
                                        elementsToObserve.forEach(element => {
                                            intoViewObserver.observe(element)
                                        })
                                    }
                                })
                            }
                        })
                        const buttons = document.querySelectorAll('.button')
                        buttons.forEach(button => {
                            button.removeEventListener('transitionend', halo.bannerButtonTransitionEnd)
                            button.addEventListener('transitionend', halo.bannerButtonTransitionEnd)
                        })

                        const zoomImages = document.querySelectorAll('.image-zoom')
                        zoomImages.forEach(image => {
                            image.addEventListener('transitionend', () => {
                                image.classList.add('image-animated')
                            })
                        })

                        halo.slideArrowTransitionEnd()
                    }

                    window.clearInterval(slickInterval)
                }
            }

            var slickInterval = window.setInterval(testimonialsSlick, 300);
        },

        enableSlideshowAnimationWithSlick: function (slider) {
            var slides = $(slider).find('.slick-slide');
            var firstSlide = slides.eq(0);
            var allButtons = slides.find('.button');
            var dots = $(slider).find('.slick-dots')
            var arrows = $(slider).find('.slick-arrow');

            firstSlide.addClass('shouldShow')

            setTimeout(() => {
                const section = slider.closest('.shopify-section')
                section.classList.add('observed')
            }, 300)

            var addAndRemoveButtonTransitionListeners = function ($buttons) {
                $buttons.each((index, button) => {
                    if (button.closest('.enable_border_color') != null) {
                        button.classList.add('banner-button-animated')
                    } else {
                        button.removeEventListener('transitionend', halo.bannerButtonTransitionEnd)
                        button.addEventListener('transitionend', halo.bannerButtonTransitionEnd)
                    }
                })
            }
            
            addAndRemoveButtonTransitionListeners(firstSlide.find('.button'))

            $(slider).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                slides.removeClass('shouldShow')
                allButtons.removeClass('banner-button-animated')
                slides.eq(nextSlide).addClass('shouldShow')
                addAndRemoveButtonTransitionListeners(slides.eq(nextSlide).find('.button'))
            })
        },
        
        slideArrowTransitionEnd: function() {
            document.addEventListener('transitionend', e => {
                if (e.target.matches('.slick-arrow')) {
                    const section = e.target.closest('.shopify-section')
                    if (!section?.classList.contains('observed')) return 
                    e.target.classList.add('banner-action-animated')
                }
            })
        },

        bannerButtonTransitionEnd: function (e) {
            const buttonParentArray = [
                {
                    grandParentKlass: '.slideshow',
                    parentKlass: '.item'
                },
                {
                    grandParentKlass: '.spotlight-block',
                    parentKlass: '.halo-item'
                },
                {
                    grandParentKlass: '.product-block-has__banner',
                    parentKlass: '.product-block__banner'
                },
                {
                    grandParentKlass: '.halo-row',
                    parentKlass: '.halo-item'
                },
                {
                    grandParentKlass: '.halo-banner-wrapper',
                    parentKlass: '.item'
                },
                {
                    grandParentKlass: '.custom-image-banner-block',
                    parentKlass: '.halo-item'
                }
            ]

            const button = e.target

            const currentButtonParent = buttonParentArray.find(parent => button.closest(parent.grandParentKlass) != null)
            if (currentButtonParent != null) {
                const parentItem = button.closest(currentButtonParent.parentKlass)
                // if (parentItem?.closest('.slideshow') != null) {
                //     const slickslides = [...parentItem.closest('.slideshow').querySelectorAll('.slick-slide')]
                //     const items = slickslides.map(slide => slide.querySelector('.item')).filter(item => item != null)
                //     if (items.length > 0) {
                //         items.forEach(item => item.classList.remove('shouldShow'))
                //     }
                // }
                
                if (parentItem?.classList.contains('shouldShow') || parentItem?.parentElement.classList.contains('shouldShow')) {
                    button?.classList.add('banner-button-animated');
                } else {
                    button?.classList.remove('banner-button-animated')
                }
            }
        },

        backgroundOverlayHoverEffect: function() {
            const backgroundOverlay = document.querySelector('.background-overlay')
            const backgroundCursorWrapper = document.querySelector('.background-cursor-wrapper')

            const enlargeCursor = () => {
                backgroundCursorWrapper.classList.add('enlarge-cursor')
            }

            const dwindleCursor = () => {
                backgroundCursorWrapper.classList.remove('enlarge-cursor')
            }

            const setCursorPosition = (clientX, clientY) => {
                requestAnimationFrame(() => {
                    backgroundCursorWrapper.style.setProperty('--translate-y', clientY)
                    backgroundCursorWrapper.style.setProperty('--translate-x', clientX)
                })
            }

            const handleMouseMove = (e) => {
                setCursorPosition(e.clientX, e.clientY)                
            }

            const handleMouseEnter = (e) => {
                setCursorPosition(e.clientX, e.clientY)
                enlargeCursor()
            }
            
            const handleMouseLeave = e => {
                setCursorPosition(e.clientX, e.clientY)
                backgroundCursorWrapper.removeEventListener('mousemove', handleMouseMove)
                dwindleCursor()
            }

            backgroundOverlay.addEventListener('mouseenter', handleMouseEnter)
            backgroundOverlay.addEventListener('mouseleave', handleMouseLeave)
            backgroundOverlay.addEventListener('mousemove', handleMouseMove)
            backgroundOverlay.addEventListener('click', dwindleCursor)
        },

        initDragToScroll: function(dragContainer) {
            const dragParent = dragContainer.querySelector('[data-drag-parent]')
            const isOverflowing = (wrapper) => {
                return wrapper.clientWidth < wrapper.scrollWidth
            }
            let containerOverflowing = isOverflowing(dragContainer)

            if (containerOverflowing) {
                this.dragToScroll(dragContainer)
                return 
            }
            this.dragToScroll(dragParent)
        },

        dragToScroll: function(slider) {
            let mouseDown = false;
            let start;
            let scrollLeft;
            let inactiveTimeout

            slider.addEventListener('mousedown', (e) => {
                const target = e.target 

                mouseDown = true;
                start = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseup', () => {
                mouseDown = false;

                clearTimeout(inactiveTimeout)
                inactiveTimeout = setTimeout(() => {
                    slider.classList.remove('active');
                }, 150)
            });

            slider.addEventListener('mousemove', (e) => {
                if(!mouseDown) return;
                e.preventDefault();

                if (!slider.classList.contains('active')) {
                    slider.classList.add('active');
                }

                const x = e.pageX - slider.offsetLeft;
                const walk = (x - start) * 1; 
                slider.scrollLeft = scrollLeft - walk;
            });

            slider.addEventListener('mouseleave', () => {
                mouseDown = false;

                clearTimeout(inactiveTimeout)
                inactiveTimeout = setTimeout(() => {
                    slider.classList.remove('active');
                }, 150)
            });
        },

        productBlockScroller: function (wrapper) {
            const { Back } = window;
            const easingEffect = Back.easeInOut.config(1.7);

            let cursorWrapper = wrapper.get(0)?.querySelector('.products-cursor');

            if(!cursorWrapper) return;

            let innerCursor = cursorWrapper.querySelector('.products-cursor__inner'),
                imageCursor = cursorWrapper.querySelector('.products-cursor__image'),
                iconCursor = cursorWrapper.querySelector('.products-cursor__icon'),
                itemTween = wrapper.get(0)?.querySelectorAll('.halo-block-content.is-scroll'),
                itemNotTween = wrapper.get(0)?.querySelectorAll('.card-product__group, .card-action, .card-title, .card-swatch, .variants-popup, .card-compare, .card-quickview, .card-wishlist'),
                clientX,
                clientY,
                scrollerBox,
                cursorSide = null,
                cursorInsideSwiper = false;

            document.addEventListener('mousemove', (event) => {
                clientX = event.clientX;
                clientY = event.clientY;
                docClientX = event.clientX;
                docClientY = event.clientY;
            });

            const render = () => {
                TweenMax.set(cursorWrapper, {
                    x: clientX,
                    y: clientY
                });
                
                requestAnimationFrame(render);
            };

            requestAnimationFrame(render);

            const wrapTween = TweenMax.to([cursorWrapper] , 0.1, {
                scale: 2.5,
                opacity: 1,
                backgroundColor: 'rgba(42,104,118,1)',
                ease: easingEffect,
                paused: true
            });

            const elementTween = TweenMax.to([imageCursor, iconCursor] , 0.1, {
                opacity: 1,
                ease: easingEffect,
                paused: true
            });

            const handleMouseEnter = (event) => {
                wrapTween.play();
                elementTween.play();
                cursorWrapper.classList.add('handleMouseEnter');
                cursorWrapper.classList.remove('handleMouseLeave');
            };

            const handleMouseLeave = (event) => {
                wrapTween.reverse();
                elementTween.reverse();
                cursorWrapper.classList.add('handleMouseLeave');
                cursorWrapper.classList.remove('handleMouseEnter');
            };

            itemTween.forEach(element => {
                element.addEventListener('mouseenter', handleMouseEnter);
                element.addEventListener('mouseleave', handleMouseLeave);
            });

            itemNotTween.forEach(element => {
                element.addEventListener('mouseenter', handleMouseLeave);
                element.addEventListener('mouseleave', handleMouseEnter);
            });
        },

        productCustomInformation() {
            const $customInfo = $('[data-custom-information]');
            const $thisPopup = $('#halo-product-custom-information');

            $customInfo.on('click', (event) => {
                const $this = $(event.currentTarget);
                const title = $this.find('.title')[0].innerText;
                const thisContent = $this.find('.product-customInformation__popup').html();

                $thisPopup.addClass('is-show');
                $thisPopup.find('.halo-popup-title').text(title);
                $thisPopup.find('.halo-popup-content').html(thisContent);
                $body.addClass('is-custom-information');
            });

            $doc.on('click', '[data-close-custom-information]', () => {
                $body.removeClass('is-custom-information');
                $thisPopup.removeClass('is-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('is-custom-information')) {
                    if (($(event.target).closest('#halo-product-custom-information').length === 0) && ($(event.target).closest('[data-custom-information]').length === 0)) {
                        $body.removeClass('is-custom-information');
                    }
                }
            });
        },

        initBreadcrumbFadeout() {
            const scrollToLastObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const breadcrumb = entry.target.closest('.breadcrumb-container')
        
                    if (entry.isIntersecting) {
                        breadcrumb.classList.add('disable-last')
                    } else {
                        breadcrumb.classList.remove('disable-last')
                    }
                })
            }, {
                threshold: 0.6
            })
            
            const scrollToFirstObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const breadcrumb = entry.target.closest('.breadcrumb-container')
        
                    if (entry.isIntersecting) {
                        breadcrumb.classList.add('disable-first')
                    } else {
                        breadcrumb.classList.remove('disable-first')
                    }
                })
            }, {
                threshold: 1
            }) 
        
            const initObservers = (breadcrumb) => {
                const firstLink = breadcrumb.querySelector('.link.home-link')
                const lastLink = breadcrumb.querySelector('.observe-element')
        
                setTimeout(() => {
                    breadcrumb.classList.add('initialized')
                }, 300)
                
                scrollToLastObserver.observe(lastLink)
                scrollToFirstObserver.observe(firstLink)
            }
            
            const breadcrumbs = document.querySelectorAll('.breadcrumb-container')
            breadcrumbs.forEach(breadcrumb => {
                initObservers(breadcrumb)
            })    
        },

        initLazyloadObserver() {
            const loadingImages = document.querySelectorAll('.media--loading-effect img')
            const productGrid = document.getElementById('main-collection-product-grid')

            const setLazyLoaded = (target) => {
                const card = target.closest('.card')
                card.classList.add('ajax-loaded')
            }

            this.lazyloadedObserver = new MutationObserver((mutationList, observer) => {
                mutationList.forEach((mutation) => {
                    if (mutation.type == 'attributes') {
                        if (!mutation.target.classList.contains('lazyloaded')) return 
                        setLazyLoaded(mutation.target)
                    }
                })
            }) 

            const parentObserver = new MutationObserver((mutationlist) => {
                mutationlist.forEach((mutation) => {
                    if (mutation.type == 'childList') {
                        const addedLoadingImages = [...mutation.addedNodes].map(node => node.querySelector('.media--loading-effect img'))
                        addedLoadingImages.forEach(image => {
                            this.lazyloadedObserver.observe(image, { childList: true, attributes: true })
                        })    
                    }
                })
            }) 

            if (productGrid) parentObserver.observe(productGrid, { subtree: false, childList: true });
            if (loadingImages.length > 0) loadingImages.forEach(image => {
                if (image.classList.contains('lazyloaded')) {
                    setLazyLoaded(image)
                } else {
                    this.lazyloadedObserver.observe(image, { childList: true, attributes: true })
                }
            })
        },

        observeImageLazyloaded(images) {
            images.forEach(image => {
                this.lazyloadedObserver.observe(image, { childList: true, attributes: true })
            })
        },

        iconZoomClickMobile() {
            const iconZoom = $('.productView-iconZoom');
            iconZoom.on('click', (event) => {
                document.querySelector('.productView-image .productView-img-container .media').click();
            });
        }
    }
})(jQuery);