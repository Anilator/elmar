;(function start() {
    var fullWidth = window.innerWidth;
    var fullHeight = window.innerHeight;
    var zoomedImgSize = Math.max(fullWidth, fullHeight) * 3;

    window.G = readStorage();
    if (window.G) {

        loadImg();

        handleTouches();
        $(document).keyup(handleKeys);
        $('.controls').on('click', 'i', handleControls);
        $('.gallery').on('click', 'img', zoomImg);

        $('html').css('background', G.backgroundColor);
    }


    function loadImg() {

        var activeWork = G.works[G.activePage][G.activeWork];
        var src = changeImgSize(activeWork.src, zoomedImgSize);

        var content = '<img src="'+ src +'">';
        $('.gallery').html(content);

        description = '<h2>'+ activeWork.title +'<h2> <p>'+ activeWork.text +'</p>';
        $('.description').html(activeWork.text);

        updateControls();
    }

    function handleControls(e) {
        var $btn = $(e.currentTarget);
        var direction = $btn.data('dir');

        if (direction == 'close') {
            history.back();
            return;
        }

        switchImg(direction);
    }
    function handleKeys(e) {
        if (e.key == "ArrowLeft") switchImg('prev');
        if (e.key == "ArrowRight") switchImg('next');
    }
    function handleTouches() {

        var startX, startY, endX, endY;
        var tresX = 64, tresY = 100;
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


            if (distX > distY) {    // horizontal move
                if (distX > tresX) {
                    if (dirX)
                        moveHorizon(true);
                    else
                        moveHorizon(false);
                }
            } else if (distY > tresY) {  // vertical move
                if (dirY)
                    moveVert(true);
                else
                    moveVert(false);
            }
        }

        function moveHorizon(isRight) {
            if (isRight) switchImg('prev');
            else switchImg('next');
        }
        function moveVert(isDown) {
            if (isDown && window.pageYOffset < 1) {
                history.back();
            } else {}
        }
    }

    function switchImg(direction) {
        if (direction == 'next') { // right
            if (G.activeWork < G.works[G.activePage].length - 1)
                G.activeWork++;
        } else { // left
            if (G.activeWork)
                G.activeWork--;
        }

        loadImg();
        saveToStorage();
    }
    function updateControls() {
        var $left = $('.controls i[data-dir="prev"]').css('display', '');
        var $right = $('.controls i[data-dir="next"]').css('display', '');
        if (G.activeWork) {
            if (G.activeWork >= G.works[G.activePage].length - 1)
                $right.css('display', 'none');
        } else {
            $left.css('display', 'none');
        }
    }

    function zoomImg(e) {
        $(e.target).toggleClass('zoomed');
    }


    /* common */
        function changeImgSize(src, size) {
            var srcSplitted = src.split('/');

            srcSplitted[7] = 's' + size;

            return srcSplitted.join('/');
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
        function saveToStorage() {
            try {
                window.localStorage.G = JSON.stringify(G);
            }
            catch (e) { console.warn(e); }
        }
})();
