window.G = {
    pages: {
        'drawings': {
            contentType: 'drawing',
        },
        'paintings': {
            contentType: 'painting',
        },
        'about': {
            contentType: 'static',
        },
    },
    works: {},
    activePage: 'drawing',
    activeWork: '0',
};
try { G.activePage = localStorage.activePage || 'drawing'; } catch(e) { console.warn(e) }

;(function start() {
    checkForMobile();
    initPages();
    getData();


    function checkForMobile() {
        G.isMobile = window.innerWidth < 768 ? true : false;

        $(window).resize(function () {
            G.isMobile = window.innerWidth < 768 ? true : false;
        });
    }

    function initPages() {

        $('.nav').on('click', '.nav__item', switchPage);

        function switchPage(e) {
            var activeClass = 'nav__item-active';
            var $btn = $(e.currentTarget).addClass(activeClass);
            $btn.siblings().removeClass(activeClass);

            var page = $btn.data('page');
            G.activePage = page;
            saveToStorage();

            drawData(G.pages[page].contentType);
        }
    }

    // debugger;


    function getData() {
        $.getJSON(
            "https://www.googleapis.com/blogger/v3/blogs/327656489361647821/posts",
            {
                key: 'AIzaSyA-T9NRjIXJMQHWuf4TEZfAoBG9sfvarQg',
            },
            parseData
        );

        function parseData(data) {

            var fullWidth = document.body.clientWidth;
            var fullHeight = document.body.clientHeight;
            var heroImgSize = fullWidth;
            var thumbImgSize = G.isMobile ? ~~(fullWidth / 3) : ~~(fullWidth / 4);
            var zoomedImgSize = Math.max(fullWidth, fullHeight) * 2;

            $.each(data.items, function (i, post) {
                var src = post.content.match(/src\s*=\s*["']([^"']+)["']/)[1];
                var work = {
                    src: changeImgSize(src, thumbImgSize),
                    srcZoomed: changeImgSize(src, zoomedImgSize),
                };

                var labels = post.labels;
                if (labels) {
                    label = labels[0];
                    if (label[0] == '#') {
                        work.src = changeImgSize(src, heroImgSize);
                        work.backgroundColor = label;
                        work.heroImage = true;
                        label = labels[1];
                    }
                    G.works[label] = G.works[label] ? G.works[label] : [];
                    G.works[label].unshift(work);
                }
            });

            drawData(G.activePage);
        }
    }

    function changeImgSize(src, size) {
        var srcSplitted = src.split('/');

        srcSplitted[7] = 's' + size;

        return srcSplitted.join('/');
    }

    function drawData(contentType) {
        var content = '';
        var $gallery = $('.gallery');

        $.each (G.works[contentType], function (i, work) {
            if (work.heroImage) {
                G.backgroundColor = work.backgroundColor;
                content = '<img class="gallery__hero" src="'+ work.src +'">' + content;
            } else {
                content +=
                    '<div class="gallery__thumb" data-i="'+ i +'">'+
                        '<div class="gallery__thumb_cont">'+
                            '<img src="'+ work.src +'">'+
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
