class StickyAddToCart extends HTMLElement {
    constructor() {
        super();
        this.sticky = this;
        this.stickyBounds = document.getElementById('product-add-to-cart') || document.querySelector('[data-combo-addtocart]');
        this.closeSticky = this.querySelector('[data-close-sticky-add-to-cart]');
        this.expandSticky = this.querySelector('[data-expand-sticky-add-to-cart]');

        this.closeSticky?.addEventListener(
            'click',
            this.setCloseSticky.bind(this)
        );

        this.expandSticky?.addEventListener(
            'click',
            this.setExpandSticky.bind(this)
        );
    }

    connectedCallback(){
        this.onScrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onScrollHandler, false);
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.onScrollHandler);
    }

    onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offsetScroll = $(this.stickyBounds).offset().top + $(this.stickyBounds).outerHeight(true) + 100;
        const winHeight = window.innerHeight;
        const docHeight = document.body.clientHeight;

        if (scrollTop > offsetScroll && scrollTop + winHeight < docHeight) {
            requestAnimationFrame(this.show.bind(this));

            if (this.sticky.classList.contains('style-1')) {
                let height = 0;
                const previewBar = document.getElementById('preview-bar-iframe'),
                    toolbarMobile = document.querySelector('.halo-sticky-toolbar-mobile');

                if (previewBar && window.getComputedStyle(previewBar).display !== "none") {
                    height = previewBar.offsetHeight;
                }
                else if (toolbarMobile) {
                    height = toolbarMobile.offsetHeight;
                }

                this.sticky.style.top = 'auto';
                this.sticky.style.bottom = `${height}px`;
            }
            else if (this.sticky.classList.contains('style-2')) {
                if(document.body.classList.contains('scroll-up')){
                    let height = document.querySelector('sticky-header').offsetHeight;

                    if (window.innerWidth < 551) {
                        height = height + 20;
                    }

                    this.sticky.style.top = `${height}px`;
                } else if(document.body.classList.contains('scroll-down')) {
                    if (window.innerWidth > 550) {
                        this.sticky.style.top = 0;
                    }
                    else {
                        this.sticky.style.top = '20px';
                    }
                }
            }
        } else{
            requestAnimationFrame(this.hide.bind(this));
        }

        this.currentScrollTop = scrollTop;
    }

    hide() {
        this.sticky.classList.remove('show-sticky', 'hidden-sticky', 'full-sticky', 'animate');
        document.body.classList.remove('show-mobile-options');
    }

    show() {
        this.sticky.classList.add('show-sticky', 'animate');
    }

    setCloseSticky(event){
        event.preventDefault();

        if(this.sticky.classList.contains('full-sticky')){
            this.sticky.classList.remove('full-sticky');
        } else{
            this.sticky.classList.add('hidden-sticky');
        }
    }

    setExpandSticky(event){
        event.preventDefault();

        this.sticky.classList.add('full-sticky');
    }
}

customElements.define('sticky-add-to-cart', StickyAddToCart);

