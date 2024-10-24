<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <q-card flat v-if="page_ready">
          <q-card-section>
            <q-form @submit="onSubmit" autocomplete="off">
              <div class="text-center q-mb-md">
                <h4 class="no-margin text-weight-bold q-pb-sm">
                  {{ $t("Guest information") }}
                </h4>
                <p class="text-weight-thin">
                  {{ $t("Join the experience, become our guest today!") }}
                </p>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <q-input
                    v-model="first_name"
                    :label="$t('First name')"
                    stack-label
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || this.$t('This field is required'),
                    ]"
                    bg-color="mygrey"
                    color="warning"
                    outlined
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <q-input
                    v-model="last_name"
                    :label="$t('Last name')"
                    stack-label
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || this.$t('This field is required'),
                    ]"
                    bg-color="mygrey"
                    color="warning"
                    outlined
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="mobile_number"
                    :label="$t('Mobile number')"
                    stack-label
                    :prefix="SettingsStore.settings_data.phone_data.phonecode"
                    mask="##################"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                      (val) => val.length <= 15 || $t('Please use maximum 15 characters'),
                    ]"
                    bg-color="mygrey"
                    color="warning"
                    outlined
                  />
                </div>
              </div>

              <div class="q-mb-md">
                <div class="flex flex-center q-gutter-x-md items-center">
                  <div>
                    <h4 class="q-ma-none q-pa-none text-weight-bold q-pb-sm">
                      {{ $t("Create Account") }}
                    </h4>
                  </div>
                  <div>(Optional)</div>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12">
                  <q-input
                    v-model="email_address"
                    :label="$t('Email address')"
                    stack-label
                    autocomplete="off"
                    bg-color="mygrey"
                    color="warning"
                    outlined
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <q-input
                    v-model="password"
                    :type="field_type"
                    :label="$t('Password')"
                    stack-label
                    autocomplete="off"
                    bg-color="mygrey"
                    color="warning"
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon
                        @click="
                          this.field_type =
                            this.field_type == 'password' ? 'text' : 'password'
                        "
                        :name="password_icon"
                        color="grey"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <q-input
                    v-model="cpassword"
                    :type="field_type"
                    :label="$t('Confirm password')"
                    stack-label
                    bg-color="mygrey"
                    color="warning"
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon
                        @click="
                          this.field_type =
                            this.field_type == 'password' ? 'text' : 'password'
                        "
                        :name="password_icon"
                        color="grey"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="q-mb-md" v-if="SettingsStore.settings_data.captcha_enabled">
                <componentsRecaptcha
                  ref="recapcha"
                  :sitekey="SettingsStore.settings_data.captcha_site_key"
                  :is_enabled="SettingsStore.settings_data.captcha_enabled"
                  :language_code="SettingsStore.settings_data.captcha_lang"
                  size="normal"
                  theme="light"
                  :tabindex="0"
                  @verify="recaptchaVerified"
                  @expire="recaptchaExpired"
                  @fail="recaptchaFailed"
                />
              </div>

              <template v-if="SettingsStore.settings_data.signup_enabled_terms">
                <div
                  class="text-caption q-pb-md"
                  v-html="SettingsStore.settings_data.signup_terms"
                ></div>
              </template>
              <template v-else>
                <q-space class="q-pa-md"></q-space>
              </template>

              <q-btn
                type="submit"
                unelevated
                rounded
                color="warning"
                text-color="black"
                no-caps
                class="full-width"
                :label="$t('Continue')"
                size="lg"
                :loading="loading"
                :dense="$q.screen.lt.sm"
              >
              </q-btn>

              <!-- // -->
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "GuestSignup",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    componentsRecaptcha: defineAsyncComponent(() =>
      import("components/componentsRecaptcha")
    ),
    componentsRecaptcha: defineAsyncComponent(() =>
      import("components/componentsRecaptcha")
    ),
  },
  data() {
    return {
      loading: false,
      first_name: "",
      last_name: "",
      email_address: "",
      mobile_number: "",
      mobile_prefix: "",
      password: "",
      cpassword: "",
      field_type: "password",
      password_icon: "las la-low-vision",
      recaptcha_response: "",
      page_ready: false,
    };
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.page_ready = true;
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.page_ready = true;
        }
      );
    }
  },
  methods: {
    recaptchaVerified(response) {
      this.recaptcha_response = response;
    },
    recaptchaExpired() {
      if (this.SettingsStore.settings_data.captcha_enabled) {
        if (this.$refs.recapcha) {
          this.$refs.recapcha.reset();
        }
      }
    },
    recaptchaFailed() {},
    onSubmit() {
      this.loading = true;
      APIinterface.fetchDataPost("registerGuest", {
        first_name: this.first_name,
        last_name: this.last_name,
        email_address: this.email_address,
        mobile_prefix: this.SettingsStore.settings_data.phone_data.phonecode,
        mobile_number: this.mobile_number,
        password: this.password,
        cpassword: this.cpassword,
        recaptcha_response: this.recaptcha_response,
      })
        .then((data) => {
          if (data.details.verify === true) {
            this.$router.push({
              path: "/account/verify",
              query: { uuid: data.details.uuid, msg: data.msg },
            });
          } else {
            auth.setUser(data.details.user_data);
            auth.setToken(data.details.user_token);
            this.$router.push("/home");
          }
        })
        .catch((error) => {
          this.recaptchaExpired();
          APIinterface.notify("dark", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
