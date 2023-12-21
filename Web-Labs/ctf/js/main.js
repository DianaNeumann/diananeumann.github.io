var currentUrl = window.location.href;

var menuItems = document.querySelectorAll('.menu li a');

menuItems.forEach(function (item) {
    if (item.href === currentUrl) {
        item.classList.add('active');
    }
});