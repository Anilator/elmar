;(function start() {
    var fullWidth = window.innerWidth;
    var fullHeight = window.innerHeight;
    var zoomedImgSize = Math.max(fullWidth, fullHeight) * 2;

    window.G = readStorage();
    if (window.G) {

        updateControls();
        showZoomedImg();

        $('.controls').on('click', 'i', switchImg);
    }

    function showZoomedImg() {

        var activeWorkSrc = G.works[G.activePage][G.activeWork].src;
        var src = changeImgSize(activeWorkSrc, zoomedImgSize);

        var content = '<img src="'+ src +'">';
        $('.gallery').html(content).css('background', G.backgroundColor);
    }

    function switchImg(e) {
        var $btn = $(e.target);
        var direction = $btn.data('dir');

        if (direction) { // right
            if (G.activeWork < G.works[G.activePage].length - 1)
                G.activeWork++;
        } else { // left
            if (G.activeWork)
                G.activeWork--;
        }

        updateControls();
        showZoomedImg();
    }

    function updateControls() {
        var $left = $('.controls .left').css('');
        var $right = $('.controls .right').css('');
        if (G.activeWork) {
            if (G.activeWork >= G.works[G.activePage].length - 1)
                $right.css('display: none');
        } else {
            $left.css('display: none');
        }
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
