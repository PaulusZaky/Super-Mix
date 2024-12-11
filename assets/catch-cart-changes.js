const open = window.XMLHttpRequest.prototype.open;

function openReplacement() {
  this.addEventListener("load", function () {
    if (
      [
        "/cart/add.js",
        "/cart/update.js",
        "/cart/change.js",
        "/cart/clear.js",
      ].includes(this._url)
    ) {
      // console.log('Cart Updated');
      fetch('/cart.js')
      .then(response => response.json())
      .then(data => {
        // console.log(data.items)
        let updatedCartItems = []
        let encodedJson = ''
        let params = ''
        let queryParameters = ''

        if ( data.items.length ) {
          data.items.forEach(item => {
            let cartItem = {variant: item.variant_id, quantity: item.quantity}
            updatedCartItems.push(cartItem)
            let encodedJson = encodeURIComponent(JSON.stringify(updatedCartItems))
            queryParameters = `?cartItems=${encodedJson}`
          }); //end forEach item
        }
        const buttonExists = document.querySelector('a[data-customizer]')
        if ( buttonExists ) {
          $('[data-customizer]').attr('href', `${productHref}/${variantId}${queryParameters}`)
        }

      }); //end then(data)
    }
  });
  return open.apply(this, arguments);
}

window.XMLHttpRequest.prototype.open = openReplacement;