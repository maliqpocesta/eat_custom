<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <q-card flat class="w-75" style="margin: auto">
          <q-card-section>
            <template v-if="request_success">
              <div class="text-center q-mb-md">
                <h4 class="no-margin text-weight-bold q-pb-sm">
                  {{ $t("Password Reset") }}
                </h4>
                <p class="text-weight-thin">
                  {{ message }}
                </p>
              </div>

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
                    @click="request_success = false"
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
            </template>

            <template v-else>
              <div class="text-center q-mb-md">
                <h4 class="no-margin text-weight-bold q-pb-sm">
                  {{ $t("Forgot Password") }}
                </h4>
                <p class="text-weight-thin">
                  {{
                    $t(
                      "Please specify your email address to receive instructions for resetting it"
                    )
                  }}.
                  {{
                    $t(
                      "If an account exists by that email, we will send a password reset"
                    )
                  }}
                </p>
              </div>

              <div class="w-75" style="margin: auto">
                <q-form @submit="onSubmit">
                  <div class="q-mb-lg">
                    <q-input
                      bg-color="mygrey"
                      color="warning"
                      outlined
                      v-model="email_address"
                      :label="$t('Email address')"
                      type="email"
                      lazy-rules
                      :rules="[
                        (val, rules) =>
                          rules.email(val) || $t('Please enter a valid email address'),
                      ]"
                    />
                  </div>

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

                  <div class="q-mb-lg">
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
                </q-form>
              </div>
              <!-- w-75 -->
            </template>
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

export default {
  name: "ForgotPassword",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
  },
  data() {
    return {
      loading: false,
      email_address: "",
      request_success: false,
      customer_uuid: [],
      message: "",
      steps: 1,
      maxCounter: 20,
      counter: this.maxCounter,
      timer: undefined,
    };
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
        "requestResetPassword",
        "email_address=" + this.email_address
      )
        .then((data) => {
          // this.request_success = true;
          // this.customer_uuid = data.details.uuid;
          // this.message = data.msg;
          // this.startTimer();
          this.$router.push({ path: '/resetpassword', query: { uuid: data.details.uuid, msg: data.msg } })
        })
        .catch((error) => {
          this.loading = false;
          this.customer_uuid = [];
          this.message = "";
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
