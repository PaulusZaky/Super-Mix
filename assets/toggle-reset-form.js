document
  .getElementById("toggle-reset-form")
  ?.addEventListener("click", function (event) {
    event.preventDefault();
    const resetForm = document.getElementById("reset-form");

    if (resetForm.style.display === "none") {
      localStorage.setItem('isResetForm','true')

      resetForm.style.display = "block";
    } else {
      localStorage.setItem('isResetForm','false')

      resetForm.style.display = "none";
    }
  });

document.addEventListener('DOMContentLoaded', function () {
  const isResetForm = localStorage.getItem('isResetForm');
  const resetForm = document.getElementById('reset-form');

  if(!resetForm){
    return
  }

  isResetForm === 'true' ? (resetForm.style.display = 'block') : (resetForm.style.display = 'none')
});