<template>
  <div ref="google_target" class="fullwidth-child flex flex-center"></div>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { loadScript } from "vue-plugin-load-script";
// eslint-disable-next-line
import jwt_decode from "jwt-decode";

export default {
  name: "componentsGoogleLogin",
  props: [
    "title",
    "show_button",
    "client_id",
    "cookiepolicy",
    "verification",
    "scope",
    "redirect_to",
    "errors",
    "button_width",
  ],
  data() {
    return {
      social_strategy: "google",
      auth2: undefined,
    };
  },
  mounted() {
    this.includeLibrary();
  },
  methods: {
    includeLibrary() {
      loadScript("https://accounts.google.com/gsi/client")
        .then(() => {
          this.init();
        })
        .catch(() => {
          console.debug("failed loading script");
        });
    },
    init() {
      try {
        // eslint-disable-next-line
        google.accounts.id.initialize({
          client_id: this.client_id,
          callback: this.handleResponse,
        });

        // eslint-disable-next-line
        google.accounts.id.renderButton(this.$refs.google_target, {
          theme: "outline",
          shape: "pill",
          size: "large",
          width: this.button_width,
        });
      } catch (error) {
        APIinterface.notify("negative", error, "error_outline", this.$q);
      }
    },
    handleResponse(data) {
      const payload = jwt_decode(data.credential);
      const params = {
        id: payload.sub,
        email_address: payload.email,
        first_name: payload.given_name,
        last_name: payload.family_name,
        social_strategy: this.social_strategy,
        verification: this.verification,
        redirect_to: this.redirect_to,
        social_token: data.credential,
      };
      this.$emit("socialRegistration", params);
    },
  },
};
</script>
