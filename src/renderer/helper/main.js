import { clipboard } from "electron";
import store from "../store";

export default {
  copy: (site, videoId) => {
    const url = `https://${site}/watch?v=${videoId}`;
    clipboard.writeText(url);
    store.dispatch("showToast", "URL has been copied to the clipboard");
  },
  /**
   *
   * Use this function instead of console.log.
   * This function logs the date, time and presents the information in a readable format
   *
   * @param {*} data
   *
   * @returns {Void}
   */
  log: (...data) => {
    const currentTime = new Date();
    const time = `${currentTime.getDate()}/${currentTime.getMonth() +
      1}/${currentTime.getFullYear()}@${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

    console.log(`[${time}] [FREETUBE]`, data);
  }
};
