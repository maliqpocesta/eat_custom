<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <q-card flat class="w-75" style="margin: auto">
          <q-card-section>

              <div class="text-center q-mb-md">
                <h4 class="no-margin text-weight-bold q-pb-sm">
                  {{ $t("Password Reset") }}
                </h4>
                <p class="text-weight-thin">
                  {{ message }}
                </p>
              </div>
                <q-form @submit="onSubmit">

                   <q-input
                      bg-color="mygrey"
                      color="warning"
                      outlined
                      v-model="otp"
                      :label="$t('OTP')"
                      mask="######"
                      lazy-rules
                      :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                    />

                    <q-input
                      bg-color="mygrey"
                      color="warning"
                      outlined
                      v-model="newpassword"
                      :label="$t('New Password')"
                      lazy-rules

                      :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"

                    />
                    <q-input
                      bg-color="mygrey"
                      color="warning"
                      outlined
                      v-model="confirmpassword"
                      :label="$t('Confirm Password')"
                      lazy-rules
                      :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                    />
                  <div class="q-mb-lg">
                    <q-btn
                      type="submit"
                      unelevated
                      rounded
                      color="warning"
                      text-color="black"
                      no-caps
                      class="full-width"
                      :label="$t('Reset Password')"
                      size="lg"
                      :dense="$q.screen.lt.sm"
                      :loading="loading"
                    >
                    </q-btn>
                  </div>
                </q-form>

              <div class="text-center">
                <template v-if="counter === 0">
                  <q-btn
                    @click="resendEmail"
                    flat
                    dense
                    color="myblue"
                    no-caps
                    class="font13 q-ma-none q-mr-md"
                    ><u>{{ $t("Resend reset email") }}</u></q-btn
                  >
                  <q-btn
                    to="/forgotpassword"
                    flat
                    dense
                    color="warning"
                    no-caps
                    class="font13 q-ma-none"
                    ><u>{{ $t("Enter email again") }}</u></q-btn
                  >
                </template>
                <p v-else class="font11 q-ma-none">
                  <!-- <u>Resend Code in {{ counter }}</u> -->
                  <u>{{ $t("Resend Code in {counter}", { counter: counter }) }}</u>
                </p>
              </div>

              <div class="q-mt-lg">
                <q-btn
                  flat
                  :ripple="false"
                  text-color="negative"
                  no-caps
                  class="full-width no-hover"
                  :dense="$q.screen.lt.sm"
                  to="/login"
                >
                  <u>{{ $t("Back to login") }}</u>
                </q-btn>
              </div>

          </q-card-section>
        </q-card>
      </div>
      <!-- col -->
    </div>
    <!-- row   -->
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";

export default {
  name: "ResetPassword",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
  },
  data() {
    return {
      loading: false,
      email_address: "bastikikang@gmail.com",
      request_success: false,
      customer_uuid: [],
      message: "",
      steps: 1,
      maxCounter: 20,
      counter: this.maxCounter,
      timer: undefined,
      newpassword : '',
      confirmpassword : '',
      otp : ''
    };
  },
  created() {
    this.request_success = true;
    this.message = this.$route.query.msg;
    this.customer_uuid = this.$route.query.uuid;
    this.startTimer();
  },
  watch: {
    counter(newval, oldval) {
      if (newval <= 0) {
        this.stopTimer();
      }
    },
  },
  beforeUnmount() {
    this.stopTimer();
  },
  methods: {
    stopTimer() {
      clearInterval(this.timer);
    },
    startTimer() {
      this.stopTimer();
      this.counter = this.maxCounter;
      this.timer = setInterval(() => {
        this.counter--;
      }, 1000);
    },
    onSubmit() {
      this.loading = true;
      APIinterface.fetchDataPost(
        "ResetPassword",
        "newpassword=" + this.newpassword + "&confirmpassword="+ this.confirmpassword + "&uuid="+ this.customer_uuid + "&otp="+ this.otp
      )
        .then((data) => {
          APIinterface.notify("positive", data.msg, "check_circle", this.$q);
          console.log(data.details.user_token);
          console.log(data.details.user_data);
          auth.setUser(data.details.user_data);
          auth.setToken(data.details.user_token);
          this.$router.push("/menu");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    resendEmail() {
      this.loading = true;
      APIinterface.fetchDataPost(
        "resendResetEmail",
        "customer_uuid=" + this.customer_uuid
      )
        .then((data) => {
          this.request_success = true;
          this.message = data.msg;
          this.startTimer();
        })
        .catch((error) => {
          this.loading = false;
          this.message = "";
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
