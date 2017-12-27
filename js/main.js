window.G = readStorage();
if (!G) {
    G = {
        works: {},
        activePage: 'drawing',
        activeWork: '0',
    };
}

function readStorage() {
    var data = {};
    try {
        if (!window.localStorage.G) return false;
        data = JSON.parse(window.localStorage.G);
        if (!data.works) return false;
    } catch (e) {
        console.warn(e);
        // alert('Zoom is not working on your device');
        return false;
    }
    return data;
}


;(function start() {
    checkForMobile();
    initPages();
    // debugger;
    getWorks();


    function checkForMobile() {
        G.isMobile = window.innerWidth < 768 ? true : false;

        $(window).resize(function () {
            G.isMobile = window.innerWidth < 768 ? true : false;
        });
    }

    function initPages() {

        $('.nav').on('click', '.nav__item', switchPage);

        function switchPage(e) {
            var page = $(e.currentTarget).data('page');

            G.activePage = page;
            saveToStorage();

            drawData();
        }
    }

    function getWorks() {
        if (!G.works.fetched) {
            $.getJSON(
                "https://www.googleapis.com/blogger/v3/blogs/327656489361647821/posts",
                {
                    key: 'AIzaSyA-T9NRjIXJMQHWuf4TEZfAoBG9sfvarQg',
                    maxResults: '100',
                },
                parseData
            );
        } else {
            drawData();
        }


        function parseData(data) {
            G.works = { fetched: true };

            $.each(data.items, function (i, post) {
                var src = post.content.match(/src\s*=\s*["']([^"']+)["']/)[1];
                var text = post.content.replace(/<a.*?<\/a>/, '');
                var work = {
                    src: src,
                    text: text,
                    title: post.title,
                };

                var labels = post.labels;
                if (labels) {
                    label = labels[0];
                    if (label[0] == '#') {
                        work.backgroundColor = label;
                        work.heroImage = true;
                        label = labels[1];
                    }
                    G.works[label] = G.works[label] ? G.works[label] : [];
                    G.works[label].unshift(work);
                }
            });

            drawData();
        }
    }

    function changeImgSize(src, size) {
        var srcSplitted = src.split('/');

        srcSplitted[7] = 's' + size;

        return srcSplitted.join('/');
    }

    function drawData() {
        var page = G.activePage;
        var content = '';
        var $gallery = $('.gallery');

        var activeBtnClass = 'nav__item-active';
        var $btn = $('.nav__item[data-page="'+ page +'"]').addClass(activeBtnClass);
        $btn.siblings().removeClass(activeBtnClass);


        var fullWidth = document.body.clientWidth;
        var heroImgSize = fullWidth;
        var thumbImgSize = G.isMobile ? ~~(fullWidth / 3*2) : ~~(fullWidth / 4);


        $.each (G.works[page], function (i, work) {
            var src;
            if (work.heroImage) {
                G.backgroundColor = work.backgroundColor;
                src = changeImgSize(work.src, heroImgSize);
                content = '<img class="gallery__hero" src="'+ src +'">' + content;
            } else {
                src = changeImgSize(work.src, thumbImgSize);
                content +=
                    '<div class="gallery__thumb" data-i="'+ i +'">'+
                        '<div class="gallery__thumb_cont">'+
                            '<img src="'+ src +'">'+
                        '</div>'+
                    '</div>';
            }
        });


        $gallery.html(content).css('background', G.backgroundColor);

        $gallery.on('click', '.gallery__thumb', zoomImg);
    }

    function zoomImg(e) {
        var workNumber = $(e.currentTarget).data('i');

        G.activeWork = workNumber;
        saveToStorage();

        var galleryPath = location.href.split('/');
        galleryPath.splice(-1, 1, 'gallery.html');
        location.href = galleryPath.join('/');
    }

    function saveToStorage() {
        try {
            window.localStorage.G = JSON.stringify(G);
        }
        catch (e) { console.warn(e); }
    }
})();
