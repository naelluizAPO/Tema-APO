class VariantSelects extends HTMLElement {
    constructor() {
        super();
        this.item = $(this).closest('.productView');

        this.onVariantInit();
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantInit(){
        this.updateOptions();
        this.updateMasterId();
        this.updateMedia(1500);
        // this.updateURL();
        this.renderProductAjaxInfo();
        this.renderProductInfo();
        if (!this.currentVariant) {
            this.updateAttribute(true);
        } else {
            this.updateAttribute(false, !this.currentVariant.available);
        }
    }
    
    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updatePickupAvailability();

        if (!this.currentVariant) {
            this.updateAttribute(true);
            this.updateStickyAddToCart(true);
        } else {
            this.updateMedia(200);
            this.updateURL();
            this.updateVariantInput();
            this.renderProductAjaxInfo();
            this.renderProductInfo();
            this.updateAttribute(false, !this.currentVariant.available);
            this.updateStickyAddToCart(false, !this.currentVariant.available);
            this.checkQuantityWhenVariantChange();
        }
    }

    updateOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
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
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.product}, #product-form-installment-${this.dataset.product}`);

        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = this.currentVariant.id;
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

                const property = `product-property-${this.dataset.product}`;
                const destinationProperty = document.getElementById(property);
                const sourceProperty = html.getElementById(property);

                if (source && destination) {
                    destination.innerHTML = source.innerHTML;
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }

                if(destinationProperty) {
                    if (sourceProperty) {
                        destinationProperty.innerHTML = sourceProperty.innerHTML;
                        destinationProperty.style.display = 'table';
                    } else{
                        destinationProperty.style.display = 'none';
                    }
                } else if (sourceProperty) {
                    document.querySelector('.productView-product').insertBefore(sourceProperty, document.querySelector('.productView-options'));
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
            options = this.item.find('.product-form__input'),
            optionsLength = options.length,
            pvOptionsLength = this.item.find('.productView-details .product-form__input').length,
            checkStickyVariant = false;
        
        optionsLength > pvOptionsLength ? checkStickyVariant = true : '';

        $.each(options, (index, element) => {
            var position = $(element).data('option-index'),
                type = $(element).data('product-attribute');

            switch (position) {
                case 0:
                    $(element).find('[data-header-option]').text(selectedOption1);

                    if(type == 'set-select') {
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
                        
                        if (checkStickyVariant) {
                            var inputListSticky = $(options[1+pvOptionsLength]),
                                inputSticky = inputListSticky.find('.product-form__radio'),
                                selectOptionSticky = inputListSticky.find('.select__select option');
                        }

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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('available').addClass('soldout');
                                    }
                                } else {
                                    $label.removeClass('soldout').addClass('available');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('soldout').addClass('available');
                                    }
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
                                    if (checkStickyVariant) {
                                        $(selectOptionSticky[idx]).attr('disabled', true);
                                    }
                                } else {
                                    $option.removeAttr('disabled');
                                    if (checkStickyVariant) {
                                        $(selectOptionSticky[idx]).removeAttr('disabled');
                                    }
                                }
                            });
                        }
                    }

                    if(selectedOption3){
                        var inputList = $(options[2]),
                            input = inputList.find('.product-form__radio'),
                            selectOption = inputList.find('.select__select option');

                        if (checkStickyVariant) {
                            var inputListSticky = $(options[2+pvOptionsLength]),
                                inputSticky = inputListSticky.find('.product-form__radio'),
                                selectOptionSticky = inputListSticky.find('.select__select option');
                        }

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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('available').addClass('soldout');
                                    }
                                } else {
                                    $label.removeClass('soldout').addClass('available');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('soldout').addClass('available');
                                    }
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
                                    if (checkStickyVariant) {
                                        $(selectOptionSticky[idx]).attr('disabled', true);
                                    }
                                } else {
                                    $option.removeAttr('disabled');
                                    if (checkStickyVariant) {
                                        $(selectOptionSticky[idx]).removeAttr('disabled');
                                    }
                                }
                            });
                        }
                    }

                    break;
                case 1:
                    $(element).find('[data-header-option]').text(selectedOption2);

                    if(type == 'set-select') {
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

                        if (checkStickyVariant) {
                            var inputListSticky = $(options[pvOptionsLength]),
                                inputSticky = inputListSticky.find('.product-form__radio'),
                                selectOptionSticky = inputListSticky.find('.select__select option');
                        }

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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('available').addClass('soldout');
                                    }
                                } else {
                                    $label.removeClass('soldout').addClass('available');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('soldout').addClass('available');
                                    }
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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).attr('disabled', true);
                                    }
                                } else {
                                    $option.removeAttr('disabled');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).removeAttr('disabled');
                                    }
                                }
                            });
                        }
                    }

                    if(selectedOption3){
                        var inputList = $(options[2]),
                            input = inputList.find('.product-form__radio'),
                            selectOption = inputList.find('.select__select option');

                        if (checkStickyVariant) {
                            var inputListSticky = $(options[2+pvOptionsLength]),
                                inputSticky = inputListSticky.find('.product-form__radio'),
                                selectOptionSticky = inputListSticky.find('.select__select option');
                        }

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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('available').addClass('soldout');
                                    }
                                } else {
                                    $label.removeClass('soldout').addClass('available');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('soldout').addClass('available');
                                    }
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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).attr('disabled', true);
                                    }
                                } else {
                                    $option.removeAttr('disabled');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).removeAttr('disabled');
                                    }
                                }
                            });
                        }
                    }

                    break;
                case 2:
                    $(element).find('[data-header-option]').text(selectedOption3);

                    if(type == 'set-select') {
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

                        if (checkStickyVariant) {
                            var inputListSticky = $(options[pvOptionsLength]),
                                inputSticky = inputListSticky.find('.product-form__radio'),
                                selectOptionSticky = inputListSticky.find('.select__select option');
                        }

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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('available').addClass('soldout');
                                    }
                                } else {
                                    $label.removeClass('soldout').addClass('available');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('soldout').addClass('available');
                                    }
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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).attr('disabled', true);
                                    }
                                } else {
                                    $option.removeAttr('disabled');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).removeAttr('disabled');
                                    }
                                }
                            });
                        }
                    }

                    if(selectedOption2){
                        var inputList = $(options[1]),
                            input = inputList.find('.product-form__radio');

                        if (checkStickyVariant) {
                            var inputListSticky = $(options[1+pvOptionsLength]),
                                inputSticky = inputListSticky.find('.product-form__radio'),
                                selectOptionSticky = inputListSticky.find('.select__select option');
                        }

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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('available').addClass('soldout');
                                    }
                                } else {
                                    $label.removeClass('soldout').addClass('available');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).next().removeClass('soldout').addClass('available');
                                    }
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
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).attr('disabled', true);
                                    }
                                } else {
                                    $option.removeAttr('disabled');
                                    if (checkStickyVariant) {
                                        $(inputSticky[idx]).removeAttr('disabled');
                                    }
                                }
                            });
                        }
                    }

                    break;
            }
        });

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
                        const showStock = this.item.find('[data-inventory]').data('stock-level');
                        if (showStock == 'show') {
                            this.item.find('[data-inventory] .productView-info-value').text(inventoryQuantity+' '+window.inventory_text.inStock);
                        }
                        else {
                            this.item.find('[data-inventory] .productView-info-value').text(window.inventory_text.inStock);
                        }
                    } else {
                        this.item.find('[data-inventory] .productView-info-value').text(window.inventory_text.outOfStock);
                    }
                }

                if(this.item.find('.productView-hotStock').length > 0){

                    var hotStock = this.item.find('.productView-hotStock'),
                        hotStockText = hotStock.find('.hotStock-text'),
                        maxStock = hotStock.data('hot-stock'),
                        textStock;

                    if(inventoryQuantity > 0 && inventoryQuantity <= maxStock){
                        if (hotStock.is('.style-2')) {
                            textStock  = window.inventory_text.hotStock2.replace('[inventory]', inventoryQuantity);
                        }
                        else {
                            textStock  = window.inventory_text.hotStock.replace('[inventory]', inventoryQuantity);
                        }
                        hotStockText.text(textStock);
                        hotStock.removeClass('hidden');
                    } else {
                        hotStock.addClass('hidden');
                    }

                    if (hotStock.is('.style-2')) {
                        const objInven = Object.values(inven_array),
                            totalInven = objInven.reduce((a, b) => parseInt(a) + parseInt(b), 0),
                            invenProgress = inventoryQuantity / totalInven * 100,
                            hotStockProgressItem = hotStock.find('.hotStock-progress-item');
                        // console.log(invenProgress);    
                        hotStockProgressItem.css('width', `${invenProgress}%`);
                    }
                }
            }
        }

        if(this.item.find('.productView-stickyCart').length > 0){
            const sticky = this.item.find('.productView-stickyCart');
            const optionSticky = sticky.find('.select__select');

            optionSticky.val(this.currentVariant.id);
        }
    }

    updateAttribute(unavailable = true, disable = true){
        const addButton = document.getElementById(`product-form-${this.dataset.product}`)?.querySelector('[name="add"]');
        var quantityInput = this.item.find('input[name="quantity"]'),
            notifyMe = this.item.find('.productView-notifyMe'),
            hotStock = this.item.find('.productView-hotStock');

        if(unavailable){
            var text = window.variantStrings.unavailable;

            quantityInput.attr('disabled', true);
            notifyMe.slideUp('slow');
            addButton.setAttribute('disabled', true);
            addButton.textContent = text;
            quantityInput.closest('quantity-input').addClass('disabled');

            if(hotStock.length > 0){
                hotStock.hide();
            }
        } else {
            if (disable) {
                var text = window.variantStrings.soldOut;

                quantityInput.attr('data-price', this.currentVariant?.price);
                quantityInput.attr('disabled', true);
                addButton.setAttribute('disabled', true);
                addButton.textContent = text;
                quantityInput.closest('quantity-input').addClass('disabled');

                if(notifyMe.length > 0){
                    notifyMe.find('input[name="halo-notify-product-variant"]').val(this.currentVariant.title);
                    notifyMe.find('.notifyMe-text').empty();
                    notifyMe.slideDown('slow');
                }
            } else{
                var text,
                    subTotal = 0,
                    price = this.currentVariant?.price;

                const stickyPrice = $('[data-sticky-add-to-cart] .sticky-price .money');

                if(window.subtotal.show) {
                    let qty = quantityInput.val();

                    subTotal = qty * price;
                    subTotal = Shopify.formatMoney(subTotal, window.money_format);
                    subTotal = extractContent(subTotal);

                    const moneySpan = document.createElement('span')
                    moneySpan.classList.add(window.currencyFormatted ? 'money' : 'money-subtotal') 
                    moneySpan.innerText = subTotal 
                    document.body.appendChild(moneySpan) 

                    if (this.checkNeedToConvertCurrency()) {
                        let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                    }
                    
                    subTotal = moneySpan.innerText 
                    $(moneySpan).remove()

                    if (window.subtotal.style == '1') {
                        const pdView_subTotal = document.querySelector('.productView-subtotal .money') || document.querySelector('.productView-subtotal .money-subtotal');

                        pdView_subTotal.textContent = subTotal;
                        text = window.variantStrings.addToCart;
                    }
                    else if (window.subtotal.style == '2') {
                        text = window.subtotal.text.replace('[value]', subTotal);
                    }
                } else {
                    subTotal = Shopify.formatMoney(price, window.money_format);
                    subTotal = extractContent(subTotal);

                    text = window.variantStrings.addToCart;
                }

                quantityInput.attr('data-price', this.currentVariant?.price);
                quantityInput.attr('disabled', false);
                addButton.removeAttribute('disabled');
                addButton.textContent = text;
                quantityInput.closest('quantity-input').removeClass('disabled');

                if (subTotal != 0 && stickyPrice.length) {
                    stickyPrice.text(subTotal);
                }

                if(notifyMe.length > 0){
                    notifyMe.slideUp('slow');
                }
            }
        }
    }

    updateStickyAddToCart(unavailable = true, disable = true){
        if(this.item.find('.productView-stickyCart').length > 0){
            const sticky = this.item.find('.productView-stickyCart');
            const itemImage = sticky.find('.sticky-image');
            const option = sticky.find('.select__select');
            const input = document.getElementById(`product-form-sticky-${this.dataset.product}`)?.querySelector('input[name="id"]');
            const button = document.getElementById(`product-form-sticky-${this.dataset.product}`)?.querySelector('[name="add"]');

            if(unavailable){
                var text = window.variantStrings.unavailable;

                button.setAttribute('disabled', true);
                button.textContent = text;
            } else {
                if (!this.currentVariant) return;

                const image = this.currentVariant?.featured_image;
                
                if (image != null) {
                    itemImage.find('img').attr({
                        'src': image.src,
                        'srcset': image.src,
                        'alt': image.alt
                    });
                }

                option.val(this.currentVariant.id);

                if (disable) {
                    var text = window.variantStrings.soldOut;

                    button.setAttribute('disabled', true);
                    button.textContent = text;
                } else {
                    text = window.variantStrings.addToCart;

                    button.removeAttribute('disabled');
                    button.textContent = text;
                }

                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    checkQuantityWhenVariantChange() {
        var quantityInput = this.closest('.productView-details').querySelector('input.quantity__input')
        var maxValue = parseInt(quantityInput.dataset.inventoryQuantity);
        var inputValue = parseInt(quantityInput.value);
        
        let value = inputValue 
        if (inputValue > maxValue) {
            value = maxValue
        }

        if (value < 1 || isNaN(value)) value = 1
            
        quantityInput.value = value
    }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
    constructor() {
        super();
    }
        
    updateOptions() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));
        this.options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
    }
}

