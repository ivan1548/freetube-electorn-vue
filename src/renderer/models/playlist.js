import dateFormat from "dateformat";
class Playlist {
    constructor(playListData) {

        this.isPlaylist = true;
        this.isVideo = false;
        this.thumbnail = playListData.videos[0].videoThumbnails[4].url;
        this.channelName = playListData.author;
        this.channelId = playListData.authorId;
        this.id = playListData.playlistId;
        this.description = playListData.videos[0].title + "\r\n" + playListData.videos[1].title;
        this.title = playListData.title;
        this.videoCount = playListData.videoCount;
        if (playListData.authorThumbnails !== undefined) {
            this.channelThumbnail = playListData.authorThumbnails[3].url;
        }
        if (playListData.viewCount !== undefined) {
            this.viewCount = playListData.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        this.description = playListData.descriptionHtml;

        if (playListData.updated !== undefined) {
            let dateString = new Date(playListData.updated * 1000);
            dateString.setDate(dateString.getDate() + 1);
            this.lastUpdated = dateFormat(dateString, "mmm dS, yyyy");
        }


        if (this.channelName == 'YouTube' && this.title.includes('Mix')) {
            // Hide Mix playlists.
            return;
        }
    }
}

export default Playlist;