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
                  <div class="row items-center">
                    <div class="col-2">
                      <q-btn
                        dense
                        flat
                        color="dark"
                        icon="arrow_back_ios"
                        to="/account/payments"
                        no-caps
                        :label="$t('Back')"
                        class="no-margin"
                        v-if="!isMobile"
                      />
                    </div>
                    <div class="col">
                      <h5 class="text-weight-bold no-margin">{{ $t("Payment New") }}</h5>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />

              <q-list v-if="hasData">
                <template v-for="items in data" :key="items.payment_code">
                  <q-item clickable v-ripple @click="onchoosePayment(items)">
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
                  <q-separator spaced inset />
                </template>
              </q-list>

              <div v-else>
                <div class="q-pa-md text-center">
                  <p class="text-grey">{{ $t("No payment method available") }}</p>
                </div>
              </div>
            </q-card>
          </div>
          <!-- right -->
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <!-- PAYMENTS COMPONENTS -->
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
      :payment_credentials="payment_credentials"
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
      :payment_credentials="payment_credentials"
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
      :payment_credentials="payment_credentials"
      @after-addpayment="afterAddpayment"
    />

    <BankComponents
      ref="bank"
      payment_code="bank"
      :title="$t('Add Bank Transfer')"
      :label="{
        submit: $t('Add Payment'),
        notes: $t('Pay using bank Transfer'),
      }"
      :payment_credentials="payment_credentials"
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
      :payment_credentials="payment_credentials"
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
      :payment_credentials="payment_credentials"
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
      :payment_credentials="payment_credentials"
      @after-addpayment="afterAddpayment"
    />
    
    <PaydeliveryComponents
      ref="paydelivery"
      payment_code="paydelivery"
      :title="$t('Add Payment')"
      :label="{
        submit: this.$t('Saved'),
        notes: this.$t('Pay using different card'),
      }"
      :payment_credentials="payment_credentials"
      @after-addpayment="afterAddpayment"
    >
    </PaydeliveryComponents>

    <!-- PAYMENTS COMPONENTS -->
  </q-page>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { defineAsyncComponent } from "vue";

export default {
  name: "PaymentNew",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    codComponents: defineAsyncComponent(() => import("components/codComponents")),
    ocrComponents: defineAsyncComponent(() => import("components/ocrComponents")),
    StripeComponents: defineAsyncComponent(() => import("components/StripeComponents")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
    BankComponents: defineAsyncComponent(() => import("components/BankComponents")),
    PaypalComponents: defineAsyncComponent(() => import("components/PaypalComponents")),
    RazorpayComponents: defineAsyncComponent(() =>
      import("components/RazorpayComponents")
    ),
    MercadopagoComponents: defineAsyncComponent(() =>
      import("components/MercadopagoComponents")
    ),
    PaydeliveryComponents: defineAsyncComponent(() => import("components/PaydeliveryComponents")),
    
  },
  data() {
    return {
      data: [],
      loading: false,
      payment_credentials: [],
    };
  },
  mounted() {
    this.PaymentMethod();
  },
  computed: {
    hasData() {
      if (this.data.length > 0) {
        return true;
      }
      return false;
    },
    isMobile() {
      if (this.$q.screen.lt.md) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    /* eslint-disable */
    PaymentMethod() {
      APIinterface.PaymentMethod()
        .then((data) => {
          this.data = data.details.data;
          this.payment_credentials = data.details.credentials;
        })
        .catch((error) => {
          //
        })
        .then((data) => {});
    },
    onchoosePayment(data) {
      try {
        this.$refs[data.payment_code].showPaymentForm();
      } catch (error) {
        APIinterface.notify("negative", error, "error_outline", this.$q);
      }
    },
    afterAddpayment() {
      this.$router.push("/account/payments");
    },
  },
};
</script>

<style lang="sass"></style>
