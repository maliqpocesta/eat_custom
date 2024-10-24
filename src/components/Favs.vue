<template>
  <template v-if="active">
    <q-btn
      @click="addTofav()"
      round
      color="warning"
      text-color="white"
      size="sm"
      icon="favorite_border"
      class="btn-icon"
      :loading="loading"
    />
  </template>
  <template v-else>
    <q-btn
      @click="addTofav()"
      round
      color="white"
      text-color="warning"
      size="sm"
      icon="favorite_border"
      class="btn-icon"
      :loading="loading"
    />
  </template>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";

export default {
  name: "Favs",
  props: ["item_token", "cat_id", "active"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    addTofav() {
      /* eslint-disable */
      if (auth.authenticated()) {
        this.loading = true;
        APIinterface.addTofav(this.item_token, this.cat_id)
          .then((data) => {
            this.$emit("afterSavefav", data.details.found);
          })
          .catch((error) => {
            APIinterface.notify("negative", error, "error_outline", this.$q);
          })
          .then((data) => {
            this.loading = false;
          });
      } else {
        APIinterface.notify(
          "negative",
          this.$t("You need to login to save this to your favorites items"),
          "error_outline",
          this.$q
        );
      }
    },
  },
};
</script>
