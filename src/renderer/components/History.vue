<template>
  <div>
    <div>
      <h2 style="margin-left: 15px;">{{ title }}</h2>
      <hr>
    </div>
    <list :items="items"></list>
  </div>
</template>

<script>
import { historyDb } from "../helper/db";
import { invidiousAPI } from "../helper/youtubeApi";
import { mapActions } from "vuex";
import List from "./List";

export default {
  name: "history",
  components: { List },
  data() {
    return {
      title: "Video History",
      items: []
    };
  },
  mounted() {
    this.getVideos();
  },
  methods: {
    getVideos() {
      this.showLoading();

      historyDb
        .find({})
        .sort({
          timeWatched: -1
        })
        .exec((err, docs) => {
          let videoList = [];
          let requests = docs.reduce((promiseChain, video, index) => {
            return promiseChain.then(
              () =>
                new Promise(resolve => {
                  invidiousAPI("videos", video.videoId, {}, data => {
                    videoList.splice(index, 0, data);
                    resolve();
                  });
                })
            );
          }, Promise.resolve());
          requests.then(() => {
            this.items = videoList;
            this.hideLoading();
          });
        });
    },
    ...mapActions(["showLoading", "hideLoading"])
  }
};
</script>