/* eslint-disable no-undef */
import $ from "jquery";
import electron from "electron";
import router from "../router";
import parseSearchText from "../api/search";

// Open links externally by default
$(document).on("click", 'a[href^="http"]', event => {
  const el = event.currentTarget;
  if (!el.href.includes("freetube")) {
    event.preventDefault();
    electron.shell.openExternal(el.href);
  } else {
    window.open(el.href, "_self");
  }
});

// Open links externally on middle click.
$(document).on("auxclick", 'a[href^="http"]', event => {
  const el = event.currentTarget;
  if (!el.href.includes("freetube")) {
    event.preventDefault();
  } else {
    event.preventDefault();
    el.href.replace("freetube://", "");
    electron.shell.openExternal(el.href);
  }
});

electron.ipcRenderer.on("ping", (_event, message) => {
  console.log(message);
  const url = message[1].replace("freetubeelectornvue://", "");
  parseSearchText(url);
});

electron.ipcRenderer.on("openMiniPlayerRenderer", (_event, data) => {
  router.push({
    name: "mini-player",
    params: data
  });
});
