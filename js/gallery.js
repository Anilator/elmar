function readStorage() {
    var storage;
    try {
        storage = JSON.parse(window.localStorage.G);
        G.activePage = window.localStorage.activePage;
    } catch (e) {
        console.warn(e);
        storage = { activePage: 'drawing' };
    }
    return storage;
}
window.G = readStorage();
console.log(G);
