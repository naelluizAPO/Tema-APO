class CollectionFilterByTagForm extends HTMLElement {
    constructor() {
        super();

        this.queryParams();
        this.sidebarBlocks = this.querySelectorAll('.collection-filters__item [data-type-list]'); 
        this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
        }, 500);

        this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));

        if(this.querySelector('[data-clear-filter]')){
            this.querySelectorAll('[data-clear-filter]').forEach((clearButton) => {
                clearButton.addEventListener('click', this.onClickClearButtonHandler.bind(this));
            });
        }

        this.querySelectorAll('[data-clear-all-filter]').forEach((clearAllButton) => {
            clearAllButton.addEventListener('click', this.onClickClearAllButtonHandler.bind(this));
        });

        const filterDisplayType = this.dataset.filterDisplay
        if (filterDisplayType === 'show-more') {
            setTimeout(() => {
                this.initListShowMore();
            }, 500)
        }
    }
    
    initListShowMore() {
        this.sidebarBlocks.forEach(block => {
            const facetList = block.querySelector('.facets__list');
            const facetListItems = facetList.querySelectorAll('.list-menu__item');
            const currentHeight = facetList.clientHeight;
            const maxItemsNumber = parseInt(facetList.dataset.maxItems);

            facetList.style.maxHeight = currentHeight + 'px';
            facetList.dataset.collapsedHeight = currentHeight;

            facetListItems.forEach((item, index) => {
                item.classList.remove('d-none');
                if (index + 1 > maxItemsNumber) item.style.opacity = '0';
            })
        })
        
        const showMoreButtons = this.querySelectorAll('.show-more--list_tags');
        if(showMoreButtons) {
            showMoreButtons.forEach( (button) => button.addEventListener('click', this.toggleShowMore.bind(this)));
        }
    }

    toggleShowMore(event) {
        const showMoreButton = event.target.closest('[data-show-more-btn]');
        const showMoreButtonContent = showMoreButton.querySelector('[data-show-more-content]')
        const sideBlock = event.target.closest('.sidebarBlock');
        const sideBlockContent = sideBlock.querySelector('.facets__list');
        const facetListItems = sideBlockContent.querySelectorAll('.facets__list .list-menu__item');
        const collapsedHeight = parseInt(sideBlockContent.dataset.collapsedHeight);
        const maxItemsNumber = parseInt(sideBlockContent.dataset.maxItems);
        let maxExpandedHeight
        if (maxItemsNumber <= 10) maxExpandedHeight = collapsedHeight * 3
        if (maxItemsNumber > 10 && maxItemsNumber <= 20) maxExpandedHeight = collapsedHeight * 2
        if (maxItemsNumber > 20 && maxItemsNumber <= 30) maxExpandedHeight = collapsedHeight * 1.5

        if (sideBlock.classList.contains('show-more')) {
            sideBlock.classList.remove('show-more');
            showMoreButtonContent.textContent = window.show_more_btn_text.show_all
            sideBlockContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            sideBlockContent.style.maxHeight = collapsedHeight + 'px';
            facetListItems.forEach((item, index) => {
                if (index + 1 > maxItemsNumber) item.style.opacity = '0';
            }) 
        } else {
            sideBlock.classList.add('show-more');
            sideBlockContent.style.maxHeight = maxExpandedHeight+ 'px';
            showMoreButtonContent.textContent = window.show_more_btn_text.show_less;
            facetListItems.forEach((item) => {
                item.style.opacity = '1';
            })
        }
    }

    // renderRemainingBlocks(sidebarBlocks) {
    //     let storedExpandedAndCollapsedHeight = JSON.parse(localStorage.getItem('heightData')) || []
        
    //     sidebarBlocks.forEach((element) => {
    //         const htmlElement = document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`)
    //         htmlElement.innerHTML = element.innerHTML;
            
    //         htmlElement.classList.remove('show-more')
    //         const collapsedHeight = storedExpandedAndCollapsedHeight.find(item => item.index === element.dataset.index).collapsedHeight
    //         const facetList = htmlElement.querySelector('.facets__list')
    //         const hiddenItems = facetList.querySelectorAll('.list-menu__item.d-none')
    //         const showMoreButton = htmlElement.querySelector('[data-show-more-btn]')

    //         facetList.dataset.collapsedHeight = collapsedHeight
    //         facetList.style.maxHeight = collapsedHeight + 'px'
    //         hiddenItems.forEach(item => item.classList.remove('d-none'))
    //         showMoreButton?.addEventListener('click', CollectionFiltersForm.showMoreValue)
    //     })  
    // }

    queryParams() {
        Shopify.queryParams = {};

        if (location.search.length > 0) {
            for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                aKeyValue = aCouples[i].split('=');

                if (aKeyValue.length > 1) {
                    Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                }
            }
        }
    }

    createURLHash(baseLink) {
        var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

        if (baseLink) {
            if (newQuery != "") {
                return baseLink + "?" + newQuery;
            } else {
                return baseLink;
            }
        } else {
            if (newQuery != "") {
                return location.pathname + "?" + newQuery;
            } else {
                return location.pathname;
            }
        }
    }

    updateURLHash(baseLink) {
        delete Shopify.queryParams.page;

        var newurl = this.createURLHash(baseLink);

        history.pushState({
            param: Shopify.queryParams
        }, newurl, newurl);
    }

    onSubmitHandler(event) {
        event.preventDefault();

        var $target = event.target,
            form = $target.closest('form'),
            newTags = [],
            tagName = event.target.value,
            tagPos;

        if (Shopify.queryParams.constraint) {
            newTags = Shopify.queryParams.constraint.split('+');
        }

        if (!window.show_multiple_choice && !$target.is(':checked')) {
            var refinedWiget = form.querySelector('.refined-widgets'),
                otherTag;

            if(refinedWiget){
                otherTag = refinedWiget.querySelector('input:checked');
            }

            if (otherTag) {
                tagName = otherTag.value;

                if (tagName) {
                    tagPos = newTags.indexOf(tagName);

                    if (tagPos >= 0) {
                        newTags.splice(tagPos, 1);
                    }
                }
            }
        }

        if (tagName) {
            tagPos = newTags.indexOf(tagName);

            if (tagPos >= 0) {
                newTags.splice(tagPos, 1);
            } else {
                newTags.push(tagName);
            }
        }

        if (newTags.length > 0) {
            Shopify.queryParams.constraint = newTags.join('+');
        } else {
            delete Shopify.queryParams.constraint;
        }

        this.updateURLHash();

        var newUrl = this.createURLHash();
        this.renderPage(newUrl);
    }

    onClickClearButtonHandler(event) {

        event.preventDefault();
        event.stopPropagation();

        var currentTags = [],
            listTagsContainer = event.target.closest('.facets__display'),
            listTags = listTagsContainer.querySelector('.facets__list'),
            selectedTag,
            tagName,
            tagPos;

        if (Shopify.queryParams.constraint) {
            currentTags = Shopify.queryParams.constraint.split('+');
        }

        listTags.querySelectorAll('input:checked').forEach((element) => {
            tagName = element.value;

            if (tagName) {
                tagPos = currentTags.indexOf(tagName);

                if (tagPos >= 0) {
                    currentTags.splice(tagPos, 1);
                }
            }
        });

        if (currentTags.length > 0) {
            Shopify.queryParams.constraint = currentTags.join('+');
        } else {
            delete Shopify.queryParams.constraint;
        }

        this.updateURLHash();

        var newUrl = this.createURLHash();
        this.renderPage(newUrl);
    }

    onClickClearAllButtonHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        delete Shopify.queryParams.constraint;

        this.updateURLHash();
        this.renderPage(new URL(event.currentTarget.href).href);
    }

    getSections() {
        return [
            {
                id: 'main-collection-product-grid',
                section: document.getElementById('main-collection-product-grid').dataset.id,
            }
        ]
    }

    renderPage(href) {
        const sections = this.getSections();

        // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('is-loading');
        document.body.classList.add('has-halo-loader');

        sections.forEach((section) => {
            this.renderSectionFromFetch(href, section);
        });
    }

    renderSectionFromFetch(url, section) {
        fetch(url)
        .then(response => response.text())
        .then((responseText) => {
            const html = responseText;

            this.renderFilters(html);
            this.renderProductGrid(html);

        });
    }

    renderFilters(html) {
        const innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('main-collection-filters').innerHTML;
        const mainCollectionFiltersElement = document.getElementById('main-collection-filters')
        mainCollectionFiltersElement.innerHTML = innerHTML;
        // this.initListShowMore();
    }

    setProductForWishlist(handle){
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
    }

    setLocalStorageProductForWishlist() {
        var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

        if (wishlistList.length > 0) {
            wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));
            
            wishlistList.forEach((handle) => {
                this.setProductForWishlist(handle);
            });
        }
        $('[data-wishlist-count]').text(wishlistList.length);
    }

    setLocalStorageProductForCompare($link) {
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
            }
        }
    }

    renderProductGrid(html) {
        const innerHTML = new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById('CollectionProductGrid')
            .querySelector('.collection').innerHTML;

        document.getElementById('CollectionProductGrid').querySelector('.collection').innerHTML = innerHTML;

        this.setActiveViewModeMediaQuery(true);

        if(window.compare.show){
            this.setLocalStorageProductForCompare({
                link: $('a[data-compare-link]'),
                onComplete: null
            });
        }

        if(window.wishlist.show){
            this.setLocalStorageProductForWishlist();
        }

        if(window.innerWidth < 1025){
            // document.getElementById('CollectionProductGrid').scrollIntoView();
            window.scrollTo({
                top: document.getElementById('CollectionProductGrid').getBoundingClientRect().top + window.pageYOffset - 50,
                behavior: 'smooth'
            });
        }

        document.body.classList.remove('has-halo-loader');
        document.getElementById('CollectionProductGrid').querySelector('.collection .halo-row--masonry').classList.add('is-show');
        if (document.querySelector('.collection-masonry')) {
            this.resizeAllGridItems();
        }
    }
    
    resizeGridItem(item) {
        grid = document.getElementsByClassName('halo-row--masonry')[0];

        rowHeight = parseInt(
            window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
        );

        rowGap = parseInt(
            window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
        );

        rowSpan = Math.ceil(
            (item.querySelector('.collection-masonry .product-masonry-item .product-item').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap)
        );

        item.style.gridRowEnd = 'span ' + rowSpan;
    }

    resizeAllGridItems() {

        allItems = document.getElementsByClassName('product-masonry-item');

        for (x = 0; x < allItems.length; x++) {
            this.resizeGridItem(allItems[x]);
        }
    }

    setActiveViewModeMediaQuery(ajaxLoading = true){
        var mediaView = document.querySelector('[data-view-as]'),
            mediaViewMobile = document.querySelector('[data-view-as-mobile]'),
            viewMode = mediaView.querySelector('.icon-mode.active'),
            viewModeMobile = mediaViewMobile.querySelector('.icon-mode.active'),
            column = parseInt(viewMode.dataset.col),
            windowWidth = window.innerWidth;

        if(column != 1){
            if(document.querySelector('.sidebar--layout_vertical')){
                if (windowWidth < 768) {
                    if (column == 3 || column == 4 || column == 5) {
                        column = 2;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-2').classList.add('active');
                        mediaViewMobile.querySelector('.grid-2').classList.add('active');
                    }
                } else if (windowWidth <= 1100 && windowWidth >= 768) {
                    if (column == 5 || column == 4 || column == 3) {
                        column = 2;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-2').classList.add('active');
                        mediaViewMobile.querySelector('.grid-2').classList.add('active');
                    }
                } else if (windowWidth < 1599 && windowWidth > 1100) {
                    if (column == 5 || column == 4) {
                        column = 3;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-3').classList.add('active');
                        mediaViewMobile.querySelector('.grid-3').classList.add('active');
                    }
                } else if (windowWidth < 1700 && windowWidth >= 1599) {
                    if (column == 5) {
                        column = 4;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-4').classList.add('active');
                        mediaViewMobile.querySelector('.grid-4').classList.add('active');
                    }
                }
            } else{
                if (windowWidth < 768) {
                    if (column == 3 || column == 4 || column == 5) {
                        column = 2;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-2').classList.add('active');
                        mediaViewMobile.querySelector('.grid-2').classList.add('active');
                    }
                } else if (windowWidth < 992 && windowWidth >= 768) {
                    if (column == 4 || column == 5) {
                        column = 3;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-3').classList.add('active');
                        mediaViewMobile.querySelector('.grid-3').classList.add('active');
                    }
                } else if (windowWidth < 1600 && windowWidth >= 992) {
                    if (column == 5) {
                        column = 4;
                        viewMode.classList.remove('active');
                        viewModeMobile.classList.remove('active');
                        mediaView.querySelector('.grid-4').classList.add('active');
                        mediaViewMobile.querySelector('.grid-4').classList.add('active');
                    }
                }
            }
            
            this.initViewModeLayout(column);
        } else{
            if(ajaxLoading){
                this.initViewModeLayout(column);
            }
        }
    }

    initViewModeLayout(column) {
        const productListing = document.getElementById('CollectionProductGrid').querySelector('.productListing');

        if (!productListing) return;

        switch (column) {
            case 1:
                productListing.classList.remove('productGrid', 'column-5', 'column-4', 'column-3', 'column-2');
                productListing.classList.add('productList');

                break;

            default:
                switch (column) {
                    case 2:
                        productListing.classList.remove('productList', 'column-5', 'column-4', 'column-3');
                        productListing.classList.add('productGrid', 'column-2');

                        break;
                    case 3:
                        productListing.classList.remove('productList', 'column-5', 'column-4', 'column-2');
                        productListing.classList.add('productGrid', 'column-3');

                        break;
                    case 4:
                        productListing.classList.remove('productList', 'column-5', 'column-3', 'column-2');
                        productListing.classList.add('productGrid', 'column-4');

                        break;
                    case 5:
                        productListing.classList.remove('productList', 'column-4', 'column-3', 'column-2');
                        productListing.classList.add('productGrid', 'column-5');

                        break;
                }
        };
    }
}

customElements.define('collection-filters-form', CollectionFilterByTagForm);