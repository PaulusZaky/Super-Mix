const isKiosk = localStorage.getItem('scaaf_aid') !== null;
let concatElements = [];
const targetNode = document.body;

const setBlur = (arr, blurPoint = '3') => {
    if(arr.length){
        for (const item of arr) {
            item.style.filter = blurPoint ? `blur(${blurPoint}px)` : ''
        }
    }
}

let setTitle = (elements) => {
    for (let element of elements) {
        const parent = element.parentElement
        const titleName = element.parentElement.getAttribute('data-card-field-placeholder')
        const secondParent = parent.parentElement
        let titleAlreadyExist = false
        const spanElements = secondParent.parentElement.getElementsByTagName('span')
        for (let i= 0; i < spanElements.length; i++) {
            if (spanElements[i].innerHTML === titleName) {
                titleAlreadyExist = true
            }
        }
        if (titleAlreadyExist) {
            return
        }
        const title = document.createElement('span')
        title.innerHTML = titleName
        title.style = 'margin-left: 10px; color:#666;'
        secondParent.parentElement.insertBefore(title, secondParent)
    }
}

// Create a new MutationObserver instance
const observer = new MutationObserver(function(mutationsList) {
  if(!isKiosk){
    return;
  }
  
  // Check if the mutations include the changes you are interested in
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // DOM changes occurred (e.g., new child nodes added, existing nodes removed)
        const shippingAddressFields = document.getElementsByClassName("review-block__content");
        const creditCardFields = document.getElementsByClassName("card-fields-iframe");
        const elements = document.getElementsByClassName('section__title');
        const isConfirmed = document.getElementsByClassName("heading-2")[0]?.textContent?.includes('Your order is confirmed');
        const parentElement = document.querySelector('.section');
        const isCheckBox = document.getElementById("custom-checkbox");
        const checkBox = document.getElementById("reveal-user-data");
        const isMainBtn = document.getElementById("purchase-main-btn");
        let element;
      
        concatElements = [...shippingAddressFields,...creditCardFields];

        if(checkBox && checkBox.checked) {
            setBlur(concatElements);
            setTitle(creditCardFields)
        }

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.trim().replace(/\n/g, '').includes('Shipping address')) {
              element = elements[i];
              break;
            }
        }
      
      if (!isCheckBox && !element && !isConfirmed) {
            const checkboxWrapper = `<div id="custom-checkbox" class="checkbox-wrapper"> <div class="checkbox__input"> <input class="input-checkbox" type="checkbox" checked="checked" id="reveal-user-data"> </div> <label class="checkbox__label">Hide personal data</label> </div>`
            parentElement.insertAdjacentHTML('beforebegin', checkboxWrapper);

            const inputCheckbox = parentElement.previousSibling.querySelector('.input-checkbox');
            const handleCheckboxChange = (event) => {
                event.target.checked ? setBlur(concatElements) : setBlur(concatElements, "")
            }

            inputCheckbox.addEventListener('click', handleCheckboxChange);
        };
     if(isConfirmed && !isMainBtn){
            LogoutModal.createHover();
            LogoutModal.createPurchaseModal();
            LogoutModal.showPurchaseModal();

            const button = document.createElement('button');
            button.classList.add('purchase-modal_button');
            button.innerText = 'Log out';
            button.id = "purchase-main-btn";
            button.style.margin = "1.2rem 0px";
            button.onclick = LogoutModal.logoutAndRedirectToHomePage;

            parentElement.appendChild(button);

      };
    }
  }
});

// Configure and start observing the target node (document.body)
const observerConfig = { childList: true, subtree: true };
observer.observe(targetNode, observerConfig);
