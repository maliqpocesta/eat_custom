<template>
  <DIV v-if="cart_loading">
    <div class="row q-mb-sm">
      <div class="col-3">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>
      </div>
      <div class="col">
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" class="w-50" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </div>
    </div>
    <q-separator />

    <div class="row q-mt-md items-center">
      <div class="col"><q-skeleton type="text" class="w-50" /></div>
      <div class="col-3 text-right">
        <q-skeleton type="text" style="width: 30%" class="float-right" />
      </div>
    </div>

    <div v-for="i in 4" :key="i" class="border-bottom">
      <div class="row q-mt-md">
        <div class="col-3">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
        </div>
        <div class="col">
          <q-skeleton type="text" style="width: 50%" />
          <q-skeleton type="text" />
          <q-skeleton type="text" style="width: 30%" />
        </div>
        <div class="col-3 text-right">
          <q-skeleton type="text" style="width: 30%" class="float-right" />
        </div>
      </div>
    </div>

    <q-page-sticky expand position="bottom" v-if="sticky_checkout" class="full-width">
      <div class="q-pa-md fit bg-white">
        <q-skeleton type="QBtn" class="full-width" />
      </div>
    </q-page-sticky>
    <div v-if="!sticky_checkout" class="q-mt-lg q-mb-sm">
      <q-skeleton type="QBtn" class="full-width" />
    </div>
  </DIV>
  <!-- loading  -->
  <DIV v-else>
    <template v-if="items_count > 0">
      <template v-if="viewMerchantInfo">
        <!--div class="row q-mb-sm">
          <div class="col-3">
            <q-avatar>
              <img :src="cart_merchant.logo" />
            </q-avatar>
          </div>
          <div class="col">
            <h5 class="no-margin text-weight-medium">
              {{ cart_merchant.restaurant_name }}
            </h5>
            <q-badge
              :label="cart_merchant.cuisine[0].cuisine_name"
              :style="`background-color:${cart_merchant.cuisine[0].bgcolor};color:${cart_merchant.cuisine[0].fncolor};`"
            />
            <p class="font11 ellipsis-2-lines">{{ cart_merchant.address }}</p>
          </div>
        </div-->
        <q-separator />
      </template>

      <div class="row q-mt-md items-center">
        <div class="col">
          <div class="text-h5">{{ $t("Summary") }}</div>
        </div>
        <div class="col text-right">
          <a class="text-weight-light font11 cursor-pointer" @click="ConfirmClearCart">
            <u>{{ $t("Clear") }}</u>
          </a>
        </div>
      </div>

      <div class="items border-bottom" v-for="items in cart_items" :key="items.item_id">
        <!-- items -->
        <div class="row q-mt-md">
          <div class="col-3">
            <q-img
              fit="cover"
              :src="items.url_image"
              class="no-margin"
              height="50px"
              width="50px"
              loading="lazy"
              spinner-color="warning"
              spinner-size="sm"
            />
          </div>
          <!-- col -->
          <div class="col">
            <p class="no-margin">
              <span v-html="items.item_name"></span>
              <template v-if="items.price.size_name != ''">
                ({{ items.price.size_name }})
              </template>
            </p>

            <template v-if="items.price.discount > 0">
              <p class="no-margin">
                <del>{{ items.price.pretty_price }}</del>
                {{ items.price.pretty_price_after_discount }}
              </p>
            </template>
            <template v-else>
              <p class="no-margin">{{ items.price.pretty_price }}</p>
            </template>

            <div
              class="row inline q-mt-xs q-mb-xs items-center justify-center w-75"
              style="margin-left: -10px"
            >
              <div class="col q-pl-sm">
                <q-select
                  v-model="items.qty"
                  @update:model-value="updateCartQty(items.qty, items)"
                  filled
                  borderless
                  color="warning"
                  label-color="black"
                  bg-color="grey-2"
                  :disable="loading"
                  :options="qty_options"
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  dense
                  size="sm"
                  style="width: 70px"
                />

                <!-- <div class="col text-center no-padding">
                      <q-btn
                      @click="updateCartQty(0,items)"
                      :loading="loading"
                      round unelevated dense size="11px" color="warning" icon="remove" />
                    </div>
                  <div class="col text-center no-padding">{{  items.qty }}</div>
                  <div class="col text-center no-padding">
                    <q-btn
                    @click="updateCartQty(1,items)"
                    :loading="loading"
                    round unelevated dense size="11px" color="warning" icon="add" />
                  </div> -->
              </div>
            </div>

            <p class="no-margin text-grey" v-if="items.special_instructions != ''">
              {{ items.special_instructions }}
            </p>

            <template v-if="items.attributes != ''">
              <template v-for="attributes in items.attributes" :key="attributes">
                <p class="no-margin">
                  <template v-for="(attributes_data, attributes_index) in attributes">
                    {{ attributes_data
                    }}<template v-if="attributes_index < attributes.length - 1"
                      >,
                    </template>
                  </template>
                </p>
              </template>
            </template>
          </div>
          <!-- col -->
          <div class="col-3 text-right">
            <q-btn
              @click="removeItem(items)"
              round
              unelevated
              dense
              size="11px"
              class="btn-icon"
              color="warning"
              icon="close"
            />

            <template v-if="items.price.discount <= 0">
              <p class="q-mt-sm">
                <q-skeleton
                  v-if="loading"
                  type="QBadge"
                  class="float-right"
                  style="width: 50px"
                />
                <template v-else>{{ items.price.pretty_total }}</template>
              </p>
            </template>
            <template v-else>
              <p class="q-mt-sm">
                <q-skeleton
                  v-if="loading"
                  type="QBadge"
                  class="float-right"
                  style="width: 50px"
                />
                <template v-else>{{ items.price.pretty_total_after_discount }}</template>
              </p>
            </template>
          </div>
        </div>
        <!-- row -->
        <!-- items -->

        <!-- addons -->
        <div
          v-for="addons in items.addons"
          :key="addons"
          class="addons q-mb-sm border-bottomx"
        >
          <div class="row q-mt-xs">
            <div class="col-3"></div>
            <div class="col">
              <p class="no-margin text-weight-bold">{{ addons.subcategory_name }}</p>
            </div>
          </div>
          <!-- row -->
          <div
            v-for="addon_items in addons.addon_items"
            :key="addon_items"
            class="row q-mb-xs"
          >
            <div class="col-3"></div>
            <div class="col">
              <p class="no-margin">
                {{ addon_items.qty }} x {{ addon_items.pretty_price }}
                {{ addon_items.sub_item_name }}
              </p>
            </div>
            <div class="col-3 text-right">
              <p class="no-margin">{{ addon_items.pretty_addons_total }}</p>
            </div>
          </div>
        </div>
        <!-- addons -->
      </div>
      <!-- end loop items -->

      <!-- SUMMARY -->
      <template v-if="viewSummary">
        <div
          v-for="summary in cart_summary"
          :key="summary.name"
          class="row justify-center q-mb-sm q-mt-sm"
        >
          <template v-if="summary.type == 'total'">
            <div class="col text-weight-bold">{{ summary.name }}</div>
            <div class="col text-right text-weight-bold">{{ summary.value }}</div>
          </template>
          <template v-else>
            <div class="col">{{ summary.name }}</div>
            <div class="col text-right">{{ summary.value }}</div>
          </template>
        </div>
      </template>
      <!-- SUMMARY -->

      <template v-if="hasPointsdata">
        <q-separator></q-separator>
        <div class="text-caption q-mt-md">{{ getPoints.points_label }}</div>
      </template>

      <div v-if="!sticky_checkout" class="q-mt-lg q-mb-sm relative-position">
        <q-inner-loading :showing="ifstoreAvailable.loading_status" color="warning" />
        <q-btn
          unelevated
          rounded
          color="warning"
          text-color="black"
          no-caps
          class="full-width"
          size="17px"
          :disable="canCheckout"
          :loading="cart_reloading"
          @click="this.$emit('onPlaceorder')"
          style="letter-spacing: 2px"
          :dense="$q.screen.lt.sm"
        >
          {{ $t("Place Order") }}
        </q-btn>
      </div>

      <div v-if="sticky_checkout" class="q-mt-md"></div>

      <template v-if="hasError">
        <div class="bg-myyellow rounded-borders q-pa-sm">
          <ul class="no-margin error-list">
            <li v-for="err in error" :key="err" class="text-weight-thin font12">
              {{ err }}
            </li>
          </ul>
        </div>
      </template>
      <template v-if="hasErrors">
        <div class="bg-myyellow rounded-borders q-pa-sm">
          <ul class="no-margin error-list">
            <li v-for="err in errors" :key="err" class="text-weight-thin font12">
              {{ err }}
            </li>
          </ul>
        </div>
      </template>

      <div v-if="payment_error" class="bg-myyellow rounded-borders q-pa-sm">
        {{ payment_error }}
      </div>

      <template v-if="ifstoreAvailable.loading_status === false">
        <template v-if="ifstoreAvailable.merchant_open_status === false">
          <div class="bg-myyellow rounded-borders q-pa-sm">
            <ul class="no-margin error-list">
              <li class="text-weight-thin font12">
                {{ ifstoreAvailable.merchant_status_msg }}
              </li>
            </ul>
          </div>
        </template>
      </template>
    </template>
    <!-- end items count -->

    <template v-else>
      <div class="q-mt-lg q-pa-sm text-center">
        <q-img
          src="orders-icon.png"
          spinner-color="white"
          lazy
          style="height: 40px; width: 36px"
          class="q-mb-md"
        />
        <div class="text-h6">{{ $t("You don't have any orders here") }}</div>
        <p class="font-11 text-weight-thin">{{ $t("let's change that") }}!</p>
      </div>
    </template>

    <q-page-sticky expand position="bottom" v-if="sticky_checkout" class="full-width">
      <div class="q-pa-md fit bg-white">
        <q-inner-loading :showing="ifstoreAvailable.loading_status" color="warning" />
        <q-btn
          unelevated
          rounded
          color="warning"
          text-color="black"
          no-caps
          class="full-width q-pl-xs-md q-pr-xs-md"
          size="17px"
          :dense="$q.screen.lt.sm"
          :disable="hasItem"
          :loading="cart_reloading"
          @click="checkout"
        >
          <div class="row full-width">
            <div class="col text-left">{{ $t("Checkout") }}</div>
            <div class="col text-right">{{ cart_subtotal.value }}</div>
          </div>
        </q-btn>
      </div>
    </q-page-sticky>
  </DIV>
  <!-- end loading card -->
