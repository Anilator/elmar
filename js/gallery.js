;(function start() {
    var fullWidth = window.innerWidth;
    var fullHeight = window.innerHeight;
    var zoomedImgSize = Math.max(fullWidth, fullHeight) * 3;

    window.G = readStorage();
    if (window.G) {

        updateControls();
        showZoomedImg();

        $('.controls').on('click', 'i', handleControls);
        handleTouches();
    }


    function handleControls(e) {
        var $btn = $(e.currentTarget);
        var direction = $btn.data('dir');

        switchImg(direction);
    }


    function switchImg(direction) {
        if (direction == 'next') { // right
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
        var $left = $('#left').css('display', '');
        var $right = $('#right').css('display', '');
        if (G.activeWork) {
            if (G.activeWork >= G.works[G.activePage].length - 1)
                $right.css('display', 'none');
        } else {
            $left.css('display', 'none');
        }
    }

    function showZoomedImg() {

        var activeWork = G.works[G.activePage][G.activeWork];
        var src = changeImgSize(activeWork.src, zoomedImgSize);

        var content = '<img src="'+ src +'">';
        $('.gallery').html(content);
        $('html').css('background', G.backgroundColor);

        var $description = $('.description').html(activeWork.text);
    }




    function handleTouches() {

        var startX, startY, endX, endY;
        var tresX = 64, tresY = 120;
        var isMulti = false;
        var $doc = $(document);

        $doc.on('touchstart', touchstart);
        $doc.on('touchmove', touchmove);
        $doc.on('touchend', touchend);

        function touchstart(e) {
            t = e.originalEvent.touches;
            if (t.length > 1) { isMulti = true; return; }
            else isMulti = false;

            t = t[0];
            startX = t.clientX;
            startY = t.clientY;
        }
        function touchmove(e) {}
        function touchend(e) {
            if (isMulti) return;
            var t = e.originalEvent.changedTouches[0];

            endX = t.clientX;
            endY = t.clientY;

            var dirX = endX > startX ? true : false;
            var dirY = endY > startY ? true : false;
            var distX = Math.abs(endX - startX);
            var distY = Math.abs(endY - startY);


            if (distX > distY) {
                if (distX > tresX) {
                    if (dirX)
                        moveHorizon(true);
                    else
                        moveHorizon(false);
                }
            } else if (distY > tresY) {
                if (dirY)
                    moveVert(true);
                else
                    moveVert(false);
            }

            if (distY > tresY) moveVert(true);
            if (distY < tresY * -1) moveVert(false);
        }

        function moveHorizon(isRight) {
            if (isRight) switchImg('prev');
            else switchImg('next');
        }
        function moveVert(isDown) {
            if (isDown) {
                history.back();
            } else {}
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
