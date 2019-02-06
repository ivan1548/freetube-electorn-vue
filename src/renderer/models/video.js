class Video {
    constructor(videoData) {
        this.id = videoData.videoId;
        this.youtubeUrl = 'https://youtube.com/watch?v=' + videoData.videoId;
        this.invidiousUrl = 'https://invidio.us/watch?v=' + videoData.videoId;
        this.thumbnail = videoData.videoThumbnails[4].url;
        this.title = videoData.title;
        this.channelName = videoData.author;
        this.channelId = videoData.authorId;
        this.description = videoData.description;
        if (videoData.viewCount !== undefined) {
            this.views = videoData.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        this.viewCount = videoData.viewCountText;
        let time = videoData.lengthSeconds;

        if (videoData.liveNow === true || time < 0) {
            this.liveText = 'LIVE NOW';
            this.duration = '';
            this.publishedDate = '';
            this.viewText = 'watching';
        } else {
            let now = Date.now();
            this.liveText = '';

            if (this.views <= 1) {
                this.viewText = 'view';
            } else {
                this.viewText = 'views';
            }

            let published = new Date(videoData.published * 1000);
            let hours = 0;

            if (now < published.getTime()) {
                this.publishedDate = 'Premieres on ' + published.toLocaleString();
            } else {
                if (time >= 3600) {
                    hours = Math.floor(time / 3600);
                    time = time - hours * 3600;
                }

                let minutes = Math.floor(time / 60);
                let seconds = time - minutes * 60;

                if (seconds < 10) {
                    seconds = '0' + seconds;
                }

                if (minutes < 10 && hours > 0) {
                    minutes = '0' + minutes;
                }

                if (hours > 0) {
                    this.duration = hours + ":" + minutes + ":" + seconds;
                } else {
                    this.duration = minutes + ":" + seconds;
                }

                this.publishedDate = videoData.publishedText;
            }
        }
    }
}

export default Video;