document.addEventListener('DOMContentLoaded', function() {
    let swatchWrappers = document.querySelectorAll('.swatches-wrapper');
    swatchWrappers.forEach(function(wrapper) {
        wrapper.style.display = 'none';
    });
});

window.addEventListener('load', function() {
    let swatchWrappers = document.querySelectorAll('.swatches-wrapper');
    swatchWrappers.forEach(function(wrapper) {
        wrapper.style.display = 'block';
    });
});