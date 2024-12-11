$(document).ready(() => {
  if ( $('ul li.mega-menu').last().find($('ul.dropdown-menu')).last().css({"right":"0", "left":"auto"}).length != 0 ) {
    $('ul li.mega-menu').last().find($('ul.dropdown-menu')).last().css({"right":"0", "left":"auto"})
  }
})