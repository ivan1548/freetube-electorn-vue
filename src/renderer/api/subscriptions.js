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

/*
 * File for all functions related to subscriptions.
 */

import { subDb } from "../helper/db";
import ft from "../helper/main";
import store from "../store";
import toast from "./toast";
import { invidiousAPI } from "../helper/youtubeApi";

/**
 * Add a channel to the user's subscription database.
 *
 * @param {string} channelId - The channel ID to add to the subscriptions database.
 *
 * @return {Void}
 */
export function addSubscription(channelId, useToast = true) {
  ft.log("Channel ID: ", channelId);

  invidiousAPI("channels", channelId, {}, data => {
    const channelName = data.author;
    const thumbnail = data.authorThumbnails[3].url;

    const channel = {
      channelId: data.authorId,
      channelName: channelName,
      channelThumbnail: thumbnail
    };

    // Refresh the list of subscriptions on the side navigation bar.
    subDb.insert(channel, (err, newDoc) => {
      if (useToast) {
        toast.show("Added " + channelName + " to subscriptions.");
        loadDisplaySubscriptions();
        loadSubscriptions();
      }
    });
  });
}

/**
 * Remove a channel from the subscriptions database.
 *
 * @param {string} channelId - The channel ID to be removed.
 *
 * @return {Void}
 */
export function removeSubscription(channelId) {
  subDb.remove(
    {
      channelId: channelId
    },
    {},
    (err, numRemoved) => {
      // Refresh the list of subscriptions on the side navigation bar.
      loadDisplaySubscriptions();
      loadSubscriptions();
      toast.show("Removed channel from subscriptions.");
    }
  );
}

/**
 * Adds / Removes a subscription based on if the channel is in the database or not.
 * @param {string} channelId - The channel ID to check
 *
 * @return {Void}
 */
export function toggleSubscription(channelId) {
  const checkIfSubscribed = isSubscribed(channelId);

  checkIfSubscribed.then(results => {
    if (results === false) {
      addSubscription(channelId);
    } else {
      removeSubscription(channelId);
    }
  });
}

/**
 * Get the list of subscriptions from the user's subscription database.
 *
 * @return {promise} The list of subscriptions.
 */
function returnSubscriptions() {
  return new Promise((resolve, reject) => {
    subDb.find({}, (err, subs) => {
      resolve(subs);
    });
  });
}

/**
 * Load the recent uploads of the user's subscriptions.
 *
 * @return {promise}
 */
export function loadSubscriptions() {
  store.dispatch("setSubscriptions", []);

  const subscriptions = returnSubscriptions();

  return subscriptions.then(results => {
    if (results.length > 0) {
      let channels = results.map(channel => {
        return new Promise((resolve, reject) => {
          invidiousAPI("channels/videos", channel.channelId, {}, data => {
            resolve(data);
          });
        });
      });

      return Promise.all(channels).then(function(result) {
        const sorted = [].concat.apply([], result).sort((a, b) => {
          return b.published - a.published;
        });

        store.dispatch("setSubscriptions", sorted);

        return sorted;
      });
    } else {
      return results;
    }
  });
}

/**
 * Check if the user is subscribed to a channel or not.
 *
 * @param {string} channelId - The channel ID to check
 *
 * @return {promise} - A boolean value if the channel is currently subscribed or not.
 */
export function isSubscribed(channelId) {
  return new Promise((resolve, reject) => {
    subDb.findOne(
      {
        channelId: channelId
      },
      (err, doc) => {
        resolve(!!doc);
      }
    );
  });
}

export function loadDisplaySubscriptions() {
  // Sort alphabetically
  subDb
    .find({})
    .sort({
      channelName: 1
    })
    .exec((err, subs) => {
      store.dispatch("setDisplaySubscriptions", subs);
    });
}

export default {
  addSubscription,
  removeSubscription,
  toggleSubscription,
  loadSubscriptions,
  isSubscribed,
  loadDisplaySubscriptions
};
