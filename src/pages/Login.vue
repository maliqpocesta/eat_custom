<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <q-card flat class="w-75" style="margin: auto">
          <q-card-section>
            <div class="text-center q-mb-md">
              <h4 class="no-margin text-weight-bold q-pb-sm">{{ $t("Sign In") }}</h4>
              <p class="text-weight-thin">{{ $t("Sign in to your account") }}.</p>
            </div>

            <div class="w-75 margin-auto">
              <q-form @submit="onSubmit">
                <div class="q-mb-xs">
                  <q-input
                    bg-color="mygrey"
                    color="warning"
                    outlined
                    v-model="username"
                    :label="$t('Mobile number or email')"
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                  />
                </div>

                <div class="q-mb-xs">
                  <q-input
                    bg-color="mygrey"
                    color="warning"
                    :type="password_type.type"
                    outlined
                    v-model="password"
                    :label="$t('Password')"
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="password_type.icon"
                        @click="changeFieldType"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="q-mb-lg">
                  <q-btn
                    flat
                    :ripple="false"
                    text-color="negative"
                    no-caps
                    class="full-width no-hover text-weight-bold"
                    dense
                    to="/forgotpassword"
                  >
                    <u>{{ $t("Forgot your password") }}?</u>
                  </q-btn>
                </div>

                <template v-if="!SettingsStore.loading_settings">
                  <div class="q-mb-md">
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
                </template>

                <div class="q-mb-lg">
                  <q-btn
                    type="submit"
                    unelevated
                    rounded
                    color="warning"
                    text-color="black"
                    no-caps
                    class="full-width"
                    :label="$t('Sign in')"
                    size="lg"
                    :loading="loading"
                    :dense="$q.screen.lt.sm"
                  >
                  </q-btn>
                </div>
              </q-form>

              <div class="text-center q-mb-md">
                <p class="no-margin">{{ $t("Don't have an account") }}?</p>
                <q-btn
                  flat
                  :ripple="false"
                  text-color="negative"
                  no-caps
                  class="full-width no-hover text-weight-bold"
                  :label="$t('Sign up')"
                  dense
                  to="/signup"
                >
                </q-btn>
              </div>

              <template v-if="SettingsStore.settings_data.enabled_guest">
                <q-btn
                  color="grey-2"
                  text-color="grey-5"
                  no-caps
                  class="q-mb-lg fit"
                  :label="$t('Continue as guest')"
                  to="/guest"
                  rounded
                  unelevated
                  size="lg"
                >
                </q-btn>
              </template>

              <template v-if="!SettingsStore.loading_settings">
                <div
                  class="q-mb-lg"
                  v-if="SettingsStore.settings_data.social_settings.fb_flag == 1"
                >
                  <componentsFacebook
                    ref="facebook"
                    :title="$t('Login with Facebook')"
                    :app_id="SettingsStore.settings_data.social_settings.fb_app_id"
                    :verification="
                      SettingsStore.settings_data.social_settings.enabled_verification
                    "
                    :button_width="250"
                    version="v13.0"
                    @social-registration="socialRegistration"
                    :errors="{
                      user_cancelled: $t(
                        'User cancelled login or did not fully authorize.'
                      ),
                    }"
                  />
                </div>
              </template>

              <template v-if="!SettingsStore.loading_settings">
                <div
                  class="q-mb-lg"
                  v-if="
                    SettingsStore.settings_data.social_settings.google_login_enabled == 1
                  "
                >
                  <componentsGoogleLogin
                    ref="googlelogin"
                    :title="$t('Login with Google')"
                    :show_button="
                      SettingsStore.settings_data.social_settings.google_login_enabled
                    "
                    :client_id="
                      SettingsStore.settings_data.social_settings.google_client_id
                    "
                    :verification="
                      SettingsStore.settings_data.social_settings.enabled_verification
                    "
                    :button_width="250"
                    cookiepolicy="single_host_origin"
                    scope="profile"
                    redirect_to=""
                    @social-registration="socialRegistration"
                    :errors="{
                      user_cancelled: $t(
                        'User cancelled login or did not fully authorize.'
                      ),
                    }"
                  />
                </div>
              </template>

              <div
                v-if="settings.signup_enabled_terms == 1"
                class="q-pl-md q-pr-md q-pt-sm"
              >
                <p class="font12 text-weight-thin" v-html="settings.signup_terms"></p>
              </div>
            </div>
            <!-- w-75 -->
          </q-card-section>
        </q-card>
      </div>
      <!-- col -->
    </div>
    <!-- row   -->
  </q-page>
</template>

<script>
/* eslint-disable */
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "Login",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    componentsRecaptcha: defineAsyncComponent(() =>
      import("components/componentsRecaptcha")
    ),
    componentsFacebook: defineAsyncComponent(() =>
      import("components/componentsFacebook")
    ),
    componentsGoogleLogin: defineAsyncComponent(() =>
      import("components/componentsGoogleLogin")
    ),
  },
  data() {
    return {
      loading: false,
      loading_settings: false,
      settings: [],
      username: "",
      password: "",
      password_type: {
        type: "password",
        icon: "visibility",
      },
      recaptcha_response: "",
    };
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  mounted() {
    if (auth.authenticated()) {
      this.$router.push("/menu");
    }

    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.getSettings();
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.getSettings();
        }
      );
    }

    //this.getSignupSettings();
  },
  methods: {
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (Object.keys(resp).length > 0) {
        console.log("respx", resp);
      }
    },
    changeFieldType() {
      if (this.password_type.type === "password") {
        this.password_type = { type: "text", icon: "visibility_off" };
      } else {
        this.password_type = { type: "password", icon: "visibility" };
      }
    },
    onSubmit() {
      this.loading = true;
      const params = {
        username: this.username,
        password: this.password,
        local_id: APIinterface.getStorage("local_id"),
        recaptcha_response: this.recaptcha_response,
      };
      APIinterface.userLogin(params)
        .then((data) => {
          auth.setUser(data.details.user_data);
          auth.setToken(data.details.user_token);
          if (this.$route.query.checkout === "true") {
            this.$router.push("/checkout");
          } else {
            this.$router.push("/menu");
          }
        })
        .catch((error) => {
          this.loading = false;
          APIinterface.notify("negative", error, "error_outline", this.$q);
          if (this.SettingsStore.settings_data.captcha_enabled) {
            if (this.$refs.recapcha) {
              this.$refs.recapcha.reset();
            }
          }
        })
        .then((data) => {
          this.loading = false;
        });
    },
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
    socialRegistration(data) {
      data.local_id = APIinterface.getStorage("local_id");
      APIinterface.socialRegistration(data)
        .then((data) => {
          if (data.details.redirect.page === "verify") {
            this.$router.push({
              path: "/account/verify",
              query: { uuid: data.details.redirect.uuid },
            });
          } else if (data.details.redirect.page === "complete-registration") {
            this.$router.push({
              path: "/account/complete-registration",
              query: { uuid: data.details.redirect.uuid },
            });
          } else {
            auth.setUser(data.details.user_data);
            auth.setToken(data.details.user_token);
            this.$router.push("/menu");
          }
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
  },
};
</script>
