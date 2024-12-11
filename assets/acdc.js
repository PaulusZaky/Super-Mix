window.addEventListener('DOMContentLoaded', () => {
    $('[data-notColor]').prop('checked', false)
    $('a[data-customizer]').addClass('disable-customizer')

    $('.swatch input').on('click', function() {
      if ( $('[data-notColor]:checked').length > 0 ) {
        $('a[data-customizer]').removeClass('disable-customizer')
      }
    })
})