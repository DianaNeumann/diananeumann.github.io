(function () {
    window.addEventListener('load', function () {
        var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        var pElement = document.querySelector('p.performance');
        if (pElement) {
            pElement.textContent = 'Page load time: ' + loadTime + ' milliseconds';
        }
    });
})();