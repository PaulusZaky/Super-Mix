window.addEventListener('load', () => {
  const lastItem = $('.product-description-wrapper ul').first().children().last()
  // console.log(variantData) Variable containing PDP Metafields JSON
  if ( $('.color input.target-swatch').length > 0 ) {
    if ( $('.color input.target-swatch:checked').length == 0 ) {
      $('.color input.target-swatch')[0].checked = true;
    }
  }
  handleBullet()
  filterIt()
  slickIt()

  $('.color input.target-swatch').click( () => {
    $('.product-gallery-main').slick('unslick')
    $('.product-gallery-nav').slick('unslick')
    handleBullet()
    filterIt()
    slickIt()

  })

  function filterIt() {
    let swatchClass = '.' + $('.color input.target-swatch:checked').data('colorvalue') + '-slide'
    let matchedMainItems = $('.gallery-main-item' + swatchClass)
    let matchedItems = $('.gallery-item' + swatchClass)
    let unmatchedMainItems = $('.gallery-main-item').not(swatchClass)
    let unmatchedItems = $('.gallery-item').not(swatchClass)
    matchedMainItemsDetached = matchedMainItems.detach()
    matchedItemsDetached = matchedItems.detach()
    unmatchedMainItemsDetached = unmatchedMainItems.detach()
    unmatchedItemsDetached = unmatchedItems.detach()
    $('.product-gallery-main').append(matchedMainItemsDetached)
    $('.hidden-gallery').append(unmatchedMainItemsDetached)
    $('.product-gallery-nav').append(matchedItemsDetached)
    $('.hidden-gallery').append(unmatchedItemsDetached)
  }

  function slickIt() {
    let totalSlides = $('.product-gallery-nav').children().length
    if ( totalSlides >=5 ) {
      totalSlides = 5
      showCenter = true
      $('.gallery-item img').css('width', '100%')
      infiniteValue = true
      navFor = '.product-gallery-nav'
    } else {
      showCenter = false
      $('.gallery-item img').css('width', '80px')
      infiniteValue = false
      navFor = ''
    }
    

    $('.product-gallery-main').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      appendArrows: $('.gallery-arrow-container'),
      asNavFor: navFor
    });
    $('.product-gallery-nav').slick({
      infinite: infiniteValue,
      slidesToShow: totalSlides,
      slidesToScroll: 1,
      arrows: false,
      asNavFor: '.product-gallery-main',
      dots: false,
      centerMode: showCenter,
      focusOnSelect: true,
      respondTo: 'slider'
    });
  }; //End SlickIt()

  function handleBullet() {
    if ( $('.variant-bullet') ) {
      $('.variant-bullet').remove()
    }

    Object.keys(variantData).forEach( key => {
      if ( key == $('.color input.target-swatch:checked').data('colorvalue') ) {
        let bulletString = variantData[key].replaceAll('-', ' ')
        bulletString = bulletString.charAt(0).toUpperCase() + bulletString.slice(1) + '.'
        bulletString = `<li class="variant-bullet">${bulletString}</li>`
        $( bulletString ).insertAfter( lastItem )
        // console.log(variantData[key])
        // console.log(bulletString)
      }
    })
  }

}); //End onload