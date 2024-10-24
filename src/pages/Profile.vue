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
                <q-item-section avatar class="relative-position">
                  <q-avatar>
                    <q-img :src="avatar" fit="contain" />
                  </q-avatar>
                  <div class="absolute-bottom-right">
                    <q-btn
                      round
                      color="primary"
                      icon="photo_camera"
                      dense
                      size="sm"
                      unelevated
                      @click="upload_enabled = !upload_enabled"
                    />
                  </div>
                </q-item-section>

                <q-item-section class="q-pl-md">
                  <h5 class="text-weight-bold no-margin">{{ $t("Profile") }}</h5>
                  <q-item-label caption> {{ first_name }} {{ last_name }} </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-space class="q-mt-lg" />

              <q-form @submit="checkForm" class="q-pa-md">
                <q-uploader
                  v-if="upload_enabled"
                  :url="upload_api"
                  :label="$t('Upload files')"
                  :color="$q.dark.mode ? 'grey600' : 'warning'"
                  :text-color="$q.dark.mode ? 'grey300' : 'white'"
                  no-thumbnails
                  class="full-width q-mb-md"
                  flat
                  accept=".jpg, image/*"
                  bordered
                  :max-files="1"
                  auto-upload
                  max-total-size="1048576"
                  @rejected="onRejectedFiles"
                  :headers="[
                    { name: 'Authorization', value: `token ${this.getToken()}` },
                  ]"
                  field-name="file"
                  @uploaded="afterUploaded"
                />

                <q-input
                  v-model="first_name"
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  :label="$t('First name')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('This field is required'),
                  ]"
                />
                <q-input
                  v-model="last_name"
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  :label="$t('Last name')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('This field is required'),
                  ]"
                />
                <q-input
                  v-model="email_address"
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  :label="$t('Email')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('This field is required'),
                  ]"
                />
                <q-input
                  v-model="mobile_number"
                  :prefix="prefix"
                  mask="##################"
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  :label="$t('Mobile number')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('This field is required'),
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
                  :dense="$q.screen.lt.sm"
                  :loading="loading"
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

    <StepsVerification
      ref="steps_verification"
      :sent_message="sent_message"
      @after-verifycode="afterVerifycode"
    />
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import config from "src/api/config";

export default {
  name: "Profile",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    StepsVerification: defineAsyncComponent(() => import("components/StepsVerification")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      loading: false,
      first_name: "",
      last_name: "",
      email_address: "",
      mobile_number: "",
      prefix: "",
      avatar: "",
      original_email_address: "",
      original_mobile_number: "",
      sent_message: "",
      upload_enabled: false,
      upload_api: config.api_base_url + "/partnerapi/updateAvatar",
      filename: "",
      upload_path: "",
    };
  },
  mounted() {
    this.getCurrentProfile();
    this.getProfile();
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
    getToken() {
      return auth.getToken();
    },
    getCurrentProfile() {
      const $oldprofile = auth.getUser();
      if ($oldprofile) {
        this.original_email_address = $oldprofile.email_address;
        this.original_mobile_number = $oldprofile.contact_number;
      }
    },
    getProfile() {
      this.loading = true;
      APIinterface.getProfile()
        .then((data) => {
          this.first_name = data.details.first_name;
          this.last_name = data.details.last_name;
          this.email_address = data.details.email_address;
          this.mobile_number = data.details.mobile_number;
          this.prefix = data.details.mobile_prefix;
          this.avatar = data.details.avatar;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    checkForm() {
      let _change = false;
      if (this.email_address !== this.original_email_address) {
        _change = true;
      }
      const phone = this.prefix + this.mobile_number;
      if (phone !== this.original_mobile_number) {
        _change = true;
      }

      if (_change) {
        this.loading = true;
        APIinterface.RequestEmailCode()
          .then((data) => {
            this.sent_message = data.msg;
            this.show_modal = false;
            this.$refs.steps_verification.show_modal = true;
          })
          .catch((error) => {
            APIinterface.notify("negative", error, "error_outline", this.$q);
          })
          .then((data) => {
            this.loading = false;
          });
      } else {
        this.onSubmit("");
      }
    },
    onSubmit(code) {
      this.loading = true;
      const params = {
        code: code,
        first_name: this.first_name,
        last_name: this.last_name,
        email_address: this.email_address,
        mobile_number: this.mobile_number,
        mobile_prefix: this.prefix,
        featured_filename: this.filename,
        upload_path: this.upload_path,
      };
      APIinterface.saveProfile(params)
        .then((data) => {
          this.$refs.steps_verification.show_modal = false;
          auth.setUser(data.details);
          APIinterface.notify("positive", data.msg, "check_circle", this.$q);
          this.getCurrentProfile();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    afterVerifycode(code) {
      this.onSubmit(code);
    },
    afterUploaded(files) {
      const response = JSON.parse(files.xhr.responseText);
      if (response.code === 1) {
        this.avatar = response.details.url_image;
        this.filename = response.details.filename;
        this.upload_path = response.details.upload_path;
      } else {
        this.avatar = "";
        this.filename = "";
        this.upload_path = "";
        APIinterface.notify("dark", response.msg, "error", this.$q);
      }
    },
  },
};
</script>

<style lang="sass"></style>
