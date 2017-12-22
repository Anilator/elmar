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



        $.each(data.items, function (i, post) {
            var $content = $('<div>' + post.content + '</div>');
            var imgSrc = $content.find('img')[0].src;
            var imgSrcOriginal = $content.find('a')[0].href;

            var work = {
                src: imgSrc,
                srcOrig: imgSrcOriginal,
            };

            var label = post.labels;
            if (label) {
                label = label[0];

                // debugger;
                G.works[label] = G.works[label] ? G.works[label] : [];
                G.works[label].push(work);
            }

        });

        console.log(G.works);

        var content = '';
        $.each (G.works[G.currentPage], function (i, work) {
            content += '<img src="'+ work.src +'">';
        });


        $('.gallery__room.mini').html(content);
    }
}


