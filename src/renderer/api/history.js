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
import store from "../store";
import { historyDb } from "../helper/db";
import { invidiousAPI } from "../helper/youtubeApi";
import toast from "./toast";

export function loadHistory() {
  historyDb
    .find({})
    .sort({
      timeWatched: -1
    })
    .exec((_err, docs) => {
      docs.forEach((video, index) => {
        invidiousAPI("videos", video.videoId, {}, data => {
          // eslint-disable-next-line no-param-reassign
          data.index = index;
          store.dispatch("addVideoToHistory", data);
        });
      });
    });
}

/*
 * File used for functions related to video history.
 */

/**
 * Add a video to the history database file
 *
 * @param {Object} video - The video Object to be saved.
 *
 * @return {Void}
 */
export function addToHistory(video) {
  const data = {
    videoId: video.videoId,
    timeWatched: new Date().getTime()
  };
  historyDb.insert(data, () => {
    store.dispatch("addVideoToHistory", video);
  });
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
    videoId
  };
  historyDb.remove(data, {}, err => {
    if (!err) {
      store.dispatch("removeVideoFromHistory", videoId);
      toast.show("Video removed from history");
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
  return new Promise((resolve, _reject) => {
    historyDb.findOne(
      {
        videoId
      },
      (err, doc) => {
        resolve(!!doc);
      }
    );
  });
}

export default {
  loadHistory,
  addToHistory,
  removeFromHistory,
  isInHistory
};