class VariantStickyAddToCart extends HTMLElement {
    constructor() {
        super();
        this.item = $(this).closest('.productView');
        this.sticky = $(this).closest('.productView-stickyCart');
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange(event) {
        this.updateOptions();   
        this.updateMasterId();
        this.updatePickupAvailability();
        this.updateMedia(200);
        this.updateURL();
        this.updateVariantInput();
        this.renderProductAjaxInfo();
        this.renderProductInfo();
        this.updateAttribute(!this.currentVariant.available);
    }

    updateOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return variant.id == this.options;
        });
    }

    updateMedia(time) {
        if (!this.currentVariant || !this.currentVariant?.featured_media) return;

        const itemImage = this.item.find('.sticky-image');
        const image = this.currentVariant?.featured_image;
        if (!itemImage) return;

        itemImage.find('img').attr({
            'src': image.src,
            'srcset': image.src,
            'alt': image.alt
        });

        const newMedia = document.querySelectorAll(
            `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
        );

        if (!newMedia) return;
        window.setTimeout(() => {
            $(newMedia).trigger('click');
        }, time);
    }

    updateURL() {
        if (!this.currentVariant) return;
        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.product}, #product-form-installment-${this.dataset.product}, #product-form-sticky-${this.dataset.product}`);
        
        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = this.currentVariant.id;
            // console.log(input.value, this.currentVariant)
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    updatePickupAvailability() {
        const pickUpAvailability = document.querySelector('pickup-availability');
        if (!pickUpAvailability) return;

        if (this.currentVariant?.available) {
            pickUpAvailability.fetchAvailability(this.currentVariant.id);
        } else {
            pickUpAvailability.removeAttribute('available');
            pickUpAvailability.innerHTML = '';
        }
    }

    renderProductAjaxInfo() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
            .then((response) => response.text())
            .then((responseText) => {
                const id = `product-price-${this.dataset.product}`;
                const html = new DOMParser().parseFromString(responseText, 'text/html')
                const destination = document.getElementById(id);
                const source = html.getElementById(id);

                if (source && destination) {
                    destination.innerHTML = source.innerHTML;
                }

                document.getElementById(`product-price-${this.dataset.product}`)?.classList.remove('visibility-hidden');
        });
    }

    renderProductInfo() {
        var variantList = this.getVariantData().filter((variant) => {
            return variant.available
        }); 

        var selectedOption1 = this.currentVariant?.option1,
            selectedOption2 = this.currentVariant?.option2,
            selectedOption3 = this.currentVariant?.option3,
            options = this.item.find('.product-form__input:not(.mobile)'),
            optionsMobile = this.item.find('.product-form__input.mobile');

        const renderOptions = (options) => {
            $.each(options, (index, element) => {
                var position = $(element).data('option-index'),
                    type = $(element).data('product-attribute');
                
                switch (position) {
                    case 0:
                        $(element).find('[data-header-option]').text(selectedOption1);
    
                        if(type == 'set-select') {
                            $(element).find('.select__select').val(selectedOption1);
    
                            var selectList = $(element).find('.select__select option');
    
                            selectList.each((idx, elt) => {
                                if(elt.value == selectedOption1){
                                    $(elt).attr('selected', 'selected');
                                } else {
                                    $(elt).removeAttr('selected');
                                }
                            });
                        } else {
                            $(element).find('.product-form__radio').prop('checked', false);
                            $(element).find(`.product-form__radio[value="${selectedOption1}"]`).prop('checked', true);
                        }
    
                        var option1List = variantList.filter((variant) => {
                            return variant.option1 === selectedOption1;
                        });
    
                        if(selectedOption2){
                            var inputList = $(options[1]),
                                input = inputList.find('.product-form__radio'),
                                selectOption = inputList.find('.select__select option');
    
                            if(type == 'set-rectangle'){
                                input.each((idx, elt) => {
                                    var $input = $(elt),
                                        $label = $input.next(),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option1List.find((variant) => {
                                        return variant.option2 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $label.removeClass('available').addClass('soldout');
                                    } else {
                                        $label.removeClass('soldout').addClass('available');
                                    }
                                });
                            } else {
                                selectOption.each((idx, elt) => {
                                    var $option = $(elt),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option1List.find((variant) => {
                                        return variant.option2 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $option.attr('disabled', true);
                                    } else {
                                        $option.removeAttr('disabled');
                                    }
                                });
                            }
                        }
    
                        if(selectedOption3){
                            var inputList = $(options[2]),
                                input = inputList.find('.product-form__radio'),
                                selectOption = inputList.find('.select__select option');
    
                            if(type == 'set-rectangle'){
                                input.each((idx, elt) => {
                                    var $input = $(elt),
                                        $label = $input.next(),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option1List.find((variant) => {
                                        return variant.option3 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $label.removeClass('available').addClass('soldout');
                                    } else {
                                        $label.removeClass('soldout').addClass('available');
                                    }
                                });
                            } else {
                                electOption.each((idx, elt) => {
                                    var $option = $(elt),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option1List.find((variant) => {
                                        return variant.option3 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $option.attr('disabled', true);
                                    } else {
                                        $option.removeAttr('disabled');
                                    }
                                });
                            }
                        }
                        
                        break;
                    case 1:
                        $(element).find('[data-header-option]').text(selectedOption2);
    
                        if(type == 'set-select') {
                            $(element).find('.select__select').val(selectedOption2);
    
                            var selectList = $(element).find('.select__select option');
    
                            selectList.each((idx, elt) => {
                                if(elt.value == selectedOption2){
                                    $(elt).attr('selected', 'selected');
                                } else {
                                    $(elt).removeAttr('selected');
                                }
                            });
                        } else {
                            $(element).find('.product-form__radio').prop('checked', false);
                            $(element).find(`.product-form__radio[value="${selectedOption2}"]`).prop('checked', true);
                        }
    
                        var option2List = variantList.filter((variant) => {
                            return variant.option2 === selectedOption2;
                        });
    
                        if(selectedOption1){
                            var inputList = $(options[0]),
                                input = inputList.find('.product-form__radio'),
                                selectOption = inputList.find('.select__select option');
    
                            if(type == 'set-rectangle'){
                                input.each((idx, elt) => {
                                    var $input = $(elt),
                                        $label = $input.next(),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option2List.find((variant) => {
                                        return variant.option1 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $label.removeClass('available').addClass('soldout');
                                    } else {
                                        $label.removeClass('soldout').addClass('available');
                                    }
                                });
                            } else {
                                selectOption.each((idx, elt) => {
                                    var $option = $(elt),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option2List.find((variant) => {
                                        return variant.option1 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $option.attr('disabled', true);
                                    } else {
                                        $option.removeAttr('disabled');
                                    }
                                });
                            }
                        }
    
                        if(selectedOption3){
                            var inputList = $(options[2]),
                                input = inputList.find('.product-form__radio'),
                                selectOption = inputList.find('.select__select option');
    
                            if(type == 'set-rectangle'){
                                input.each((idx, elt) => {
                                    var $input = $(elt),
                                        $label = $input.next(),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option2List.find((variant) => {
                                        return variant.option3 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $label.removeClass('available').addClass('soldout');
                                    } else {
                                        $label.removeClass('soldout').addClass('available');
                                    }
                                });
                            } else {
                                electOption.each((idx, elt) => {
                                    var $option = $(elt),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option2List.find((variant) => {
                                        return variant.option3 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $option.attr('disabled', true);
                                    } else {
                                        $option.removeAttr('disabled');
                                    }
                                });
                            }
                        }
                        
                        break;
                    case 2:
                        $(element).find('[data-header-option]').text(selectedOption3);
    
                        if(type == 'set-select') {
                            $(element).find('.select__select').val(selectedOption3);
    
                            var selectList = $(element).find('.select__select option');
    
                            selectList.each((idx, elt) => {
                                if(elt.value == selectedOption3){
                                    $(elt).attr('selected', 'selected');
                                } else {
                                    $(elt).removeAttr('selected');
                                }
                            });
                        } else {
                            $(element).find('.product-form__radio').prop('checked', false);
                            $(element).find(`.product-form__radio[value="${selectedOption3}"]`).prop('checked', true);
                        }
    
                        var option3List = variantList.filter((variant) => {
                            return variant.option3 === selectedOption3;
                        });
    
                        if(selectedOption1){
                            var inputList = $(options[0]),
                                input = inputList.find('.product-form__radio'),
                                selectOption = inputList.find('.select__select option');
    
                            if(type == 'set-rectangle'){
                                input.each((idx, elt) => {
                                    var $input = $(elt),
                                        $label = $input.next(),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option3List.find((variant) => {
                                        return variant.option1 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $label.removeClass('available').addClass('soldout');
                                    } else {
                                        $label.removeClass('soldout').addClass('available');
                                    }
                                });
                            } else {
                                selectOption.each((idx, elt) => {
                                    var $option = $(elt),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option3List.find((variant) => {
                                        return variant.option1 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $option.attr('disabled', true);
                                    } else {
                                        $option.removeAttr('disabled');
                                    }
                                });
                            }
                        }
    
                        if(selectedOption2){
                            var inputList = $(options[1]),
                                input = inputList.find('.product-form__radio');
    
                            if(type == 'set-rectangle'){
                                input.each((idx, elt) => {
                                    var $input = $(elt),
                                        $label = $input.next(),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option3List.find((variant) => {
                                        return variant.option2 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $label.removeClass('available').addClass('soldout');
                                    } else {
                                        $label.removeClass('soldout').addClass('available');
                                    }
                                });
                            } else {
                                selectOption.each((idx, elt) => {
                                    var $option = $(elt),
                                        optionValue = $(elt).val();
    
                                    var optionSoldout = option3List.find((variant) => {
                                        return variant.option2 == optionValue
                                    });
    
                                    if(optionSoldout == undefined){
                                        $option.attr('disabled', true);
                                    } else {
                                        $option.removeAttr('disabled');
                                    }
                                });
                            }
                        }
                        
                        break;
                }
            }); 
        }

        renderOptions(options)
        renderOptions(optionsMobile)

        if(this.item.find('[data-sku]').length > 0){
            this.item.find('[data-sku] .productView-info-value').text(this.currentVariant.sku);
        }

        var inventory = this.currentVariant?.inventory_management;

        if(inventory != null) {
            var arrayInVarName = `product_inven_array_${this.dataset.product}`,
                inven_array = window[arrayInVarName];

            if(inven_array != undefined) {
                var inven_num = inven_array[this.currentVariant.id],
                    inventoryQuantity = parseInt(inven_num);

                this.item.find('input[name="quantity"]').attr('data-inventory-quantity', inventoryQuantity);

                if(this.item.find('[data-inventory]').length > 0){
                    if(inventoryQuantity > 0){
                        this.item.find('[data-inventory] .productView-info-value').text(window.inventory_text.inStock);
                    } else {
                        this.item.find('[data-inventory] .productView-info-value').text(window.inventory_text.outOfStock);
                    }
                }

                if(this.item.find('.productView-hotStock').length > 0){
                    var hotStock = this.item.find('.productView-hotStock'),
                        maxStock = hotStock.data('hot-stock');

                    if(inventoryQuantity > 0 && inventoryQuantity <= maxStock){
                        var textStock = window.inventory_text.hotStock.replace('[inventory]', inventoryQuantity);
                        hotStock.text(textStock).show();
                    } else {
                        hotStock.hide();
                    }
                }
            }
        }
    }

    updateAttribute(disable = true){
        const addButton = document.getElementById(`product-form-${this.dataset.product}`)?.querySelector('[name="add"]');
        const stickyButton = document.getElementById(`product-form-sticky-${this.dataset.product}`)?.querySelector('[name="add"]');

        var quantityInput = $('[data-sticky-add-to-cart] .quantity__input'),
            notifyMe = this.item.find('.productView-notifyMe'),
            stickyPrice = $('[data-sticky-add-to-cart] .sticky-price .money');

        if (disable) {
            var text = window.variantStrings.soldOut;

            this.item.removeClass('isChecked');
            quantityInput.attr('data-price', this.currentVariant?.price);
            quantityInput.attr('disabled', true);
            addButton.setAttribute('disabled', true);
            addButton.textContent = text;
            stickyButton.setAttribute('disabled', true);
            stickyButton.textContent = text;

            if(notifyMe.length > 0){
                notifyMe.find('input[name="halo-notify-product-variant"]').val(this.currentVariant.title);
                notifyMe.find('.notifyMe-text').empty();
                notifyMe.slideDown('slow');
            }
        } else{
            var text,
                subTotal = 0,
                price = this.currentVariant?.price;

            if(window.subtotal.show) {
                let qty = quantityInput.val();

                subTotal = qty * price;
                subTotal = Shopify.formatMoney(subTotal, window.money_format);
                subTotal = $(subTotal).text();

                if (window.subtotal.style == '1') {
                    const pdView_subTotal = document.querySelector('.productView-subtotal .money');

                    pdView_subTotal.textContent = subTotal;
                    text = window.variantStrings.addToCart;
                }
                else if (window.subtotal.style == '2') {
                    text = window.subtotal.text.replace('[value]', subTotal);
                }
            } else {
                subTotal = Shopify.formatMoney(price, window.money_format);
                subTotal = $(subTotal).text();

                text = window.variantStrings.addToCart;
            }

            this.item.addClass('isChecked');
            quantityInput.attr('data-price', this.currentVariant?.price);
            quantityInput.attr('disabled', false);
            addButton.removeAttribute('disabled');
            addButton.textContent = text;
            stickyButton.removeAttribute('disabled');
            stickyButton.textContent = window.variantStrings.addToCart;

            if (subTotal != 0 && stickyPrice.length) {
                stickyPrice.text(subTotal);
            }

            if(notifyMe.length > 0){
                notifyMe.slideUp('slow');
            }
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }
}

customElements.define('variant-sticky-selects', VariantStickyAddToCart);

class VariantStickyRadios extends VariantStickyAddToCart {
    constructor() {
        super();
        this.openStickyButton = document.getElementById('show-sticky-product');
        this.closeModal = this.closeStickyModal.bind(this);
    }

    connectedCallback() {
        this.openStickyButton.addEventListener('click', this.openStickyModal.bind(this));
        document.addEventListener('click', (e) => {
            if (e.target.matches('.background-overlay') || e.target.closest('[data-close-sticky-mobile]') != null || e.target.matches('[data-close-sticky-mobile]')) {
                this.closeModal();
            }
        })

        const height = this.closest('[data-sticky-add-to-cart]').clientHeight;
        this.closest('.sticky-product-mobile').style.bottom = height + 'px';
        
        this.updateMediaTimeout = undefined
    }

    onVariantChange(event) {
        this.updateOptions();   
        this.updateMasterId();
        this.updatePickupAvailability();
        this.updateMedia(10);
        this.updateURL();
        this.updateVariantInput();
        this.updateSelectVariant();
        this.renderProductAjaxInfo();
        this.renderProductInfo();
        this.updateAttribute(!this.currentVariant.available);
    }   

    updateOptions() {   
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));
        this.options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
    }

    updateSelectVariant() {
        const selectElement = this.closest('.productView-stickyCart').querySelector('select');
        selectElement.value = this.currentVariant.id
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return this.options[index] === option;
            }).includes(false);
        });
    }

    updateMedia(time) {
        if (!this.currentVariant || !this.currentVariant?.featured_media) return;

        const itemImage = this.item.find('.sticky-image');
        const image = this.currentVariant?.featured_image;
        if (!itemImage) return;

        itemImage.find('img').attr({
            'src': image.src,
            'srcset': image.src,
            'alt': image.alt
        });

        const newMedia = document.querySelectorAll(
            `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
        );

        if (!newMedia) return;
        
        clearTimeout(this.updateMediaTimeout);
        this.updateMediaTimeout = setTimeout(() => {
            $(newMedia).trigger('click');
        }, time);
    }

    openStickyModal() {
        document.body.classList.add('show-mobile-options');
    }

    closeStickyModal() {
        document.body.classList.remove('show-mobile-options');
    }
}

customElements.define('variant-sticky-radios', VariantStickyRadios);