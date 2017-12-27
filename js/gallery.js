;(function start() {

    window.G = readStorage();

    if (window.G) {
        var fullWidth = window.innerWidth;
        var fullHeight = window.innerHeight;
        var zoomedImgSize = Math.max(fullWidth, fullHeight) * 2;

        var activeWorkSrc = G.works[G.activePage][G.activeWork].src;
        var src = changeImgSize(activeWorkSrc, zoomedImgSize);

        content = '<img src="'+ src +'">';
        $('.gallery').html(content);
    }

    function readStorage() {
        var data = {};
        try {
            data = JSON.parse(window.localStorage.G);
        } catch (e) {
            console.warn(e);
            alert('Zoom is not working on your device');
            return false;
        }
        return data;
    }
    function changeImgSize(src, size) {
        var srcSplitted = src.split('/');

        srcSplitted[7] = 's' + size;

        return srcSplitted.join('/');
    }
})();
