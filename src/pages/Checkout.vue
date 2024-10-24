<template>
  <q-page padding>
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white">
        <q-btn
          dense
          flat
          color="dark"
          icon="arrow_back_ios"
          to="/menu"
          no-caps
          :label="$t('Back')"
        />
      </q-toolbar>
    </q-page-sticky>

    <div class="q-pa-lg"></div>

    <div class="row justify-center q-pa-md q-col-gutter-md">
      <!-- left -->
      <div class="col-md-6 col-sm-12">
        <!-- order type -->
        <q-card flat class="q-mb-sm">
          <q-card-section>
            <div class="row items-start q-col-gutter-sm q-mb-lg">
              <div class="col-3">
                <div class="text-h5 no-margin">{{ $t("Order & Time") }}</div>
              </div>
              <div class="col-9">
                <TransactionInfo
                  ref="transaction_info"
                  :show_address="false"
                  @change-transaction="changeTransaction"
                  @after-getinfo="afterGetinfo"
                />
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
        <!-- order type -->

        <!-- address -->
        <q-card
          v-if="DataStorePersisted.transaction_type == 'delivery'"
          flat
          class="q-mb-sm"
        >
          <q-card-section>
            <template v-if="loading">
              <div class="row items-start q-col-gutter-sm">
                <div class="col-3">
                  <q-skeleton type="rect" />
                </div>
                <div class="col-9">
                  <q-skeleton height="130px" />
                  <q-skeleton type="text" class="w-50" />
                  <q-skeleton type="text" class="w-25" />
                </div>
              </div>
            </template>

            <div v-else class="row items-start q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">{{ $t("Address") }}</div>
                <q-btn
                  flat
                  color="warning"
                  no-caps
                  class="no-padding q-ma-none"
                  @click="this.$refs.location_modal.show_modal = true"
                  >{{ $t("Change") }}</q-btn
                >
              </div>
              <div class="col-9">
                <template v-if="checkout_address.latitude">
                  <Div class="bg-grey-1 maps small q-mb-sm relative-position">
                    <Maps
                      ref="maps"
                      :lat="maps_config.default_lat"
                      :lng="maps_config.default_lng"
                      :keys="maps_config.key"
                      :zoom="maps_config.zoom"
                      class_map="maps small"
                      :provider="maps_config.provider"
                      :detect_location="false"
                      :marker="marker"
                      @after-selectmap="afterSelectmap"
                      @drag-marker="dragMarker"
                      @show-loader="showLoader"
                    />
                    <q-inner-loading
                      :showing="loading_map"
                      :label="$t('Please wait...')"
                      label-class="text-dark"
                      label-style="font-size: 11px"
                    >
                    </q-inner-loading>
                  </Div>
                  <div class="row items-start q-col-gutter-sm">
                    <div class="col-12">
                      <div class="text-h6 line-normal">
                        {{ checkout_address.address.formatted_address }}
                      </div>
                      <p class="font12 text-weight-thin">
                        {{ $t("Delivery options") }}:
                        {{ checkout_address.attributes.delivery_options }}
                      </p>
                      <q-btn
                        @click="editAddress()"
                        flat
                        color="warning"
                        no-caps
                        icon="add"
                        :label="$t('Add delivery instructions')"
                      ></q-btn>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <template v-if="DataStorePersisted.getAddress">
                    <AddressInline
                      ref="address_inline"
                      :locationdata="DataStorePersisted.location_data"
                      :maps_config="maps_config"
                      @after-saveaddress="afterSaveaddress"
                    ></AddressInline>
                  </template>
                  <template v-else>
                    <div
                      class="bg-myyellow rounded-borders q-pa-sm text-weight-thin font12"
                    >
                      {{ $t("Select your address") }}
                    </div>
                  </template>
                </template>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
        <!-- address -->

        <template
          v-if="
            SettingsStore.getBookingFlag &&
            DataStorePersisted.transaction_type == 'dinein'
          "
        >
          <BookingCheckout ref="booking"></BookingCheckout>
        </template>

        <!-- utensils -->
        <q-card flat class="q-mb-sm" v-if="SettingsStore.enabled_include_utensils">
          <q-card-section>
            <div class="row items-center q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">{{ $t("Utensils") }}</div>
              </div>
              <div class="col-9">
                <div class="row items-center">
                  <div class="col">{{ $t("Include utensils and condoments") }}</div>
                  <div>
                    <q-toggle
                      v-model="include_utensils"
                      color="warning"
                      @update:model-value="setUtensil"
                    />
                  </div>
                </div>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
        <!-- utensils -->

        <!-- phone -->
        <q-card flat class="q-mb-sm">
          <q-card-section>
            <div class="row items-start q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">{{ $t("Phone number") }}</div>
                <q-btn
                  @click="this.$refs.change_phone.show_modal = true"
                  flat
                  color="warning"
                  no-caps
                  class="no-padding q-ma-none"
                  >{{ $t("Change") }}</q-btn
                >
              </div>
              <div class="col-9">
                <template v-if="loading_phone">
                  <q-skeleton type="text" class="w-50" />
                </template>
                <template v-else>
                  {{ phone_number }}
                </template>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
        <!-- phone -->

        <!-- promo -->
        <q-card flat class="q-mb-sm">
          <q-card-section>
            <div class="row items-center q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">{{ $t("Promo") }}</div>
              </div>
              <div class="col-9">
                <template v-if="loading_promo">
                  <q-skeleton type="text" class="w-50" />
                </template>
                <div v-else class="row items-center">
                  <div class="col">
                    <template v-if="promo_selected.promo_id > 0">
                      <p class="no-margin">{{ $t("Promotion applied") }}</p>
                      <p
                        v-if="promo_selected.savings"
                        class="no-margin font11 text-green"
                      >
                        {{ promo_selected.savings }}
                      </p>
                    </template>
                    <template v-else>
                      <template v-if="total_promo > 0">
                        {{ total_promo }} {{ $t("promotional available") }}
                      </template>
                      <template v-else> {{ $t("no promo available") }} </template>
                    </template>
                  </div>
                  <div class="col text-right">
                    <template v-if="promo_selected.promo_id > 0">
                      <q-btn
                        @click="this.$refs.promotional.removePromo(promo_selected)"
                        flat
                        color="warning"
                        no-caps
                        >{{ $t("Remove") }}</q-btn
                      >
                    </template>
                    <template v-else>
                      <q-btn
                        @click="this.$refs.promotional.show_modal = true"
                        flat
                        color="warning"
                        no-caps
                        >{{ $t("Add") }}</q-btn
                      >
                    </template>
                  </div>
                </div>
                <!-- row -->
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
        <!-- promo -->

        <q-card
          flat
          class="q-mb-sm"
          v-if="SettingsStore.points_enabled && SettingsStore.loyalty_points_activated"
        >
          <q-card-section>
            <div class="row items-center">
              <div class="col-md-3 col-xs-3">
                <div class="text-h5 no-margin line-normal">
                  {{ $t("Points discount") }}
                </div>
              </div>
              <div class="col-9 col-xs-9">
                <PointsCart
                  ref="cart_points"
                  :currency_code="DataStorePersisted.getUseCurrency()"
                  @after-applypoints="afterApplypoints"
                  :use_thresholds="SettingsStore.points_use_thresholds"
                  :cart_loaded="cartStore.cart_loading"
                  :cart_updated="cartStore.cart_reloading"
                >
                </PointsCart>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>

        <!-- tips -->

        <q-card flat class="q-mb-sm" v-if="isTipenabled">
          <q-card-section>
            <div class="row items-start q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">{{ $t("Tips") }}</div>
              </div>
              <div class="col-9">
                <Tips
                  ref="tips"
                  @after-applytips="afterApplytips"
                  :cart_loaded="cartStore.cart_loading"
                  :cart_updated="cartStore.cart_reloading"
                ></Tips>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
        <!-- tips -->

        <!-- <template v-if="this.$q.screen.gt.sm">
          <q-card flat class="q-mb-sm q-pa-none">
            <q-card-section>
              <SimilarItems ref="similar_items" :title="$t('People also ordered')" />
            </q-card-section>
          </q-card>
        </template> -->

        <!-- payment saved -->
        <q-card flat class="q-mb-sm">
          <q-card-section>
            <div class="row items-center">
              <div class="col-md-3 col-xs-6">
                <div class="text-h5 no-margin line-normal">{{ $t("Payment") }}</div>
              </div>
              <div class="col-md-9 col-xs-6 text-right">
                <q-btn
                  :label="$t('Add')"
                  no-caps
                  color="warning"
                  flat
                  @click="this.$refs.payment_list.dialog = true"
                />
              </div>
            </div>

            <!-- SAVED PAYMENT LIST-->
            <div class="row">
              <div v-if="this.$q.screen.gt.sm" class="col-md-3 col-xs-12"></div>
              <div class="col-md-9 col-xs-12">
                <WalletComponents
                  ref="digital_wallet"
                  @after-applywallet="afterApplywallet"
                  :cart_loaded="cartStore.cart_loading"
                  :cart_updated="cartStore.cart_reloading"
                >
                </WalletComponents>

                <SavedPaymentList
                  ref="saved_payment"
                  @onselect-payment="onselectPayment"
                  @after-loadpaymentlist="afterLoadpaymentlist"
                  @set-paymentuuid="setPaymentuuid"
                  @after-getpaymentcredentials="setPaymentcredentials"
                  :wallet_data="wallet_data"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <!-- payment saved -->
      </div>
      <!-- col -->
      <!-- left -->

      <!-- right -->
      <div class="col-xs-12 col-sm-12 col-md-3">
        <q-card flat>
          <q-card-section class="cart">
            <CartDetails
              ref="cart_details"
              :sticky_checkout="false"
              :payload="[
                'items',
                'merchant_info',
                'service_fee',
                'delivery_fee',
                'packaging',
                'tax',
                'tips',
                'checkout',
                'discount',
                'distance_local',
                'summary',
                'total',
                'items_count',
                'points',
                'points_discount',
              ]"
              @set-cartcount="setCartcount"
              @on-placeorder="onPlaceorder"
              @set-merchantinfo="setMerchantinfo"
            />
          </q-card-section>
        </q-card>
      </div>
      <!-- col -->
      <!-- end right -->
    </div>
    <!-- row -->

    <DeliverySched ref="delivery_sched" @after-savetrans="afterSavetrans" />

    <LocationModal
      ref="location_modal"
      :title="$t('Change address')"
      :enabled_search="true"
      @after-selectaddress="afterSelectaddress"
      @after-setplaceid="afterSetplaceid"
    />

    <AddressDetails
      ref="address_details"
      :locationdata="location_data"
      :maps_config="maps_config"
      @after-saveaddress="afterSaveaddress"
    />

    <ChangePhoneModal
      ref="change_phone"
      @after-getphone="afterGetphone"
      @after-changephone="afterChangephone"
      @before-loadphone="beforeLoadphone"
      @after-loadphone="afterLoadphone"
    />

    <PromotionsModal
      ref="promotional"
      @afterget-promo="aftergetPromo"
      @before-loadpromo="beforeLoadpromo"
      @after-loadpromo="afterLoadpromo"
      @after-applypromo="afterApplypromo"
      @after-removepromo="afterRemovepromo"
      @clear-promo="clearPromo"
      :cart_loaded="cartStore.cart_loading"
      :cart_updated="cartStore.cart_reloading"
    />

    <PaymentListModal
      ref="payment_list"
      :payment_credentials="payment_credentials"
      @after-addpayment="afterAddpayment"
    >
    </PaymentListModal>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="yellow-9" padding="10px" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import { useTransactionStore } from "stores/Transaction";
