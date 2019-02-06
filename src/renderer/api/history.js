/*
    This file is part of FreeTube.

    FreeTube is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    FreeTube is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with FreeTube.  If not, see <http://www.gnu.org/licenses/>.
*/

import {
    historyDb
} from '../helper/db'

import toast from './toast'

/*
 * File used for functions related to video history.
 */

/**
 * Add a video to the history database file
 *
 * @param {string} videoId - The video ID of the video to be saved.
 *
 * @return {Void}
 */
export function addToHistory(videoId) {
    const data = {
        videoId: videoId,
        timeWatched: new Date().getTime(),
    };
    historyDb.insert(data, (err, newDoc) => {});
}

/**
 * Remove a video from the history database file
 *
 * @param {string} videoId - The video ID of the video to be removed.
 *
 * @return {Void}
 */
export function removeFromHistory(videoId) {
    const data = {
        videoId: videoId
    };
    historyDb.remove(data, {}, (err, numRemoved) => {
        if (!err) {
            toast.show('Video removed from history')
        }
    });
}

/**
 * Checks if a video was saved in the user's history video database
 *
 * @param {string} videoId - The video ID to check
 *
 * @return {promise} - A boolean value if the video was found or not.
 */
export function isInHistory(videoId) {
    return new Promise((resolve, reject) => {
        historyDb.findOne({
            videoId: videoId
        }, (err, doc) => {
            resolve(!!doc)
        });
    });
}

export default {
    addToHistory,
    removeFromHistory,
    isInHistory
}