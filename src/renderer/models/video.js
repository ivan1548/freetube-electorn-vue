/* eslint-disable no-underscore-dangle */
import dateFormat from "dateformat";

class Video {
  constructor(videoData) {
    this.id = videoData.videoId;
    this.youtubeUrl = `https://youtube.com/watch?v=${videoData.videoId}`;
    this.invidiousUrl = `https://invidio.us/watch?v=${videoData.videoId}`;
    this.thumbnail = videoData.videoThumbnails[4].url;
    this.title = videoData.title;
    this.description = videoData.description;

    this._setViews(videoData);
    this.viewCount = videoData.viewCountText;
    this._setLiveText(videoData);
    this._setDuration(videoData);
    this._setPublishedDate(videoData);
    this._setViewText(videoData);
    this.likes = videoData.likeCount;
    this.dislikes = videoData.dislikeCount;
    this.captions = videoData.captions;

    this.formatStreams = videoData.formatStreams;
    this.adaptiveFormats = videoData.adaptiveFormats;

    this.channelName = videoData.author;
    this.channelId = videoData.authorId;
    this._setChannelIcon(videoData);
  }

  _setDescriptionHtml(videoData) {
    let descriptionText = videoData.descriptionHtml;
    descriptionText = descriptionText.replace(/target="_blank"/g, "");
    descriptionText = descriptionText.replace(/\/redirect.+?(?=q=)/g, "");
    descriptionText = descriptionText.replace(/q=/g, "");
    descriptionText = descriptionText.replace(/rel="nofollow\snoopener"/g, "");
    descriptionText = descriptionText.replace(/class=.+?(?=")./g, "");
    descriptionText = descriptionText.replace(/id=.+?(?=")./g, "");
    descriptionText = descriptionText.replace(
      /data-target-new-window=.+?(?=")./g,
      ""
    );
    descriptionText = descriptionText.replace(/data-url=.+?(?=")./g, "");
    descriptionText = descriptionText.replace(
      /data-sessionlink=.+?(?=")./g,
      ""
    );
    descriptionText = descriptionText.replace(/&amp;/g, "&");
    descriptionText = descriptionText.replace(/%3A/g, ":");
    descriptionText = descriptionText.replace(/%2F/g, "/");
    descriptionText = descriptionText.replace(/&v.+?(?=")/g, "");
    descriptionText = descriptionText.replace(/&redirect-token.+?(?=")/g, "");
    descriptionText = descriptionText.replace(/&redir_token.+?(?=")/g, "");
    descriptionText = descriptionText.replace(
      /href="http(s)?:\/\/youtube\.com/g,
      'href="freetube://https://youtube.com'
    );
    descriptionText = descriptionText.replace(
      /href="\/watch/g,
      'href="freetube://https://youtube.com'
    );
    descriptionText = descriptionText.replace(
      /href="\/results\?search_query=/g,
      'href="freetube://'
    );
    descriptionText = descriptionText.replace(
      /yt\.www\.watch\.player\.seekTo/g,
      "changeDuration"
    );

    this.descriptionHtml = descriptionText;
  }

  _setViews(videoData) {
    if (typeof videoData.viewCount !== "undefined") {
      this.views = videoData.viewCount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  _setLiveText(videoData) {
    if (videoData.liveNow === true || videoData.lengthSeconds < 0) {
      this.liveText = "LIVE NOW";
    } else {
      this.liveText = "";
    }
  }

  _setDuration(videoData) {
    let time = videoData.lengthSeconds;
    if (videoData.liveNow === true || time < 0) {
      this.duration = "";
    } else {
      const now = Date.now();
      const published = new Date(videoData.published * 1000);
      let hours = 0;

      if (now > published.getTime()) {
        if (time >= 3600) {
          hours = Math.floor(time / 3600);
          time -= hours * 3600;
        }

        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;

        if (seconds < 10) {
          seconds = `0${seconds}`;
        }

        if (minutes < 10 && hours > 0) {
          minutes = `0${minutes}`;
        }

        if (hours > 0) {
          this.duration = `${hours}:${minutes}:${seconds}`;
        } else {
          this.duration = `${minutes}:${seconds}`;
        }
      }
    }
  }

  _setPublishedDate(videoData) {
    if (videoData.liveNow === true || videoData.lengthSeconds < 0) {
      this.publishedDate = "";
    } else {
      const now = Date.now();
      const published = new Date(videoData.published * 1000);
      // Format the date to a more readable format.
      // const dateString = new Date(videoData.published * 1000);
      // dateString.setDate(dateString.getDate() + 1);
      // this.publishedDate = dateFormat(dateString, "mmm dS, yyyy");

      if (now < published.getTime()) {
        this.publishedDate = `Premieres on ${dateFormat(
          published,
          "mmm dS, yyyy"
        )}`;
      } else {
        this.publishedDate = videoData.publishedText;
      }
    }
  }

  _setViewText(videoData) {
    if (videoData.liveNow === true || videoData.lengthSeconds < 0) {
      this.viewText = "watching";
    } else if (this.views <= 1) {
      this.viewText = "view";
    } else {
      this.viewText = "views";
    }
  }

  _setChannelIcon(videoData) {
    if (typeof videoData.authorThumbnails !== "undefined") {
      this.channelIcon = videoData.authorThumbnails[2].url;
    }
  }
}

export default Video;
