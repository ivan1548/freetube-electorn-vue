<template>
  <div class="center">
    <img src="~@/assets/icons/logoColor.png" width="500px;">
    <h1>{{ versionNumber }} Beta</h1>
    <h3>
      <i class="fas fa-envelope"></i>&nbsp;&nbsp;FreeTubeApp@protonmail.com
    </h3>
    <h2>
      This software is FOSS and released under the
      <a
        href="https://www.gnu.org/licenses/quick-guide-gplv3.html"
      >GNU Public License v3+</a>.
    </h2>
    <p>
      Found a bug? Want to suggest a feature? Want to help out? Check out our
      <a
        href="https://github.com/FreeTubeApp/FreeTube"
      >GitHub</a> page. Pull requests are welcome.
    </p>
    <p>
      Thank you very much to the
      <a
        href="https://github.com/FreeTubeApp/FreeTube/wiki/Credits"
      >People and Projects</a> that make FreeTube possible!
    </p>
    <p>
      Want to chat? Join our
      <a
        href="https://riot.im/app/#/room/#freetube:matrix.org"
      >Riot / Matrix Server</a>. Please check the
      <a
        href="https://github.com/FreeTubeApp/FreeTube/wiki/Matrix-Server-Info-&-Rules"
      >rules</a> before joining.
    </p>
    <p>
      Looking for help? Check out our
      <a href="https://github.com/FreeTubeApp/FreeTube/wiki">Wiki</a> page.
    </p>
    <p>
      Check out our
      <a
        href="https://addons.mozilla.org/en-US/firefox/addon/freetube-redirect/"
      >Firefox</a> extension!
    </p>
  </div>
</template>

<script>
const { app } = require("electron").remote;

export default {
  name: "about",
  components: {},
  data() {
    return {
      versionNumber: app.getVersion()
    };
  },

  methods: {}
};
</script>