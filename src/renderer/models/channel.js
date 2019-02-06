import autolinker from 'autolinker'

class Channel {
    constructor(channelData) {

        this.channelId = channelData.authorId;
        this.thumbnail = channelData.authorThumbnails[4].url;
        if (channelData.authorBanners !== undefined) {
            this.banner = channelData.authorBanners[0].url;
        }
        if (channelData.authorThumbnails !== undefined) {
            this.icon = channelData.authorThumbnails[3].url
        }


        this.channelName = channelData.author;
        this.description = channelData.description;
        this.subscriberCount = channelData.subCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (channelData.videoCount !== undefined) {
            this.videoCount = channelData.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        this.isVideo = false;
        this.description = autolinker.link(channelData.description); //autolinker makes URLs clickable
    }
}

export default Channel;