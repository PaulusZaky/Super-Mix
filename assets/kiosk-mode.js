var isKioskMode = localStorage.getItem("scaaf_aid") !== null;
const credentialInputs = document.getElementsByClassName("form-control");
let countdownTime;
let countdown;
const HOME_PAGE_URL = "https://supermixstudio.com/";

// this part of code for the new affiliate approach
if (!isKioskMode) {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith("bgaffilite_id="))
    ?.split("=")[1];

  if (value) {
    localStorage.setItem("scaaf_aid", value);
    isKioskMode = true;
  }
}

function startCountdown(duration = 300) {
  countdownTime = duration;

  countdown = setInterval(function () {
    countdownTime--;

    if (countdownTime < 0) {
      clearInterval(countdown);
      LogoutModal.showLogoutModal();
    }
  }, 1000);
}

function renewCountdown(duration = 300) {
  clearInterval(countdown);
  startCountdown(duration);
}

if (isKioskMode && credentialInputs.length) {
  for (const input of credentialInputs) {
    input.setAttribute("autocomplete", "one-time-code");
  }
}

// Wait for the home page to finish loading
window.addEventListener("DOMContentLoaded", function () {
  // Insert modal on page
  LogoutModal.createHover();
  LogoutModal.createLogoutModal(renewCountdown);

  // Check if the user is navigating away from the home page
  if (isKioskMode && location.href !== HOME_PAGE_URL) {
    renewCountdown();

    // Event listener for tracking user activity
    document.addEventListener("touchmove", function () {
      renewCountdown();
    });
    document.addEventListener("touchstart", function () {
      renewCountdown();
    });
    window.addEventListener("keydown", function () {
      renewCountdown();
    });
  }

  if (isKioskMode) {
    const kiosk_video = document.getElementById("kiosk_video");
    const non_kiosk_video = document.getElementById("non_kiosk_video");
    const socialFooter = document.querySelectorAll(".footer__social-icons");
    const navElements = document.querySelectorAll(".nav.js.nav-pills li");
    const footerElements = document.querySelectorAll(".f-link-container li");
    const combinedElements = [...navElements, ...footerElements];

    //Hide tabs 'Collabs' & 'Kiosk' & 'Gift Cards' for kiosk mode only
    combinedElements.forEach((li) => {
      const a = li.querySelector("a");

      if (
        a &&
        (a.textContent.trim() === "Collabs" ||
          a.textContent.trim() === "Kiosk" ||
          a.textContent.trim() === "Gift Cards")
      ) {
        li.remove();
      }
    });

    if (kiosk_video) {
      kiosk_video.classList.remove("hide");
      non_kiosk_video.classList.add("hide");
    } else if (socialFooter.length > 0) {
      socialFooter.forEach(function (element) {
        element.style.display = "none";
      });
    }
  }
});

