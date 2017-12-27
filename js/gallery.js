;(function start() {

    window.G = readStorage();

    if (window.G) {
        console.log(G.works[G.activePage][G.activeWork]);
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
})();
