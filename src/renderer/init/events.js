import $ from "jquery";
import electron from "electron";
import parseSearchText from '../api/search';

// Open links externally by default
$(document).on('click', 'a[href^="http"]', (event) => {
    let el = event.currentTarget;
    if (!el.href.includes('freetube')) {
        event.preventDefault();
        electron.shell.openExternal(el.href);
    } else {
        window.open(el.href, "_self");
    }
});

// Open links externally on middle click.
$(document).on('auxclick', 'a[href^="http"]', (event) => {
    let el = event.currentTarget;
    if (!el.href.includes('freetube')) {
        event.preventDefault();
    } else {
        event.preventDefault();
        let url = el.href.replace('freetube://', '');
        electron.shell.openExternal(el.href);
    }
});


electron.ipcRenderer.on('ping', function (event, message) {
    console.log(message);
    let url = message[1].replace('freetubeelectornvue://', '');
    parseSearchText(url);
});