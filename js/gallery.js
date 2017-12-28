;(function start() {
    var fullWidth = window.innerWidth;
    var fullHeight = window.innerHeight;
    var zoomedImgSize = Math.max(fullWidth, fullHeight) * 3;

    window.G = readStorage();
    if (window.G) {

        updateControls();
        showZoomedImg();

        $('.controls').on('click', 'i', switchImg);
    }
        handleTouches();



    function showZoomedImg() {

        var activeWork = G.works[G.activePage][G.activeWork];
        var src = changeImgSize(activeWork.src, zoomedImgSize);

        var content = '<img src="'+ src +'">';
        $('.gallery').html(content).css('background', G.backgroundColor);

        var $description = $('.description').html(activeWork.text);
    }

    function switchImg(e) {
        var $btn = $(e.currentTarget);
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
        var $left = $('#left').css('display', '');
        var $right = $('#right').css('display', '');
        if (G.activeWork) {
            if (G.activeWork >= G.works[G.activePage].length - 1)
                $right.css('display', 'none');
        } else {
            $left.css('display', 'none');
        }
    }





    function handleTouches() {

        var startX, startY, endX, endY;
        var tresX = 40, tresY = 40;
        var $doc = $(document);

        $doc.on('touchstart', touchstart);
        $doc.on('touchmove', touchmove);
        $doc.on('touchend', touchend);

        function touchstart(e) {
            t = e.originalEvent.touches[0];
            startX = t.screenX;
            startY = t.screenY;
        }
        function touchmove(e) {
            t = e.originalEvent.touches[0];
            endX = t.screenX;
            endY = t.screenY;
        }
        function touchend(e) {
            var distX = endX - startX;
            var distY = endY - startY;

            if (distX > tresX) moveHorizon(true);
            if (distX < tresX * -1) moveHorizon(false);

            if (distY > tresY) moveVert(true);
            if (distY < tresY * -1) moveVert(false);


            $('.description').html(window.pageYOffset +'<br>'+ distX +'<br>'+ distY);
        }

        function moveHorizon(isRight) {
            if (isRight) console.log('right');
            else console.log('left');
        }
        function moveVert(isDown) {
            if (isDown) console.log('down');
            else console.log('up');
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
