<template>
  <q-dialog
    v-model="dialog"
    @before-show="PaymentList"
    persistent
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
    :full-width="this.$q.screen.gt.sm ? false : true"
  >
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none no-margin no-padding">
        <div class="text-h5 text-weight-bold">{{ $t("New Payment") }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section style="max-height: 70vh" class="scroll">
        <template v-if="loading">
          <q-list>
            <q-item v-for="i in 4" :key="i">
              <q-item-section avatar
                ><q-skeleton type="QRadio" size="25px"
              /></q-item-section>
              <q-item-section><q-skeleton type="text"></q-skeleton></q-item-section>
            </q-item>
          </q-list>
        </template>
        <template v-else>
          <template v-for="items in getData" :key="items.payment_code">
            <q-card flat bordered class="q-mb-sm">
              <q-card-section class="q-pa-none">
                <q-item clickable v-ripple @click.stop="onchoosePayment(items)">
                  <q-item-section avatar>
                    <template v-if="items.logo_type === 'icon'">
                      <q-icon color="warning" name="credit_card" />
                    </template>
                    <template v-else>
                      <q-img
                        :src="items.logo_image"
                        fit="contain"
                        style="height: 35px; max-width: 35px"
                      />
                    </template>
                  </q-item-section>
                  <q-item-section>{{ items.payment_name }}</q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </template>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- PAYMENT COMPONENTS -->
  <codComponents
    ref="cod"
    payment_code="cod"
    :title="$t('Add Cash On delivery')"
    :label="{
      submit: $t('Add Cash'),
      notes: $t(
        'Cash on Delivery or COD is a payment method that allows pay for the items you have ordered only when it gets delivered.'
      ),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <PaydeliveryComponents
    ref="paydelivery"
    payment_code="paydelivery"
    :title="$t('Select Payment')"
    :label="{
      submit: this.$t('Saved'),
      notes: this.$t('Pay using different card'),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  >
  </PaydeliveryComponents>

  <BankComponents
    ref="bank"
    payment_code="bank"
    :title="$t('Add Bank Transfer')"
    :label="{
      submit: $t('Add Payment'),
      notes: $t('Pay using bank Transfer'),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <ocrComponents
    ref="ocr"
    payment_code="ocr"
    :title="$t('Add Credit card')"
    :label="{
      submit: $t('Add Card'),
      notes: '',
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <PaypalComponents
    ref="paypal"
    payment_code="paypal"
    :title="$t('Add Paypal')"
    :label="{
      submit: $t('Add Paypal'),
      notes: $t('Pay using your paypal account'),
      payment_title: $t('Pay using Paypal'),
      payment_subtitle: $t(
        'You will re-direct to paypal account to login to your account.'
      ),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <StripeComponents
    ref="stripe"
    payment_code="stripe"
    :title="$t('Add Stripe')"
    :label="{
      submit: $t('Add Stripe'),
      notes: $t('Add your card account'),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <RazorpayComponents
    ref="razorpay"
    payment_code="razorpay"
    :title="$t('Add Razorpay')"
    :label="{
      submit: $t('Submit'),
      notes: $t('Pay using your Razorpay account'),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <MercadopagoComponents
    ref="mercadopago"
    payment_code="mercadopago"
    :title="$t('Add Mercadopago')"
    :label="{
      submit: $t('Add Mercadopago'),
      notes: $t('Pay using your mercadopago account'),
    }"
    :payment_credentials="credentials"
    @after-addpayment="afterAddpayment"
  />

  <!-- PAYMENT COMPONENTS -->
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { defineAsyncComponent } from "vue";

export default {
  name: "PaymentListModal",
  props: ["payment_credentials"],
  components: {
    PaydeliveryComponents: defineAsyncComponent(() =>
      import("components/PaydeliveryComponents")
    ),
    codComponents: defineAsyncComponent(() => import("components/codComponents")),
    BankComponents: defineAsyncComponent(() => import("components/BankComponents")),
    ocrComponents: defineAsyncComponent(() => import("components/ocrComponents")),
    PaypalComponents: defineAsyncComponent(() => import("components/PaypalComponents")),
    StripeComponents: defineAsyncComponent(() => import("components/StripeComponents")),
    RazorpayComponents: defineAsyncComponent(() =>
      import("components/RazorpayComponents")
    ),
    MercadopagoComponents: defineAsyncComponent(() =>
      import("components/MercadopagoComponents")
    ),
  },
  data() {
    return {
      dialog: false,
      loading: false,
      data: [],
      credentials: [],
    };
  },
  computed: {
    getData() {
      return this.data;
    },
  },
  watch: {
    payment_credentials(newval, oldval) {
      this.credentials = newval;
    },
  },
  methods: {
    PaymentList() {
      this.loading = true;
      APIinterface.PaymentList(APIinterface.getStorage("cart_uuid"))
        .then((data) => {
          this.data = data.details.data;
          this.credentials = data.details.credentials;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    onchoosePayment(data) {
      try {
        this.$refs[data.payment_code].showPaymentForm();
        this.dialog = false;
      } catch (error) {
        APIinterface.notify("negative", error, "error_outline", this.$q);
      }
    },
    doPayment(data) {
      this.$refs[data.payment_code].PaymentRender(data);
    },
    afterAddpayment() {
      this.$emit("afterAddpayment");
    },
  },
};
</script>
