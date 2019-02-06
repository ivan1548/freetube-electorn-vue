<template>
  <div id="app">
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
import SideNav from "./components/Layout/SideNav";
import TopNav from "./components/Layout/TopNav";
import Loading from "./components/Layout/Loading";
import ConfirmDialog from "./components/Layout/ConfirmDialog";
import Toast from "./components/Layout/Toast";

export default {
  name: "freetube-electorn-vue",
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

<style>
/* CSS */
</style>
