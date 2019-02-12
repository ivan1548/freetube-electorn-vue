<template>
  <div v-if="value" id="sideNav">
    <div class="sideNavContainer">
      <ul>
        <li @click="goTo('/subscriptions')">
          <i class="fas fa-rss"></i>&nbsp;&nbsp;Subscriptions
        </li>
        <li @click="goTo('/trending')">
          <i class="fas fa-fire"></i>&nbsp;&nbsp;Trending
        </li>
        <li @click="goTo('/most-popular')">
          <i class="fas fa-users"></i>&nbsp;&nbsp;Most Popular
        </li>
        <li @click="goTo('/saved-videos')">
          <i class="fas fa-star"></i>&nbsp;&nbsp;Favorites
        </li>
        <li @click="goTo('/history')">
          <i class="fas fa-history"></i>&nbsp;&nbsp;History
        </li>
      </ul>
      <hr>
      <ul>
        <li @click="goTo('/settings')">
          <i class="fas fa-sliders-h"></i>&nbsp;&nbsp;Settings
        </li>
        <li @click="goTo('/about')">
          <i class="fas fa-info-circle"></i>&nbsp;&nbsp;About
        </li>
      </ul>
      <hr>
      <subscriptions></subscriptions>
    </div>
  </div>
</template>

<script>
import { truncate } from "fs";
import Subscriptions from "./Subscriptions";

export default {
  name: "side-nav",
  components: { Subscriptions },
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    }
  }
};
</script>