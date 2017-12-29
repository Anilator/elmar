;(function start() {
    window.G = readStorage();
    if (!G) {
        G = {
            works: {},
            activePage: 'drawing',
            activeWork: '0',
        };
    }


    // debugger;
    checkForMobile();
    initPages();
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
        if (/*!G.works.fetched*/ true) {
            $.getJSON(
                "https://www.googleapis.com/blogger/v3/blogs/327656489361647821/posts",
                {
                    key: 'AIzaSyA-T9NRjIXJMQHWuf4TEZfAoBG9sfvarQg',
                    maxResults: '500',
                },
                parseData
            );
        } else {
            drawData();
        }


        function parseData(data) {
            G.works = { fetched: true };

            $.each(data.items, function (i, post) {
                var labels = post.labels;
                if (labels) {
                    var label = labels[0];
                    var work = {};
                    if (label[0] == '#') {
                        work.backgroundColor = label;
                        work.heroImage = true;
                        label = labels[1];
                    }

                    if (label == 'about') {
                        G.about = post.content;
                        return;
                    }

                    work.src = post.content.match(/src\s*=\s*["']([^"']+)["']/)[1];
                    work.text = post.content.replace(/<a.*?<\/a>/, '');
                    work.title = post.title;

                    G.works[label] = G.works[label] ? G.works[label] : [];
                    G.works[label].unshift(work);
                }
            });

            drawData();
        }
    }

    function changeImgSize(src, size) {
        var srcSplitted = src.split('/');

        srcSplitted[7] = 'w' + size;

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
        var heroImgSize = fullWidth * 2;
        var thumbImgSize = G.isMobile ? ~~(fullWidth / 3*2) : ~~(fullWidth / 4);


        $.each (G.works[page], function (i, work) {
            var src;
            if (work.heroImage) {
                G.backgroundColor = work.backgroundColor;
                src = changeImgSize(work.src, heroImgSize);
                content =
                    '<div class="gallery__hero">'+
                        '<img src="'+ src +'" class="zoom" data-i="'+ i +'">'+
                    '</div>' + content;
            } else {
                src = changeImgSize(work.src, thumbImgSize);
                content +=
                    '<div class="gallery__thumb zoom" data-i="'+ i +'">'+
                        '<div class="gallery__thumb_cont">'+
                            '<img src="'+ src +'">'+
                        '</div>'+
                    '</div>';
            }
        });

        if (page == 'about') {
            content = '<div class="about">'+ G.about +'</div>';
            G.backgroundColor = '#eee';
        }


        $gallery.html(content).css('background', G.backgroundColor);

        $gallery.on('click', '.zoom', zoomImg);
    }

    function zoomImg(e) {
        var workNumber = $(e.currentTarget).data('i');

        G.activeWork = workNumber;
        saveToStorage();

        var galleryPath = location.href.split('/');
        galleryPath.splice(-1, 1, 'gallery.html');
        location.href = galleryPath.join('/');
    }

    /* common */
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
    function saveToStorage() {
        try {
            window.localStorage.G = JSON.stringify(G);
        }
        catch (e) { console.warn(e); }
    }
})();
