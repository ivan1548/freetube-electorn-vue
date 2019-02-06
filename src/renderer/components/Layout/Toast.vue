<template>
  <div v-if="seen" id="toast">
    <span id="toastMessage">{{message}}</span>
    <i @click="hideToast" class="closeToast fas fa-times"></i>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "toast",
  components: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions(["hideToast"])
  },
  computed: {
    seen() {
      return this.$store.state.Toast.seen;
    },
    message() {
      return this.$store.state.Toast.message;
    }
  }
};
</script>