customElements.define('variant-radios', VariantRadios);

class QuantityInput extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', { bubbles: true });
        this.input.addEventListener('change', this.onInputChange.bind(this));

        this.querySelectorAll('button').forEach(
            (button) => button.addEventListener('click', this.onButtonClick.bind(this))
        );

        if (!this.checkHasMultipleVariants()) {
            this.initProductQuantity();
        }
    }

    onInputChange(event) {
        event.preventDefault();
        var inputValue = this.input.value;
        var maxValue = parseInt(this.input.dataset.inventoryQuantity);
        const addButton = document.getElementById(`product-form-${this.input.dataset.product}`)?.querySelector('[name="add"]');

        if(inputValue < 1) {
            inputValue = 1;

            this.input.value =  inputValue;
        }

        if (inputValue > maxValue) {
            inputValue = maxValue
            this.input.value =  inputValue;

            const message = getInputMessage(maxValue)
            return showWarning(message, 3000)
        }
        
        if(window.subtotal.show) {
            var text,
                price = this.input.dataset.price,
                subTotal = 0;

            var parser = new DOMParser();

            subTotal = inputValue * price;
            subTotal = Shopify.formatMoney(subTotal, window.money_format);
            subTotal = extractContent(subTotal);

            const moneySpan = document.createElement('span')
            moneySpan.classList.add(window.currencyFormatted ? 'money' : 'money-subtotal') 
            moneySpan.innerText = subTotal 
            document.body.appendChild(moneySpan) 

            if (this.checkNeedToConvertCurrency()) {
                let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
            }

            subTotal = moneySpan.innerText 
            $(moneySpan).remove()

            if (window.subtotal.style == '1') {
                const pdView_subTotal = document.querySelector('.productView-subtotal .money') || document.querySelector('.productView-subtotal .money-subtotal');

                pdView_subTotal.textContent = subTotal;
            }
            else if (window.subtotal.style == '2') {
                text = window.subtotal.text.replace('[value]', subTotal);

                addButton.textContent = text;  
            }

            const stickyPrice = $('[data-sticky-add-to-cart] .sticky-price .money');

            if (stickyPrice.length) {
                stickyPrice.text(subTotal);
            }
        }

        if (this.classList.contains('quantity__group--2') || this.classList.contains('quantity__group--3')) {
            const mainQty = document.querySelector('.quantity__group--1 .quantity__input');
            mainQty.value = inputValue;

            const mainQty2Exists = !!document.querySelector('.quantity__group--2 .quantity__input');
            const mainQty3Exists = !!document.querySelector('.quantity__group--3 .quantity__input');

            if (this.classList.contains('quantity__group--2') && mainQty3Exists) {
                const mainQty3 = document.querySelector('.quantity__group--3 .quantity__input');
                mainQty3.value = inputValue;
            }
            else if (this.classList.contains('quantity__group--3') && mainQty2Exists) {
                const mainQty2 = document.querySelector('.quantity__group--2 .quantity__input');
                mainQty2.value = inputValue;
            }
        }
    }

    onButtonClick(event) {
        event.preventDefault();
        const previousValue = this.input.value;
        
        event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
        if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }
    
    checkHasMultipleVariants() {
        const arrayInVarName = `product_inven_array_${this.querySelector('[data-product]').dataset.product}`
        this.inven_array = window[arrayInVarName];
        return Object.keys(this.inven_array).length > 1
    }
        
    initProductQuantity() {
        if(this.inven_array != undefined) {
            var inven_num = Object.values(this.inven_array),
                inventoryQuantity = parseInt(inven_num);

            this.querySelector('input[name="quantity"]').setAttribute('data-inventory-quantity', inventoryQuantity);
            this.querySelector('input[name="quantity"]').dataset.inventoryQuantity = inventoryQuantity

            // if(this.find('[data-inventory]').length > 0){
            //     if(inventoryQuantity > 0){
            //         const showStock = this.item.find('[data-inventory]').data('stock-level');
            //         if (showStock == 'show') {
            //             this.item.find('[data-inventory] .productView-info-value').text(inventoryQuantity+' '+window.inventory_text.inStock);
            //         }
            //         else {
            //             this.item.find('[data-inventory] .productView-info-value').text(window.inventory_text.inStock);
            //         }
            //     } else {
            //         this.item.find('[data-inventory] .productView-info-value').text(window.inventory_text.outOfStock);
            //     }
            // }
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(document.querySelector('.product-option [type="application/json"]').textContent);
        return this.variantData;
    }
}

customElements.define('quantity-input', QuantityInput);

function showWarning(content, time = null) {
    if (window.warningTimeout) {
        clearTimeout(window.warningTimeout);
    }
    const warningPopupContent = document.getElementById('halo-warning-popup').querySelector('[data-halo-warning-content]')
    warningPopupContent.textContent = content
    document.body.classList.add('has-warning')

    if (time) {
        window.warningTimeout = setTimeout(() => {
            document.body.classList.remove('has-warning')
        }, time)
    }
}

function getInputMessage(maxValue) {
    var message = window.cartStrings.addProductOutQuantity.replace('[maxQuantity]', maxValue);
    return message
}
