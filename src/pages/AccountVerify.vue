<template>
  <q-page padding>
    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="text-center">
          <h4 class="no-margin text-weight-bold q-pb-sm">
            {{ $t("Your almost there") }}
          </h4>
          <p>{{ $t("we need to confirm your not a robot") }} :)</p>
        </div>

        <q-card flat class="w-50 margin-auto">
          <q-card-section class="relative-position">
            <q-form @submit="onSubmit">
              <q-input
                bg-color="mygrey"
                color="warning"
                outlined
                v-model="code"
                :label="$t('Code')"
                maxlength="6"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Code is required']"
              />

              <div class="text-left q-mt-md q-mb-md">
                <p class="text-weight-bold no-margin font11">{{ sent_message2 }}</p>
                <q-btn
                  @click="resendCode"
                  v-if="counter === 0"
                  flat
                  dense
                  color="dark"
                  no-caps
                  class="font11 q-ma-none"
                  ><u>{{ $t("Resend Code") }}</u></q-btn
                >
                <p v-else class="font11 q-ma-none no-margin">
                  <!-- <u>Resend Code in {{ counter }}</u> -->
                  <u>{{ $t("Resend Code in {counter}", { counter: counter }) }}</u>
                </p>
              </div>

              <q-btn
                type="submit"
                unelevated
                rounded
                color="warning"
                text-color="black"
                no-caps
                class="full-width q-mb-md"
                :label="$t('Next')"
                size="17px"
                :disabled="hasCode"
                :loading="loading"
              >
              </q-btn>
            </q-form>

            <q-inner-loading
              :showing="visible"
              :label="$t('Please wait...')"
              label-class="text-warning"
              label-style="font-size: 1.1em"
              color="warning"
            />
          </q-card-section>
        </q-card>
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";

export default {
  name: "AccountVerify",
  data() {
    return {
      loading: false,
      visible: false,
      code: "",
      counter: 20,
      timer: undefined,
      sent_message2: "",
      settings: [],
      data: [],
      settings_resent_counter : 0
    };
  },
  mounted() {
    this.startTimer();
    // this.sent_message2 = this.$route.query.msg
    this.getAccountStatus();
  },
  computed: {
    hasCode() {
      if (!APIinterface.empty(this.code)) {
        return false;
      }
      return true;
    },
  },
  watch: {
    counter(newval, oldval) {
      if (newval <= 0) {
        this.stopTimer();
      }
    },
    show_modal(newval, oldval) {
      if (newval) {
        this.startTimer();
      }
    },
    sent_message(newval, oldval) {
      this.sent_message2 = newval;
    },
  },
  methods: {
    getAccountStatus() {
      this.loading = true;
      APIinterface.getAccountStatus(this.$route.query.uuid)
        .then((data) => {
          this.sent_message2 = data.msg;
          this.data = data.details.data;
          this.settings = data.details.settings;

          this.counter = data.details.settings.signup_resend_counter;
          this.settings_resent_counter = this.counter;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
          this.$router.push("/login");
        })
        .then((data) => {
          this.loading = false;
        });
    },
    onSubmit() {
      let $autoLogin = true;
      if (
        this.settings.enabled_verification === "1" &&
        this.data.social_strategy === "google"
      ) {
        $autoLogin = false;
      }
      if (
        this.settings.enabled_verification === "1" &&
        this.data.social_strategy === "facebook"
      ) {
        $autoLogin = false;
      }
      const params = {
        auto_login: $autoLogin,
        client_uuid: this.$route.query.uuid,
        verification_code: this.code,
        local_id: APIinterface.getStorage("local_id"),
      };
      this.loading = true;
      APIinterface.verifyCodeSignup(params)
        .then((data) => {
          if ($autoLogin) {
            auth.setUser(data.details.user_data);
            auth.setToken(data.details.user_token);
            this.$router.push("/menu");
          } else {
            this.$router.push({
              path: "/account/complete-registration",
              query: { uuid: this.$route.query.uuid },
            });
          }
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    startTimer() {
      this.stopTimer();
      this.counter = this.settings_resent_counter> 0 ? this.settings_resent_counter : 20;
      this.timer = setInterval(() => {
        this.counter--;
      }, 1000);
    },
    resendCode() {
      this.loading = true;
      APIinterface.requestCode(this.$route.query.uuid)
        .then((data) => {
          this.sent_message2 = data.msg;
          this.startTimer();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
