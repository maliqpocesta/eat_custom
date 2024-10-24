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
                  <q-item-label class="text-weight-bold">
                    <h5 class="text-weight-bold">{{ $t("Available Balance") }}</h5>
                  </q-item-label>
                  <q-item-label caption>
                    {{ $t("Your wallet transaction history") }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-item-label>
                    <template v-if="loading_balance">
                      <q-inner-loading :showing="true" size="md" color="warning" />
                    </template>
                    <template v-else>
                      <h4 class="text-weight-bold text-warning">
                        {{ balance }}
                      </h4>
                    </template>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    color="blue"
                    icon="add"
                    @click="this.$refs.topup.dialog = true"
                  />
                </q-item-section>
              </q-item>
              <q-separator />

              <div class="q-pt-md q-pl-md q-pr-md">
                <WalletBunos></WalletBunos>
              </div>

              <div class="q-pa-md" style="min-height: calc(50vh)">
                <q-tabs
                  v-model="tab"
                  dense
                  active-color="dark"
                  indicator-color="warning"
                  align="justify"
                  narrow-indicator
                  no-caps
                  :class="{
                    'text-grey300': $q.dark.mode,
                    'text-dark': !$q.dark.mode,
                  }"
                  class="bg-grey-2 rounded-borders"
                  :breakpoint="0"
                  @update:model-value="tabChange"
                >
                  <template v-for="items in tabList" :key="items">
                    <q-tab
                      :name="items.value"
                      :label="items.label"
                      no-caps
                      content-class="text-weight-500 "
                    />
                  </template>
                </q-tabs>

                <q-infinite-scroll
                  ref="nscroll"
                  @load="getWalletTransaction"
                  :offset="350"
                >
                  <template v-slot:default>
                    <template v-if="!hasData && !loading">
                      <div
                        style="height: calc(35vh)"
                        class="flex flex-center text-grey text-body2"
                      >
                        {{ $t("No data available") }}
                      </div>
                    </template>
                    <q-list class="q-mt-md">
                      <template v-for="datas in getData" :key="datas">
                        <template v-for="items in datas" :key="items.transaction_date">
                          <q-item>
                            <q-item-section>
                              <q-item-label>{{
                                items.transaction_description
                              }}</q-item-label>
                              <q-item-label caption>
                                {{ items.transaction_date }}
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label
                                class="text-weight-bold"
                                :class="{
                                  'text-green': items.transaction_type == 'credit',
                                  'text-red': items.transaction_type == 'debit',
                                }"
                              >
                                {{ items.transaction_amount }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator spaced inset />
                        </template>
                      </template>
                    </q-list>
                  </template>

                  <template v-slot:loading>
                    <template v-if="page <= 1">
                      <div
                        style="height: calc(35vh)"
                        class="flex flex-center relative-position"
                      >
                        <q-inner-loading
                          :showing="true"
                          color="warning"
                          size="md"
                          label-class="dark"
                          class="transparent"
                        />
                      </div>
                    </template>
                    <div v-else-if="page > 2" class="row justify-center absolute-bottom">
                      <q-spinner-dots color="warning" size="40px" />
                    </div>
                  </template>
                </q-infinite-scroll>
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

    <WalletTopupform
      ref="topup"
      @after-preparepayment="afterPreparepayment"
    ></WalletTopupform>

    <WalletTopupreceipt
      ref="receipt"
      :data="receipt_data"
      @after-receiptclose="afterReceiptclose"
    >
    </WalletTopupreceipt>

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
      @after-cancel-payment="AfterCancelPayment"
      @after-successfulpayment="afterSuccessfulpayment"
      @after-failedpayment="afterFailedpayment"
      @close-payment="closePayment"
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
      @after-cancel-payment="AfterCancelPayment"
      @after-successfulpayment="afterSuccessfulpayment"
      @after-failedpayment="afterFailedpayment"
      @close-payment="closePayment"
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
      @after-cancel-payment="AfterCancelPayment"
      @after-successfulpayment="afterSuccessfulpayment"
      @after-failedpayment="afterFailedpayment"
      @close-payment="closePayment"
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
      @after-cancel-payment="AfterCancelPayment"
      @after-successfulpayment="afterSuccessfulpayment"
      @after-failedpayment="afterFailedpayment"
      @close-payment="closePayment"
    />
  </q-page>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { defineAsyncComponent } from "vue";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "Payments",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    AddressesSkeleton: defineAsyncComponent(() => import("components/AddressesSkeleton")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
    WalletBunos: defineAsyncComponent(() => import("components/WalletBunos.vue")),
    WalletTopupform: defineAsyncComponent(() => import("components/WalletTopupform.vue")),
    WalletTopupreceipt: defineAsyncComponent(() =>
      import("components/WalletTopupreceipt.vue")
    ),
    StripeComponents: defineAsyncComponent(() => import("components/StripeComponents")),
    RazorpayComponents: defineAsyncComponent(() =>
      import("components/RazorpayComponents")
    ),
    PaypalComponents: defineAsyncComponent(() => import("components/PaypalComponents")),
    MercadopagoComponents: defineAsyncComponent(() =>
      import("components/MercadopagoComponents")
    ),
  },
  data() {
    return {
      data: [],
      credentials: [],
      loading: true,
      tab: "all",
      tabList: [
        {
          value: "all",
          label: this.$t("All"),
        },
        {
          value: "order",
          label: this.$t("Orders"),
        },
        {
          value: "refund",
          label: this.$t("Refunds"),
        },
        {
          value: "topup",
          label: this.$t("Top-ups"),
        },
        {
          value: "cashback",
          label: this.$t("Cashbacks"),
        },
        {
          value: "adjustment",
          label: this.$t("Adjustment"),
        },
      ],
      page: 0,
      is_refresh: undefined,
      balance: 0,
      loading_balance: true,
      receipt_data: [],
    };
  },
  setup(props) {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  async mounted() {
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
  },
  computed: {
    hasData() {
      if (this.data.length > 0) {
        return true;
      }
      return false;
    },
    getData() {
      return this.data;
    },
    hasData() {
      if (Object.keys(this.data).length > 0) {
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
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (resp.digitalwallet_enabled) {
        this.getWalletBalance();
        this.getPaymentCredentials();
        this.resetPagination();
      } else {
        this.$router.push("/home");
      }
    },
    getPaymentCredentials() {
      APIinterface.fetchDataByTokenPost("getPaymentCredentials")
        .then((data) => {
          this.credentials = data.details;
        })
        .catch((error) => {})
        .then((data) => {});
    },
    getWalletBalance() {
      this.loading_balance = true;
      APIinterface.fetchDataByTokenPost("getWalletBalance")
        .then((data) => {
          if (data.code == 1) {
            this.balance = data.details.total;
          } else {
            this.balance = 0;
          }
        })
        .catch((error) => {})
        .then((data) => {
          this.loading_balance = false;
        });
    },
    getWalletTransaction(index, done) {
      this.loading = true;
      this.page = index;
      const method = APIinterface.fetchDataByTokenPost(
        "getWalletTransaction",
        "page=" + index + "&transaction_type=" + this.tab
      )
        .then((data) => {
          if (data.code == 1) {
            this.data.push(data.details.data);
          } else {
            if (this.$refs.nscroll) {
              this.$refs.nscroll.stop();
            }
          }
        })
        .catch((error) => {
          if (this.$refs.nscroll) {
            this.$refs.nscroll.stop();
          }
        })
        .then((data) => {
          this.loading = false;
          done();
          if (!APIinterface.empty(this.is_refresh)) {
            this.is_refresh();
          }
        });
    },
    tabChange() {
      this.resetPagination();
    },
    resetPagination() {
      this.page = 0;
      this.data = [];
      this.$refs.nscroll.reset();
      this.$refs.nscroll.resume();
      this.$refs.nscroll.trigger();
    },
    afterPreparepayment(data) {
      try {
        this.$refs[data.payment_code].Dopayment(data.data, data);
      } catch (error) {
        APIinterface.notify("dark", error, "error", this.$q);
      }
    },
    afterSuccessfulpayment(data) {
      this.receipt_data = data;
      this.$refs.topup.dialog = false;
      this.$refs.receipt.dialog = true;
    },
    afterReceiptclose() {
      this.getWalletBalance();
      this.resetPagination();
    },
    afterCancelPayment(data) {
      if (!APIinterface.empty(data)) {
        APIinterface.notify("dark", data, "error", this.$q);
      }
    },
    closePayment() {
      this.$refs.topup.dialog = false;
    },
  },
};
</script>

<style lang="sass"></style>
