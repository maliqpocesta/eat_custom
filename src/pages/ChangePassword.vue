<template>
  <q-page padding>
    <StickyBack url="/account/menu" label="Back" v-if="isMobile" />
    <LocationNav v-else />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row">
          <!-- left -->
          <div v-if="!isMobile" class="col-md-4 col-sm-4 col-xs-12">
            <AccountNav></AccountNav>
          </div>
          <!-- left -->

          <!-- right -->
          <div class="col-md-8 col-sm-8 col-xs-12">
            <q-card flat class="fit">
              <q-item>
                <q-item-section>
                  <h5 class="text-weight-bold">{{ $t("Change password") }}</h5>
                  <p class="no-margin font12 text-weight-thin">
                    {{ $t("You can change your password here") }}
                  </p>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-space class="q-mt-lg" />

              <q-form @submit="onSubmit" class="q-pa-md">
                <q-input
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  v-model="old_password"
                  :label="$t('Old password')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('this field is required'),
                  ]"
                />
                <q-input
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  v-model="new_password"
                  :label="$t('New password')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('this field is required'),
                  ]"
                />
                <q-input
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  v-model="confirm_password"
                  :label="$t('Confirm password')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('this field is required'),
                  ]"
                />

                <q-btn
                  type="submit"
                  unelevated
                  rounded
                  color="warning"
                  text-color="black"
                  no-caps
                  class="full-width"
                  :label="$t('Save')"
                  size="17px"
                  :loading="loading"
                  :dense="$q.screen.lt.sm"
                >
                </q-btn>
              </q-form>
            </q-card>
          </div>
          <!-- right -->
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "ChangePassword",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      loading: false,
      old_password: "",
      new_password: "",
      confirm_password: "",
    };
  },
  computed: {
    isMobile() {
      if (this.$q.screen.lt.md) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    onSubmit() {
      const params = {
        old_password: this.old_password,
        new_password: this.new_password,
        confirm_password: this.confirm_password,
      };
      this.loading = true;
      APIinterface.updatePassword(params)
        .then((data) => {
          APIinterface.notify("positive", data.msg, "check_circle", this.$q);
          this.onReset();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    onReset() {
      this.old_password.value = "";
      this.new_password.value = "";
      this.confirm_password.value = "";
    },
  },
};
</script>

<style lang="sass"></style>
