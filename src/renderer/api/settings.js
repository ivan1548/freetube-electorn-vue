/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/no-named-as-default-member */
import fs from "fs";
import getOpml from "opml-to-json";
import store from "../store";
import {
  subDb,
  historyDb,
  savedVidsDb,
  settingsDb,
  localDataStorage
} from "../helper/db";
import subsApi from "./subscriptions";
import toast from "./toast";

const { dialog } = require("electron").remote;

export function initSettings() {
  const settingDefaults = store.state.Settings;

  for (const key in settingDefaults) {
    settingsDb.findOne(
      {
        _id: key
      },
      (err, doc) => {
        if (doc === null) {
          settingsDb.insert({
            _id: key,
            value: settingDefaults[key]
          });
        } else {
          store.dispatch("updateSettingsItem", doc);
        }
      }
    );
  }
}

export function updateSettings(data) {
  for (const key in data) {
    settingsDb.findOne(
      {
        _id: key
      },
      (err, doc) => {
        if (doc !== null) {
          settingsDb.update(
            {
              _id: key
            },
            {
              $set: {
                value: data[key]
              }
            },
            {},
            (_err, _numReplaced) => {
              store.dispatch("updateSettingsItem", {
                _id: key,
                value: data[key]
              });
            }
          );
        }
      }
    );
  }
}

function clearDatabase(db, callbacks = []) {
  db.remove(
    {},
    {
      multi: true
    },
    (_err, _numRemoved) => {
      db.loadDatabase(_error => {
        callbacks.forEach(f => {
          f();
        });
      });
    }
  );
}

export function clearDb(type) {
  switch (type) {
    case "subscriptions":
      clearDatabase(subDb, [subsApi.loadDisplaySubscriptions]);
      break;
    case "history":
      clearDatabase(historyDb);
      break;
    case "saved":
      clearDatabase(savedVidsDb);
      break;
    default:
      toast.show(`Unknown file: ${type}`);
  }
}

/**
 * Import Subscriptions from an OPML file.
 *
 * @param {string} subFile - The file location of the OPML file.
 *
 * @return {Void}
 */
export function importOpmlSubs(json) {
  if (!json[0].folder.includes("YouTube")) {
    toast.show("Invalid OPML File.  Import is unsuccessful.");
    return;
  }

  json.forEach(channel => {
    const channelId = channel.xmlurl.replace(
      "https://www.youtube.com/feeds/videos.xml?channel_id=",
      ""
    );

    subsApi.addSubscription(channelId, false);
  });
  // eslint-disable-next-line no-undef
  window.setTimeout(subsApi.loadDisplaySubscriptions, 1000);
  toast.show("Subscriptions have been imported!");
}

/**
 * Import a subscriptions file that the user provides.
 *
 * @return {Void}
 */
export function importSubscriptions() {
  const appDatabaseFile = `${localDataStorage}/subscriptions.db`;

  // Open user's file browser.  Only show .db files.
  dialog.showOpenDialog(
    {
      properties: ["openFile"],
      filters: [
        {
          name: "Database File",
          extensions: ["*"]
        }
      ]
    },
    fileLocation => {
      if (typeof fileLocation === "undefined") {
        console.log("Import Aborted");
        return;
      }
      console.log(fileLocation);
      const i = fileLocation[0].lastIndexOf(".");
      const fileType = i < 0 ? "" : fileLocation[0].substr(i);
      console.log(fileType);

      fs.readFile(fileLocation[0], (readErr, data) => {
        if (readErr) {
          toast.show(
            "Unable to read file.  File may be corrupt or have invalid permissions."
          );
          throw readErr;
        }

        if (data.includes("<opml")) {
          getOpml(data, (error, json) => {
            if (!error) {
              clearDb("subscriptions");
              importOpmlSubs(json.children[0].children);
            }
          });
          return;
        }
        if (fileType !== ".db") {
          toast.show("Incorrect file type.  Import unsuccessful.");
          return;
        }

        clearDb("subscriptions");

        fs.writeFile(appDatabaseFile, data, writeErr => {
          if (writeErr) {
            toast.show(
              "Unable to create file.  Please check your permissions and try again."
            );
            throw writeErr;
          }
          toast.show("Susbcriptions have been successfully imported.");
        });
      });
    }
  );
}

/**
 * Export the susbcriptions database to a file.
 *
 * @return {Void}
 */
export function exportSubscriptions() {
  const appDatabaseFile = `${localDataStorage}/subscriptions.db`;

  const date = new Date();
  let dateMonth = date.getMonth() + 1;

  if (dateMonth < 10) {
    dateMonth = `0${dateMonth}`;
  }

  let dateDay = date.getDate();

  if (dateDay < 10) {
    dateDay = `0${dateDay}`;
  }

  const dateYear = date.getFullYear();
  const dateString = `freetube-subscriptions-${dateYear}-${dateMonth}-${dateDay}`;

  // Open user file browser. User gives location of file to be created.
  dialog.showSaveDialog(
    {
      defaultPath: dateString,
      filters: [
        {
          name: "Database File",
          extensions: ["db"]
        }
      ]
    },
    fileLocation => {
      console.log(fileLocation);
      if (typeof fileLocation === "undefined") {
        console.log("Export Aborted");
        return;
      }
      fs.readFile(appDatabaseFile, (readErr, data) => {
        if (readErr) {
          throw readErr;
        }
        fs.writeFile(fileLocation, data, writeErr => {
          if (writeErr) {
            throw writeErr;
          }
          toast.show("Susbcriptions have been successfully exported");
        });
      });
    }
  );
}

export default {
  initSettings,
  updateSettings,
  importOpmlSubs,
  importSubscriptions,
  exportSubscriptions,
  clearDb
};
