<template>
  <div v-if="seen">
    <div id="confirmFunction">
      <span id="confirmMessage">{{message}}</span>
      <div class="confirmButton" id="confirmYes" @click="confirm">Yes</div>
      <div class="confirmButton" id="confirmNo" @click="hideConfirmDialog">No</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "confirm-dialog",
  components: {},
  data() {
    return {};
  },
  methods: {
    confirm() {
      if (this.params) {
        this.callback(...this.params);
        this.hideConfirmDialog();
      } else {
        this.callback();
      }
    },
    ...mapActions(["hideConfirmDialog"])
  },
  computed: {
    seen() {
      return this.$store.state.ConfirmDialog.seen;
    },
    message() {
      return this.$store.state.ConfirmDialog.message;
    },
    callback() {
      return this.$store.state.ConfirmDialog.callback;
    },
    params() {
      return this.$store.state.ConfirmDialog.params;
    }
  }
};
</script>