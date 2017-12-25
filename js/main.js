window.G = {
    pages: {
        'drawing': {
            type: 'gallery',
        },
        'painting': {
            type: 'gallery',
        },
        'about': {
            type: 'static',
        },
    },
    currentPage: 'drawing',
    works: {},
};

;(function start() {
    checkForMobile();
    initPages();
    getData();
})();

function checkForMobile() {
    G.isMobile = window.innerWidth < 768 ? true : false;

    $(window).resize(function () {
        G.isMobile = window.innerWidth < 768 ? true : false;
    });
}



function initPages() {
    var loaders = {
        'gallery': loadGalleryPage,
        'static': loadStaticPage,
    }

    $('.nav').on('click', '.nav__item', switchPage);

    function switchPage(e) {
        var $btn = $(e.currentTarget);
        var page = $btn.data('page');
        loaders[G.pages[page].type]();
    }
    function loadGalleryPage() {
        console.log('load gallery page');
    }
    function loadStaticPage() {
        console.log('load static page');
    }
}



function getData() {
    $.getJSON(
        "https://www.googleapis.com/blogger/v3/blogs/327656489361647821/posts",
        {
            key: 'AIzaSyA-T9NRjIXJMQHWuf4TEZfAoBG9sfvarQg',
        },
        handle
    );
    function handle(data) {


        function resizeTo(src, size) {
            var srcSplitted = src.split('/');

            srcSplitted[7] = 's' + size;

            return srcSplitted.join('/');
        }



        $.each(data.items, function (i, post) {
            var $content = $('<div>' + post.content + '</div>');
            var src = $content.find('a')[0].href;
            // debugger;


            var work = {
                src: src,
                srcThumb: G.isMobile ? resizeTo(src, 300) : resizeTo(src, 500),
            };

            var labels = post.labels;
            if (labels) {
                label = labels[0];
                if (label[0] == '#') {
                    G.backgroundColor = label;
                    G.heroImage = G.isMobile ? resizeTo(src, 500) : src;
                    label = labels[1];
                } else {
                    G.works[label] = G.works[label] ? G.works[label] : [];
                    G.works[label].push(work);
                }
            }
        });




        // console.log(G.works);

        var content = '<img class="gallery__hero" src="'+ G.heroImage +'">';

        $.each (G.works[G.currentPage], function (i, work) {
            content += '<img class="gallery__img" src="'+ work.srcThumb +'">';
        });

        $('.gallery__room.mini').html(content).css('background', G.backgroundColor);
    }
}


