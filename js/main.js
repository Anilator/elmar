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
};

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

            $.each(data.items, function (i, post) {
                var src = post.content.match(/src\s*=\s*["']([^"']+)["']/)[1];

                var fullWidth = document.body.clientWidth;
                var fullHeight = document.body.clientHeight;
                var heroImgSize = fullWidth;
                var thumbImgSize = G.isMobile ? ~~(fullWidth / 3) : ~~(fullWidth / 4);
                var zoomedImgSize = Math.max(fullWidth, fullHeight) * 2;

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

            function changeImgSize(src, size) {
                var srcSplitted = src.split('/');

                srcSplitted[7] = 'w' + size;

                return srcSplitted.join('/');
            }


            drawData('drawing');
        }
    }

    function drawData(contentType) {
        var content = '';

        $.each (G.works[contentType], function (i, work) {
            if (work.heroImage) {
                G.backgroundColor = work.backgroundColor;
                content = '<img class="gallery__hero" src="'+ work.src +'">' + content;
            } else {
                content += '<img class="gallery__thumb" src="'+ work.src +'">';
            }
        });

        $('.gallery').html(content).css('background', G.backgroundColor);
    }
})();
