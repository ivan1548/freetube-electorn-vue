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
    savedVidsDb
} from '../helper/db'

import toast from './toast'

/*
 * File used for functions related to saving videos
 */

/**
 * Adds a video to the user's saved video database.
 *
 * @param {string} videoId - The video ID of the video that will be saved.
 *
 * @return {Void}
 */
export function addSavedVideo(videoId) {
    let checkIfSaved = videoIsSaved(videoId);

    checkIfSaved.then((saved) => {
        if (saved === false) {
            let data = {
                videoId: videoId,
                timeSaved: new Date().getTime(),
            };

            savedVidsDb.insert(data, (err, newDoc) => {
                toast.show('The video has been favorited!')
            });
        } else {
            toast.show('The video has already been favorited!')
        }
    });
}

/**
 * Removes a video from the user's saved video database.
 *
 * @param {string} videoId - The video ID of the video that will be removed.
 *
 * @return {Void}
 */
export function removeSavedVideo(videoId, string) {
    savedVidsDb.remove({
        videoId: videoId
    }, {}, (err, numRemoved) => {
        toast.show('Video has been removed from the favorites list.')
    });
}

/**
 * Toggles the save video button styling and saved / remove a video based on the current status.
 *
 * @param {string} videoId - The video ID to toggle between.
 *
 * @return {Void}
 */
export function toggleSavedVideo(videoId) {
    event.stopPropagation();

    const checkIfSaved = videoIsSaved(videoId);

    checkIfSaved.then((results) => {
        if (results === false) {
            addSavedVideo(videoId);
        } else {
            removeSavedVideo(videoId);
        }
    });
}

/**
 * Checks if a video was saved in the user's saved video database
 *
 * @param {string} videoId - The video ID to check
 *
 * @return {promise} - A boolean value if the video was found or not.
 */
export function videoIsSaved(videoId) {
    return new Promise((resolve, reject) => {
        savedVidsDb.findOne({
            videoId: videoId
        }, (err, doc) => {
            resolve(!!doc)
        });
    });
}

export default {
    addSavedVideo,
    removeSavedVideo,
    toggleSavedVideo,
    videoIsSaved
}