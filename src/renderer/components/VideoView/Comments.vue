<template>
  <div>
    <div v-for="(item, index) in items" v-bind:key="index">
      <div class="user-comment">
        <div @click="goToChannel(item.authorId)" style="float:left;margin-right: 1em; width:48px">
          <img class="user-icon" :src="item.authorThumbnail" alt>
        </div>
        <div class="comment-data">
          <p
            @click="goToChannel(item.authorId)"
            style="cursor: pointer; margin-left: 65px; font-weight: bold;"
          >{{item.author}}</p>
          <p
            style="margin-bottom: 0; margin-left: 65px; word-break: break-word;"
          >{{item.authorComment}}</p>
          <p style="font-size:80%; padding: 0; margin-left: 65px;">{{item.tempublished}}</p>
        </div>
      </div>
      <br>
      <hr>
    </div>
  </div>
</template>

<script>
import { invidiousAPI } from "../../helper/youtubeApi";
import Comment from "../../models/comment";
export default {
  name: "comments",
  components: {},
  data() {
    return {
      items: []
    };
  },
  props: {
    videoId: String
  },
  mounted() {
    this.loadComments();
  },
  methods: {
    loadComments() {
      invidiousAPI("comments", this.videoId, {}, data => {
        console.log(data);

        let comments = [];

        data.comments.forEach(object => {
          comments.push(new Comment(object));
        });

        this.items = comments;
      });
    },
    goToChannel(channelId) {
      this.$router.push({
        name: "channel-view",
        params: { id: channelId }
      });
    }
  }
};
</script>