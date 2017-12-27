function readStorage() {
    var data;
    try {
        data = JSON.parse(window.localStorage.G);
        data.activePage = window.localStorage.activePage;
    } catch (e) {
        console.warn(e);
        data = { activePage: 'drawing' };
    }
    return data;
}
window.G = readStorage();
console.log(G);