import { usestoreAvailable } from "stores/storeAvailable";
import { useDeliveryschedStore } from "stores/DeliverySched";
import { useCartStore } from "stores/Cart";
import { useSettingsStore } from "stores/SettingsStore";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import jwtDecode from "jwt-decode";

export default {
  name: "Checkout",
  data() {
    return {
      data: [],
      include_utensils: false,
      modal_phone: false,
      modal_promo: false,
      edit_address: false,
      location_data: [],
      checkout_address: [],
      phone_number: "",
      total_promo: 0,
      promo_selected: [],
      payment_credentials: [],
      has_payment_saved: false,
      payment_uuid: "",
      loading: true,
      marker: [],
      maps_config: [],
      merchant_info: [],
      loading_phone: false,
      loading_promo: true,
      enabled_tip: false,
      wallet_data: [],
    };
  },
  setup() {
    const transactionStore = useTransactionStore();
    const ifstoreAvailable = usestoreAvailable();
    const deliveryschedStore = useDeliveryschedStore();
    const cartStore = useCartStore();
    const SettingsStore = useSettingsStore();
    const DataStorePersisted = userDataStorePersisted();
    return {
      transactionStore,
      ifstoreAvailable,
      deliveryschedStore,
      cartStore,
      SettingsStore,
      DataStorePersisted,
    };
  },
  components: {
    TransactionInfo: defineAsyncComponent(() => import("components/TransactionInfo")),
    DeliverySched: defineAsyncComponent(() => import("components/DeliverySched")),
    LocationModal: defineAsyncComponent(() => import("components/LocationModal")),
    AddressDetails: defineAsyncComponent(() => import("components/AddressDetails")),
    Maps: defineAsyncComponent(() => import("components/Maps")),
    ChangePhoneModal: defineAsyncComponent(() => import("components/ChangePhoneModal")),
    PromotionsModal: defineAsyncComponent(() => import("components/PromotionsModal")),
    Tips: defineAsyncComponent(() => import("components/Tips")),
    SavedPaymentList: defineAsyncComponent(() => import("components/SavedPaymentList")),
    CartDetails: defineAsyncComponent(() => import("components/CartDetails")),
    //SimilarItems: defineAsyncComponent(() => import("components/SimilarItems")),
    PaymentListModal: defineAsyncComponent(() => import("components/PaymentListModal")),
    WalletComponents: defineAsyncComponent(() => import("components/WalletComponents")),
    BookingCheckout: defineAsyncComponent(() => import("components/BookingCheckout")),
    PointsCart: defineAsyncComponent(() => import("components/PointsCart")),
    AddressInline: defineAsyncComponent(() => import("components/AddressInline")),
  },
  created() {
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
  async mounted() {
    const includeUtensils = APIinterface.getStorage("include_utensils");
    if (!APIinterface.empty(includeUtensils)) {
      this.include_utensils = includeUtensils;
    }

    this.checkoutAddress();

    setTimeout(() => {
      //this.ifstoreAvailable.checkStoreOpen();
    }, 1000);
  },
  watch: {
    merchant_info(newdata, oldata) {
      //
    },
  },
  computed: {
    isTipenabled() {
      if (Object.keys(this.SettingsStore.settings_data).length > 0) {
        if (this.SettingsStore.settings_data.enabled_tip) {
          if (
            Object.keys(this.SettingsStore.settings_data.tips_in_transactions).length > 0
          ) {
            if (
              this.SettingsStore.settings_data.tips_in_transactions.includes(
                this.DataStorePersisted.transaction_type
              ) === false
            ) {
              return false;
            }
          }

          return true;
        }
      }
      return false;
    },
  },
  methods: {
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (Object.keys(resp).length > 0) {
        try {
          this.maps_config = jwtDecode(resp.maps_config);
          this.marker = [
            {
              id: 0,
              draggable: false,
              icon: this.maps_config.icon,
              lat: this.maps_config.default_lat,
              lng: this.maps_config.default_lng,
            },
          ];
        } catch (error) {
          console.log(error);
        }
      }
    },
    authenticate() {
      auth
        .authenticate()
        .then((data) => {
          // do nothing
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
          this.$router.push("/login");
        })
        .then((data) => {});
    },
    changeTransaction() {
      this.$refs.delivery_sched.show_modal = true;
    },
    afterGetinfo(data) {
      console.log(data);
    },
    afterSavetrans(data) {
      //this.$refs.transaction_info.TransactionInfo();
      // this.transactionStore.getTipSettings(
      //   "cart_uuid=" + APIinterface.getStorage("cart_uuid")
      // );
      this.$refs.cart_details.getCart(false);
    },
    afterSelectaddress(data) {
      console.log("checkoutvue afterSelectaddress", data);
      this.location_data = data;
      this.$refs.location_modal.show_modal = false;
      this.$refs.address_details.clearData();
      this.$refs.address_details.show_modal = true;
    },
    checkoutAddress() {
      this.loading = true;
      APIinterface.checkoutAddress(this.DataStorePersisted.local_id)
        .then((data) => {
          this.checkout_address = data.details.data;
          this.marker = [
            {
              id: 0,
              draggable: false,
              icon: this.maps_config.icon,
              lat: this.checkout_address.latitude,
              lng: this.checkout_address.longitude,
            },
          ];
        })
        .catch((error) => {
          //
        })
        .then((data) => {
          this.loading = false;
        });
    },
    editAddress() {
      this.location_data = this.checkout_address;
      this.$refs.address_details.show_modal = true;
    },
    afterSaveaddress() {
      console.log("checkoutvue afterSaveaddress");
      this.checkoutAddress();
      this.$refs.cart_details.getCart();
    },
    afterSetplaceid() {
      console.log("checkoutvue afterSetplaceid");
      this.checkoutAddress();
      this.$refs.cart_details.getCart();
    },
    setUtensil(value) {
      APIinterface.setStorage("include_utensils", value);
    },
    beforeLoadphone() {
      this.loading_phone = true;
    },
    afterLoadphone() {
      this.loading_phone = false;
    },
    afterGetphone(data) {
      this.phone_number = data;
    },
    afterChangephone(data) {
      this.phone_number = data;
    },
    beforeLoadpromo() {
      this.loading_promo = true;
    },
    afterLoadpromo() {
      this.loading_promo = false;
    },
    aftergetPromo(data) {
      this.total_promo = data.count;
      this.promo_selected = data.promo_selected;
    },
    clearPromo() {
      this.total_promo = 0;
      this.promo_selected = [];
    },
    afterApplypromo() {
      this.$refs.cart_details.getCart(false);
    },
    afterRemovepromo() {
      this.$refs.cart_details.getCart(false);
    },
    setPaymentcredentials(data) {
      this.payment_credentials = data;
    },
    onchoosePayment(data) {
      try {
        console.debug(data);
        this.$refs[data.payment_code].showPaymentForm();
      } catch (error) {
        APIinterface.notify("negative", error, "error_outline", this.$q);
      }
    },
    afterAddpayment() {
      this.$refs.saved_payment.SavedPaymentList();
    },
    afterLoadpaymentlist(data) {
      this.has_payment_saved = data;
      if (data) {
        this.$refs.cart_details.errors = [];
      } else {
        this.$refs.cart_details.errors.push("Please select valid payment method");
      }
    },
    onselectPayment(data, credentials) {
      //
    },
    setPaymentuuid(data) {
      this.payment_uuid = data;
    },
    afterApplytips() {
      this.$refs.cart_details.getCart(false);
    },
    afterApplypoints() {
      this.$refs.cart_details.getCart(false);
    },
    onPlaceorder() {
      const $attributes_data = {
        whento_deliver: this.DataStorePersisted.whento_deliver,
        delivery_date: this.DataStorePersisted.delivery_date,
        delivery_time: this.DataStorePersisted.delivery_time_data,
      };
      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        local_id: this.DataStorePersisted.local_id,
        include_utensils: this.include_utensils,
        payment_uuid: this.payment_uuid,
        payment_change: this.$refs.saved_payment.payment_change,
        use_digital_wallet: this.$refs.digital_wallet
          ? this.$refs.digital_wallet.use_wallet
          : "",
        guest_number: this.$refs.booking ? this.$refs.booking.guest_number : 0,
        room_uuid: this.$refs.booking ? this.$refs.booking.room_uuid : "",
        table_uuid: this.$refs.booking ? this.$refs.booking.table_uuid : "",
        currency_code: this.DataStorePersisted.getUseCurrency(),
        attributes_data: $attributes_data,
        transaction_type: this.DataStorePersisted.transaction_type,
      };
      this.$refs.cart_details.cart_reloading = true;
      APIinterface.PlaceOrder($params)
        .then((data) => {
          if (data.details.payment_instructions.method === "offline") {
            this.$router.push({
              path: "/account/trackorder",
              query: { order_uuid: data.details.order_uuid },
            });
          } else {
            this.doPayment(data.details);
          }
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.$refs.cart_details.cart_reloading = false;
        });
    },
    doPayment(data) {
      this.$refs.payment_list.doPayment(data);
    },
    setMerchantinfo(data) {
      this.merchant_info = data;
    },
    afterApplywallet(data) {
      this.wallet_data = data;
    },
  },
};
</script>
