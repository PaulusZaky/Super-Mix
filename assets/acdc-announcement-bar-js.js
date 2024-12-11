$(document).ready(() => {
  // if ( $(window).width() < 768 ) {
  //   if ( isDesignSite ) {
  //     $('[data-travel="design-mobile"]').show()
  //   }
  // }
  $('[data-col="left"]').on('click', function() {
    $('[data-travel="shop"]').show()
  });
  $('[data-col="right"]').on('click', function() {
    // if ( $(window).width() < 768 ) {
    //   $('[data-travel="design-mobile"]').show()
    // } else {
      $('[data-travel="design"]').show()
    // }
  });
  $('.a-bar-modal-close, p.return-text').on('click', function() {
    $('[data-travel]').hide()
  });
});