var LogoutModal = (function () {
  const ONE_SECOND = 1000;
  const CONFIRMATION_TIME_S = 10 * ONE_SECOND;
  const LOGOUT_POSTFIX = "/account/logout";

  let currentModal = null;
  let confirmationTimer = null;

  let continueCallback = null;

  // hover section
  function createHover() {
    addHoverStyles();
    insertHoverToDOM();
  }

  function checkIsHoverStylesExist() {
    return document.getElementById("hover-styles") !== null;
  }

  function addHoverStyles() {
    if (checkIsHoverStylesExist()) return;
    const hoverStyles = document.createElement("style");
    hoverStyles.id = "hover-styles";
    hoverStyles.innerText = `
            #hover {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0,0,0, 0.3);
                z-index: 999;
            }
            .hover--visible {
                display: block;
            }
            .hover--hidden {
                display: none;
            }
        `;
    document.head.appendChild(hoverStyles);
  }

  function checkIsHoverExist() {
    return getHoverFromDOM() !== null;
  }

  function getHoverFromDOM() {
    return document.getElementById("hover");
  }

  function insertHoverToDOM() {
    if (checkIsHoverExist()) return;
    const body = document.getElementsByTagName("body")[0];
    const hover = document.createElement("div");
    hover.id = "hover";
    hover.classList = "hover--hidden";
    hover.addEventListener("click", onContinueHandler);
    body.appendChild(hover);
  }

  function showHover() {
    getHoverFromDOM().classList.replace("hover--hidden", "hover--visible");
  }

  function hideHover() {
    getHoverFromDOM().classList.replace("hover--visible", "hover--hidden");
  }

  function checkIsModalStyleExist() {
    return document.getElementById("logout-modal-styles");
  }

  // logout modal section
  function addLogoutModalStyles() {
    if (checkIsModalStyleExist()) return;
    const style = document.createElement("style");
    style.id = "logout-modal-styles";
    style.innerText = `
            .logout-modal--visible {
                position: absolute;
                top: 300px;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                z-index: 9999;
                background: linear-gradient(90deg, rgba(204,48,69,1) 0%, rgba(234,96,165,1) 20%, rgba(245,225,124,1) 40%, rgba(79,173,91,1) 60%, rgba(50,152,196,1) 80%, rgba(175,145,189,1) 100%);
                border: "1px solid #dddddd";
                border-radius: 6px;
            }
            .logout-moda_inner {
                flex:  1;
                margin: 6px;
                padding: 20px 100px;
                background: white;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                z-index: 9999;
            }
            .logout-modal--hidden {
                display: none;
            }
            .logout-modal_question {
                font-size: 30px;
                margin: 0 0 20px 0;
            }
            .logout-modal_button {
                background: black;
                color: white;
                outline: none;
                border-width: 0;
                border-radius: 50px;
                padding: 5px 10px;
                width: 200px;
                height: 50px;
                font-size: 20px;
            }
            .logout-modal_countdown {
                font-size: 20px;
                margin: 0 0 20px 0;
            }
        `;

    document.head.appendChild(style);
  }

  function insertLogoutModalToDOM() {
    if (getLogoutModalFromDom() !== null) return;

    const p = document.createElement("h5");
    p.classList = "logout-modal_question";
    p.textContent = "Are you still here?";

    const button = document.createElement("button");
    button.classList = "logout-modal_button";
    button.textContent = "I'm still here";
    button.type = "button";

    const countdown = document.createElement("p");
    countdown.classList = "logout-modal_countdown";
    countdown.innerText = "Logging out in ";

    const countSecond = document.createElement("span");
    countSecond.id = "loggout-countdown";
    countSecond.innerText = CONFIRMATION_TIME_S / 1000;
    countdown.appendChild(countSecond);

    const countText = document.createElement("span");
    countText.innerText = " seconds";
    countdown.appendChild(countText);

    const div = document.createElement("div");
    div.id = "logout-modal";
    div.classList = "logout-modal--hidden";

    const innerWhiteContainer = document.createElement("div");
    innerWhiteContainer.classList.add("logout-moda_inner");

    getHoverFromDOM().appendChild(div);
    div.appendChild(innerWhiteContainer);
    innerWhiteContainer.appendChild(p);
    innerWhiteContainer.appendChild(countdown);
    innerWhiteContainer.appendChild(button);
  }

  function getLogoutModalFromDom() {
    return document.getElementById("logout-modal");
  }

  function getCounterFromDOM() {
    if (currentModal.id === "logout-modal") {
      return document.getElementById("loggout-countdown");
    }
    if (currentModal.id === "purchase-modal") {
      return document.getElementById("purchase-countdown");
    }
  }

  function decreaseCounterInDOM() {
    const count = getCounterFromDOM();
    let number = Number(count.innerText);

    if (number >= 1) {
      count.innerText = number - 1;
      number -= 1;
      setTimeout(decreaseCounterInDOM, ONE_SECOND);
    }
  }

  function showLogoutModal() {
    currentModal = getLogoutModalFromDom();
    setConfirmationTimer();
    getLogoutModalFromDom().classList.replace(
      "logout-modal--hidden",
      "logout-modal--visible"
    );
    showHover();
  }

  function hideLogoutModal() {
    getLogoutModalFromDom().classList.replace(
      "logout-modal--visible",
      "logout-modal--hidden"
    );
    hideHover();
  }

  function hideCurrentModal() {
    if (currentModal.id === "logout-modal") {
      hideLogoutModal();
    }
    if (currentModal.id === "purchase-modal") {
      hidePurchaseModal();
    }
  }

  function setConfirmationTimer() {
    getCounterFromDOM().innerText = CONFIRMATION_TIME_S / ONE_SECOND;

    confirmationTimer = setTimeout(function () {
      hideCurrentModal();
      logoutAndRedirectToHomePage();
    }, CONFIRMATION_TIME_S);

    decreaseCounterInDOM();
  }

  function clearConfirmationTimer() {
    clearTimeout(confirmationTimer);
  }

  function onContinueHandler() {
    if (getLogoutModalFromDom() !== null) {
      hideLogoutModal();
    }
    if (getPurchaseModalFromDOM() !== null) {
      hidePurchaseModal();
    }

    clearConfirmationTimer();
    if (continueCallback) {
      continueCallback();
    }
  }

  function logoutAndRedirectToHomePage() {
    window.location.href = `${HOME_PAGE_URL}${LOGOUT_POSTFIX}`;
  }

  function createLogoutModal(callback) {
    // create and insert Logout modal in DOM
    addLogoutModalStyles();
    insertLogoutModalToDOM();

    // save callback for logout modal
    continueCallback = callback;
  }

  // Purchase modal section
  function addStyleForPurchaseModal() {
    const successPurchaseModalStyles = document.createElement("style");
    successPurchaseModalStyles.id = "success-purchase-modal";
    successPurchaseModalStyles.innerText = `
            #purchase-modal {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                min-width: 400px;
                background-color: white;
                border: 10px rgba(234,96,165,1) solid;
                flex-direction: column;
                gap: 25px;
                padding: 25px 32px;
            }
            .purchase-modal--visible {
                display: flex;
            }
            .purchase-modal--hidden {
                display: none;
            }

            #purchase-modal_logo {
                align-self: center;
            }

            .purchase-modal_button {
                background-color: black;
                color: white;
                border: none;
                border-radius: 20px;
                height: 40px;
                width: 230px;
                align-self: center;
                padding: 10px 20px;
                font-size: 15px;
            }

            .purchase-modal_title_section {
                display: flex;
                flex-direction: column;
            }

            .purchase-modal_title {
                align-self: center;
                font-size: 26px;
                font-weight: 600;
            }

            #purchase-modal_message {
                font-size: 20px;
            }

            #purchase-modal_cross-container {
                position: absolute;
                align-self: end;
                margin-bottom: 20px;
            }
            .cross-container-line {
                position: absolute;
                border: 1px solid black;
                height: 20px;
                width: 1px;
                background: black;
            }
            .cross-container_left-line {
                transform: rotate(-45deg);
            }
            .cross-container_right-line {
                transform: rotate(45deg);
            }
            #purchase-modal_counter-message {
                align-self: center;
                font-size: 18px;
            }
        `;
    document.head.appendChild(successPurchaseModalStyles);
  }

  function insertPurchaseModalToDOM() {
    if (getPurchaseModalFromDOM() !== null) return;

    // modal container
    const purchaseModal = document.createElement("div");
    purchaseModal.id = "purchase-modal";
    purchaseModal.classList.add("purchase-modal--visible");

    // wrapper for order number and title
    const purchaseModalTitleSection = document.createElement("div");
    purchaseModalTitleSection.classList.add("purchase-modal_title_section");

    const thankYouMessage = document.createElement("span");
    thankYouMessage.innerText = "Thank you for your purchase!";
    thankYouMessage.classList.add("purchase-modal_title");

    // Loggout in ...
    const message = document.createElement("span");
    message.id = "purchase-modal_message";
    message.innerText = "You will receive an email with your orders details.";

    const counterMessage = document.createElement("span");
    counterMessage.id = "purchase-modal_counter-message";
    counterMessage.innerText = "Logging out in ";

    const countdown = document.createElement("span");
    countdown.id = "purchase-countdown";
    countdown.innerText = CONFIRMATION_TIME_S / ONE_SECOND;

    const secondsString = document.createElement("span");
    secondsString.innerText = " seconds";

    const button = document.createElement("button");
    button.classList.add("purchase-modal_button");
    button.innerText = "Log out";
    button.addEventListener("click", logoutAndRedirectToHomePage);

    // cross icon
    const crossContainer = document.createElement("div");
    crossContainer.id = "purchase-modal_cross-container";
    // const crossLeftLine = document.createElement('div')
    // crossLeftLine.classList.add('cross-container_left-line', 'cross-container-line')
    // const crossRightLine = document.createElement('div')
    // crossRightLine.classList.add('cross-container_right-line', 'cross-container-line')
    // crossContainer.append(crossLeftLine, crossRightLine)

    // Supermix logo
    const logo = document.createElement("img");
    logo.id = "purchase-modal_logo";
    logo.src =
      "https://supermixstudio.com/cdn/shop/files/supermix-logo_1_1445x.png?v=1662487330";
    logo.width = 219;
    logo.height = 85;
    logo.sizes =
      "(min-width: 2000px) 1000px, (min-width: 1445px) calc(100vw / 2), (min-width: 1200px) calc(100vw / 1.75), (min-width: 750px) calc(100vw / 1.25), 100vw";
    logo.loading = "lazy";

    purchaseModal.append(crossContainer, logo);
    purchaseModalTitleSection.append(thankYouMessage);
    purchaseModal.appendChild(purchaseModalTitleSection);
    counterMessage.appendChild(countdown);
    purchaseModal.append(message, counterMessage, button);
    getHoverFromDOM().appendChild(purchaseModal);
  }

  function getPurchaseModalFromDOM() {
    return document.getElementById("purchase-modal");
  }

  var callbackForPurchaseModal = null;

  function createPurchaseModal(callback) {
    addStyleForPurchaseModal();
    insertPurchaseModalToDOM();
    callbackForPurchaseModal = callback;
  }

  function showPurchaseModal() {
    currentModal = getPurchaseModalFromDOM();
    setConfirmationTimer();
    showHover();
    getPurchaseModalFromDOM().classList.replace(
      "purchase-modal--hidden",
      "purchase-modal--visible"
    );
  }

  function hidePurchaseModal() {
    hideHover();
    getPurchaseModalFromDOM().classList.replace(
      "purchase-modal--visible",
      "purchase-modal--hidden"
    );
  }

  return {
    currentModal,
    createHover,
    createLogoutModal,
    showLogoutModal,
    hideLogoutModal,
    createPurchaseModal,
    showPurchaseModal,
    hidePurchaseModal,
    logoutAndRedirectToHomePage,
  };
})();
