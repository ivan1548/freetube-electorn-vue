class Player {
    constructor(videoId) {

        this.isPlaylist = true;
        this.isVideo = false;
        this.thumbnail = playListData.videos[0].videoThumbnails[4].url;
        this.channelName = playListData.author;
        this.channelId = playListData.authorId;
        this.id = playListData.playlistId;
        this.description = playListData.videos[0].title + "\r\n" + playListData.videos[1].title;
        this.title = playListData.title;
        this.videoCount = playListData.videoCount;

        if (this.channelName == 'YouTube' && this.title.includes('Mix')) {
            // Hide Mix playlists.
            return;
        }
    }
}

export default Playlist;