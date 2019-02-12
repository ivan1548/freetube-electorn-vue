import router from "../router";
import ft from "../helper/main";

export default function parseSearchText(query) {
  const input = query.replace(/freetubeelectornvue:\/\//, "");

  if (input === "") {
    return;
  }

  // The regex to get the video id from a YouTube link.  Thanks StackOverflow.
  const rx = /^.*(?:(?:(you|hook)tu\.?be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

  const match = input.match(rx);

  ft.log("Video ID: ", match);
  const urlSplit = input.split("/");
  if (match) {
    ft.log("Video found");

    router.push({
      name: "video-view",
      params: {
        id: match[2]
      }
    });
  } else if (urlSplit[3] === "channel") {
    ft.log("channel found");

    router.push({
      name: "channel-view",
      params: {
        id: urlSplit[4]
      }
    });
  } else if (urlSplit[3] === "user") {
    ft.log("user found");

    router.push({
      name: "channel-view",
      params: {
        id: urlSplit[4]
      }
    });
  } else {
    ft.log("Video not found");

    router.push({
      name: "search",
      params: {
        query: decodeURIComponent(input)
      }
    });
  }
}
