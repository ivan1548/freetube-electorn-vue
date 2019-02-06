import {
    subDb,
    historyDb,
    savedVidsDb,
    settingsDb,
    localDataStorage
} from '../helper/db'
import subsApi from "./subscriptions"
import toast from './toast'
import store from '../store'
import fs from 'fs'
import getOpml from 'opml-to-json'

const {
    dialog
} = require('electron').remote

export function initSettings() {
    const settingDefaults = store.state.Settings;

    for (let key in settingDefaults) {
        settingsDb.findOne({
            _id: key
        }, (err, doc) => {
            if (doc === null) {
                settingsDb.insert({
                    _id: key,
                    value: settingDefaults[key]
                });
            } else {
                store.dispatch('updateSettingsItem', doc)
            }
        });
    }
}

export function updateSettings(data) {
    for (let key in data) {
        settingsDb.findOne({
            _id: key
        }, (err, doc) => {
            if (doc === null) {} else {
                settingsDb.update({
                    _id: key
                }, {
                    $set: {
                        value: data[key]
                    }
                }, {}, (err, numReplaced) => {
                    store.dispatch('updateSettingsItem', {
                        _id: key,
                        value: data[key]
                    })
                });

            }
        });
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
    if (!json[0]['folder'].includes('YouTube')) {
        toast.show('Invalid OPML File.  Import is unsuccessful.');
        return;
    }

    json.forEach((channel) => {
        let channelId = channel['xmlurl'].replace('https://www.youtube.com/feeds/videos.xml?channel_id=', '');

        subsApi.addSubscription(channelId, false);
    });
    window.setTimeout(subsApi.loadDisplaySubscriptions, 1000);
    toast.show('Subscriptions have been imported!');
    return;
}

/**
 * Import a subscriptions file that the user provides.
 *
 * @return {Void}
 */
export function importSubscriptions() {
    const appDatabaseFile = localDataStorage + '/subscriptions.db';

    // Open user's file browser.  Only show .db files.
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'Database File',
            extensions: ['*']
        }, ]
    }, function (fileLocation) {
        if (typeof (fileLocation) === 'undefined') {
            console.log('Import Aborted');
            return;
        }
        console.log(fileLocation);
        let i = fileLocation[0].lastIndexOf('.');
        let fileType = (i < 0) ? '' : fileLocation[0].substr(i);
        console.log(fileType);

        fs.readFile(fileLocation[0], function (readErr, data) {
            if (readErr) {
                toast.show('Unable to read file.  File may be corrupt or have invalid permissions.');
                throw readErr;
            }

            if (data.includes("<opml")) {
                getOpml(data, function (error, json) {
                    if (!error) {
                        clearDb('subscriptions');
                        importOpmlSubs(json['children'][0]['children']);
                    }
                });
                return;
            } else if (fileType !== '.db') {
                toast.show('Incorrect file type.  Import unsuccessful.');
                return;
            }

            clearDb('subscriptions');

            fs.writeFile(appDatabaseFile, data, function (writeErr) {
                if (writeErr) {
                    toast.show('Unable to create file.  Please check your permissions and try again.');
                    throw writeErr;
                }
                toast.show('Susbcriptions have been successfully imported.');
            });
        })
    });
}

/**
 * Export the susbcriptions database to a file.
 *
 * @return {Void}
 */
export function exportSubscriptions() {
    const appDatabaseFile = localDataStorage + '/subscriptions.db';

    const date = new Date();
    let dateMonth = date.getMonth() + 1;

    if (dateMonth < 10) {
        dateMonth = '0' + dateMonth;
    }

    let dateDay = date.getDate();

    if (dateDay < 10) {
        dateDay = '0' + dateDay;
    }

    const dateYear = date.getFullYear();
    const dateString = 'freetube-subscriptions-' + dateYear + '-' + dateMonth + '-' + dateDay;

    // Open user file browser. User gives location of file to be created.
    dialog.showSaveDialog({
        defaultPath: dateString,
        filters: [{
            name: 'Database File',
            extensions: ['db']
        }, ]
    }, function (fileLocation) {
        console.log(fileLocation);
        if (typeof (fileLocation) === 'undefined') {
            console.log('Export Aborted');
            return;
        }
        fs.readFile(appDatabaseFile, function (readErr, data) {
            if (readErr) {
                throw readErr;
            }
            fs.writeFile(fileLocation, data, function (writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
                toast.show('Susbcriptions have been successfully exported');
            });
        })
    });
}

function _clearDB(db, callbacks = []) {
    db.remove({}, {
        multi: true
    }, function (err, numRemoved) {
        db.loadDatabase(function (err) {
            callbacks.forEach((f) => {
                f();
            });
        });
    });
}

export function clearDb(type) {
    switch (type) {
        case 'subscriptions':
            _clearDB(subDb, [subsApi.loadDisplaySubscriptions])
            break;
        case 'history':
            _clearDB(historyDb)
            break;
        case 'saved':
            _clearDB(savedVidsDb)
            break;
        default:
            toast.show('Unknown file: ' + type)
            return
    }

}


export default {
    initSettings,
    updateSettings,
    importOpmlSubs,
    importSubscriptions,
    exportSubscriptions,
    clearDb
}