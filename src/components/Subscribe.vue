<template>
  <h4 class="text-weight-medium no-margin">{{ $t("Stay up to date") }}</h4>
  <p class="no-margin font12 text-weight-light">
    {{ $t("subscribe to our newsletter") }}
  </p>

  <div class="input-inline-btn float-right q-mt-md">
    <q-toolbar class="bg-mygrey rounded-borders no-padding" style="min-height: auto">
      <q-input
        borderless
        color="dark"
        dense
        v-model="email_address"
        :label="$t('E-mail')"
        class="q-pl-sm"
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="warning"
            text-color="black"
            no-caps
            :label="$t('Subscribe')"
            class="rounded-borders-10"
            style="
              padding-left: 30px;
              padding-right: 30px;
              padding-top: 8px;
              padding-bottom: 8px;
            "
            @click="onSubmit"
            :loading="loading"
          />
        </template>
      </q-input>
    </q-toolbar>
  </div>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "Subscribe",
  data() {
    return {
      loading: false,
      email_address: "",
    };
  },
  methods: {
    onSubmit() {
      if (APIinterface.empty(this.email_address)) {
        APIinterface.notify(
          "negative",
          "Email address is required",
          "error_outline",
          this.$q
        );
      } else {
        this.loading = true;
        APIinterface.subscribeNews(this.email_address)
          .then((data) => {
            APIinterface.notify("positive", data.msg, "check_circle", this.$q);
            this.email_address = "";
          })
          .catch((error) => {
            APIinterface.notify("negative", error, "error_outline", this.$q);
          })
          .then((data) => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