</template>

<script>
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import { useCartStore } from "stores/Cart";
import { usestoreAvailable } from "stores/storeAvailable";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useTransactionStore } from "stores/Transaction";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "CartDetails",
  props: ["payload", "sticky_checkout", "page"],
  setup() {
    const cartStore = useCartStore();
    const ifstoreAvailable = usestoreAvailable();
    const DataStorePersisted = userDataStorePersisted();
    const transactionStore = useTransactionStore();
    const SettingsStore = useSettingsStore();
    return {
      cartStore,
      ifstoreAvailable,
      DataStorePersisted,
      transactionStore,
      SettingsStore,
    };
  },
  data() {
    return {
      loading: false,
      items_count: 0,
      cart_loading: true,
      cart_reloading: false,
      cart_uuid: "",
      cart_items: [],
      cart_summary: [],
      cart_merchant: [],
      cart_total: [],
      cart_subtotal: [],
      error: [],
      errors: [],
      qty_options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      transaction_data: [],
      delivery_option: [],
      services_list: [],
      payment_error: "",
      points_data: [],
    };
  },
  created() {
    this.$watch(
      () => this.transactionStore.$state.change_currency,
      (newData, oldData) => {
        this.getCart(false);
      }
    );
  },
  async mounted() {
    const resp = await this.SettingsStore.getAsyncSettings();
    this.getCart(true);
    this.ifstoreAvailable.checkStoreOpen();
    this.qty_options = [];
    for (let i = 1; i < 100; i++) {
      this.qty_options.push(i);
    }
    let $error = this.$route.query.error;
    if (!APIinterface.empty($error)) {
      this.payment_error = $error;
    }
  },
  watch: {
    trans_type(newval, oldval) {
      this.showAddressIfNeeded();
    },
  },
  computed: {
    hasItem() {
      if (
        this.items_count > 0 &&
        this.error.length <= 0 &&
        this.ifstoreAvailable.loading_status == false &&
        this.ifstoreAvailable.merchant_open_status == 1
      ) {
        return false;
      }
      return true;
    },
    viewSummary() {
      if (APIinterface.inArray("summary", this.payload)) {
        return true;
      }
      return false;
    },
    viewMerchantInfo() {
      if (APIinterface.inArray("merchant_info", this.payload)) {
        return true;
      }
      return false;
    },
    hasError() {
      if (this.error.length > 0) {
        return true;
      }
      return false;
    },
    hasErrors() {
      if (this.errors.length > 0) {
        return true;
      }
      return false;
    },
    canCheckout() {
      let $returns = false;
      if (this.error.length > 0) {
        $returns = true;
      }
      if (this.errors.length > 0) {
        $returns = true;
      }
      if (
        this.ifstoreAvailable.loading_status == false &&
        this.ifstoreAvailable.merchant_open_status === false
      ) {
        $returns = true;
      }
      return $returns;
    },
    hasPointsdata() {
      if (Object.keys(this.points_data).length > 0) {
        return true;
      }
      return false;
    },
    getPoints() {
      return this.points_data;
    },
  },
  methods: {
    getCart(cardLoading) {
      const $data = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        local_id: this.DataStorePersisted.local_id,
        currency_code: this.DataStorePersisted.getUseCurrency(),
        transaction_type: this.DataStorePersisted.transaction_type,
        payload: this.payload,
      };

      if (cardLoading) {
        this.cart_loading = true;
      } else {
        this.cart_reloading = true;
      }

      this.cartStore.cart_loading = this.cart_loading;
      this.cartStore.cart_reloading = this.cart_reloading;

      APIinterface.getCart($data, this.sticky_checkout)
        .then((data) => {
          this.items_count = data.details.items_count;
          this.cartStore.setCartcount(this.items_count);
          this.cart_uuid = data.details.cart_uuid;
          this.cart_items = data.details.data.items;
          this.cart_summary = data.details.data.summary;
          this.cart_total = data.details.data.total;
          this.error = data.details.error;
          this.cart_subtotal = data.details.data.subtotal;
          this.points_data = data.details.points_data;

          this.cartStore.cart_total = data.details.data.total;

          if (!APIinterface.empty(data.details.data.merchant)) {
            this.cart_merchant = data.details.data.merchant;
            this.$emit("setMerchantinfo", data.details.data.merchant);
          }
        })
        .catch((error) => {
          this.resetData();
          if (this.$route.path === "/checkout" && error === null) {
            this.$router.push({ name: "menu", params: { addcart: true } });
          }
        })
        .then((data) => {
          this.cart_loading = false;
          this.cart_reloading = false;
          this.cartStore.cart_loading = false;
          this.cartStore.cart_reloading = false;
        });
    },
    resetData() {
      this.items_count = 0;
      this.cart_items = [];
      this.cart_summary = [];
      this.cart_total = [];
      this.error = [];
      this.cart_subtotal = [];
      // this.$emit('setCartcount', this.items_count)
      this.cartStore.setCartcount(this.items_count);
    },
    ConfirmClearCart() {
      this.$q
        .dialog({
          title: "Clear cart",
          message: "Are your sure you want to clear your cart?",
          stackButtons: false,
          ok: {
            unelevated: true,
            rounded: true,
            color: "warning",
            "text-color": "black",
            size: "md",
            label: "Yes clear cart",
            "no-caps": true,
          },
          cancel: {
            unelevated: true,
            rounded: true,
            color: "grey-3",
            "text-color": "black",
            size: "md",
            label: "Cancel",
            "no-caps": true,
          },
        })
        .onOk((data) => {
          this.clearCart();
        });
    },
    clearCart() {
      this.loading = false;
      APIinterface.clearCart(APIinterface.getStorage("cart_uuid"))
        .then((data) => {
          this.getCart();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    removeItem(items) {
      this.$q
        .dialog({
          title: "Delete Item",
          message: "Are you sure you want to delete this item?",
          stackButtons: false,
          ok: {
            unelevated: true,
            rounded: true,
            color: "warning",
            "text-color": "black",
            size: "md",
            label: "Delete",
            "no-caps": true,
          },
          cancel: {
            unelevated: true,
            rounded: true,
            color: "grey-3",
            "text-color": "black",
            size: "md",
            label: "Cancel",
            "no-caps": true,
          },
        })
        .onOk((data) => {
          this.loading = true;
          APIinterface.removeCartItem(this.cart_uuid, items.cart_row)
            .then((data) => {
              this.getCart();
            })
            .catch((error) => {
              APIinterface.notify("negative", error, "error_outline", this.$q);
            })
            .then((data) => {
              this.loading = false;
            });
        });
    },
    updateCartQty(itemQty, item) {
      this.updateCartItems(itemQty, item);
    },
    updateCartItems(itemQty, item) {
      this.loading = true;
      APIinterface.updateCartItems(this.cart_uuid, item.cart_row, itemQty)
        .then((data) => {
          this.getCart();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    checkout() {
      let $redirectTo = "";
      if (this.$route.path === "/menu") {
        $redirectTo = "/login?checkout=true";
      } else {
        $redirectTo = "/login";
      }
      if (auth.authenticated()) {
        this.$router.push("/checkout");
      } else {
        this.$router.push($redirectTo);
      }
    },
  },
};
</script>

<style scoped lang="scss">
ul.error-list {
  list-style: none;
}
</style>
