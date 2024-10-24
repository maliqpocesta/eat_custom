<template>
  <q-dialog
    v-model="show_modal"
    persistent
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
    :full-width="this.$q.screen.gt.sm ? false : true"
  >
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none no-margin no-padding">
        <div class="text-h5 text-weight-bold">{{ title }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="q-ma-sm">
          <p class="font12">{{ label.notes }}</p>
        </div>
      </q-card-section>

      <q-separator spaced />
      <q-card-actions>
        <q-btn
          unelevated
          roundedx
          color="warning"
          text-color="black"
          no-caps
          class="full-width q-mb-md"
          :label="label.submit"
          size="17px"
          :loading="loading"
          @click="onSubmit()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "BankComponents",
  props: ["title", "label", "payment_code", "payment_credentials"],
  data() {
    return {
      show_modal: false,
      data: [],
      loading: false,
      credentials: [],
    };
  },
  methods: {
    showPaymentForm() {
      this.show_modal = true;
      this.setCredentials();
    },
    close() {
      this.show_modal = false;
    },
    closePayment() {
      this.$emit("afterCancelPayment");
    },
    setCredentials() {
      if (
        typeof this.payment_credentials[this.payment_code] !== "undefined" &&
        this.payment_credentials[this.payment_code] !== null
      ) {
        this.credentials = this.payment_credentials[this.payment_code];
      }
    },
    onSubmit() {
      const $data = {
        merchant_id: this.credentials.merchant_id,
        payment_code: this.payment_code,
      };
      this.loading = true;
      APIinterface.SavedPaymentProvider($data)
        .then((data) => {
          this.close();
          this.$emit("afterAddpayment");
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
