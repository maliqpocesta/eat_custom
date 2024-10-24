<template>
  <q-dialog
    v-model="show_modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 450px; max-width: 80vw" class="relative-position">
      <q-card-section class="row items-center q-pb-none q-pa-md">
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="text-center">
          <h4 class="text-weight-bold q-mt-none">{{ $t("2-Step Verification") }}</h4>
          <p class="text-weight-medium">
            {{ $t("For your security, we want to make sure it's really you") }}.
          </p>
          <q-input
            bg-color="mygrey"
            color="warning"
            outlined
            v-model="code"
            :label="$t('Code')"
            maxlength="6"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('Code is required')]"
          />

          <div class="text-left q-mt-md">
            <p class="text-weight-bold font11">{{ sent_message2 }}</p>
            <q-btn
              @click="resendCode"
              v-if="counter === 0"
              flat
              dense
              color="dark"
              no-caps
              class="font11 q-ma-none"
              ><u>{{ $t("Resend") }}</u></q-btn
            >
            <p v-else class="font11 q-ma-none">
              <!-- <u>Resend Code in {{ counter }}</u> -->
              <u>{{ $t("Resend Code in {counter}", { counter: counter }) }}</u>
            </p>
          </div>
        </q-card-section>

        <q-separator spaced />
        <q-card-actions>
          <q-btn
            type="submit"
            unelevated
            color="warning"
            text-color="black"
            no-caps
            class="full-width q-mb-md"
            :label="$t('Submit')"
            size="17px"
            :disabled="hasCode"
            :loading="loading"
          >
          </q-btn>
        </q-card-actions>
      </q-form>

      <q-inner-loading
        :showing="visible"
        :label="$t('Please wait...')"
        label-class="text-warning"
        label-style="font-size: 1.1em"
        color="warning"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "StepsVerification",
  props: ["sent_message"],
  data() {
    return {
      show_modal: false,
      loading: false,
      visible: false,
      code: "",
      counter: 20,
      timer: undefined,
      sent_message2: "",
    };
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
    onSubmit() {
      this.$emit("afterVerifycode", this.code);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    startTimer() {
      this.stopTimer();
      this.counter = 20;
      this.timer = setInterval(() => {
        this.counter--;
      }, 1000);
    },
    resendCode() {
      this.loading = true;
      APIinterface.RequestEmailCode()
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
