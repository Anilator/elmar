window.G = {
    isMobile: window.innerWidth < 768 ? true : false,

    pages: {
        'drawings': {
            type: 'gallery',
        },
        'paintings': {
            type: 'gallery',
        },
        'about': {
            type: 'static',
        },
    },
};

;(function start() {
    initMenu();
    initPages();
    checkForMobile();
})();

function initMenu() {
    $('.menu').on('click', 'div', toggleMenu);

    function toggleMenu() {
        console.log(this);
        var $menu__btn = $(this);
        var $menu = $menu__btn.parents('.menu');
        var classOpened = 'menu-opened';

        if($menu.hasClass(classOpened)) {
            $menu.removeClass(classOpened);
        } else {
            $menu.addClass(classOpened);
        }
    }
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

function checkForMobile() {
    $(window).resize(function () {
        G.isMobile = window.innerWidth < 768 ? true : false;
    });
}



$.getJSON(
    "https://www.googleapis.com/blogger/v3/blogs/2162001888846871697/posts",
    {
        key: 'AIzaSyA-T9NRjIXJMQHWuf4TEZfAoBG9sfvarQg',
    },
    handle
);
function handle(data) {
    console.log(data);

    var $description = $(data.items[0].content);

    $('.gallery__room.mini').html($description);
}
