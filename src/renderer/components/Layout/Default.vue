<template>
  <div>
    <loading></loading>
    <confirm-dialog></confirm-dialog>
    <toast></toast>
    <top-nav @side-nav-toggle="handleSideNavToggle" :sideNav="sideNav"></top-nav>
    <side-nav v-model="sideNav"></side-nav>
    <div id="main" v-bind:class="{ noSideNav: !sideNav }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import Loading from "./Loading";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

export default {
  name: "layout-default",
  components: { Loading, SideNav, TopNav, ConfirmDialog, Toast },
  data() {
    return {
      sideNav: true
    };
  },
  methods: {
    handleSideNavToggle(val) {
      this.sideNav = val;
    }
  }
};
</script>
